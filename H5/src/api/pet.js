import game from '../util/game.js'

export async function getPetList() {
  const data = await game.send('logic.petHandler.getPetList')
  console.log('logic.petHandler.getPetList', data)
  return data
}

export async function switchPetStatus(petId) {
  const data = await game.send('logic.petHandler.switchPetStatus', { petId })
  console.log('logic.petHandler.switchPetStatus', data)
  return data
}

export async function discardPet(petId) {
  const data = await game.send('logic.petHandler.discardPet', { petId })
  console.log('logic.petHandler.discardPet', data)
  return data
}
