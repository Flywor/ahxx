import game from '../util/game.js'

export async function getAllItem(params) {
  return await game.send('logic.marketHandler.getAllItem', params)
}

export async function marketSellEquip(equipId, gold) {
  return await game.send('logic.marketHandler.sellEquip', { equipId, gold })
}

export async function marketSellPet(petId, gold) {
  return await game.send('logic.marketHandler.sellPet', { petId, gold })
}

export async function marketSellProp(propId, count, gold) {
  return await game.send('logic.marketHandler.sellProp', { propId, count, gold })
}

export async function buyItem(itemId) {
  return await game.send('logic.marketHandler.buyItem', { itemId })
}

export async function stopSell(itemId) {
  return await game.send('logic.marketHandler.stopSell', { itemId })
}
