import game from '../util/game.js'

export async function getPetList() {
  return await game.send('logic.petHandler.getPetList')
}

export async function switchPetStatus(petId) {
  return await game.send('logic.petHandler.switchPetStatus', { petId })
}

export async function discardPet(petId) {
  return await game.send('logic.petHandler.discardPet', { petId })
}

export async function rebornPet(petId) {
  return await game.send('logic.petHandler.rebornPet', { petId })
}
