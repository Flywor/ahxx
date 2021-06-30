export const qualityMap = {
  0: { color: 'rgba(0, 0, 0, 0.65)', name: '普通' },
  1: { color: '#0779e4', name: '稀有' },
  2: { color: '#9d0191', name: '神话' },
  3: { color: '#ff7e67', name: '传说' },
  4: { color: '#f1c550', name: '不朽' },
  5: { color: '#fa1616', name: '至宝' }
}

export const qualityOptions = Object.keys(qualityMap).map(value => {
  return { value: Number(value), label: qualityMap[value].name }
})

export const typeMap = {
  5: '武器',
  0: '头盔',
  3: '胸甲',
  1: '手套',
  4: '腰带',
  2: '鞋子',
  6: '戒指',
  7: '项链'
}

export const weaponOptions = [5, 0, 3, 1, 4, 2, 6, 7].map(value => {
  return { value: Number(value), label: typeMap[value] }
})

export const skillTypeMap = {
  0: '物理伤害',
  1: '魔法伤害',
  2: '恢复HP',
  3: '恢复MP',
  4: '复活',
  5: '保护',
  6: '捕捉',
  7: '控制',
  8: 'buff',
  9: '被动技能'
}

export const petQualityMap = {
  0: { color: 'rgba(0, 0, 0, 0.65)', name: '野兽' },
  1: { color: '#0779e4', name: '灵兽' },
  2: { color: '#9d0191', name: '神兽' },
  3: { color: '#ff7e67', name: '仙兽' },
  4: { color: '#f1c550', name: '圣兽' },
}
