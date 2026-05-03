<template>
  <el-card class="param-card">
    <el-scrollbar class="form-scrollbar">
      <el-form :model="params" label-width="150px" class="param-form">
        <el-form-item v-for="param in params" :key="param.id" :label="param.paramName">
          <div class="param-item">
            <el-input
              v-if="param.paramType === '文本'"
              v-model="param.paramValue"
              :placeholder="`请输入${param.paramName}`"
            />
            <el-input
              v-else-if="param.paramType === '数字'"
              v-model="param.paramValue"
              type="number"
              :placeholder="`请输入${param.paramName}`"
            />
            <el-switch
              v-else-if="param.paramType === '布尔'"
              v-model="param.paramValue"
              active-value="true"
              inactive-value="false"
            />
            <div v-else-if="param.paramType === '文件'" class="file-input">
              <el-input
                v-model="param.paramValue"
                :placeholder="`请输入${param.paramName}路径`"
              />
              <el-button type="primary" style="margin-left: 12px">上传文件</el-button>
            </div>
            <div class="param-desc">{{ param.description }}</div>
          </div>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="form-footer">
      <el-button type="primary" @click="handleSave">保存配置</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getByGroup, batchUpdate } from '@/api/system-param'
import type { SystemParam } from '@/types/system'

const props = defineProps<{
  /** 参数分组中文名（如「基础配置」「安全配置」） */
  groupName: string
}>()

const params = ref<SystemParam[]>([])

const loadParams = async () => {
  try {
    const res = await getByGroup(props.groupName)
    if (res.code === 200) {
      params.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载参数失败')
  }
}

const handleSave = async () => {
  try {
    const res = await batchUpdate(params.value)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      loadParams()
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(loadParams)
</script>

<style scoped lang="scss">
.param-card {
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.form-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.param-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;

  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

.param-item {
  width: 100%;

  .el-input,
  .el-switch {
    width: 100%;
  }

  .file-input {
    display: flex;
    align-items: center;

    .el-input {
      flex: 1;
    }
  }

  .param-desc {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }
}

.form-footer {
  flex-shrink: 0;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  text-align: center;
}
</style>
