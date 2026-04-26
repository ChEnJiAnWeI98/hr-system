<template>
  <div class="page-container">
    <!-- 工具栏卡片 -->
    <el-card class="toolbar-card">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <el-radio-group v-model="viewDimension" @change="handleDimensionChange">
            <el-radio-button value="department">按部门</el-radio-button>
            <el-radio-button value="position">按岗位</el-radio-button>
          </el-radio-group>

          <el-input
            v-model="searchText"
            :placeholder="viewDimension === 'department' ? '请输入部门名称搜索' : '请输入岗位名称搜索'"
            clearable
            style="width: 300px; margin-left: 16px"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="toolbar-buttons">
          <el-button @click="handleExpandAll">
            展开全部
          </el-button>
          <el-button @click="handleCollapseAll">
            收起全部
          </el-button>
          <el-button @click="handleExportImage">
            <el-icon><Download /></el-icon>
            导出PNG
          </el-button>
          <el-button @click="handleExportPDF">
            <el-icon><Download /></el-icon>
            导出PDF
          </el-button>
          <el-button @click="handlePrint">
            <el-icon><Printer /></el-icon>
            打印
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 架构图卡片 -->
    <el-card class="chart-card">
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Download, Printer } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { jsPDF } from 'jspdf'
import { getDepartmentTree } from '@/api/department'
import { getPositionList } from '@/api/position'
import type { Department } from '@/types/department'
import type { Position } from '@/types/position'

defineOptions({
  name: 'OrgChart'
})

// 维度类型
type ViewDimension = 'department' | 'position'

// 当前查看维度
const viewDimension = ref<ViewDimension>('department')

// 搜索文本
const searchText = ref('')

// 图表实例
const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

// 部门数据
const departmentData = ref<Department[]>([])
// 岗位数据
const positionData = ref<Position[]>([])
const expandedNodes = ref<Set<string>>(new Set())

/**
 * 加载部门数据
 */
const loadDepartmentData = async () => {
  try {
    const res = await getDepartmentTree({})
    if (res.code === 200) {
      departmentData.value = res.data.list || []
      // 默认只展开前3级
      expandFirstThreeLevels(departmentData.value, 1)
      await nextTick()
      initChart()
    }
  } catch (error) {
    ElMessage.error('加载部门数据失败')
  }
}

/**
 * 加载岗位数据
 */
const loadPositionData = async () => {
  try {
    // 确保部门数据已加载（岗位视图需要部门信息）
    if (departmentData.value.length === 0) {
      await loadDepartmentData()
    }

    const res = await getPositionList({ page: 1, pageSize: 9999 })
    if (res.code === 200) {
      positionData.value = res.data.list || []
      // 默认只展开前3级
      expandFirstThreeLevelsForPosition()
      await nextTick()
      initChart()
    }
  } catch (error) {
    ElMessage.error('加载岗位数据失败')
  }
}

/**
 * 维度切换处理
 */
const handleDimensionChange = () => {
  searchText.value = ''
  expandedNodes.value.clear()
  if (viewDimension.value === 'department') {
    loadDepartmentData()
  } else {
    loadPositionData()
  }
}

/**
 * 展开前3级节点
 */
const expandFirstThreeLevels = (nodes: Department[], level: number) => {
  if (level > 3) return
  nodes.forEach(node => {
    expandedNodes.value.add(`dept-${node.id}`)
    if (node.children && node.children.length > 0) {
      expandFirstThreeLevels(node.children, level + 1)
    }
  })
}

/**
 * 岗位维度展开前3级（部门 -> 岗位类别 -> 岗位）
 */
const expandFirstThreeLevelsForPosition = () => {
  // 获取所有部门ID
  const deptIds = [...new Set(positionData.value.map(p => p.departmentId))]
  deptIds.forEach(deptId => {
    expandedNodes.value.add(`dept-${deptId}`)
    // 获取该部门下的所有岗位类别
    const categories = [...new Set(
      positionData.value
        .filter(p => p.departmentId === deptId)
        .map(p => p.category)
    )]
    categories.forEach(category => {
      expandedNodes.value.add(`dept-${deptId}-cat-${category}`)
    })
  })
}

/**
 * 转换部门数据为 ECharts 树形数据
 */
