/**
 * 数据字典 Store
 * Phase 1.1 - 所有业务模块读取字典的统一入口
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DictEntry, DictItem } from '@/types/system/dictionary'
import { ALL_DICTS } from '@/mock/dict'

export const useDictStore = defineStore(
  'dict',
  () => {
    // 所有字典数据（可编辑 → 响应式）
    const dicts = ref<DictEntry[]>(JSON.parse(JSON.stringify(ALL_DICTS)))

    /** 获取整个字典 */
    const getDict = (dictCode: string): DictEntry | undefined => {
      return dicts.value.find((d) => d.dictCode === dictCode)
    }

    /** 获取字典的字典项（仅启用） */
    const getItems = (dictCode: string): DictItem[] => {
      const dict = getDict(dictCode)
      if (!dict) return []
      return dict.items
        .filter((i) => i.status === 1)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    }

    /** 根据字典 value 获取 label */
    const getLabel = (dictCode: string, value: string | number): string => {
      const items = getItems(dictCode)
      return items.find((i) => i.value === value)?.label || String(value)
    }

    /** 根据字典 value 获取 extra 扩展字段 */
    const getExtra = (dictCode: string, value: string | number): Record<string, any> | undefined => {
      const items = getItems(dictCode)
      return items.find((i) => i.value === value)?.extra
    }

    /** 批量转换：将 values 数组转为 labels 数组（保持顺序） */
    const getLabels = (dictCode: string, values: (string | number)[]): string[] => {
      return values.map((v) => getLabel(dictCode, v))
    }

    /** 获取某分组下所有字典 */
    const getDictsByGroup = (group: string): DictEntry[] => {
      return dicts.value
        .filter((d) => d.dictGroup === group && d.status === 1)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    }

    /** 所有分组 */
    const allGroups = computed(() => {
      return Array.from(new Set(dicts.value.map((d) => d.dictGroup)))
    })

    /** 新增字典 */
    const addDict = (dict: DictEntry) => {
      dicts.value.push(dict)
    }

    /** 更新字典 */
    const updateDict = (dictCode: string, patch: Partial<DictEntry>) => {
      const idx = dicts.value.findIndex((d) => d.dictCode === dictCode)
      if (idx !== -1) {
        dicts.value[idx] = { ...dicts.value[idx], ...patch }
      }
    }

    /** 删除字典 */
    const removeDict = (dictCode: string) => {
      const idx = dicts.value.findIndex((d) => d.dictCode === dictCode)
      if (idx !== -1 && !dicts.value[idx].isSystem) {
        dicts.value.splice(idx, 1)
      }
    }

    /** 新增字典项 */
    const addItem = (dictCode: string, item: DictItem) => {
      const dict = getDict(dictCode)
      if (dict && dict.editable) {
        dict.items.push(item)
      }
    }

    /** 更新字典项 */
    const updateItem = (dictCode: string, value: string | number, patch: Partial<DictItem>) => {
      const dict = getDict(dictCode)
      if (!dict || !dict.editable) return
      const idx = dict.items.findIndex((i) => i.value === value)
      if (idx !== -1) {
        dict.items[idx] = { ...dict.items[idx], ...patch }
      }
    }

    /** 删除字典项 */
    const removeItem = (dictCode: string, value: string | number) => {
      const dict = getDict(dictCode)
      if (!dict || !dict.editable) return
      const idx = dict.items.findIndex((i) => i.value === value)
      if (idx !== -1) dict.items.splice(idx, 1)
    }

    return {
      dicts,
      allGroups,
      getDict,
      getItems,
      getLabel,
      getExtra,
      getLabels,
      getDictsByGroup,
      addDict,
      updateDict,
      removeDict,
      addItem,
      updateItem,
      removeItem
    }
  },
  {
    persist: {
      key: 'hr-system-dict',
      storage: localStorage
    }
  }
)
