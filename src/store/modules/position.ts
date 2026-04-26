/**
 * 岗位体系 Store（Phase 1.3）
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  LevelSpec,
  JobSequence,
  Position,
  JobFamilyCode,
  LevelTrack
} from '@/types/org/position'
import { LEVEL_SPECS, JOB_SEQUENCES, POSITIONS } from '@/mock/core/positionMatrix'

export const usePositionStore = defineStore(
  'position',
  () => {
    const levels = ref<LevelSpec[]>(JSON.parse(JSON.stringify(LEVEL_SPECS)))
    const sequences = ref<JobSequence[]>(JSON.parse(JSON.stringify(JOB_SEQUENCES)))
    const positions = ref<Position[]>(JSON.parse(JSON.stringify(POSITIONS)))

    /** 职级：按通道 */
    const getLevelsByTrack = (track: LevelTrack) => {
      return levels.value
        .filter((l) => l.track === track)
        .sort((a, b) => a.rank - b.rank)
    }

    /** 序列：按岗位族 */
    const getSequencesByFamily = (family: JobFamilyCode) => {
      return sequences.value.filter((s) => s.familyCode === family)
    }

    /** 岗位：按序列 */
    const getPositionsBySequence = (sequenceCode: string) => {
      return positions.value.filter((p) => p.sequenceCode === sequenceCode && p.status === 1)
    }

    /** 岗位：按岗位族 */
    const getPositionsByFamily = (family: JobFamilyCode) => {
      return positions.value.filter((p) => p.familyCode === family && p.status === 1)
    }

    /** 岗位：根据 ID */
    const getPositionById = (id: number) => positions.value.find((p) => p.id === id)

    /** 岗位：根据编码 */
    const getPositionByCode = (code: string) =>
      positions.value.find((p) => p.positionCode === code)

    /** 岗位 CRUD */
    const addPosition = (data: Partial<Position>): Position => {
      const newId = Math.max(...positions.value.map((p) => p.id)) + 1
      const newItem: Position = {
        id: newId,
        positionCode: data.positionCode || `POSNEW${newId}`,
        positionName: data.positionName || '',
        familyCode: (data.familyCode as JobFamilyCode) || 'TECH',
        sequenceCode: data.sequenceCode || '',
        levelMin: data.levelMin || 'P3',
        levelMax: data.levelMax || 'P5',
        jobDescription: data.jobDescription || '',
        qualification: data.qualification || '',
        status: data.status ?? 1,
        sortOrder: data.sortOrder ?? 99,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      }
      positions.value.push(newItem)
      return newItem
    }

    const updatePosition = (id: number, patch: Partial<Position>) => {
      const idx = positions.value.findIndex((p) => p.id === id)
      if (idx === -1) return null
      positions.value[idx] = {
        ...positions.value[idx],
        ...patch,
        updateTime: new Date().toLocaleString('zh-CN')
      }
      return positions.value[idx]
    }

    const removePosition = (id: number) => {
      const idx = positions.value.findIndex((p) => p.id === id)
      if (idx !== -1) positions.value.splice(idx, 1)
    }

    /** 矩阵视图：按序列 × 职级 分组 */
    const getMatrix = (family: JobFamilyCode) => {
      const seqs = getSequencesByFamily(family)
      // 取该岗位族下所有职级的并集
      const levelSet = new Set<string>()
      positions.value
        .filter((p) => p.familyCode === family && p.status === 1)
        .forEach((p) => {
          const levelRange = levels.value.filter((l) => {
            const pMin = levels.value.find((lx) => lx.code === p.levelMin)?.rank ?? 0
            const pMax = levels.value.find((lx) => lx.code === p.levelMax)?.rank ?? 10
            return l.rank >= pMin && l.rank <= pMax
          })
          levelRange.forEach((l) => levelSet.add(l.code))
        })
      const levelList = Array.from(levelSet)
        .map((code) => levels.value.find((l) => l.code === code)!)
        .filter(Boolean)
        .sort((a, b) => a.rank - b.rank)
      return { sequences: seqs, levels: levelList }
    }

    /** 所有岗位族 */
    const families = computed<JobFamilyCode[]>(() => {
      return ['TECH', 'PROD', 'SALES', 'OPS', 'FUNC', 'MGMT']
    })

    return {
      levels,
      sequences,
      positions,
      families,
      getLevelsByTrack,
      getSequencesByFamily,
      getPositionsBySequence,
      getPositionsByFamily,
      getPositionById,
      getPositionByCode,
      addPosition,
      updatePosition,
      removePosition,
      getMatrix
    }
  },
  {
    persist: {
      key: 'hr-system-position',
      storage: localStorage
    }
  }
)