const convertToTreeData = (dept: Department): any => {
  const nodeId = `dept-${dept.id}`
  const isExpanded = expandedNodes.value.has(nodeId)
  const isDisabled = dept.status === 0

  const node: any = {
    name: dept.name,
    value: nodeId,
    label: {
      show: true,
      formatter: () => {
        return [
          `{title|${dept.name}}`,
          `{info|负责人：${dept.leaderName || '未设置'}}`,
          `{info|编制：${dept.currentCount}/${dept.headcount} 人}`
        ].join('\n')
      },
      rich: {
        title: {
          fontSize: 13,
          fontWeight: 'bold',
          color: isDisabled ? '#909399' : '#303133',
          padding: [0, 0, 4, 0]
        },
        info: {
          fontSize: 11,
          color: isDisabled ? '#a8abb2' : '#606266',
          lineHeight: 16
        }
      },
      backgroundColor: isDisabled ? '#f5f7fa' : '#fff',
      borderColor: isDisabled ? '#c0c4cc' : '#dcdfe6',
      borderWidth: 1,
      borderRadius: 6,
      padding: [8, 10],
      shadowBlur: 4,
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffsetX: 0,
      shadowOffsetY: 1
    },
    itemStyle: {
      color: isDisabled ? '#909399' : '#409eff',
      borderWidth: 0
    },
    collapsed: !isExpanded
  }

  if (dept.children && dept.children.length > 0 && isExpanded) {
    node.children = dept.children.map(child => convertToTreeData(child))
  }

  return node
}

/**
 * 转换岗位数据为 ECharts 树形数据（按部门分组）
 */
const convertPositionToTreeData = (): any[] => {
  // 获取所有部门（从部门数据中获取）
  const deptMap = new Map<number, Department>()
  const collectDepts = (depts: Department[]) => {
    depts.forEach(dept => {
      deptMap.set(dept.id, dept)
      if (dept.children) {
        collectDepts(dept.children)
      }
    })
  }
  collectDepts(departmentData.value)

  // 按部门分组岗位
  const deptPositionMap = new Map<number, Position[]>()
  positionData.value.forEach(position => {
    if (!deptPositionMap.has(position.departmentId)) {
      deptPositionMap.set(position.departmentId, [])
    }
    deptPositionMap.get(position.departmentId)!.push(position)
  })

  // 构建树形结构
  const result: any[] = []
  deptPositionMap.forEach((positions, deptId) => {
    const dept = deptMap.get(deptId)
    if (!dept) return

    const deptNodeId = `dept-${deptId}`
    const isDeptExpanded = expandedNodes.value.has(deptNodeId)

    // 按岗位类别分组
    const categoryMap = new Map<number, Position[]>()
    positions.forEach(pos => {
      if (!categoryMap.has(pos.category)) {
        categoryMap.set(pos.category, [])
      }
      categoryMap.get(pos.category)!.push(pos)
    })

    const categoryNames: Record<number, string> = {
      1: '管理类',
      2: '技术类',
      3: '业务类',
      4: '职能类',
      5: '销售类',
      6: '客服类',
      7: '其他'
    }

    const deptNode: any = {
      name: dept.name,
      value: deptNodeId,
      label: {
        show: true,
        formatter: () => {
          return [
            `{title|${dept.name}}`,
            `{info|岗位数：${positions.length} 个}`,
            `{info|在职人数：${positions.reduce((sum, p) => sum + p.employeeCount, 0)} 人}`
          ].join('\n')
        },
        rich: {
          title: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#303133',
            padding: [0, 0, 8, 0]
          },
          info: {
            fontSize: 13,
            color: '#606266',
            lineHeight: 20
          }
        },
        backgroundColor: '#fff',
        borderColor: '#dcdfe6',
        borderWidth: 1,
        borderRadius: 8,
        padding: [12, 16],
        shadowBlur: 8,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffsetX: 0,
        shadowOffsetY: 2
      },
      itemStyle: {
        color: '#409eff',
        borderWidth: 0
      },
      collapsed: !isDeptExpanded
    }

    if (isDeptExpanded) {
      deptNode.children = []
      categoryMap.forEach((categoryPositions, category) => {
        const categoryNodeId = `dept-${deptId}-cat-${category}`
        const isCategoryExpanded = expandedNodes.value.has(categoryNodeId)

        const categoryNode: any = {
          name: categoryNames[category] || '其他',
          value: categoryNodeId,
          label: {
            show: true,
            formatter: () => {
              return [
                `{title|${categoryNames[category] || '其他'}}`,
                `{info|岗位数：${categoryPositions.length} 个}`,
                `{info|在职人数：${categoryPositions.reduce((sum, p) => sum + p.employeeCount, 0)} 人}`
              ].join('\n')
            },
            rich: {
              title: {
                fontSize: 15,
                fontWeight: 'bold',
                color: '#606266',
                padding: [0, 0, 6, 0]
              },
              info: {
                fontSize: 12,
                color: '#909399',
                lineHeight: 18
              }
            },
            backgroundColor: '#f5f7fa',
            borderColor: '#e4e7ed',
            borderWidth: 1,
            borderRadius: 6,
            padding: [10, 14],
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.05)',
            shadowOffsetX: 0,
            shadowOffsetY: 1
          },
          itemStyle: {
            color: '#67c23a',
            borderWidth: 0
          },
          collapsed: !isCategoryExpanded
        }

        if (isCategoryExpanded) {
          categoryNode.children = categoryPositions.map(position => {
            const isDisabled = position.status === 0
            return {
              name: position.name,
              value: `pos-${position.id}`,
              label: {
                show: true,
                formatter: () => {
                  const levelNames: Record<number, string> = {
                    1: '初级',
                    2: '中级',
                    3: '高级',
                    4: '专家'
                  }
                  return [
                    `{title|${position.name}}`,
                    `{info|职级：${levelNames[position.level] || '未知'} (${position.grade}等)}`,
                    `{info|在职人数：${position.employeeCount} 人}`
                  ].join('\n')
                },
                rich: {
                  title: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: isDisabled ? '#909399' : '#303133',
                    padding: [0, 0, 6, 0]
                  },
                  info: {
                    fontSize: 12,
                    color: isDisabled ? '#a8abb2' : '#606266',
                    lineHeight: 18
                  }
                },
                backgroundColor: isDisabled ? '#f5f7fa' : '#fff',
                borderColor: isDisabled ? '#c0c4cc' : '#dcdfe6',
                borderWidth: 1,
                borderRadius: 6,
                padding: [8, 12],
                shadowBlur: 4,
                shadowColor: 'rgba(0, 0, 0, 0.05)',
                shadowOffsetX: 0,
                shadowOffsetY: 1
              },
              itemStyle: {
                color: isDisabled ? '#909399' : '#e6a23c',
                borderWidth: 0
              }
            }
          })
        }

        deptNode.children.push(categoryNode)
      })
    }

    result.push(deptNode)
  })

  return result
}

