<template>
  <div class="page-container">
    <ModuleTabBar :tabs="settingsGroupTabs" />
    <el-scrollbar class="content-scrollbar">
      <!-- 顶部说明 -->
      <el-card class="intro-card">
        <div class="intro-content">
          <el-icon :size="32" class="intro-icon"><Connection /></el-icon>
          <div class="intro-main">
            <div class="intro-title">外部集成配置中心</div>
            <div class="intro-desc">
              统一管理招聘模块依赖的第三方服务账号与接入状态。当前系统对接能力为演示级占位，真实环境部署时由 HR 信息化团队填入正式授权凭证后启用。
            </div>
          </div>
        </div>
      </el-card>

      <!-- 背调服务商 -->
      <el-card class="category-card">
        <div class="category-header">
          <div class="category-title-wrap">
            <span class="category-icon" style="background: #409eff">
              <el-icon :size="20" color="#fff"><UserFilled /></el-icon>
            </span>
            <div>
              <div class="category-title">背调服务商</div>
              <div class="category-hint">对接后可在「背调管理」页直接下单，背调状态自动回写</div>
            </div>
          </div>
        </div>
        <div class="integration-grid">
          <el-card v-for="item in backgroundCheckVendors" :key="item.id" class="integration-item">
            <div class="item-header">
              <span class="item-name">{{ item.vendorName }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusLabel(item.status) }}</el-tag>
            </div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-meta">
              <div v-if="item.accountInfo" class="meta-row">
                <span class="meta-label">账号：</span>
                <span class="meta-value">{{ item.accountInfo }}</span>
              </div>
              <div v-if="item.lastSyncTime" class="meta-row">
                <span class="meta-label">上次同步：</span>
                <span class="meta-value">{{ item.lastSyncTime }}</span>
              </div>
            </div>
            <div class="item-actions">
              <el-switch
                v-model="item.enabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="item.status === 'not_connected'"
                @change="handleToggleEnabled(item)"
              />
              <el-button link type="primary" @click="openConfigDialog(item)">
                <el-icon><Setting /></el-icon>
                配置
              </el-button>
              <el-button
                link
                :disabled="item.status === 'not_connected'"
                @click="handleTestConnection(item)"
              >
                <el-icon><Connection /></el-icon>
                测试连通
              </el-button>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- 视频面试 -->
      <el-card class="category-card">
        <div class="category-header">
          <div class="category-title-wrap">
            <span class="category-icon" style="background: #67c23a">
              <el-icon :size="20" color="#fff"><VideoCamera /></el-icon>
            </span>
            <div>
              <div class="category-title">视频面试平台</div>
              <div class="category-hint">对接后可在「面试管理」一键生成会议链接，自动发送给候选人与面试官</div>
            </div>
          </div>
        </div>
        <div class="integration-grid">
          <el-card v-for="item in videoInterviewVendors" :key="item.id" class="integration-item">
            <div class="item-header">
              <span class="item-name">{{ item.vendorName }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusLabel(item.status) }}</el-tag>
            </div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-meta">
              <div v-if="item.accountInfo" class="meta-row">
                <span class="meta-label">账号：</span>
                <span class="meta-value">{{ item.accountInfo }}</span>
              </div>
              <div v-if="item.lastSyncTime" class="meta-row">
                <span class="meta-label">上次同步：</span>
                <span class="meta-value">{{ item.lastSyncTime }}</span>
              </div>
            </div>
            <div class="item-actions">
              <el-switch
                v-model="item.enabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="item.status === 'not_connected'"
                @change="handleToggleEnabled(item)"
              />
              <el-button link type="primary" @click="openConfigDialog(item)">
                <el-icon><Setting /></el-icon>
                配置
              </el-button>
              <el-button
                link
                :disabled="item.status === 'not_connected'"
                @click="handleTestConnection(item)"
              >
                <el-icon><Connection /></el-icon>
                测试连通
              </el-button>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- 电子签 -->
      <el-card class="category-card">
        <div class="category-header">
          <div class="category-title-wrap">
            <span class="category-icon" style="background: #e6a23c">
              <el-icon :size="20" color="#fff"><EditPen /></el-icon>
            </span>
            <div>
              <div class="category-title">电子签服务</div>
              <div class="category-hint">对接后可在 Offer、入职合同等场景发起电子签署，候选人在线签字具备法律效力</div>
            </div>
          </div>
        </div>
        <div class="integration-grid">
          <el-card v-for="item in eSignVendors" :key="item.id" class="integration-item">
            <div class="item-header">
              <span class="item-name">{{ item.vendorName }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusLabel(item.status) }}</el-tag>
            </div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-meta">
              <div v-if="item.accountInfo" class="meta-row">
                <span class="meta-label">账号：</span>
                <span class="meta-value">{{ item.accountInfo }}</span>
              </div>
              <div v-if="item.lastSyncTime" class="meta-row">
                <span class="meta-label">上次同步：</span>
                <span class="meta-value">{{ item.lastSyncTime }}</span>
              </div>
            </div>
            <div class="item-actions">
              <el-switch
                v-model="item.enabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="item.status === 'not_connected'"
                @change="handleToggleEnabled(item)"
              />
              <el-button link type="primary" @click="openConfigDialog(item)">
                <el-icon><Setting /></el-icon>
                配置
              </el-button>
              <el-button
                link
                :disabled="item.status === 'not_connected'"
                @click="handleTestConnection(item)"
              >
                <el-icon><Connection /></el-icon>
                测试连通
              </el-button>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- AI 服务（Phase 5.2/5.3 依赖）-->
      <el-card class="category-card">
        <div class="category-header">
          <div class="category-title-wrap">
            <span class="category-icon" style="background: #6f5ef9">
              <el-icon :size="20" color="#fff"><MagicStick /></el-icon>
            </span>
            <div>
              <div class="category-title">AI 大模型服务</div>
              <div class="category-hint">对接后在「AI 智能匹配」「面试评价辅助」「简历解析」等场景提供智能能力</div>
            </div>
          </div>
        </div>
        <div class="integration-grid">
          <el-card v-for="item in aiServiceVendors" :key="item.id" class="integration-item">
            <div class="item-header">
              <span class="item-name">{{ item.vendorName }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusLabel(item.status) }}</el-tag>
            </div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-meta">
              <div v-if="item.accountInfo" class="meta-row">
                <span class="meta-label">账号：</span>
                <span class="meta-value">{{ item.accountInfo }}</span>
              </div>
              <div v-if="item.lastSyncTime" class="meta-row">
                <span class="meta-label">上次同步：</span>
                <span class="meta-value">{{ item.lastSyncTime }}</span>
              </div>
            </div>
            <div class="item-actions">
              <el-switch
                v-model="item.enabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="item.status === 'not_connected'"
                @change="handleToggleEnabled(item)"
              />
              <el-button link type="primary" @click="openConfigDialog(item)">
                <el-icon><Setting /></el-icon>
                配置
              </el-button>
              <el-button link :disabled="item.status === 'not_connected'" @click="handleTestConnection(item)">
                <el-icon><Connection /></el-icon>
                测试连通
              </el-button>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- 聊天机器人 -->
      <el-card class="category-card">
        <div class="category-header">
          <div class="category-title-wrap">
            <span class="category-icon" style="background: #14c9c9">
              <el-icon :size="20" color="#fff"><ChatDotRound /></el-icon>
            </span>
            <div>
              <div class="category-title">聊天机器人</div>
              <div class="category-hint">为候选人提供 7×24 小时自助答疑；为 HR 降低重复性沟通负担</div>
            </div>
          </div>
        </div>
        <div class="integration-grid">
          <el-card v-for="item in chatbotVendors" :key="item.id" class="integration-item">
            <div class="item-header">
              <span class="item-name">{{ item.vendorName }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusLabel(item.status) }}</el-tag>
            </div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-meta">
              <div v-if="item.accountInfo" class="meta-row">
                <span class="meta-label">账号：</span>
                <span class="meta-value">{{ item.accountInfo }}</span>
              </div>
              <div v-if="item.lastSyncTime" class="meta-row">
                <span class="meta-label">上次同步：</span>
                <span class="meta-value">{{ item.lastSyncTime }}</span>
              </div>
            </div>
            <div class="item-actions">
              <el-switch
                v-model="item.enabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="item.status === 'not_connected'"
                @change="handleToggleEnabled(item)"
              />
              <el-button link type="primary" @click="openConfigDialog(item)">
                <el-icon><Setting /></el-icon>
                配置
              </el-button>
              <el-button link :disabled="item.status === 'not_connected'" @click="handleTestConnection(item)">
                <el-icon><Connection /></el-icon>
                测试连通
              </el-button>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- 社交渠道 -->
      <el-card class="category-card">
        <div class="category-header">
          <div class="category-title-wrap">
            <span class="category-icon" style="background: #f56c6c">
              <el-icon :size="20" color="#fff"><Share /></el-icon>
            </span>
            <div>
              <div class="category-title">社交渠道抓取</div>
              <div class="category-hint">主动挖掘被动候选人；必须使用官方开放 API，不做违规爬虫</div>
            </div>
          </div>
        </div>
        <div class="integration-grid">
          <el-card v-for="item in socialCrawlerVendors" :key="item.id" class="integration-item">
            <div class="item-header">
              <span class="item-name">{{ item.vendorName }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusLabel(item.status) }}</el-tag>
            </div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-meta">
              <div v-if="item.accountInfo" class="meta-row">
                <span class="meta-label">账号：</span>
                <span class="meta-value">{{ item.accountInfo }}</span>
              </div>
              <div v-if="item.lastSyncTime" class="meta-row">
                <span class="meta-label">上次同步：</span>
                <span class="meta-value">{{ item.lastSyncTime }}</span>
              </div>
            </div>
            <div class="item-actions">
              <el-switch
                v-model="item.enabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="item.status === 'not_connected'"
                @change="handleToggleEnabled(item)"
              />
              <el-button link type="primary" @click="openConfigDialog(item)">
                <el-icon><Setting /></el-icon>
                配置
              </el-button>
              <el-button link :disabled="item.status === 'not_connected'" @click="handleTestConnection(item)">
                <el-icon><Connection /></el-icon>
                测试连通
              </el-button>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- 测评平台 -->
      <el-card class="category-card">
        <div class="category-header">
          <div class="category-title-wrap">
            <span class="category-icon" style="background: #6f5ef9">
              <el-icon :size="20" color="#fff"><Medal /></el-icon>
            </span>
            <div>
              <div class="category-title">测评平台</div>
              <div class="category-hint">心理/能力/领导力测评结果自动回写到候选人档案；辅助面试决策</div>
            </div>
          </div>
        </div>
        <div class="integration-grid">
          <el-card v-for="item in assessmentVendors" :key="item.id" class="integration-item">
            <div class="item-header">
              <span class="item-name">{{ item.vendorName }}</span>
              <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusLabel(item.status) }}</el-tag>
            </div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-meta">
              <div v-if="item.accountInfo" class="meta-row">
                <span class="meta-label">账号：</span>
                <span class="meta-value">{{ item.accountInfo }}</span>
              </div>
              <div v-if="item.lastSyncTime" class="meta-row">
                <span class="meta-label">上次同步：</span>
                <span class="meta-value">{{ item.lastSyncTime }}</span>
              </div>
            </div>
            <div class="item-actions">
              <el-switch
                v-model="item.enabled"
                :active-value="1"
                :inactive-value="0"
                :disabled="item.status === 'not_connected'"
                @change="handleToggleEnabled(item)"
              />
              <el-button link type="primary" @click="openConfigDialog(item)">
                <el-icon><Setting /></el-icon>
                配置
              </el-button>
              <el-button link :disabled="item.status === 'not_connected'" @click="handleTestConnection(item)">
                <el-icon><Connection /></el-icon>
                测试连通
              </el-button>
            </div>
          </el-card>
        </div>
      </el-card>

      <!-- 配置说明卡片 -->
      <el-card class="notice-card">
        <div class="notice-header">
          <el-icon><InfoFilled /></el-icon>
          <span>接入说明</span>
        </div>
        <ul class="notice-list">
          <li><strong>配置凭证</strong>：需要由 HR 信息化负责人在服务商官网获取 AppKey / AppSecret 等凭证后填入；凭证脱敏存储</li>
          <li><strong>启用开关</strong>：未配置凭证的服务商不能直接启用；配置完成后需先「测试连通」确认通过才可启用</li>
          <li><strong>使用位置</strong>：启用后对应能力在「背调管理」「面试管理」「Offer 管理」「合同管理」页面自动生效</li>
        </ul>
      </el-card>
    </el-scrollbar>

    <!-- 配置编辑弹窗 -->
    <el-dialog v-model="configDialogVisible" :title="`配置 ${currentConfig?.vendorName || ''}`" width="560px">
      <el-form v-if="currentConfig" :model="configForm" label-width="110px">
        <el-form-item label="服务商">
          <el-input :model-value="currentConfig.vendorName" disabled />
        </el-form-item>
        <el-form-item label="接入模式">
          <el-radio-group v-model="configForm.connectionMode">
            <el-radio value="oauth">OAuth 授权</el-radio>
            <el-radio value="apikey">API Key 直连</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="AppKey / 账号">
          <el-input v-model="configForm.appKey" placeholder="请输入服务商分配的 AppKey 或账号" />
        </el-form-item>
        <el-form-item label="AppSecret">
          <el-input
            v-model="configForm.appSecret"
            type="password"
            show-password
            placeholder="请输入服务商分配的 AppSecret"
          />
        </el-form-item>
        <el-form-item label="回调域名">
          <el-input v-model="configForm.callbackUrl" placeholder="https://hr.example.com/api/callback" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="configForm.remark" type="textarea" :rows="2" placeholder="可选" />
        </el-form-item>
        <el-alert
          type="warning"
          :closable="false"
          show-icon
          title="本次保存仅为前端演示"
          description="真实环境下凭证会加密存储到服务端，本演示保存后仅刷新界面状态，不会调用外部接口。"
        />
      </el-form>
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveConfig">保存配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Connection,
  UserFilled,
  VideoCamera,
  EditPen,
  InfoFilled,
  Setting,
  MagicStick,
  ChatDotRound,
  Share,
  Medal
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ModuleTabBar from '@/views/recruitment/_shared/ModuleTabBar.vue'

