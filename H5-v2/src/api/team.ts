import game from '@/util/game'

export async function getTeamList() {
  return await game.send('logic.teamHandler.getTeamList')
}

export async function createTeam(psw: string) {
  return await game.send('logic.teamHandler.createTeam', { psw })
}

export async function leaveTeam() {
  return await game.send('logic.teamHandler.leaveTeam')
}

export async function joinTeam(leader: string, psw: string) {
  return await game.send('logic.teamHandler.joinTeam', { leader, psw })
}

export async function battleStart(mapid: string) {
  return await game.send('logic.teamHandler.battleStart', { mapid })
}
