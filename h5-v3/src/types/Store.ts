import PlayerModel from './Player'
export default interface StoreTypes {
  player: PlayerModel,
  pos: { name: string, x: number, y: number, sizeX: number, sizeY: number },
  units: { id: string, x: number, y: number, name: string, type: string, hp: number, hp_c: number, per: number, percolor: string, old_hp_c: number, distance: number }[]
  skillList: { id: string, name: string, mark: string, type: number, ability: number }[],
  confirm: { tid: string, title: string, content: string },
  equipList: any[],
  goodsList: any[],
  monsterMap: { map: string, monster: string[] }[],
  news: any[],
  fb: {
    lv: 1,
    quality: 1,
    hpmp: 0,    // HPMP 比例
    defdef: 0,  // 双防 比例
    atkatk: 0,  // 双攻 比例
    negneg: 0,  // 双穿 比例
    recrec: 0,  // 双恢复 比例
    goldgold: 0, // 秒金币 比例
    hp: 0,
    mp: 0,
    maxAtk: 0,
    maxMagic: 0,
    def: 0,
    magicDef: 0,
    neglectDef: 0,
    neglectMagicDef: 0,
    exp: 0
  }
}