defineOptions({ name: 'RecruitmentIntegrations' })

const settingsGroupTabs = [
  { label: '招聘配置中心', path: '/recruit/settings-config' },
  { label: '自动化规则', path: '/recruit/settings-automation/x' },
  { label: '内推规则', path: '/recruit/settings-referral-rules/x' },
  { label: '外部集成', path: '/recruit/settings-integrations/x' }
]

/**
 * 集成配置项
 */
interface IntegrationItem {
  id: number
  category:
    | 'background_check'
    | 'video_interview'
    | 'e_sign'
    | 'ai_service'
    | 'chatbot'
    | 'social_crawler'
    | 'assessment'
  vendor: string
  vendorName: string
  description: string
  status: 'not_connected' | 'connected' | 'disabled' | 'error'
  accountInfo?: string
  lastSyncTime?: string
  enabled: 0 | 1
}

const backgroundCheckVendors = ref<IntegrationItem[]>([
  {
    id: 1,
    category: 'background_check',
    vendor: 'beisen_bg',
    vendorName: '北森背调',
    description: '国内头部雇主品牌，主流中大型企业首选；标准调查项覆盖身份/学历/工作/诉讼/金融等',
    status: 'connected',
    accountInfo: 'app_xxx****1234',
    lastSyncTime: '2026-04-18 10:25:00',
    enabled: 1
  },
  {
    id: 2,
    category: 'background_check',
    vendor: 'ibg',
    vendorName: 'i背调',
    description: '互联网企业常用，价格较北森背调约低 20%；支持境外学历核验',
    status: 'disabled',
    accountInfo: 'app_yyy****5678',
    lastSyncTime: '2026-03-10 14:00:00',
    enabled: 0
  },
  {
    id: 3,
    category: 'background_check',
    vendor: 'dayee_bg',
    vendorName: '大易背调',
    description: '大易一站式招聘平台附属服务；已开户的大易客户可直接开通',
    status: 'not_connected',
    enabled: 0
  }
])

