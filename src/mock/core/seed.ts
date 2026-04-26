/**
 * 固定种子伪随机（Phase 1.4）
 * 保证 Mock 数据每次生成结果一致
 */

export const SEED = 20260421

/**
 * 创建一个基于种子的伪随机生成器
 * 线性同余法（LCG）
 */
export function createRandom(seed: number = SEED) {
  let s = seed
  return {
    /** 返回 [0, 1) 之间的伪随机数 */
    next(): number {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    },
    /** 返回 [min, max] 之间的整数 */
    nextInt(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min
    },
    /** 从数组中随机选一个元素 */
    pick<T>(arr: T[]): T {
      return arr[this.nextInt(0, arr.length - 1)]
    },
    /** 按权重选择（weights 总和不限） */
    pickWeighted<T>(items: Array<{ value: T; weight: number }>): T {
      const total = items.reduce((s, i) => s + i.weight, 0)
      const r = this.next() * total
      let cum = 0
      for (const item of items) {
        cum += item.weight
        if (r < cum) return item.value
      }
      return items[items.length - 1].value
    },
    /** 正态分布（Box-Muller 近似），返回 [0, 1] 之间集中在 mean 附近的值 */
    nextNormal(mean: number = 0.5, stddev: number = 0.15): number {
      const u1 = this.next() || 1e-10
      const u2 = this.next()
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
      const v = mean + z * stddev
      return Math.max(0, Math.min(1, v))
    },
    /** 重置种子 */
    reset(newSeed: number = seed) {
      s = newSeed
    }
  }
}

/** 中国百家姓（Top 40，最常见）*/
export const COMMON_SURNAMES = [
  '王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
  '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
  '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕'
]

/** 预置名字字（80 个常见字）*/
export const NAME_CHARS = [
  '伟', '芳', '娜', '敏', '静', '秀', '丽', '强', '磊', '军',
  '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀', '霞',
  '平', '刚', '桂', '华', '欣', '颖', '晨', '阳', '浩', '鑫',
  '思', '彦', '博', '然', '晓', '琪', '雪', '雨', '云', '月',
  '天', '峰', '斌', '佳', '瑶', '怡', '欢', '迪', '彤', '蕾',
  '琳', '婷', '洁', '洁', '楠', '煜', '辰', '宇', '凡', '帆',
  '睿', '睿', '文', '子', '一', '心', '宁', '茹', '萍', '红',
  '兰', '梅', '菊', '莲', '玲', '珊', '玉', '珍', '璐', '韵'
]

/** 根据身份证规则生成合法的身份证号（仅 Mock 用）*/
export function generateIdCard(birthDate: string, regionCode: string, seq: number): string {
  // 区域码（6 位）：这里用传入的前缀
  const region = regionCode.padEnd(6, '0').slice(0, 6)
  // 生日（8 位）：YYYYMMDD
  const birth = birthDate.replace(/-/g, '')
  // 流水号（3 位）：基于 seq
  const order = String(seq % 1000).padStart(3, '0')
  // 前 17 位
  const front = region + birth + order
  // 校验码
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  let sum = 0
  for (let i = 0; i < 17; i++) sum += parseInt(front[i]) * weights[i]
  const check = codes[sum % 11]
  return front + check
}

/** 地区码（用于身份证生成）*/
export const REGION_CODES = [
  '110101', // 北京东城
  '310101', // 上海黄浦
  '440304', // 深圳福田
  '330106', // 杭州西湖
  '510107', // 成都武侯
  '320105', // 南京建邺
  '610103', // 西安碑林
  '420102' // 武汉江岸
]

/** 工作地点 */
export const WORK_LOCATIONS = [
  '北京',
  '上海',
  '深圳',
  '杭州',
  '成都',
  '南京',
  '西安',
  '武汉'
]