/**
 * 初始化图表
 */
const initChart = () => {
  if (!chartRef.value) return
  if (viewDimension.value === 'department' && departmentData.value.length === 0) return
  if (viewDimension.value === 'position' && positionData.value.length === 0) return

  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value)

  let treeData: any[] = []
  if (viewDimension.value === 'department') {
    // 部门维度：找到根部门
    const rootDepts = departmentData.value.filter(dept => !dept.parentId)
    treeData = rootDepts.map(dept => convertToTreeData(dept))
  } else {
    // 岗位维度：按部门分组展示岗位
    treeData = convertPositionToTreeData()
  }

  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: any) => {
        const nodeId = params.value

        if (viewDimension.value === 'department') {
          // 部门维度的 tooltip
          const deptId = parseInt(nodeId.replace('dept-', ''))
          const dept = findDepartmentById(deptId)
          if (!dept) return ''

          return [
            `<div style="padding: 8px;">`,
            `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">${dept.name}</div>`,
            `<div style="font-size: 12px; color: #606266; line-height: 20px;">`,
            `部门编码：${dept.code}<br/>`,
            `负责人：${dept.leaderName || '未设置'}<br/>`,
            `编制人数：${dept.headcount} 人<br/>`,
            `在职人数：${dept.currentCount} 人<br/>`,
            `成立时间：${dept.establishDate}<br/>`,
            `状态：${dept.status === 1 ? '<span style="color: #67c23a;">启用</span>' : '<span style="color: #f56c6c;">停用</span>'}`,
            `</div>`,
            `</div>`
          ].join('')
        } else {
          // 岗位维度的 tooltip
          if (nodeId.startsWith('pos-')) {
            const posId = parseInt(nodeId.replace('pos-', ''))
            const position = positionData.value.find(p => p.id === posId)
            if (!position) return ''

            const levelNames: Record<number, string> = {
              1: '初级',
              2: '中级',
              3: '高级',
              4: '专家'
            }
            const categoryNames: Record<number, string> = {
              1: '管理类',
              2: '技术类',
              3: '业务类',
              4: '职能类',
              5: '销售类',
              6: '客服类',
              7: '其他'
            }

            return [
              `<div style="padding: 8px;">`,
              `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">${position.name}</div>`,
              `<div style="font-size: 12px; color: #606266; line-height: 20px;">`,
              `所属部门：${position.departmentName}<br/>`,
              `岗位类别：${categoryNames[position.category] || '其他'}<br/>`,
              `职级：${levelNames[position.level] || '未知'}<br/>`,
              `职等：${position.grade}等<br/>`,
              `在职人数：${position.employeeCount} 人<br/>`,
              `状态：${position.status === 1 ? '<span style="color: #67c23a;">启用</span>' : '<span style="color: #f56c6c;">停用</span>'}`,
              `</div>`,
              `</div>`
            ].join('')
          }
          return ''
        }
      }
    },
    series: [
      {
        type: 'tree',
        data: treeData,
        top: '2%',
        left: '5%',
        bottom: '2%',
        right: '5%',
        symbolSize: 0,
        orient: 'vertical',
        expandAndCollapse: true,
        initialTreeDepth: -1,
        itemGap: 30,
        layerGap: 60,
        zoom: 0.8,
        roam: true,
        label: {
          position: 'top',
          verticalAlign: 'middle',
          align: 'center'
        },
        leaves: {
          label: {
            position: 'bottom',
            verticalAlign: 'middle',
            align: 'center'
          }
        },
        lineStyle: {
          color: '#dcdfe6',
          width: 2,
          curveness: 0.5
        },
        emphasis: {
          focus: 'descendant',
          lineStyle: {
            color: '#409eff',
            width: 3
          }
        },
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  }

  chartInstance.setOption(option)

  // 监听节点点击事件
  chartInstance.on('click', (params: any) => {
    if (params.componentType === 'series') {
      const nodeId = params.value
      if (expandedNodes.value.has(nodeId)) {
        expandedNodes.value.delete(nodeId)
      } else {
        expandedNodes.value.add(nodeId)
      }
      initChart()
    }
  })

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

/**
 * 根据 ID 查找部门
 */
const findDepartmentById = (id: number): Department | null => {
  const find = (depts: Department[]): Department | null => {
    for (const dept of depts) {
      if (dept.id === id) return dept
      if (dept.children) {
        const found = find(dept.children)
        if (found) return found
      }
    }
    return null
  }
  return find(departmentData.value)
}

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  chartInstance?.resize()
}

