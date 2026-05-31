import { type Section, type Question } from '../data/assessment'

export function getSectionScore(responses: Record<string, number>, sectionIndex: number, sections: Section[]): number {
  const section = sections[sectionIndex]
  if (!section) return 0
  const scores = section.questions
    .map(q => responses[q.id])
    .filter((s): s is number => typeof s === 'number' && s > 0)
  if (scores.length === 0) return 0
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

export function getGovernanceScore(responses: Record<string, number>, sections: Section[]): number {
  const governanceSections = sections.slice(0, 6)
  const sectionScores = governanceSections
    .map((_, i) => getSectionScore(responses, i, sections))
    .filter(s => s > 0)
  if (sectionScores.length === 0) return 0
  return sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length
}

export function getWorkforceScore(responses: Record<string, number>, sections: Section[]): number {
  return getSectionScore(responses, 6, sections)
}

export function getOverallScore(responses: Record<string, number>, sections: Section[]): number {
  const allScores = sections
    .map((_, i) => getSectionScore(responses, i, sections))
    .filter(s => s > 0)
  if (allScores.length === 0) return 0
  return allScores.reduce((a, b) => a + b, 0) / allScores.length
}

export function getMaturityLevel(score: number): { level: number; label: string } {
  if (score >= 3.75) return { level: 5, label: 'Governance Leading' }
  if (score >= 3.15) return { level: 4, label: 'Governance Managed' }
  if (score >= 2.45) return { level: 3, label: 'Governance Developing' }
  if (score >= 1.75) return { level: 2, label: 'Governance Aware' }
  return { level: 1, label: 'Governance Unaware' }
}

export function getWorkforceMaturityBand(workforceScore: number): string {
  if (workforceScore >= 3.8) return 'AI Exemplar'
  if (workforceScore >= 3.2) return 'AI Empowering'
  if (workforceScore >= 2.5) return 'AI Transitioning'
  if (workforceScore >= 1.8) return 'AI Aware'
  return 'AI Imposed'
}

export function getAdoptionProfile(
  governance: number,
  workforce: number
): 'Aligned Adopter' | 'Governance-Heavy' | 'People-First' | 'Early Stage' {
  if (governance >= 3.0 && workforce >= 3.0) return 'Aligned Adopter'
  if (governance >= 3.0 && workforce < 3.0) return 'Governance-Heavy'
  if (governance < 3.0 && workforce >= 3.0) return 'People-First'
  return 'Early Stage'
}

export function getRadarChartData(
  responses: Record<string, number>,
  sections: Section[]
): Array<{ section: string; score: number; fullMark: 4 }> {
  return sections.map((s, i) => ({
    section: s.title,
    score: getSectionScore(responses, i, sections),
    fullMark: 4 as const,
  }))
}

export function getLowestScoringQuestions(
  responses: Record<string, number>,
  allQuestions: Question[],
  count: number
): Question[] {
  return [...allQuestions]
    .filter(q => typeof responses[q.id] === 'number' && responses[q.id] > 0)
    .sort((a, b) => (responses[a.id] ?? 4) - (responses[b.id] ?? 4))
    .slice(0, count)
}
