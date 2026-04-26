<template>
  <slot v-if="passed" />
  <div v-else class="access-gate">
    <div class="gate-card">
      <div class="gate-brand">
        <div class="gate-icon">🔒</div>
        <h1 class="gate-title">企业 HR 管理系统</h1>
        <p class="gate-subtitle">产品经理演示项目 · 需要访问口令</p>
      </div>

      <el-input
        v-model="input"
        type="password"
        size="large"
        placeholder="请输入访问口令"
        show-password
        autofocus
        class="gate-input"
        @keyup.enter="handleSubmit"
      />
      <el-button
        type="primary"
        size="large"
        class="gate-button"
        @click="handleSubmit"
      >
        进入系统
      </el-button>

      <transition name="fade">
        <div v-if="error" class="gate-error">{{ error }}</div>
      </transition>

      <div class="gate-footer">
        <p>本项目为产品经理个人演示作品</p>
        <p>口令通过邀请方式获取,不对外公开</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ⚠️⚠️⚠️ 修改访问口令请改下面这一行 ⚠️⚠️⚠️
const PASSWORD = 'cjw2026'

const GATE_KEY = 'hr_demo_gate_granted'

const passed = ref(localStorage.getItem(GATE_KEY) === 'true')
const input = ref('')
const error = ref('')

const handleSubmit = () => {
  if (input.value === PASSWORD) {
    // 清除任何旧状态(避免上次访客/缓存污染),然后设置通行证
    localStorage.clear()
    localStorage.setItem(GATE_KEY, 'true')
    // 刷新让 Pinia stores 以干净状态重新初始化
    location.reload()
  } else {
    error.value = '口令不正确,请重新输入'
    input.value = ''
  }
}
</script>

<style scoped>
.access-gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.gate-card {
  width: 100%;
  max-width: 420px;
  padding: 48px 40px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.gate-brand {
  text-align: center;
  margin-bottom: 32px;
}

.gate-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.gate-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.gate-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.gate-input {
  margin-bottom: 16px;
}

.gate-button {
  width: 100%;
}

.gate-error {
  color: #f56c6c;
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
}

.gate-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  text-align: center;
  font-size: 12px;
  color: #c0c4cc;
  line-height: 1.8;
}

.gate-footer p {
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
