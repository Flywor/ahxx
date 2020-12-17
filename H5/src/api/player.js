import game from '../util/game.js'

export async function moveToMap(mapid) {
  const data = await game.send('logic.playerHandler.moveToMap', { mapid })
  console.log('logic.playerHandler.moveToMap', data)
  return data
}

export async function assignAttr(attr = { con: 0, str: 0, vit: 0, agi: 0 }) {
  const data = await game.send('logic.playerHandler.assignAttr', attr)
  console.log('logic.playerHandler.assignAttr', data)
  return data
}

export async function getEquip(page = 1) {
  const data = await game.send('logic.playerHandler.getEquip', { page })
  console.log('logic.playerHandler.getEquip', data)
  return data
}

export async function dressEquip(equipId) {
  const data = await game.send('logic.playerHandler.dressEquip', { equipId })
  console.log('logic.playerHandler.dressEquip', data)
  return data
}
