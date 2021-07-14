export default class Player {
  // 账号，同时也是昵称
  username: string = ''
  // 等级，映射境界
  lv: number = 0

  // 修为获取率 展示结果为百分比
  expRate: number = 0
  // 爆率 展示结果为百分比
  dropRate: number = 0
  // 金币获取率 展示结果为百分比
  goldRate: number = 0

  // 突破所需修为
  exp: number = 0
  // 当前修为
  exp_c: number = 0
  // 金币
  gold: number = 0
  // 灵石
  coin: number = 0

  // 可分配属性点
  attrPoint: number = 0
  // 根骨
  con: number = 0
  // 力道
  str: number = 0
  // 慧根
  int: number = 0

  // 血量
  hp: number = 0
  // 蓝量
  mp: number = 0
  // 物攻
  atk: number = 0
  // 法攻
  magic: number = 0
  // 物防
  def: number = 0
  // 法防
  magicDef: number = 0
  // 速度
  speed: number = 0
  
  // 物理暴击
  strCritsRate: number = 0
  // 物理爆伤
  strCritsDamageRate: number = 0
  // 法术暴击
  intCritsRate: number = 0
  // 法术爆伤
  intCritsDamageRate: number = 0
  // 无视物理防御 取百分比
  neglectDef: number = 0
  // 无视法术防御 取百分比
  neglectMagicDef: number = 0
}