import game from '../util/game.js'

export async function getAllItem() {
  return await game.send('logic.marketHandler.getAllItem')
}

export async function sellItem(equipId, gold) {
  return await game.send('logic.marketHandler.sellItem', { equipId, gold })
}

export async function buyItem(itemId) {
  return await game.send('logic.marketHandler.buyItem', { itemId })
}

export async function stopSell(itemId) {
  return await game.send('logic.marketHandler.stopSell', { itemId })
}