/**
 * 搜索部门或岗位
 */
const handleSearch = () => {
  if (!searchText.value.trim()) {
    ElMessage.info('请输入搜索关键词')
    return
  }

  const keyword = searchText.value.trim().toLowerCase()

  if (viewDimension.value === 'department') {
    const found = findDepartmentByName(departmentData.value, keyword)
    if (found) {
      // 展开到该节点的路径
      expandToNode(`dept-${found.id}`)
      initChart()
      ElMessage.success(`已定位到：${found.name}`)
    } else {
      ElMessage.warning('未找到匹配的部门')
    }
  } else {
    const found = positionData.value.find(p => p.name.toLowerCase().includes(keyword))
    if (found) {
      // 展开到该岗位的路径
      expandedNodes.value.add(`dept-${found.departmentId}`)
      expandedNodes.value.add(`dept-${found.departmentId}-cat-${found.category}`)
      expandedNodes.value.add(`pos-${found.id}`)
      initChart()
      ElMessage.success(`已定位到：${found.name}`)
    } else {
      ElMessage.warning('未找到匹配的岗位')
    }
  }
}

/**
 * 根据名称查找部门
 */
const findDepartmentByName = (depts: Department[], keyword: string): Department | null => {
  for (const dept of depts) {
    if (dept.name.toLowerCase().includes(keyword)) {
      return dept
    }
    if (dept.children) {
      const found = findDepartmentByName(dept.children, keyword)
      if (found) return found
    }
  }
  return null
}

/**
 * 展开到指定节点
 */
const expandToNode = (nodeId: string) => {
  if (viewDimension.value === 'department') {
    const deptId = parseInt(nodeId.replace('dept-', ''))
    const path = findPathToNode(departmentData.value, deptId)
    path.forEach(id => expandedNodes.value.add(`dept-${id}`))
  } else {
    expandedNodes.value.add(nodeId)
  }
}

/**
 * 查找到节点的路径
 */
const findPathToNode = (depts: Department[], targetId: number, path: number[] = []): number[] => {
  for (const dept of depts) {
    const currentPath = [...path, dept.id]
    if (dept.id === targetId) {
      return currentPath
    }
    if (dept.children) {
      const found = findPathToNode(dept.children, targetId, currentPath)
      if (found.length > 0) return found
    }
  }
  return []
}

