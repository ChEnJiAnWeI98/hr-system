<template>
  <div class="page-container">
    <el-card class="param-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange as any">
        <el-tab-pane label="基础配置" name="basic">
          <el-scrollbar class="form-scrollbar">
            <el-form
              ref="basicFormRef"
              :model="basicParams"
              label-width="150px"
              class="param-form"
            >
              <el-form-item
                v-for="param in basicParams"
                :key="param.id"
                :label="param.paramName"
              >
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
                    <el-button type="primary" style="margin-left: 12px">
                      上传文件
                    </el-button>
                  </div>
                  <div class="param-desc">{{ param.description }}</div>
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="form-footer">
            <el-button type="primary" @click="handleSave('basic')">
              保存配置
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="安全配置" name="security">
          <el-scrollbar class="form-scrollbar">
            <el-form
              ref="securityFormRef"
              :model="securityParams"
              label-width="150px"
              class="param-form"
            >
              <el-form-item
                v-for="param in securityParams"
                :key="param.id"
                :label="param.paramName"
              >
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
                    <el-button type="primary" style="margin-left: 12px">
                      上传文件
                    </el-button>
                  </div>
                  <div class="param-desc">{{ param.description }}</div>
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="form-footer">
            <el-button type="primary" @click="handleSave('security')">
              保存配置
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="业务配置" name="business">
          <el-scrollbar class="form-scrollbar">
            <el-form
              ref="businessFormRef"
              :model="businessParams"
              label-width="150px"
              class="param-form"
            >
              <el-form-item
                v-for="param in businessParams"
                :key="param.id"
                :label="param.paramName"
              >
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
                    <el-button type="primary" style="margin-left: 12px">
                      上传文件
                    </el-button>
                  </div>
                  <div class="param-desc">{{ param.description }}</div>
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="form-footer">
            <el-button type="primary" @click="handleSave('business')">
              保存配置
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="通知配置" name="notification">
          <el-scrollbar class="form-scrollbar">
            <el-form
              ref="notificationFormRef"
              :model="notificationParams"
              label-width="150px"
              class="param-form"
            >
              <el-form-item
                v-for="param in notificationParams"
                :key="param.id"
                :label="param.paramName"
              >
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
                    <el-button type="primary" style="margin-left: 12px">
                      上传文件
                    </el-button>
                  </div>
                  <div class="param-desc">{{ param.description }}</div>
                </div>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="form-footer">
            <el-button type="primary" @click="handleSave('notification')">
              保存配置
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getByGroup, batchUpdate } from '@/api/system-param'
import type { SystemParam } from '@/types/system'

defineOptions({
  name: 'SystemParam'
})

const activeTab = ref('basic')
const basicParams = ref<SystemParam[]>([])
const securityParams = ref<SystemParam[]>([])
const businessParams = ref<SystemParam[]>([])
const notificationParams = ref<SystemParam[]>([])

const basicFormRef = ref()
const securityFormRef = ref()
const businessFormRef = ref()
const notificationFormRef = ref()

/**
 * 加载参数列表
 */
const loadParams = async (group: string) => {
  try {
    const res = await getByGroup(group)
    if (res.code === 200) {
      switch (group) {
        case '基础配置':
          basicParams.value = res.data
          break
        case '安全配置':
          securityParams.value = res.data
          break
        case '业务配置':
          businessParams.value = res.data
          break
        case '通知配置':
          notificationParams.value = res.data
          break
      }
    }
  } catch (error) {
    ElMessage.error('加载参数失败')
  }
}

/**
 * 标签页切换
 */
const handleTabChange = (tabName: string) => {
  const groupMap: Record<string, string> = {
    basic: '基础配置',
    security: '安全配置',
    business: '业务配置',
    notification: '通知配置'
  }
  const group = groupMap[tabName]
  if (group) {
    loadParams(group)
  }
}

/**
 * 保存配置
 */
const handleSave = async (group: string) => {
  // 将英文分组名映射为中文
  const groupMap: Record<string, string> = {
    basic: '基础配置',
    security: '安全配置',
    business: '业务配置',
    notification: '通知配置'
  }
  const chineseGroup = groupMap[group] || group

  let params: SystemParam[] = []
  switch (group) {
    case 'basic':
      params = basicParams.value
      break
    case 'security':
      params = securityParams.value
      break
    case 'business':
      params = businessParams.value
      break
    case 'notification':
      params = notificationParams.value
      break
  }

  try {
    const res = await batchUpdate(params)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      loadParams(chineseGroup)
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  loadParams('基础配置')
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

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

  :deep(.el-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
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
