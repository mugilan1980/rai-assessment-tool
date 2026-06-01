// Supabase Edge Function: generate-action-plan
// Runtime: Deno
//
// Accepts a POST with the assessment results, calls the Anthropic Messages API
// with streaming enabled, and relays the model's text back to the browser as
// Server-Sent Events (SSE).
//
// Contract (self-contained — the frontend adapts to THIS shape, not vice versa):
//   {
//     orgProfile:           { name: string, industry: string, size: string },
//     scores:               { governance: number, workforce: number, overall: number, sections: number[] },
//     maturityLevel:        { level: number, label: string },
//     workforceMaturityBand: string,
//     adoptionProfile:      string,
//     responses:            Record<string, number>,
//     notes:                Record<string, string>
//   }
//
// SSE events emitted to the client:
//   data: {"text": "<chunk>"}\n\n   — incremental model output
//   data: {"done": true}\n\n        — stream finished cleanly
//   data: {"error": "<message>"}\n\n — something went wrong

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-sonnet-4-5";
const ANTHROPIC_VERSION = "2023-06-01";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// The seven assessment sections, in order, with their governance/workforce
// dimension labels. D1–D6 are governance; D7 is workforce.
const SECTION_META: { dimension: string; title: string }[] = [
  { dimension: "D1", title: "Governance Structures & Accountability" },
  { dimension: "D2", title: "Human Oversight & Control" },
  { dimension: "D3", title: "Data Governance & Privacy" },
  { dimension: "D4", title: "Algorithmic Fairness & Transparency" },
  { dimension: "D5", title: "AI Ethics & Responsible Use" },
  { dimension: "D6", title: "Agentic AI Readiness" },
  { dimension: "D7", title: "Workforce-Centred AI Adoption" },
];

const SYSTEM_PROMPT =
  `You are an AI governance and workforce transformation advisor specialising in Singapore's regulatory environment. You help organisations implement the following frameworks in practical, non-technical terms:

- IMDA's Model AI Governance Framework (MAIGF) — the foundational governance standard for AI in Singapore
- IMDA's Model AI Governance Framework for Agentic AI (updated May 2026) — governance for autonomous AI agents, with four pillars: assess and bound risks, make humans meaningfully accountable, implement technical controls, and enable end-user responsibility
- WSG/MAS/IBF GenAI Jobs Transformation Map for Financial Services (October 2025) — workforce transformation standards and six emerging Gen AI roles
- MAS Guidelines on AI Risk Management (November 2025 consultation paper) — supervisory expectations for AI risk management in financial institutions
- GovTech's Responsible AI Playbook operational tools — Litmus (testing-as-a-service for AI safety), Sentinel (input/output guardrails using LionGuard), and LionGuard 2 (multilingual content moderation for Singapore's context)
- Singapore's NAIS Update (May 2026) — 10 refreshed national AI priorities, including "AI bilingual talent" as a national priority (defined as people with both domain expertise and AI capability who apply AI meaningfully in their domains), four national AI Missions (Advanced Manufacturing, Financial Services, Connectivity, Healthcare), and S$1 billion for AI research and talent development (2025–2030)

Your tone is direct, constructive, and action-oriented. Always distinguish between governance compliance (D1–D6) and workforce outcomes (D7) in your recommendations.

When recommending testing or safety measures, reference GovTech's Litmus and Sentinel as operational benchmarks that organisations can learn from.

When recommending workforce transformation actions, use Singapore's "AI bilingual" framing — workers who combine domain expertise with practical AI capability — rather than generic "AI training" language.

When addressing agentic AI gaps (D6), reference real case studies from the updated MGF: GovTech's phased rollout approach, PwC Singapore's three-team accountability model, Tencent's human approval checkpoints, Dayos's risk-tiering methodology, or X0PA's user training for recruitment agents.

Never use jargon without explanation. Frame every recommendation as something a non-technical senior leader could act on within 90 days.`;

interface RequestBody {
  orgProfile: { name: string; industry: string; size: string };
  scores: {
    governance: number;
    workforce: number;
    overall: number;
    sections: number[];
  };
  maturityLevel: { level: number; label: string };
  workforceMaturityBand: string;
  adoptionProfile: string;
  responses: Record<string, number>;
  notes: Record<string, string>;
}

