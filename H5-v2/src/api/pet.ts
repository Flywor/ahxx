import game from '@/util/game'

export async function getPetList() {
  return await game.send('logic.petHandler.getPetList')
}

export async function switchPetStatus(petId: string) {
  return await game.send('logic.petHandler.switchPetStatus', { petId })
}

export async function discardPet(petId: string) {
  return await game.send('logic.petHandler.discardPet', { petId })
}

export async function rebornPet(petId: string) {
  return await game.send('logic.petHandler.rebornPet', { petId })
}