const videoInterviewVendors = ref<IntegrationItem[]>([
  {
    id: 4,
    category: 'video_interview',
    vendor: 'tencent_meeting',
    vendorName: '腾讯会议',
    description: '国内最主流，支持 300 人同时在线；可录屏、AI 字幕、自动生成面试纪要',
    status: 'connected',
    accountInfo: 'SdkAppId: 1400xxxxxx',
    lastSyncTime: '2026-04-19 09:12:00',
    enabled: 1
  },
  {
    id: 5,
    category: 'video_interview',
    vendor: 'zoom',
    vendorName: 'Zoom',
    description: '境外候选人/外企通用选择；稳定性好，有国际版与中国版两条接入路径',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 6,
    category: 'video_interview',
    vendor: 'feishu_meeting',
    vendorName: '飞书会议',
    description: '飞书生态客户首选；可与面试日历、通知、评价反馈深度联动',
    status: 'error',
    accountInfo: 'app_zzz****9012',
    lastSyncTime: '2026-04-15 16:40:00',
    enabled: 0
  }
])

const eSignVendors = ref<IntegrationItem[]>([
  {
    id: 7,
    category: 'e_sign',
    vendor: 'esign',
    vendorName: 'e签宝',
    description: '国内电子签市占率第一；支持 Offer Letter、入职合同、劳动合同全场景签署',
    status: 'connected',
    accountInfo: 'app_aaa****3456',
    lastSyncTime: '2026-04-19 10:50:00',
    enabled: 1
  },
  {
    id: 8,
    category: 'e_sign',
    vendor: 'fadada',
    vendorName: '法大大',
    description: '金融客户与国企常用；提供实名认证、电子签章、云端存证全流程',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 9,
    category: 'e_sign',
    vendor: 'docusign',
    vendorName: 'DocuSign',
    description: '外企与出海业务首选；支持全球 44 种语言签署，海外合规性强',
    status: 'not_connected',
    enabled: 0
  }
])

