import game from '../util/game.js'

export async function sendSometing(msg) {
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