import PlayerModel from './Player'
export default interface StoreTypes {
  player: PlayerModel,
  pos: { name: string, x: number, y: number },
  units: { id: string, x: number, y: number, name: string, type: string, hp: number, hp_c: number, per: number, percolor: string }[]
  skillList: { id: string, name: string, mark: string, type: number, ability: number }[],
  confirm: { tid: string, title: string, content: string },
  equipList: any[],
  goodsList: any[]
}