/* ========== Phase 5 新增分组 ========== */

const aiServiceVendors = ref<IntegrationItem[]>([
  {
    id: 10,
    category: 'ai_service' as any,
    vendor: 'openai',
    vendorName: 'OpenAI GPT',
    description: '通用大模型，英文场景性能强；支持 GPT-4 系列；适用于简历解析/JD 生成/面试辅助',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 11,
    category: 'ai_service' as any,
    vendor: 'claude',
    vendorName: 'Claude (Anthropic)',
    description: '长文本处理能力突出；适用于简历全文理解、候选人画像生成、面试笔录总结',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 12,
    category: 'ai_service' as any,
    vendor: 'spark',
    vendorName: '讯飞星火',
    description: '国产大模型，中文语义理解强；已通过等保三级合规；中文简历解析首选',
    status: 'connected',
    accountInfo: 'app_ai01****5678',
    lastSyncTime: '2026-04-18 09:00:00',
    enabled: 1
  },
  {
    id: 13,
    category: 'ai_service' as any,
    vendor: 'wenxin',
    vendorName: '百度文心一言',
    description: '国产大模型，教育背景信息解析准确；支持私有化部署',
    status: 'not_connected',
    enabled: 0
  }
])

const chatbotVendors = ref<IntegrationItem[]>([
  {
    id: 14,
    category: 'chatbot' as any,
    vendor: 'xiaobing',
    vendorName: '小冰机器人',
    description: 'HR 候选人 FAQ 自动应答；支持主动关怀（投递后、面试前提醒等）',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 15,
    category: 'chatbot' as any,
    vendor: 'yunwen',
    vendorName: '云问机器人',
    description: '中文 FAQ 引擎，知识库驱动；适合高频标准化问答场景',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 16,
    category: 'chatbot' as any,
    vendor: 'hrbot_custom',
    vendorName: '自研 HR Bot',
    description: '基于本系统数据和大模型自建的招聘助手；可嵌入候选人门户与内部 HR 工作台',
    status: 'disabled',
    accountInfo: 'hrbot_app****9012',
    lastSyncTime: '2026-03-20 10:00:00',
    enabled: 0
  }
])

