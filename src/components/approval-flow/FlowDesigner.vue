<template>
  <div class="flow-designer">
    <div class="designer-toolbar">
      <div class="toolbar-left">
        <el-button-group>
          <el-button :icon="ZoomIn" @click="handleZoomIn">放大</el-button>
          <el-button :icon="ZoomOut" @click="handleZoomOut">缩小</el-button>
          <el-button :icon="Refresh" @click="handleResetZoom">重置</el-button>
        </el-button-group>
        <el-button :icon="Download" @click="handleExport" style="margin-left: 12px">导出</el-button>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="handleSave">保存流程</el-button>
      </div>
    </div>

    <div class="designer-content">
      <!-- 节点面板 -->
      <div class="node-panel">
        <div class="panel-title">节点类型</div>
        <div class="node-list">
          <div
            v-for="node in nodeTypes"
            :key="node.type"
            class="node-item"
            draggable="true"
            @dragstart="handleDragStart($event, node)"
          >
            <div class="node-icon" :class="`node-${node.type}`">
              <i class="iconfont-sys" v-html="node.icon"></i>
            </div>
            <div class="node-name">{{ node.name }}</div>
          </div>
        </div>
      </div>

      <!-- 画布区域 -->
      <div class="canvas-container">
        <div ref="containerRef" class="lf-container"></div>
      </div>

      <!-- 属性面板 -->
      <div class="property-panel" v-if="selectedNode">
        <div class="panel-title">节点属性</div>
        <div class="property-content">
          <el-form :model="nodeProperties" label-width="100px">
            <el-form-item label="节点名称">
              <el-input v-model="nodeProperties.name" placeholder="请输入节点名称" />
            </el-form-item>

            <!-- 审批节点配置 -->
            <template v-if="selectedNode.type === 'approval'">
              <el-form-item label="审批人类型">
                <el-select v-model="nodeProperties.approverType" placeholder="请选择审批人类型">
                  <el-option label="指定人员" value="user" />
                  <el-option label="指定角色" value="role" />
                  <el-option label="部门负责人" value="deptLeader" />
                  <el-option label="发起人上级" value="initiatorLeader" />
                  <el-option label="发起人自选" value="initiatorSelect" />
                </el-select>
              </el-form-item>

              <el-form-item label="审批人" v-if="nodeProperties.approverType === 'user'">
                <el-select
                  v-model="nodeProperties.approvers"
                  multiple
                  placeholder="请选择审批人"
                  style="width: 100%"
                >
                  <el-option
                    v-for="user in mockUsers"
                    :key="user.id"
                    :label="user.name"
                    :value="user.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="审批角色" v-if="nodeProperties.approverType === 'role'">
                <el-select
                  v-model="nodeProperties.approvers"
                  multiple
                  placeholder="请选择审批角色"
                  style="width: 100%"
                >
                  <el-option label="HR管理员" value="hr_admin" />
                  <el-option label="部门负责人" value="dept_leader" />
                  <el-option label="财务负责人" value="finance_leader" />
                  <el-option label="总经理" value="general_manager" />
                </el-select>
              </el-form-item>

              <el-form-item label="审批方式">
                <el-radio-group v-model="nodeProperties.approvalMode">
                  <el-radio value="and">会签（所有人同意）</el-radio>
                  <el-radio value="or">或签（任一人同意）</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>

            <!-- 条件分支节点配置 -->
            <template v-if="selectedNode.type === 'condition'">
              <el-form-item label="条件配置">
                <div class="condition-list">
                  <div
                    v-for="(condition, index) in nodeProperties.conditions"
                    :key="index"
                    class="condition-item"
                  >
                    <el-select v-model="condition.field" placeholder="字段" style="width: 100%">
                      <el-option label="金额" value="amount" />
                      <el-option label="部门" value="department" />
                      <el-option label="职级" value="jobLevel" />
                      <el-option label="请假天数" value="days" />
                    </el-select>
                    <el-select v-model="condition.operator" placeholder="运算符" style="width: 100%; margin-top: 8px">
                      <el-option label="大于 >" value="gt" />
                      <el-option label="小于 <" value="lt" />
                      <el-option label="大于等于 >=" value="gte" />
                      <el-option label="小于等于 <=" value="lte" />
                      <el-option label="等于 =" value="eq" />
                      <el-option label="不等于 !=" value="neq" />
                    </el-select>
                    <el-input
                      v-model="condition.value"
                      placeholder="请输入值"
                      style="width: 100%; margin-top: 8px"
                    />
                    <el-button
                      :icon="Delete"
                      link
                      type="danger"
                      @click="removeCondition(index)"
                      style="margin-top: 8px; width: 100%"
                    >
                      删除条件
                    </el-button>
                  </div>
                  <el-button :icon="Plus" @click="addCondition" style="margin-top: 8px; width: 100%">
                    添加条件
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item label="条件关系">
                <el-radio-group v-model="nodeProperties.conditionRelation">
                  <el-radio value="and">且（所有条件满足）</el-radio>
                  <el-radio value="or">或（任一条件满足）</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>

            <!-- 并行节点配置 -->
            <template v-if="selectedNode.type === 'parallel'">
              <el-form-item label="并行分支数">
                <el-input-number v-model="nodeProperties.branchCount" :min="2" :max="5" />
              </el-form-item>
            </template>

            <el-form-item>
              <el-button type="primary" @click="handleUpdateNode">保存属性</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/index.css'
