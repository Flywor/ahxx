import game from '../util/game.js'

export async function getTeamList(x, y) {
  const data = await game.send('logic.teamHandler.getTeamList')
  console.log('logic.teamHandler.getTeamList', data)
  return data.data
}

export async function createTeam() {
  const data = await game.send('logic.teamHandler.createTeam')
  console.log('map.teamHandler.createTeam', data)
}

export async function leaveTeam() {
  const data = await game.send('logic.teamHandler.leaveTeam')
  console.log('map.teamHandler.leaveTeam', data)
}

export async function joinTeam(leader) {
  const data = await game.send('logic.teamHandler.joinTeam', { leader })
  console.log('map.teamHandler.joinTeam', data)
}

export async function battleStart(mapid) {
  const data = await game.send('logic.teamHandler.battleStart', { mapid })
  console.log('logic.teamHandler.battleStart', data)
  return data
}

export async function roundMonsterOperation(playerAction = {
  playerSkill: null,
  playerTarget: null,
  petSkill: null,
  petTarget: null
}) {
  const data = await game.send('logic.teamHandler.roundMonsterOperation', playerAction)
  console.log('logic.teamHandler.roundMonsterOperation', data)
  return data
}
