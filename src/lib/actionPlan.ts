import { type OrgProfile } from '../data/assessment'

// The exact body shape the generate-action-plan edge function expects.
// This is the function's own contract — the frontend adapts TO it.
export interface ActionPlanPayload {
  orgProfile: { name: string; industry: string; size: string }
  scores: {
    governance: number
    workforce: number
    overall: number
    sections: number[]
  }
  maturityLevel: { level: number; label: string }
  workforceMaturityBand: string
  adoptionProfile: string
  responses: Record<string, number>
  notes: Record<string, string>
}

interface MapInput {
  orgProfile: OrgProfile
  governanceScore: number
  workforceScore: number
  overallScore: number
  sectionScores: number[]
  maturityLevel: { level: number; label: string }
  workforceMaturityBand: string
  adoptionProfile: string
  responses: Record<string, number>
  notes: Record<string, string>
}

// Converts the frontend's domain types into the edge function contract.
// Notably maps orgName -> name and companySize -> size.
export function mapToEdgeContract(input: MapInput): ActionPlanPayload {
  return {
    orgProfile: {
      name: input.orgProfile.orgName,
      industry: input.orgProfile.industry,
      size: input.orgProfile.companySize,
    },
    scores: {
      governance: input.governanceScore,
      workforce: input.workforceScore,
      overall: input.overallScore,
      sections: input.sectionScores,
    },
    maturityLevel: input.maturityLevel,
    workforceMaturityBand: input.workforceMaturityBand,
    adoptionProfile: input.adoptionProfile,
    responses: input.responses,
    notes: input.notes,
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Streams the action plan from the edge function, yielding each text chunk as
 * it arrives. Resolves when the server sends {"done": true}. Throws if the
 * server sends {"error": ...} or the request fails.
 */
export async function* streamActionPlan(
  payload: ActionPlanPayload,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  if (!SUPABASE_URL) {
    throw new Error('VITE_SUPABASE_URL is not configured.')
  }

  const url = `${SUPABASE_URL}/functions/v1/generate-action-plan`

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (SUPABASE_ANON_KEY) {
    // Passed for safety even though the function is deployed --no-verify-jwt.
    headers['apikey'] = SUPABASE_ANON_KEY
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      `Action plan request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ''}`,
    )
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // SSE frames are separated by a blank line. A chunk may end mid-frame,
      // so we only consume complete frames and leave the remainder buffered.
      let sep: number
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)

        for (const line of frame.split('\n')) {
          const trimmed = line.trimStart()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (!data) continue

          let event: { text?: string; done?: boolean; error?: string }
          try {
            event = JSON.parse(data)
          } catch {
            continue
          }

          if (event.error) {
            throw new Error(event.error)
          }
          if (event.done) {
            return
          }
          if (typeof event.text === 'string') {
            yield event.text
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