function fmt(n: number | undefined): string {
  return typeof n === "number" && !Number.isNaN(n) ? n.toFixed(2) : "n/a";
}

function buildUserPrompt(body: RequestBody): string {
  const { orgProfile, scores, maturityLevel, workforceMaturityBand, adoptionProfile, notes } = body;

  const sectionLines = SECTION_META.map((meta, i) => {
    const score = scores.sections?.[i];
    return `- ${meta.dimension} ${meta.title}: ${fmt(score)} / 4`;
  }).join("\n");

  const noteEntries = Object.entries(notes ?? {}).filter(
    ([, v]) => typeof v === "string" && v.trim().length > 0,
  );
  const notesBlock = noteEntries.length
    ? noteEntries.map(([id, text]) => `- ${id}: ${text.trim()}`).join("\n")
    : "(none provided)";

  return `An organisation has completed a Responsible AI maturity assessment covering seven dimensions. Produce a prioritised, practical 90-day action plan based on their results.

## Organisation
- Name: ${orgProfile?.name ?? "Unknown"}
- Industry: ${orgProfile?.industry ?? "Unknown"}
- Size: ${orgProfile?.size ?? "Unknown"}

## Overall results (scores are 1–4, where 1 = not in place and 4 = established)
- Governance maturity (D1–D6): ${fmt(scores?.governance)} / 4 — ${maturityLevel?.label ?? "n/a"} (Level ${maturityLevel?.level ?? "?"})
- Workforce maturity (D7): ${fmt(scores?.workforce)} / 4 — band: ${workforceMaturityBand ?? "n/a"}
- Overall score: ${fmt(scores?.overall)} / 4
- Adoption profile: ${adoptionProfile ?? "n/a"}

## Scores by dimension
${sectionLines}

## Qualitative notes from the respondent
${notesBlock}

## What to produce
Write the action plan in clear markdown for a non-technical senior leader. Structure it as:

1. **Executive summary** — 2–3 sentences on where this organisation stands and the single most important thing to fix first.
2. **Governance priorities (D1–D6)** — the 3–4 highest-impact governance actions, ordered by priority. For each: what to do, why it matters for this organisation, and a concrete first step achievable within 90 days. Reference the relevant Singapore framework (MAIGF, the Agentic AI MGF, MAS guidelines) where it adds clarity. Where D6 (Agentic AI Readiness) is weak, ground the recommendation in a real MGF case study.
3. **Workforce priorities (D7)** — 2–3 actions framed around building "AI bilingual" talent rather than generic training, tied to role transformation and the worker outcomes the assessment measures.
4. **90-day roadmap** — a simple week-by-week or month-by-month sequence pulling the above together.

Keep every recommendation specific, jargon-free, and actionable by this organisation's leadership within 90 days.`;
}

// Parses the Anthropic SSE stream and relays only the text deltas to the
// client as our own SSE protocol. Returns a ReadableStream of bytes.
function relayStream(anthropicBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = anthropicBody.getReader();

  const send = (controller: ReadableStreamDefaultController<Uint8Array>, obj: unknown) => {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
  };

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Anthropic SSE frames are separated by a blank line.
          let sep: number;
          while ((sep = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, sep);
            buffer = buffer.slice(sep + 2);

            for (const line of rawEvent.split("\n")) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (!data || data === "[DONE]") continue;

              let evt: any;
              try {
                evt = JSON.parse(data);
              } catch {
                continue;
              }

              if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
                send(controller, { text: evt.delta.text });
              } else if (evt.type === "error") {
                send(controller, {
                  error: evt.error?.message ?? "Anthropic stream error",
                });
              }
            }
          }
        }
        send(controller, { done: true });
      } catch (err) {
        send(controller, {
          error: err instanceof Error ? err.message : "Stream relay failed",
        });
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}

Deno.serve(async (req: Request) => {
  // CORS preflight.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const userPrompt = buildUserPrompt(body);

  let anthropicRes: Response;
  try {
    anthropicRes = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Failed to reach Anthropic API",
      }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  if (!anthropicRes.ok || !anthropicRes.body) {
    const detail = await anthropicRes.text().catch(() => "");
    return new Response(
      JSON.stringify({
        error: `Anthropic API error (${anthropicRes.status}): ${detail.slice(0, 500)}`,
      }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(relayStream(anthropicRes.body), {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});