/**
 * 展开全部
 */
const handleExpandAll = () => {
  if (viewDimension.value === 'department') {
    const expandAll = (nodes: Department[]) => {
      nodes.forEach(node => {
        expandedNodes.value.add(`dept-${node.id}`)
        if (node.children && node.children.length > 0) {
          expandAll(node.children)
        }
      })
    }
    expandAll(departmentData.value)
  } else {
    // 岗位维度：展开所有部门、类别和岗位
    const deptIds = [...new Set(positionData.value.map(p => p.departmentId))]
    deptIds.forEach(deptId => {
      expandedNodes.value.add(`dept-${deptId}`)
      const categories = [...new Set(
        positionData.value
          .filter(p => p.departmentId === deptId)
          .map(p => p.category)
      )]
      categories.forEach(category => {
        expandedNodes.value.add(`dept-${deptId}-cat-${category}`)
      })
    })
  }
  initChart()
  ElMessage.success('已展开全部节点')
}

/**
 * 收起全部
 */
const handleCollapseAll = () => {
  expandedNodes.value.clear()
  if (viewDimension.value === 'department') {
    // 只保留根节点展开
    departmentData.value.forEach(dept => {
      if (!dept.parentId) {
        expandedNodes.value.add(`dept-${dept.id}`)
      }
    })
  } else {
    // 岗位维度：只保留部门级别展开
    const deptIds = [...new Set(positionData.value.map(p => p.departmentId))]
    deptIds.forEach(deptId => {
      expandedNodes.value.add(`dept-${deptId}`)
    })
  }
  initChart()
  ElMessage.success('已收起全部节点')
}

/**
 * 导出图片
 */
const handleExportImage = () => {
  if (!chartInstance) {
    ElMessage.error('图表未初始化')
    return
  }

  try {
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })

    const link = document.createElement('a')
    link.download = `组织架构图_${viewDimension.value === 'department' ? '按部门' : '按岗位'}_${new Date().getTime()}.png`
    link.href = url
    link.click()

    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

/**
 * 导出PDF
 */
const handleExportPDF = () => {
  if (!chartInstance) {
    ElMessage.error('图表未初始化')
    return
  }

  try {
    // 获取图表的 base64 数据
    const imgData = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })

    // 创建 PDF 文档（A4 横向）
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // A4 横向尺寸：297mm x 210mm
    const pdfWidth = 297
    const pdfHeight = 210

    // 获取图片尺寸
    const img = new Image()
    img.src = imgData

    img.onload = () => {
      // 计算图片在 PDF 中的尺寸（保持宽高比，留 10mm 边距）
      const margin = 10
      const maxWidth = pdfWidth - 2 * margin
      const maxHeight = pdfHeight - 2 * margin

      let imgWidth = maxWidth
      let imgHeight = (img.height * maxWidth) / img.width

      // 如果高度超出，按高度缩放
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight
        imgWidth = (img.width * maxHeight) / img.height
      }

      // 居中显示
      const x = (pdfWidth - imgWidth) / 2
      const y = (pdfHeight - imgHeight) / 2

      // 添加图片到 PDF
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)

      // 生成文件名
      const fileName = `组织架构图-${viewDimension.value === 'department' ? '按部门' : '按岗位'}-${new Date().getTime()}.pdf`

      // 下载 PDF
      pdf.save(fileName)

      ElMessage.success('PDF 导出成功')
    }

    img.onerror = () => {
      ElMessage.error('图片加载失败')
    }
  } catch (error) {
    console.error('导出 PDF 失败:', error)
    ElMessage.error('导出失败')
  }
}

/**
 * 打印
 */
const handlePrint = () => {
  if (!chartInstance) {
    ElMessage.error('图表未初始化')
    return
  }

  try {
    const url = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>组织架构图</title>
            <style>
              body { margin: 0; padding: 20px; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <img src="${url}" onload="window.print(); window.close();" />
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  } catch (error) {
    ElMessage.error('打印失败')
  }
}

onMounted(() => {
  // 默认加载部门数据
  loadDepartmentData()
  // 同时加载岗位数据以便切换时使用
  loadPositionData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar-card {
  flex-shrink: 0;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }

  .toolbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .toolbar-left {
      display: flex;
      align-items: center;
    }

    .toolbar-buttons {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }
}

.chart-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
  }

  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