const socialCrawlerVendors = ref<IntegrationItem[]>([
  {
    id: 17,
    category: 'social_crawler' as any,
    vendor: 'linkedin',
    vendorName: 'LinkedIn Recruiter',
    description: '海外人才搜索利器；候选人信息完整度高；仅限官方 API，禁止爬虫',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 18,
    category: 'social_crawler' as any,
    vendor: 'maimai',
    vendorName: '脉脉人才搜索',
    description: '国内职场社交平台；适合挖掘被动候选人；需通过脉脉官方开放接口调用',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 19,
    category: 'social_crawler' as any,
    vendor: 'github',
    vendorName: 'GitHub 技术候选人',
    description: '通过 GitHub 公开信息评估技术候选人；需遵守平台 ToS，仅抓取公开 profile',
    status: 'not_connected',
    enabled: 0
  }
])

const assessmentVendors = ref<IntegrationItem[]>([
  {
    id: 20,
    category: 'assessment' as any,
    vendor: 'beisen_assessment',
    vendorName: '北森测评',
    description: '行业最全的人才测评工具包；含性格、能力、管理倾向 300+ 种量表',
    status: 'connected',
    accountInfo: 'bs_app****3456',
    lastSyncTime: '2026-04-17 14:30:00',
    enabled: 1
  },
  {
    id: 21,
    category: 'assessment' as any,
    vendor: 'taiwei',
    vendorName: '太微测评',
    description: '侧重领导力和组织文化测评；常用于管理岗位选拔',
    status: 'not_connected',
    enabled: 0
  },
  {
    id: 22,
    category: 'assessment' as any,
    vendor: 'talent_review',
    vendorName: '人才盘点（北森/德勤）',
    description: '结合内部绩效与外部测评的 9-box 人才盘点，常用于高管候选人评估',
    status: 'not_connected',
    enabled: 0
  }
])

