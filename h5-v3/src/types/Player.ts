export default class Player {
  // 账号，同时也是昵称
  username: string = ''
  // 坐标
  x: number = 0
  y: number = 0
  // 等级
  lv: number = 0
  // 当前经验
  exp: number = 0
  // 金币
  gold: number = 0
  // 灵石
  coin: number = 0
  // 血量
  hp: number = 0
  // 蓝量
  mp: number = 0
  // 物攻
  minAtk: number = 0
  maxAtk: number = 0
  // 法攻
  minMagic: number = 0
  maxMagic: number = 0
  // 物防
  def: number = 0
  // 法防
  magicDef: number = 0
  // 速度 每次移动格子数
  speed: number = 0
  // 攻击距离
  attackDistance: number = 0
  // 视野范围
  vision: number = 0
  
  // 物理暴击
  strCritsRate: number = 0
  // 物理爆伤
  strCritsDamageRate: number = 0
  // 无视物理防御 取百分比
  neglectDef: number = 0

  // 法术暴击
  intCritsRate: number = 0
  // 法术爆伤
  intCritsDamageRate: number = 0
  // 无视法术防御 取百分比
  neglectMagicDef: number = 0
}