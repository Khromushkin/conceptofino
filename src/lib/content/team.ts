import { team } from '@/data/team'
import type { TeamMember } from '@/types'

export async function getTeam(): Promise<TeamMember[]> {
  return team.sort((a, b) => a.order - b.order)
}
