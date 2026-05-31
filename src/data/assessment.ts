export interface Question {
  id: string
  text: string
  guidance: string
  qualitative?: boolean
}

export interface Section {
  id: string
  title: string
  description: string
  questions: Question[]
}

export interface OrgProfile {
  orgName: string
  industry: string
  companySize: string
  respondentName: string
  respondentRole: string
}

export interface Response {
  questionId: string
  score: number
  notes?: string
}

export interface AdoptionProfile {
  label: 'Aligned Adopter' | 'Governance-Heavy' | 'People-First' | 'Early Stage'
  governanceScore: number
  workforceScore: number
}

export const SCORE_LABELS = [
  '',
  'Not in place',
  'Ad hoc',
  'Developing',
  'Established',
]

export const INDUSTRIES = [
  'Financial Services',
  'Healthcare & Life Sciences',
  'Retail & E-commerce',
  'Manufacturing',
  'Logistics & Supply Chain',
  'Information Technology',
  'Professional Services',
  'Education',
  'Food & Beverage',
  'Construction & Real Estate',
  'Media & Entertainment',
  'Non-Profit / Social Services',
  'Other',
]

export const COMPANY_SIZES = [
  '1–9 employees',
  '10–49 employees',
  '50–199 employees',
  '200–999 employees',
  '1,000+ employees',
]