/* ========== 工具 ========== */
const getStatusLabel = (status: IntegrationItem['status']): string => {
  switch (status) {
    case 'connected':
      return '已接入'
    case 'disabled':
      return '已禁用'
    case 'error':
      return '连接异常'
    default:
      return '未接入'
  }
}

type ElTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'

const getStatusType = (status: IntegrationItem['status']): ElTagType => {
  switch (status) {
    case 'connected':
      return 'success'
    case 'disabled':
      return 'info'
    case 'error':
      return 'danger'
    default:
      return 'warning'
  }
}

/* ========== 事件 ========== */
const handleToggleEnabled = (item: IntegrationItem) => {
  if (item.enabled === 1) {
    item.status = 'connected'
    ElMessage.success(`${item.vendorName} 已启用`)
  } else {
    item.status = 'disabled'
    ElMessage.success(`${item.vendorName} 已禁用`)
  }
}

const handleTestConnection = async (item: IntegrationItem) => {
  await ElMessageBox.confirm(
    `即将测试与「${item.vendorName}」的连通性。\n\n说明：本次为演示模式，不会真实调用外部 API。真实环境会向服务商发起握手请求验证凭证有效性。`,
    '测试连通性',
    { type: 'info', confirmButtonText: '开始测试' }
  )
  // 模拟测试
  const loading = ElMessage({ message: `正在连接 ${item.vendorName}...`, type: 'info', duration: 1500 })
  await new Promise((r) => setTimeout(r, 1500))
  loading.close()
  if (item.status === 'error') {
    ElMessage.error(`${item.vendorName} 连接失败：凭证已过期`)
  } else {
    ElMessage.success(`${item.vendorName} 连接成功（演示）`)
    item.lastSyncTime = new Date().toLocaleString('zh-CN')
  }
}

