import game from '@/util/game'

export async function moveToMap(mapid: string) {
  return await game.send('logic.playerHandler.moveToMap', { mapid })
}

export async function assignAttr(attr = { con: 0, str: 0, vit: 0, agi: 0 }) {
  return await game.send('logic.playerHandler.assignAttr', attr)
}

export async function resetAttr() {
  return await game.send('logic.playerHandler.resetAttr')
}

export async function getEquip(page = 1) {
  return await game.send('logic.playerHandler.getEquip', { page })
}

export async function dressEquip(equipId: string) {
  return await game.send('logic.playerHandler.dressEquip', { equipId })
}

export async function sellEquip(equipId: string) {
  return await game.send('logic.playerHandler.sellEquip', { equipId })
}

export async function sellEquipByQuality(quality: string) {
  return await game.send('logic.playerHandler.sellEquip', { quality })
}

export async function getProp(page = 1) {
  return await game.send('logic.playerHandler.getProp', { page })
}

export async function levelUp() {
  return await game.send('logic.playerHandler.levelUp')
}

export async function useProp(propId: string) {
  return await game.send('logic.playerHandler.useProp', { propId })
}

export async function composeProp(propId: string) {
  return await game.send('logic.playerHandler.composeProp', { propId })
}

export async function completeTask(taskId: string) {
  return await game.send('logic.playerHandler.completeTask', { taskId })
}

export async function buyItem(shopId: string, goodsId: string) {
  return await game.send('logic.playerHandler.buyItem', { shopId, goodsId })
}

export async function joinSect(sectId: string) {
  return await game.send('logic.playerHandler.joinSect', { sectId })
}

export async function getSectSkill() {
  return await game.send('logic.playerHandler.getSectSkill')
}

export async function learnSkill(skillId: string) {
  return await game.send('logic.playerHandler.learnSkill', { skillId })
}

export async function lvUpSectSkill(skillId: string) {
  return await game.send('logic.playerHandler.lvUpSectSkill', { skillId })
}

export async function equipQualityUp(equipId: string) {
  return await game.send('logic.playerHandler.equipQualityUp', { equipId })
}

export async function equipReset(equipId: string) {
  return await game.send('logic.playerHandler.equipReset', { equipId })
}