import { ZoomIn, ZoomOut, Refresh, Download, Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue?: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'save', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const containerRef = ref<HTMLElement>()
let lf: LogicFlow | null = null

// 节点类型
const nodeTypes = [
  { type: 'start', name: '开始', icon: '&#xe7fc;' },
  { type: 'approval', name: '审批', icon: '&#xe88a;' },
  { type: 'condition', name: '条件分支', icon: '&#xe7fd;' },
  { type: 'parallel', name: '并行', icon: '&#xe7fe;' },
  { type: 'end', name: '结束', icon: '&#xe7ff;' }
]

// Mock 用户数据
const mockUsers = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' }
]

// 选中的节点
const selectedNode = ref<any>(null)

// 节点属性
const nodeProperties = reactive<any>({
  name: '',
  approverType: 'user',
  approvers: [],
  approvalMode: 'and',
  conditions: [],
  conditionRelation: 'and',
  branchCount: 2
})

// 初始化 LogicFlow
onMounted(() => {
  if (!containerRef.value) {
    console.error('containerRef is null')
    return
  }

  console.log('Container element:', containerRef.value)
  console.log('Container dimensions:', {
    width: containerRef.value.offsetWidth,
    height: containerRef.value.offsetHeight,
    clientWidth: containerRef.value.clientWidth,
    clientHeight: containerRef.value.clientHeight
  })

  lf = new LogicFlow({
    container: containerRef.value,
    grid: {
      size: 10,
      visible: true,
      type: 'dot'
    },
    keyboard: {
      enabled: true
    },
    snapline: true,
    history: true,
    partial: false,
    style: {
      rect: {
        rx: 5,
        ry: 5,
        strokeWidth: 2
      },
      circle: {
        fill: '#f56c6c',
        stroke: '#f56c6c',
        r: 30
      },
      ellipse: {
        fill: '#67c23a',
        stroke: '#67c23a'
      },
      polygon: {
        fill: '#e6a23c',
        stroke: '#e6a23c'
      },
      diamond: {
        fill: '#409eff',
        stroke: '#409eff'
      },
      text: {
        color: '#ffffff',
        fontSize: 14
      }
    }
  })

  console.log('LogicFlow instance created:', lf)
  console.log('LogicFlow container element:', lf.container)

  // 注册自定义节点
  registerCustomNodes()

  // 监听节点点击事件
  lf.on('node:click', ({ data }) => {
    selectedNode.value = data
    loadNodeProperties(data)
  })

  // 监听画布点击事件
  lf.on('blank:click', () => {
    selectedNode.value = null
  })

  // 先渲染画布（必须先调用 render 才能创建 SVG 画布）
  if (props.modelValue) {
    console.log('Rendering with modelValue:', props.modelValue)
    lf.render(props.modelValue)
  } else {
    console.log('Rendering empty canvas')
    // 渲染空画布
    lf.render({})
    // 然后添加默认开始节点
    const node = lf.addNode({
      type: 'circle',
      x: 300,
      y: 100,
      text: '开始',
      properties: {
        nodeType: 'start'
      }
    })
    console.log('Default start node added:', node)
  }

  // 检查 LogicFlow 是否创建了 SVG 元素
  setTimeout(() => {
    console.log('Container children after init:', containerRef.value?.children)
    console.log('Container innerHTML length:', containerRef.value?.innerHTML.length)
    const svgElement = containerRef.value?.querySelector('svg')
    console.log('SVG element found:', svgElement)
    if (svgElement) {
      console.log('SVG dimensions:', {
        width: svgElement.getAttribute('width'),
        height: svgElement.getAttribute('height'),
        viewBox: svgElement.getAttribute('viewBox')
      })
    }
  }, 500)

  // 添加拖放事件监听
  const container = containerRef.value

  container.addEventListener('dragover', (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
  })

  container.addEventListener('drop', (event: DragEvent) => {
    event.preventDefault()
    if (!event.dataTransfer || !lf) return

    const nodeType = event.dataTransfer.getData('nodeType')
    if (!nodeType) return

    const point = lf.getPointByClient(event.clientX, event.clientY)
    const { x, y } = point.canvasOverlayPosition

    let type = 'rect'
    let text = ''
    let properties: any = { nodeType }

    switch (nodeType) {
      case 'start':
        type = 'circle'
        text = '开始'
        break
      case 'approval':
        type = 'rect'
        text = '审批节点'
        break
      case 'condition':
        type = 'diamond'
        text = '条件分支'
        break
      case 'parallel':
        type = 'rect'
        text = '并行节点'
        properties.branchCount = 2
        break
      case 'end':
        type = 'circle'
        text = '结束'
        break
    }

    lf.addNode({
      type,
      x,
      y,
      text,
      properties
    })
  })
})

