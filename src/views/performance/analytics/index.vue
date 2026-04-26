<template>
  <div class="analytics-container">
    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="周期">
          <el-select v-model="params.cycleId" placeholder="全部周期" style="width: 220px" clearable @change="loadData">
            <el-option label="2026 Q2 OKR 季度考核" :value="4" />
            <el-option label="2026 Q1 OKR 季度考核" :value="3" />
            <el-option label="2026 Q1 销售团队 KPI 考核" :value="8" />
            <el-option label="2025 年上半年绩效考核" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="params.departmentName" placeholder="部门" style="width: 140px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出报表
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-scrollbar class="content-scroll">
      <el-tabs v-model="activeTab" class="analytics-tabs">
        <!-- Tab 1: 分布看板 -->
        <el-tab-pane label="分布看板" name="distribution">
          <el-card class="card">
            <div class="section-title">等级分布（共 {{ data.distribution?.total || 0 }} 人）</div>
            <div class="dist-bar-wrap">
              <div class="dist-bar">
                <div v-for="g in grades" :key="g" class="dist-seg" :class="`grade-${g}`"
                  :style="{ flex: (data.distribution?.ratios?.[g] || 0.01) }">
                  <span v-if="(data.distribution?.ratios?.[g] || 0) >= 5">
                    {{ g }} {{ data.distribution?.ratios?.[g] }}%
                  </span>
                </div>
              </div>
              <div class="dist-target">目标：10% / 20% / 40% / 20% / 10%</div>
            </div>
          </el-card>

          <el-card class="card">
            <div class="section-title">过程完成率</div>
            <div class="process-grid">
              <div class="process-item">
                <div class="process-label">1on1 覆盖率</div>
                <el-progress type="dashboard" :percentage="data.processCompletion?.oooCoverage || 0" :width="110" />
              </div>
              <div class="process-item">
                <div class="process-label">面谈完成率</div>
                <el-progress type="dashboard" :percentage="data.processCompletion?.meetingCompleteRate || 0" :width="110" />
              </div>
              <div class="process-item">
                <div class="process-label">员工确认率</div>
                <el-progress type="dashboard" :percentage="data.processCompletion?.meetingConfirmRate || 0" :width="110" />
              </div>
              <div class="process-item">
                <div class="process-label">目标批准率</div>
                <el-progress type="dashboard" :percentage="data.processCompletion?.goalApprovedRate || 0" :width="110" />
              </div>
              <div class="process-item">
                <div class="process-label">PIP 通过率</div>
                <el-progress type="dashboard" :percentage="data.processCompletion?.pipPassRate || 0" :width="110" />
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- Tab 2: 部门对比 -->
        <el-tab-pane label="部门对比" name="department">
          <el-card class="card">
            <div class="section-title">各部门绩效分布对比</div>
            <el-table :data="data.departments" stripe>
              <el-table-column prop="departmentName" label="部门" width="130" />
              <el-table-column prop="total" label="人数" width="80" align="right" />
              <el-table-column prop="avgScore" label="平均分" width="100" align="center">
                <template #default="{ row }"><strong>{{ row.avgScore }}</strong></template>
              </el-table-column>
              <el-table-column label="等级分布" min-width="340">
                <template #default="{ row }">
                  <div class="mini-dist-bar">
                    <div v-for="g in grades" :key="g" class="dist-seg" :class="`grade-${g}`"
                      :style="{ flex: (row.gradeRatios[g] || 0.01) }">
                      <span v-if="row.gradeRatios[g] >= 8">{{ g }} {{ row.gradeRatios[g] }}%</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="S+A" width="100" align="center">
                <template #default="{ row }">
                  <el-tag type="success" size="small">{{ row.SACount }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="C+D" width="100" align="center">
                <template #default="{ row }">
                  <el-tag type="warning" size="small">{{ row.CDCount }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="card">
            <div class="section-title">岗位族对比</div>
            <el-table :data="data.jobFamilies" stripe>
              <el-table-column prop="jobFamily" label="岗位族" width="140" />
              <el-table-column prop="total" label="人数" width="80" align="right" />
              <el-table-column prop="avgScore" label="平均分" width="100" align="center">
                <template #default="{ row }"><strong>{{ row.avgScore }}</strong></template>
              </el-table-column>
              <el-table-column label="高绩效占比（S+A）" width="220">
                <template #default="{ row }">
                  <el-progress :percentage="row.highRate" :stroke-width="10" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 3: 周期趋势 -->
        <el-tab-pane label="周期趋势" name="trend">
          <el-card class="card">
            <div class="section-title">历次周期趋势（最多展示最近 8 个周期）</div>
            <div class="trend-bars">
              <div v-for="t in data.cycleTrend" :key="t.cycleId" class="trend-col">
                <div class="trend-score-wrap">
                  <div class="trend-bar" :style="{ height: t.avgScore + '%', background: progressColor(t.avgScore) }">
                    <span class="trend-score">{{ t.avgScore }}</span>
                  </div>
                </div>
                <div class="trend-meta">
                  <div class="trend-name">{{ (t.cycleName || '').slice(0, 12) }}</div>
                  <div class="trend-count">{{ t.total }} 人</div>
                  <div class="trend-rates">
                    <el-tag type="success" size="small">S+A {{ t.SARate.toFixed(1) }}%</el-tag>
                    <el-tag type="warning" size="small" style="margin-top: 4px">C+D {{ t.CDRate.toFixed(1) }}%</el-tag>
                  </div>
                </div>
              </div>
              <el-empty v-if="!data.cycleTrend || data.cycleTrend.length === 0" description="暂无历史周期数据" />
            </div>
          </el-card>
        </el-tab-pane>

        <!-- Tab 4: 评估人画像 -->
        <el-tab-pane label="评估人画像" name="reviewers">
          <el-card class="card">
            <div class="section-title">
              评估人打分分析
              <span class="sub-hint">参考区间：75-80 中位，标准差 > 5 健康、< 3 存在"撞墙"风险</span>
            </div>
            <el-table :data="data.reviewerProfiles" stripe>
              <el-table-column prop="reviewerName" label="评估人" width="120" />
              <el-table-column prop="department" label="部门" width="120" />
              <el-table-column prop="reviewCount" label="评估数" width="100" align="center" />
              <el-table-column prop="avgScore" label="平均分" width="100" align="center">
                <template #default="{ row }"><strong>{{ row.avgScore }}</strong></template>
              </el-table-column>
              <el-table-column prop="stdev" label="标准差" width="100" align="center" />
              <el-table-column label="打分倾向" width="120" align="center">
                <template #default="{ row }">
                  <el-tag
                    :type="row.tendency === 'loose' ? 'warning' : row.tendency === 'strict' ? 'danger' : 'success'"
                    size="small"
                  >
                    {{ row.tendency === 'loose' ? '偏宽' : row.tendency === 'strict' ? '偏严' : '中庸' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="分数分布" min-width="280">
                <template #default="{ row }">
                  <div class="bucket-bar">
                    <div v-for="b in row.scoreBuckets" :key="b.range" class="bucket-seg"
                      :style="{ flex: b.count || 0.01 }" :title="`${b.range}: ${b.count} 人`">
                      <span v-if="b.count > 0" class="bucket-count">{{ b.count }}</span>
                      <span class="bucket-label">{{ b.range }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- Tab 5: 异常检测 -->
        <el-tab-pane label="异常与洞察" name="anomaly">
          <el-card class="card">
            <div class="section-title">异常检测（自动识别 {{ data.anomalies?.length || 0 }} 项）</div>
            <el-table :data="data.anomalies" stripe>
              <el-table-column prop="detectedAt" label="检测时间" width="170" />
              <el-table-column label="严重度" width="100" align="center">
                <template #default="{ row }">
                  <el-tag
                    :type="row.severity === 'high' ? 'danger' : row.severity === 'medium' ? 'warning' : 'info'"
                    size="small"
                  >
                    {{ row.severity === 'high' ? '高' : row.severity === 'medium' ? '中' : '低' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="类型" width="140">
                <template #default="{ row }">
                  <span>{{ anomalyTypeLabel(row.type) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="target" label="对象" width="200" />
              <el-table-column prop="description" label="描述" min-width="280" show-overflow-tooltip />
            </el-table>
            <el-empty v-if="!data.anomalies || data.anomalies.length === 0" description="暂无异常" />
          </el-card>

          <div class="emp-grid">
            <el-card class="card">
              <div class="section-title">🌟 高潜员工清单（{{ data.hipoList?.length || 0 }} 人）</div>
              <el-table :data="data.hipoList" size="small" stripe>
                <el-table-column prop="employeeName" label="员工" width="110" />
                <el-table-column prop="department" label="部门" width="120" />
                <el-table-column prop="avgScore" label="平均分" width="90" align="center">
                  <template #default="{ row }">
                    <strong style="color: #67c23a">{{ row.avgScore }}</strong>
                  </template>
                </el-table-column>
                <el-table-column prop="reason" label="信号" />
              </el-table>
              <el-empty v-if="!data.hipoList || data.hipoList.length === 0" description="暂无" :image-size="50" />
            </el-card>

            <el-card class="card">
              <div class="section-title" style="color: #f56c6c">⚠ 需关注员工清单（{{ data.attentionList?.length || 0 }} 人）</div>
              <el-table :data="data.attentionList" size="small" stripe>
                <el-table-column prop="employeeName" label="员工" width="110" />
                <el-table-column prop="department" label="部门" width="120" />
                <el-table-column prop="avgScore" label="平均分" width="90" align="center">
                  <template #default="{ row }"><strong>{{ row.avgScore }}</strong></template>
                </el-table-column>
                <el-table-column prop="reason" label="信号" />
              </el-table>
              <el-empty v-if="!data.attentionList || data.attentionList.length === 0" description="暂无" :image-size="50" />
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getAnalyticsDashboard, exportAnalytics } from '@/api/performanceAnalytics'
import type { AnalyticsDashboard } from '@/types/performanceAnalytics'

defineOptions({ name: 'PerformanceAnalytics' })

const grades = ['S', 'A', 'B', 'C', 'D'] as const
const activeTab = ref('distribution')

const params = reactive({
  cycleId: null as number | null,
  departmentName: ''
})

const data = ref<Partial<AnalyticsDashboard>>({})

const loadData = async () => {
  const res = await getAnalyticsDashboard(params)
  data.value = res.data || {}
}

const handleReset = () => {
  params.cycleId = null
  params.departmentName = ''
  loadData()
}

const handleExport = async () => {
  const res = await exportAnalytics({ ...params, format: 'excel' })
  ElMessage.success(`已生成：${res.data.filename}`)
}

const progressColor = (s: number): string => {
  if (s >= 90) return '#67c23a'
  if (s >= 80) return '#409eff'
  if (s >= 70) return '#909399'
  if (s >= 60) return '#e6a23c'
  return '#f56c6c'
}

const anomalyTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    score_wall: '📊 打分撞墙',
    grade_skew: '⚖ 分布偏斜',
    score_volatile: '📈 分数剧烈波动',
    low_diversity: '🎯 维度区分度低'
  }
  return map[type] || type
}

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.analytics-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card,
.card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-card {
  flex-shrink: 0;

  :deep(.el-card__body) {
    padding: 12px 20px;
  }
}

.content-scroll {
  flex: 1;
  overflow: hidden;

  :deep(.el-scrollbar__view) {
    padding-bottom: 20px;
  }
}

.analytics-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 4px 16px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}

.card {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;

  .sub-hint {
    font-weight: normal;
    font-size: 12px;
    color: #909399;
    margin-left: 8px;
  }
}

/* 分布条 */
.dist-bar-wrap {
  .dist-bar {
    display: flex;
    height: 36px;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 12px;

    .dist-seg {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 600;
      font-size: 13px;
      min-width: 0;
    }
  }

  .dist-target {
    font-size: 12px;
    color: #909399;
    text-align: center;
  }
}

.mini-dist-bar {
  display: flex;
  height: 22px;
  border-radius: 4px;
  overflow: hidden;

  .dist-seg {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    min-width: 0;
  }
}

/* 过程完成率 */
.process-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;

  .process-item {
    text-align: center;

    .process-label {
      font-size: 13px;
      color: #606266;
      margin-bottom: 10px;
    }
  }
}

/* 周期趋势 */
.trend-bars {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  height: 280px;
  padding: 16px;
  background: #fafbfc;
  border-radius: 8px;

  .trend-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .trend-score-wrap {
      height: 180px;
      display: flex;
      align-items: flex-end;
    }

    .trend-bar {
      width: 40px;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 4px;

      .trend-score {
        color: #fff;
        font-size: 12px;
        font-weight: 600;
      }
    }

    .trend-meta {
      text-align: center;

      .trend-name {
        font-size: 11px;
        color: #909399;
        max-width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .trend-count {
        font-size: 11px;
        color: #606266;
        margin: 2px 0;
      }

      .trend-rates {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    }
  }
}

/* 分数桶 */
.bucket-bar {
  display: flex;
  height: 28px;
  gap: 2px;

  .bucket-seg {
    background: #f0f2f5;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    position: relative;

    &:nth-child(1) { background: #fef0f0; }
    &:nth-child(2) { background: #fdf6ec; }
    &:nth-child(3) { background: #f4f4f5; }
    &:nth-child(4) { background: #ecf5ff; }
    &:nth-child(5) { background: #f0f9eb; }

    .bucket-count {
      font-size: 12px;
      font-weight: 600;
      color: #303133;
    }

    .bucket-label {
      font-size: 9px;
      color: #909399;
    }
  }
}

/* 员工清单 */
.emp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* 等级配色 */
.grade-S { background: #67c23a; }
.grade-A { background: #409eff; }
.grade-B { background: #909399; }
.grade-C { background: #e6a23c; }
.grade-D { background: #f56c6c; }
</style>
