import game from '../util/game.js'

export async function getTeamList(x, y) {
  return await game.send('logic.teamHandler.getTeamList')
  return data.data
}

export async function createTeam(psw) {
  return await game.send('logic.teamHandler.createTeam', { psw })
}

export async function leaveTeam() {
  return await game.send('logic.teamHandler.leaveTeam')
}

export async function joinTeam(leader, psw) {
  return await game.send('logic.teamHandler.joinTeam', { leader, psw })
}

export async function battleStart(mapid) {
  return await game.send('logic.teamHandler.battleStart', { mapid })
}

export async function roundMonsterOperation(playerAction = {
  playerSkill: null,
  playerTarget: null,
  petSkill: null,
  petTarget: null
}) {
  return await game.send('logic.teamHandler.roundMonsterOperation', playerAction)
}