/* ========== 配置弹窗 ========== */
const configDialogVisible = ref(false)
const currentConfig = ref<IntegrationItem | null>(null)
const configForm = reactive({
  connectionMode: 'apikey' as 'oauth' | 'apikey',
  appKey: '',
  appSecret: '',
  callbackUrl: 'https://hr.example.com/api/callback',
  remark: ''
})

const openConfigDialog = (item: IntegrationItem) => {
  currentConfig.value = item
  configForm.connectionMode = 'apikey'
  configForm.appKey = item.accountInfo || ''
  configForm.appSecret = ''
  configForm.callbackUrl = 'https://hr.example.com/api/callback'
  configForm.remark = ''
  configDialogVisible.value = true
}

const handleSaveConfig = () => {
  if (!currentConfig.value) return
  if (!configForm.appKey || !configForm.appSecret) {
    ElMessage.warning('请填写 AppKey 和 AppSecret')
    return
  }
  // 演示保存
  currentConfig.value.accountInfo = configForm.appKey
  if (currentConfig.value.status === 'not_connected' || currentConfig.value.status === 'error') {
    currentConfig.value.status = 'disabled' // 配置成功但未启用
  }
  currentConfig.value.lastSyncTime = new Date().toLocaleString('zh-CN')
  ElMessage.success('配置已保存（演示）；可开启启用开关激活服务')
  configDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-scrollbar {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.intro-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  background: linear-gradient(120deg, #e8f1ff 0%, #f0f5ff 100%);
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px 24px;
  }

  .intro-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .intro-icon {
    color: #409eff;
    flex-shrink: 0;
  }

  .intro-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 6px;
  }

  .intro-desc {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
  }
}

.category-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.category-header {
  margin-bottom: 16px;

  .category-title-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .category-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .category-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 2px;
  }

  .category-hint {
    font-size: 12px;
    color: #909399;
  }
}

.integration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.integration-item {
  border: 1px solid #ebeef5 !important;
  border-radius: 10px;
  box-shadow: none !important;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;
  }

  :deep(.el-card__body) {
    padding: 16px;
  }

  .item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .item-name {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }
  }

  .item-desc {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
    margin-bottom: 12px;
    min-height: 42px;
  }

  .item-meta {
    background: #fafbfc;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 12px;
    min-height: 54px;

    .meta-row {
      font-size: 12px;
      color: #606266;
      line-height: 1.8;
    }

    .meta-label {
      color: #909399;
    }

    .meta-value {
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      color: #303133;
    }
  }

  .item-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid #f0f2f5;
  }
}

.notice-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
  background: #fafbfc;

  :deep(.el-card__body) {
    padding: 20px;
  }

  .notice-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #606266;
    margin-bottom: 12px;
  }

  .notice-list {
    margin: 0;
    padding-left: 20px;
    font-size: 13px;
    color: #606266;
    line-height: 1.8;

    li {
      margin-bottom: 4px;
    }

    strong {
      color: #303133;
    }
  }
}
</style>
