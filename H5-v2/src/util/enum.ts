export const getDefineByQuality = (quality: number) => {
  let name = ''
  let color = ''
  switch(quality) {
    case 1:
      name = 'D'
      color = 'rgba(0, 0, 0, 0.65)'
      break
    case 2:
      name = 'C'
      color = '#0779e4'
      break
    case 3:
      name = 'B'
      color = '#9d0191'
      break
    case 4:
      name = 'A'
      color = '#ff7e67'
      break
    case 5:
      name = 'S'
      color = '#f1c550'
      break
    case 6:
      name = 'S'
      color = '#fa1616'
      break
  }
  return { name, color }
}