export const SECTIONS: Section[] = [
  {
    id: 'governance-structures',
    title: 'Governance Structures & Accountability',
    description:
      'Evaluate the structures, roles, and processes that govern AI decision-making and accountability across your organisation.',
    questions: [
      {
        id: 'gs1',
        text: 'Is there a designated individual or committee responsible for AI governance decisions?',
        guidance:
          'Look for a named AI owner, steering committee, or equivalent. A general IT lead with no AI mandate does not qualify.',
      },
      {
        id: 'gs2',
        text: "Are AI-related risks included in the organisation's enterprise risk management framework?",
        guidance:
          'Check whether AI risk appears in board or management risk registers, not just informally acknowledged.',
      },
      {
        id: 'gs3',
        text: 'Does leadership have visibility into AI systems currently deployed or in development?',
        guidance:
          'Can the CEO or equivalent name the AI tools in active use across the organisation?',
      },
      {
        id: 'gs4',
        text: 'Are there documented escalation paths for AI incidents or failures?',
        guidance:
          'Is there a written process for what happens when an AI system produces a harmful or incorrect output?',
      },
      {
        id: 'gs5',
        text: 'Is there a clear policy on who can approve AI tool adoption in the organisation?',
        guidance:
          'Are employees buying or trialling AI tools without central approval? Shadow AI is a governance gap.',
      },
      {
        id: 'gs6',
        text: 'Are AI governance responsibilities communicated across departments?',
        guidance:
          'Do non-technical teams like HR, legal, and finance know what their AI governance obligations are?',
      },
      {
        id: 'gs7',
        text: 'Is there a formal review process for evaluating new AI tools before adoption?',
        guidance:
          "Does the organisation assess vendor reliability, data handling, and compliance before deploying a new AI product?",
      },
    ],
  },
  {
    id: 'human-oversight',
    title: 'Human Oversight & Control',
    description:
      'Assess how well your organisation maintains meaningful human oversight and control over AI systems and their outputs.',
    questions: [
      {
        id: 'ho1',
        text: 'Are employees trained to identify when AI outputs require human review?',
        guidance:
          'Do staff know the difference between low-stakes AI outputs like drafting emails and high-stakes ones like credit decisions or hiring?',
      },
      {
        id: 'ho2',
        text: 'Are there documented processes for overriding or correcting AI decisions?',
        guidance:
          "If an AI system makes a wrong call, is there a clear, practised path to override it?",
      },
      {
        id: 'ho3',
        text: 'Do employees understand what AI tools they are currently using, including shadow AI?',
        guidance:
          "Are staff using personal ChatGPT, Gemini, or similar accounts for work tasks without the organisation's knowledge?",
      },
      {
        id: 'ho4',
        text: 'Is there a register or inventory of AI tools deployed across the organisation?',
        guidance:
          "A simple spreadsheet counts if it's maintained. The key is whether anyone is tracking this systematically.",
      },
      {
        id: 'ho5',
        text: 'Are there defined human-in-the-loop checkpoints for high-stakes AI decisions?',
        guidance:
          'For decisions that affect customers, employees, or compliance obligations, is there a mandatory human review step?',
      },
      {
        id: 'ho6',
        text: 'Does the organisation have a process for handling unexpected or harmful AI outputs?',
        guidance:
          'What happens when an AI tool hallucinates, produces biased content, or causes a customer complaint?',
      },
      {
        id: 'ho7',
        text: 'Are employees empowered to pause or reject AI-generated recommendations?',
        guidance:
          'Is there a culture where staff feel safe questioning AI outputs, or is there implicit pressure to accept them?',
      },
    ],
  },
  {
    id: 'data-governance',
    title: 'Data Governance & Privacy',
    description:
      'Review how your organisation manages data used in AI systems, including PDPA compliance and vendor data handling.',
    questions: [
      {
        id: 'dg1',
        text: 'Does the organisation have a data classification policy that covers AI input and training data?',
        guidance:
          'Does the policy distinguish between data that can and cannot be fed into AI tools, especially third-party ones?',
      },
      {
        id: 'dg2',
        text: 'Are employees aware of PDPA obligations when using AI tools with customer data?',
        guidance:
          'Do staff know they cannot input identifiable customer information into tools like ChatGPT without proper controls?',
      },
      {
        id: 'dg3',
        text: "Is there a process for assessing whether AI vendors meet data protection standards?",
        guidance:
          "Before signing up for an AI product, does the organisation check the vendor's data handling, storage location, and compliance certifications?",
      },
      {
        id: 'dg4',
        text: 'Does the organisation limit what data can be inputted into third-party AI tools?',
        guidance:
          'Are there written rules or technical controls preventing staff from pasting confidential data into consumer AI tools?',
      },
      {
        id: 'dg5',
        text: 'Are data retention and deletion policies applied to AI-generated outputs?',
        guidance:
          "AI tools often store conversation history. Does the organisation's data retention policy cover these outputs?",
      },
      {
        id: 'dg6',
        text: 'Has the organisation assessed data residency risks for cloud-based AI tools?',
        guidance:
          'Does the organisation know where its data is being processed and stored when using cloud AI services?',
      },
      {
        id: 'dg7',
        text: 'Are AI vendor contracts reviewed for data handling and liability provisions?',
        guidance:
          'Has legal or compliance reviewed AI vendor agreements to ensure data ownership and liability are clearly defined?',
      },
    ],
  },
  {
    id: 'algorithmic-fairness',
    title: 'Algorithmic Fairness & Transparency',
    description:
      'Measure how your organisation ensures AI outputs are fair, explainable, and auditable for all stakeholders.',
    questions: [
      {
        id: 'af1',
        text: 'Is there awareness of how AI models used by the organisation were trained?',
        guidance:
          'Do decision-makers understand that AI models reflect the data they were trained on, and that this can introduce bias?',
      },
      {
        id: 'af2',
        text: 'Are there processes to test AI outputs for demographic or group-based bias?',
        guidance:
          'Particularly relevant for HR, lending, insurance, or customer-facing AI. Has anyone checked whether outputs differ unfairly across groups?',
      },
      {
        id: 'af3',
        text: 'Can the organisation explain AI-assisted decisions to affected stakeholders?',
        guidance:
          'If a customer or employee asks why an AI-assisted decision was made, can the organisation give a meaningful answer?',
      },
      {
        id: 'af4',
        text: 'Are there documented criteria for what constitutes an acceptable AI output?',
        guidance:
          'Has the organisation defined quality standards or guardrails for what AI can and cannot produce on its behalf?',
      },
      {
        id: 'af5',
        text: 'Is there a feedback mechanism for employees or customers to flag potentially unfair AI decisions?',
        guidance:
          'Is there a channel for raising concerns about AI outputs, and is someone responsible for reviewing those concerns?',
      },
      {
        id: 'af6',
        text: 'Does the organisation conduct periodic audits of AI system performance?',
        guidance:
          'AI models can drift over time. Is there a scheduled review of whether AI tools are still performing as intended?',
      },
      {
        id: 'af7',
        text: 'Are AI outputs clearly distinguished from human-generated content in customer communications?',
        guidance:
          'Where AI is used in customer-facing content, is this disclosed appropriately and consistently?',
      },
    ],
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics & Responsible Use',
    description:
      'Evaluate the ethical frameworks, policies, and cultural practices guiding responsible AI use within your organisation.',
    questions: [
      {
        id: 'ae1',
        text: 'Does the organisation have a written AI ethics or responsible AI policy?',
        guidance:
          "Even a one-page principles document counts. The key is whether it's written, shared, and referred to.",
      },
      {
        id: 'ae2',
        text: 'Are employees given guidance on the ethical use of AI tools in their roles?',
        guidance:
          'Do staff know what ethical use looks like in practice for their specific job function, not just in abstract terms?',
      },
      {
        id: 'ae3',
        text: 'Is there a process to assess the societal or community impact of AI deployments?',
        guidance:
          'Before deploying an AI system that affects customers or the public, does the organisation consider broader social impact?',
      },
      {
        id: 'ae4',
        text: 'Does the organisation consider vulnerable populations when designing AI-assisted services?',
        guidance:
          'Are elderly users, those with disabilities, or low-income groups considered in AI service design?',
      },
      {
        id: 'ae5',
        text: 'Are AI-generated communications clearly labelled as such where appropriate?',
        guidance:
          'Is the organisation transparent with customers and stakeholders about when AI is generating content on its behalf?',
      },
      {
        id: 'ae6',
        text: 'Does the organisation actively monitor AI ethics developments and regulatory changes?',
        guidance:
          'Is someone responsible for tracking IMDA updates, MAS guidelines, and international AI regulation developments?',
      },
      {
        id: 'ae7',
        text: 'Are ethical AI principles reflected in supplier and vendor selection criteria?',
        guidance:
          "When choosing AI vendors, does the organisation assess their ethical standards and responsible AI commitments?",
      },
    ],
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI Readiness',
    description:
      "Assess your organisation's preparedness for autonomous AI agents that can act independently on tasks and decisions. Aligned to IMDA's Model AI Governance Framework for Agentic AI (January 2026, updated May 2026 with industry case studies).",
    questions: [
      {
        id: 'aa1',
        text: 'Is leadership aware of what agentic AI means and how it differs from current AI tools?',
        guidance:
          'Agentic AI can take sequences of actions autonomously — browsing the web, sending emails, executing code — without a human approving each step. Does leadership understand this distinction?',
      },
      {
        id: 'aa2',
        text: 'Does the organisation have any agentic AI tools deployed or under evaluation?',
        guidance:
          'This includes AI agents built into platforms like Microsoft Copilot, Salesforce Einstein, or custom-built workflow automation tools.',
      },
      {
        id: 'aa3',
        text: 'Are there defined boundaries for what actions an AI agent is permitted to take autonomously?',
        guidance:
          "Has the organisation specified what an AI agent can and cannot do without human approval — for example, can it send emails, make bookings, or access financial systems? The updated MGF (May 2026) recommends defining limits on the agent's access to tools, autonomy level, and area of impact, preferring deterministic limits (access controls) over non-deterministic ones (prompt instructions). Case study: Dayos tiers agentic actions by risk — fully automated for low-severity reversible tasks, human approval for moderate-severity, no agent access for high-severity production deployments.",
      },
      {
        id: 'aa4',
        text: 'Is there a process to audit or log actions taken by autonomous AI systems?',
        guidance:
          'Can the organisation trace what an AI agent did, when, and why? Is this log reviewed regularly?',
      },
      {
        id: 'aa5',
        text: 'Are contracts with AI vendors reviewed for agentic AI provisions and liability clauses?',
        guidance:
          'If an AI agent causes harm — financial loss, data breach, reputational damage — who is liable? Has this been addressed in vendor agreements? The updated MGF (May 2026) emphasises clear allocation of responsibilities across the value chain. Case study: PwC Singapore allocates accountability across three teams — the Use Case Owner (appropriateness and accountable use), the Technology Risk Management Team (risk assessment and controls), and the AI Factory (design, guardrails, and monitoring).',
      },
      {
        id: 'aa6',
        text: 'Does the organisation have an incident response plan that covers autonomous AI failures?',
        guidance:
          'If an AI agent takes an unintended or harmful action, is there a plan to detect, halt, and remediate it quickly?',
      },
      {
        id: 'aa7',
        text: 'Is there a sandboxed environment for testing agentic AI tools before deployment?',
        guidance:
          "Are AI agents tested in a safe environment before being given access to live systems, customer data, or production workflows? The updated MGF (May 2026) recommends phased rollouts. Case study: GovTech Singapore phased its agentic coding assistants — initial deployment was restricted to internal staff on low-risk systems before expanding. GovTech's Litmus platform (testing-as-a-service) and Sentinel (input/output guardrails) can serve as reference benchmarks.",
      },
    ],
  },
  {
    id: 'workforce-centred',
    title: 'Workforce-Centred AI Adoption',
    description:
      'Has the organisation adopted AI with its workers — through role transformation, shared productivity gains, and genuine fluency — rather than around or against them?',
    questions: [
      {
        id: 'wc1',
        text: 'Were workers in affected roles meaningfully consulted before AI tools were deployed in their workflows?',
        guidance:
          'Consultation means input that could change decisions — not notification after decisions were made. Ask to see evidence: meeting notes, survey results, feedback loops. Announcements do not count as consultation.',
      },
      {
        id: 'wc2',
        text: 'Does the organisation have a documented role redesign process — mapping how each AI-affected role changes, what tasks stay, what is automated, and what new responsibilities emerge?',
        guidance:
          'A role redesign process is distinct from AI training. It answers: what does this job look like now that AI handles part of it? Look for updated job descriptions or formal workflow redesign sessions. General training materials without role-specific redesign score 2 at most.',
      },
      {
        id: 'wc3',
        text: 'Is AI fluency training tied specifically to role performance — teaching workers to use AI in their actual daily workflows — rather than general AI awareness?',
        guidance:
          'The NAIS Update (May 2026) defines "AI bilingual talent" as people with both domain expertise and AI capability who can apply AI meaningfully in their domains. General AI literacy scores 2. Role-specific fluency — where a finance analyst learns to use AI for their actual reconciliation tasks — scores 3–4. Ask for role-specific training content, not just attendance records.',
      },
      {
        id: 'wc4',
        text: 'Are there clear career pathways where AI capability is a recognised progression criterion — giving workers a tangible reason to invest in AI fluency?',
        guidance:
          'If AI fluency has no link to promotion, pay, or career progression, workers have no structural incentive to develop it beyond compliance. Look for updated competency frameworks or appraisal criteria that explicitly reference AI capability.',
      },
      {
        id: 'wc5',
        text: 'Has overall headcount remained stable or grown in AI-affected roles since deployment began — and is the organisation actively tracking this?',
        guidance:
          'This is not asking whether AI caused headcount changes definitively. It is asking whether the organisation is tracking headcount in AI-affected roles separately and can answer the question. An organisation that cannot answer this scores 1 regardless of intention.',
      },
      {
        id: 'wc6',
        text: 'Can the organisation name at least one role that has been demonstrably transformed — not eliminated — by AI, with the worker in that role able to describe what changed and why?',
        guidance:
          'This is the proof question. Policies and intentions score 2. A real named example scores 4. Use the notes field to record the example. An organisation with no concrete example scores 1–2 regardless of how well they answer other questions.',
        qualitative: true,
      },
      {
        id: 'wc7',
        text: 'Is there a joint forum — involving both management and worker representatives — that reviews AI adoption impacts on roles and livelihoods at least quarterly?',
        guidance:
          "Aligned to NTUC's tripartite model and WSG's Jobs Transformation Map guidance. In unionised environments this may be a formal union-management committee. In non-unionised SMEs, a structured quarterly review with staff representatives counts if it is consistent and minuted.",
      },
    ],
  },
]
