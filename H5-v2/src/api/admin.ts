import game from '@/util/game'

export async function sendSometing(msg: { player: Array<string>, exp: number, goods: Array<string>, gold: number, coin: number }) {
  return await game.send('logic.adminHandler.sendSometing', msg)
}

export async function reloadConfig() {
  return await game.send('logic.adminHandler.reloadConfig')
}

export async function resetPlayerSkills() {
  return await game.send('logic.adminHandler.resetPlayerSkills')
}

export async function getInlinePlayer() {
  return await game.send('logic.adminHandler.getInlinePlayer')
}