// 监听 modelValue 变化，重新渲染流程图
watch(() => props.modelValue, (newValue) => {
  if (newValue && lf) {
    console.log('ModelValue changed, re-rendering:', newValue)
    lf.render(newValue)
  }
}, { deep: true })

// 注册自定义节点
const registerCustomNodes = () => {
  if (!lf) return

  // 开始节点（圆形）
  // 审批节点（矩形）
  // 条件分支节点（菱形）
  // 并行节点（矩形）
  // 结束节点（圆形）
}

// 拖拽开始
const handleDragStart = (event: DragEvent, node: any) => {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('nodeType', node.type)
}

// 加载节点属性
const loadNodeProperties = (node: any) => {
  nodeProperties.name = node.text?.value || ''
  nodeProperties.approverType = node.properties?.approverType || 'user'
  nodeProperties.approvers = node.properties?.approvers || []
  nodeProperties.approvalMode = node.properties?.approvalMode || 'and'
  nodeProperties.conditions = node.properties?.conditions || []
  nodeProperties.conditionRelation = node.properties?.conditionRelation || 'and'
  nodeProperties.branchCount = node.properties?.branchCount || 2
}

// 更新节点属性
const handleUpdateNode = () => {
  if (!lf || !selectedNode.value) return

  const properties = {
    nodeType: selectedNode.value.properties?.nodeType,
    approverType: nodeProperties.approverType,
    approvers: nodeProperties.approvers,
    approvalMode: nodeProperties.approvalMode,
    conditions: nodeProperties.conditions,
    conditionRelation: nodeProperties.conditionRelation,
    branchCount: nodeProperties.branchCount
  }

  lf.setProperties(selectedNode.value.id, properties)
  lf.updateText(selectedNode.value.id, nodeProperties.name)

  ElMessage.success('节点属性已更新')
}

// 放大
const handleZoomIn = () => {
  lf?.zoom(true)
}

// 缩小
const handleZoomOut = () => {
  lf?.zoom(false)
}

// 重置缩放
const handleResetZoom = () => {
  lf?.resetZoom()
}

// 导出
const handleExport = () => {
  if (!lf) return
  const data = lf.getGraphData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'flow.json'
  a.click()
  URL.revokeObjectURL(url)
}

// 保存流程
const handleSave = () => {
  if (!lf) return
  const data = lf.getGraphData()
  emit('update:modelValue', data)
  emit('save', data)
  ElMessage.success('流程已保存')
}

// 添加条件
const addCondition = () => {
  nodeProperties.conditions.push({
    field: 'amount',
    operator: 'gt',
    value: ''
  })
}

// 删除条件
const removeCondition = (index: number) => {
  nodeProperties.conditions.splice(index, 1)
}
</script>

<style scoped lang="scss">
.flow-designer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.designer-toolbar {
  flex-shrink: 0;
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .toolbar-left {
    display: flex;
    align-items: center;
  }
}

.designer-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.node-panel {
  flex-shrink: 0;
  width: 200px;
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;

  .panel-title {
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    border-bottom: 1px solid #e4e7ed;
  }

  .node-list {
    padding: 16px;
  }

  .node-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 12px;
    background: #f5f7fa;
    border-radius: 8px;
    cursor: move;
    transition: all 0.3s;

    &:hover {
      background: #e6f7ff;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .node-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      margin-right: 12px;

      .iconfont-sys {
        font-size: 20px;
        color: #ffffff;
      }

      &.node-start {
        background: #67c23a;
      }

      &.node-approval {
        background: #409eff;
      }

      &.node-condition {
        background: #e6a23c;
      }

      &.node-parallel {
        background: #909399;
      }

      &.node-end {
        background: #f56c6c;
      }
    }

    .node-name {
      font-size: 14px;
      color: #303133;
    }
  }
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #fafafa;

  .lf-container {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
}

.property-panel {
  flex-shrink: 0;
  width: 320px;
  background: #ffffff;
  border-left: 1px solid #e4e7ed;
  overflow-y: auto;

  .panel-title {
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    border-bottom: 1px solid #e4e7ed;
  }

  .property-content {
    padding: 20px;
  }

  .condition-list {
    .condition-item {
      padding: 12px;
      background: #f5f7fa;
      border-radius: 8px;
      margin-bottom: 12px;
    }
  }
}
</style>
