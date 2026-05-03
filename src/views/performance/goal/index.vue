<template>
  <div class="perf-goal-container">
    <ModuleTabBar :tabs="goalGroupTabs" />
    <!-- 顶部 KPI -->
    <div class="kpi-grid">
      <el-card class="kpi-card">
        <div class="kpi-label">总目标数</div>
        <div class="kpi-value">{{ total }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">OKR</div>
        <div class="kpi-value" style="color: #67c23a">{{ okrCount }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">KPI</div>
        <div class="kpi-value" style="color: #e6a23c">{{ kpiCount }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">待审批</div>
        <div class="kpi-value" style="color: #f56c6c">{{ pendingApprovalCount }}</div>
      </el-card>
      <el-card class="kpi-card">
        <div class="kpi-label">平均进度</div>
        <div class="kpi-value">{{ avgProgress }}%</div>
      </el-card>
    </div>

    <el-tabs v-model="activeTab" class="goal-tabs">
      <el-tab-pane label="目标列表" name="list">
        <el-card class="filter-card">
          <el-form :model="queryParams">
            <div class="filter-form-content">
              <el-form-item label="员工">
                <el-input v-model="queryParams.employeeName" placeholder="姓名" style="width: 160px" clearable />
              </el-form-item>
              <el-form-item label="部门">
                <el-input v-model="queryParams.departmentName" placeholder="部门" style="width: 140px" clearable />
              </el-form-item>
              <el-form-item label="目标模式">
                <el-select v-model="queryParams.goalType" placeholder="全部" style="width: 130px" clearable>
                  <el-option label="OKR" :value="1" />
                  <el-option label="KPI" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="层级">
                <el-select v-model="queryParams.goalCategory" placeholder="全部" style="width: 140px" clearable>
                  <el-option label="公司目标" value="company" />
                  <el-option label="部门目标" value="department" />
                  <el-option label="个人目标" value="personal" />
                </el-select>
              </el-form-item>
              <el-form-item label="审批状态">
                <el-select v-model="queryParams.approvalStatus" placeholder="全部" style="width: 130px" clearable>
                  <el-option v-for="(s, k) in GOAL_APPROVAL_STATUS_MAP" :key="k" :label="s.label" :value="Number(k)" />
                </el-select>
              </el-form-item>
              <el-form-item label=" ">
                <div class="filter-buttons">
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                  <el-button @click="handleReset">重置</el-button>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-card>

        <el-card class="data-card">
          <div class="table-header">
            <div class="header-buttons">
              <el-button type="primary" @click="handleAdd">
                <el-icon><Plus /></el-icon>
                新增目标
              </el-button>
              <el-button @click="templateDialogVisible = true">
                <el-icon><Document /></el-icon>
                从模板创建
              </el-button>
            </div>
          </div>

          <div class="table-container">
            <el-table :data="tableData" height="100%" style="width: 100%">
              <el-table-column type="expand">
                <template #default="{ row }">
                  <div class="expand-box">
                    <div v-if="row.goalType === 1 && row.keyResults && row.keyResults.length" class="kr-list">
                      <div class="expand-title">关键成果（KR）</div>
                      <el-table :data="row.keyResults" size="small" stripe>
                        <el-table-column prop="description" label="KR 描述" min-width="260" />
                        <el-table-column prop="targetValue" label="目标值" width="140" />
                        <el-table-column prop="currentValue" label="当前值" width="140" />
                        <el-table-column prop="weight" label="权重" width="80" align="center">
                          <template #default="{ row: kr }">{{ kr.weight }}%</template>
                        </el-table-column>
                        <el-table-column label="进度" width="180">
                          <template #default="{ row: kr }">
                            <el-progress :percentage="kr.progress" :stroke-width="8" />
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <div v-if="row.approveComment" class="expand-approval">
                      <div class="expand-title">审批意见</div>
                      <el-alert :title="row.approveComment" :closable="false" type="info" show-icon />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="goalNo" label="编号" width="150" />
              <el-table-column prop="employeeName" label="员工" width="90" />
              <el-table-column prop="departmentName" label="部门" width="110" />
              <el-table-column label="模式" width="80" align="center">
                <template #default="{ row }">
                  <el-tag :type="GOAL_MODE_MAP[row.goalType].type" size="small">
                    {{ GOAL_MODE_MAP[row.goalType].label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="层级" width="110" align="center">
                <template #default="{ row }">
                  <span v-if="row.goalCategory">
                    {{ GOAL_CATEGORY_MAP[row.goalCategory].icon }}
                    {{ GOAL_CATEGORY_MAP[row.goalCategory].label }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="goalTitle" label="目标标题" min-width="180" show-overflow-tooltip />
              <el-table-column label="父目标" min-width="140">
                <template #default="{ row }">
                  <el-tag v-if="row.parentGoalTitle" size="small" effect="plain">
                    <el-icon><TopRight /></el-icon> {{ row.parentGoalTitle }}
                  </el-tag>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column label="权重" width="80" align="right">
                <template #default="{ row }">{{ row.weight }}%</template>
              </el-table-column>
              <el-table-column label="进度" width="180">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.progress"
                    :stroke-width="10"
                    :color="row.frozen === 1 ? '#909399' : undefined"
                  />
                </template>
              </el-table-column>
              <el-table-column label="审批" width="140" align="center">
                <template #default="{ row }">
                  <el-tag :type="GOAL_APPROVAL_STATUS_MAP[row.approvalStatus].type" size="small">
                    {{ GOAL_APPROVAL_STATUS_MAP[row.approvalStatus].label }}
                  </el-tag>
                  <el-tag
                    v-if="row.pendingRevision"
                    type="warning"
                    size="small"
                    effect="plain"
                    style="margin-left: 4px"
                  >修订中</el-tag>
                  <el-tag
                    v-else-if="(row.revisionCount || 0) > 0"
                    type="info"
                    size="small"
                    effect="plain"
                    style="margin-left: 4px"
                  >已修订</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="冻结" width="80" align="center">
                <template #default="{ row }">
                  <el-icon v-if="row.frozen === 1" color="#909399"><Lock /></el-icon>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="380" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="handleViewLogs(row)">进度日志</el-button>
                  <el-button
                    link
                    type="success"
                    :disabled="row.frozen === 1 || row.approvalStatus !== 1"
                    @click="handleUpdateProgress(row)"
                  >更新进度</el-button>
                  <el-button
                    v-if="row.approvalStatus === 0"
                    link
                    type="warning"
                    @click="handleApprove(row)"
                  >审批</el-button>
                  <!-- 修订审批（已批准 + 有 pendingRevision）-->
                  <el-button
                    v-if="row.approvalStatus === 1 && row.pendingRevision"
                    link
                    type="warning"
                    @click="handleApproveRevision(row)"
                  >审批修订</el-button>
                  <el-button
                    v-if="row.approvalStatus === 2"
                    link
                    @click="handleResubmit(row)"
                  >重新提交</el-button>

                  <!-- 已批准期编辑 = 申请修订（业界共识：飞书/钉钉/Lattice）-->
                  <template v-if="row.approvalStatus === 1 && row.frozen !== 1">
                    <el-tooltip
                      v-if="(row.revisionCount || 0) >= 1"
                      content="本周期已用完修订机会（最多 1 次）"
                      placement="top"
                    >
                      <span>
                        <el-button link disabled>申请修订</el-button>
                      </span>
                    </el-tooltip>
                    <el-tooltip
                      v-else-if="row.pendingRevision"
                      content="已有进行中的修订申请，请等待审批"
                      placement="top"
                    >
                      <span>
                        <el-button link disabled>修订中</el-button>
                      </span>
                    </el-tooltip>
                    <el-button
                      v-else
                      link
                      type="primary"
                      @click="handleApplyRevision(row)"
                    >申请修订</el-button>
                  </template>

                  <!-- 未批准时的编辑（保留原行为）-->
                  <el-button
                    v-if="row.approvalStatus !== 1"
                    link
                    @click="handleEdit(row)"
                    :disabled="row.frozen === 1"
                  >编辑</el-button>

                  <!-- 修订历史（有过修订或正在修订才显示）-->
                  <el-button
                    v-if="(row.revisionCount || 0) > 0 || row.pendingRevision"
                    link
                    type="info"
                    @click="handleViewRevisions(row)"
                  >修订历史</el-button>

                  <el-button link type="danger" @click="handleDelete(row)" :disabled="row.frozen === 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchData"
            @current-change="fetchData"
          />
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="进度日志" name="logs">
        <el-card class="data-card">
          <el-table :data="logList" stripe>
            <el-table-column prop="updateTime" label="更新时间" width="170" />
            <el-table-column label="目标" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">{{ goalTitleById(row.goalId) }}</template>
            </el-table-column>
            <el-table-column label="进度变化" width="220">
              <template #default="{ row }">
                <span>{{ row.beforeProgress }}%</span>
                <el-icon style="margin: 0 6px" color="#909399"><Right /></el-icon>
                <span style="color: #67c23a; font-weight: 600">{{ row.afterProgress }}%</span>
                <span class="diff-text">(+{{ row.afterProgress - row.beforeProgress }}%)</span>
              </template>
            </el-table-column>
            <el-table-column prop="highlights" label="本阶段亮点" min-width="220" show-overflow-tooltip />
            <el-table-column prop="issues" label="遇到的问题" min-width="200" show-overflow-tooltip />
            <el-table-column prop="nextPlan" label="下阶段计划" min-width="200" show-overflow-tooltip />
            <el-table-column prop="updatedBy" label="更新人" width="100" />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="editForm.id ? '编辑目标' : '新增目标'" width="780px" top="5vh">
      <el-scrollbar max-height="72vh">
      <el-form ref="editFormRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工" prop="employeeName">
              <el-input v-model="editForm.employeeName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentName">
              <el-input v-model="editForm.departmentName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位族">
              <el-select v-model="editForm.jobFamily" @change="autoMatchMode" style="width: 100%">
                <el-option label="技术研发" value="技术研发" />
                <el-option label="产品设计" value="产品设计" />
                <el-option label="运营市场" value="运营市场" />
                <el-option label="职能支持" value="职能支持" />
                <el-option label="管理岗位" value="管理岗位" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标模式" prop="goalType">
              <el-select v-model="editForm.goalType" style="width: 100%" @change="onGoalModeChange">
                <el-option label="OKR" :value="1" />
                <el-option label="KPI" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标层级" prop="goalCategory">
              <el-select v-model="editForm.goalCategory" style="width: 100%">
                <el-option label="公司目标" value="company" />
                <el-option label="部门目标" value="department" />
                <el-option label="个人目标" value="personal" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重">
              <el-input v-model.number="editForm.weight"><template #append>%</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="父目标" v-if="editForm.goalType === 1">
          <el-select v-model="editForm.parentGoalId" clearable placeholder="可选，对齐到上级目标" style="width: 100%">
            <el-option
              v-for="p in parentGoalOptions"
              :key="p.id"
              :label="`[${p.employeeName}] ${p.goalTitle}`"
              :value="p.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="目标标题" prop="goalTitle">
          <el-input v-model="editForm.goalTitle" />
        </el-form-item>
        <el-form-item label="目标描述">
          <el-input v-model="editForm.goalDescription" type="textarea" :rows="2" />
        </el-form-item>

        <el-divider v-if="editForm.goalType === 1" content-position="left">
          关键成果（KR，建议 3~5 个，权重和 = 100）
        </el-divider>
        <div v-if="editForm.goalType === 1" class="kr-list">
          <!-- KR 卡片（v4：完全自由表达，无引导横幅，进度纯手动） -->
          <div v-for="(kr, idx) in editForm.keyResults" :key="idx" class="kr-card">
            <div class="kr-card-head">
              <span class="kr-index">KR{{ idx + 1 }}</span>
              <el-tag size="small" effect="plain" :type="getKRTypeTagType(kr.type)">
                {{ KR_TYPE_MAP[kr.type || 'milestone'].icon }}
                {{ KR_TYPE_MAP[kr.type || 'milestone'].label }}
              </el-tag>
              <div class="kr-card-spacer"></div>
              <span class="kr-progress-inline">
                进度 <strong>{{ computedKRProgress(kr) }}%</strong>
              </span>
              <el-button link type="danger" @click="removeKR(idx)">删除</el-button>
            </div>

            <el-form-item label="关键结果" :label-width="86" class="kr-form-item">
              <el-input
                v-model="kr.description"
                type="textarea"
                :rows="2"
                placeholder="描述这个 KR，如：测试效率降低 50% / 完成 V2.0 上线 / 通过 PMP 认证"
              />
            </el-form-item>

            <el-form-item label="度量方式" :label-width="86" class="kr-form-item">
              <el-radio-group v-model="kr.type" @change="onKRTypeChange(kr)" class="kr-type-group">
                <el-radio
                  v-for="(meta, key) in KR_TYPE_MAP"
                  :key="key"
                  :value="key"
                  class="kr-type-radio"
                >
                  <span class="kr-type-label">{{ meta.icon }} {{ meta.label }}</span>
                  <span class="kr-type-hint">{{ meta.hint }}</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 数值进度：进度滑块 + 权重 -->
            <el-row v-if="kr.type === 'numeric'" :gutter="12">
              <el-col :span="16">
                <el-form-item label="进度" :label-width="86" class="kr-form-item">
                  <el-slider
                    v-model="kr.progress"
                    :min="0"
                    :max="100"
                    :step="5"
                    show-input
                    :show-input-controls="false"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="权重" :label-width="86" class="kr-form-item">
                  <el-input v-model.number="kr.weight">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 里程碑：当前状态 + 进度滑块 + 权重 -->
            <el-row v-else-if="kr.type === 'milestone'" :gutter="12">
              <el-col :span="24">
                <el-form-item label="当前状态" :label-width="86" class="kr-form-item">
                  <el-input v-model="kr.currentValue" placeholder="选填，如：进行中 / 测试阶段 / 已完成" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="进度" :label-width="86" class="kr-form-item">
                  <el-slider
                    v-model="kr.progress"
                    :min="0"
                    :max="100"
                    :step="5"
                    show-input
                    :show-input-controls="false"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="权重" :label-width="86" class="kr-form-item">
                  <el-input v-model.number="kr.weight">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 达成型：switch 开关 + 权重 -->
            <el-row v-else-if="kr.type === 'achieve'" :gutter="12">
              <el-col :span="14">
                <el-form-item label="是否达成" :label-width="86" class="kr-form-item">
                  <el-switch
                    :model-value="kr.currentValue === '已达成'"
                    @update:model-value="(v) => (kr.currentValue = v ? '已达成' : '未达成')"
                    active-text="已达成"
                    inactive-text="未达成"
                    inline-prompt
                    style="--el-switch-on-color: #67c23a"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="权重" :label-width="86" class="kr-form-item">
                  <el-input v-model.number="kr.weight">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="kr-actions">
            <el-button type="primary" plain size="small" @click="addKR">+ 添加 KR</el-button>
            <el-button
              type="primary"
              plain
              size="small"
              :disabled="!canTriggerAICheck"
              @click="aiOKRCheckVisible = true"
            >
              <el-icon><ArtAiIcon /></el-icon>
              AI 质量检查
            </el-button>
            <span v-if="!canTriggerAICheck" class="ai-trigger-hint">
              至少 1 条 KR 标题不少于 10 字才能调用 AI
            </span>
            <div class="kr-weight-hint" :class="krWeightOk ? 'ok' : 'err'">
              KR 权重和：{{ krWeightSum }}{{ krWeightOk ? '' : '（应为 100）' }}
            </div>
          </div>
        </div>

        <div v-else>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="目标值">
                <el-input v-model="editForm.targetValue" placeholder="如 销售额 800 万" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前值">
                <el-input v-model="editForm.currentValue" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前进度">
                <el-input v-model.number="editForm.progress"><template #append>%</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存（提交审批）</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog v-model="approveDialogVisible" title="审批目标" width="520px">
      <el-descriptions v-if="approveTargetGoal" :column="1" border>
        <el-descriptions-item label="员工">{{ approveTargetGoal.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="目标">{{ approveTargetGoal.goalTitle }}</el-descriptions-item>
        <el-descriptions-item label="权重">{{ approveTargetGoal.weight }}%</el-descriptions-item>
      </el-descriptions>
      <el-form label-width="90px" style="margin-top: 16px">
        <el-form-item label="审批意见">
          <el-input v-model="approveComment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="submitApprove(false)">驳回</el-button>
        <el-button type="primary" @click="submitApprove(true)">批准</el-button>
      </template>
    </el-dialog>

    <!-- 更新进度弹窗 -->
    <el-dialog v-model="progressDialogVisible" title="更新目标进度" width="560px">
      <el-form label-width="100px">
        <el-form-item label="当前进度">
          <el-slider v-model="progressForm.afterProgress" :min="0" :max="100" show-input :show-input-controls="false" />
        </el-form-item>
        <el-form-item v-if="progressTarget && progressTarget.goalType === 2" label="当前值">
          <el-input v-model="progressForm.afterValue" placeholder="如 销售额 320 万" />
        </el-form-item>
        <el-form-item label="本阶段亮点">
          <el-input v-model="progressForm.highlights" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="遇到的问题">
          <el-input v-model="progressForm.issues" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="下阶段计划">
          <el-input v-model="progressForm.nextPlan" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="progressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProgress">提交更新</el-button>
      </template>
    </el-dialog>

    <!-- 进度日志弹窗 -->
    <el-dialog v-model="logsDialogVisible" title="目标进度日志" width="700px">
      <el-table :data="currentGoalLogs" size="small">
        <el-table-column prop="updateTime" label="时间" width="160" />
        <el-table-column label="进度" width="140" align="center">
          <template #default="{ row }">
            {{ row.beforeProgress }}% → <strong style="color: #67c23a">{{ row.afterProgress }}%</strong>
          </template>
        </el-table-column>
        <el-table-column prop="highlights" label="亮点" min-width="160" show-overflow-tooltip />
        <el-table-column prop="issues" label="问题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="updatedBy" label="更新人" width="100" />
      </el-table>
    </el-dialog>

    <!-- 从模板创建 -->
    <el-dialog v-model="templateDialogVisible" title="从目标模板创建" width="720px">
      <el-table :data="templateList" highlight-current-row @current-change="(r: any) => (selectedTemplateId = r?.id)">
        <el-table-column prop="templateName" label="模板名称" min-width="200" />
        <el-table-column prop="jobFamily" label="岗位族" width="120" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="GOAL_MODE_MAP[row.goalType].type" size="small">{{ GOAL_MODE_MAP[row.goalType].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="goalTitle" label="目标示例" min-width="200" />
        <el-table-column prop="suggestedWeight" label="建议权重" width="100" align="right">
          <template #default="{ row }">{{ row.suggestedWeight || '—' }}%</template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="templateDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!selectedTemplateId" @click="handleApplyTemplate">基于此模板新建</el-button>
      </template>
    </el-dialog>

    <!-- AI OKR 质量检查（Drawer 抽屉：与编辑弹窗并存，避免双层模态） -->
    <OKRCheckDrawer
      v-model="aiOKRCheckVisible"
      :objective-input="buildOKRCheckInput()"
      :target-employee="editForm.employeeName || ''"
      @apply-objective="handleApplyObjective"
      @apply-kr="handleApplyKR"
      @apply-all="handleApplyAll"
    />

    <!-- 申请修订 Dialog（已批准期改 OKR 必走流程）-->
    <el-dialog
      v-model="revisionApplyVisible"
      title="申请目标修订"
      width="900px"
      top="5vh"
      :close-on-click-modal="false"
    >
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom: 16px"
      >
        <template #title>
          已批准的 OKR 修改需走"目标修订"审批流程（业界对标 飞书 OKR / 钉钉 OKR / Lattice）。
          <strong>本周期最多修订 1 次</strong>，审批通过后修改生效。
        </template>
      </el-alert>

      <div class="revision-compare">
        <!-- 左：修改前 -->
        <div class="revision-side">
          <div class="revision-side-title">修改前（当前）</div>
          <el-form label-width="90px" label-position="top">
            <el-form-item label="目标标题">
              <el-input :model-value="revisionBefore.goalTitle" readonly />
            </el-form-item>
            <el-form-item label="目标描述">
              <el-input
                :model-value="revisionBefore.goalDescription"
                type="textarea"
                :rows="2"
                readonly
              />
            </el-form-item>
            <el-form-item label="权重">
              <el-input :model-value="String(revisionBefore.weight)" readonly>
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="revisionBefore.keyResults?.length" label="关键结果">
              <div class="kr-readonly">
                <div
                  v-for="(kr, idx) in revisionBefore.keyResults"
                  :key="idx"
                  class="kr-readonly-item"
                >
                  <div class="kr-no">KR{{ idx + 1 }}（权重 {{ kr.weight }}%）</div>
                  <div>{{ kr.description }}</div>
                  <div class="kr-meta">目标值：{{ kr.targetValue }}</div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 右：修改后 -->
        <div class="revision-side">
          <div class="revision-side-title revision-side-after">修改后（申请变更）</div>
          <el-form label-width="90px" label-position="top">
            <el-form-item label="目标标题" required>
              <el-input v-model="revisionAfter.goalTitle" />
            </el-form-item>
            <el-form-item label="目标描述">
              <el-input v-model="revisionAfter.goalDescription" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item label="权重">
              <el-input v-model="revisionWeightStr" placeholder="0~100">
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="revisionAfter.keyResults?.length" label="关键结果">
              <div class="kr-edit-list">
                <div
                  v-for="(kr, idx) in revisionAfter.keyResults"
                  :key="idx"
                  class="kr-edit-item"
                >
                  <div class="kr-no">KR{{ idx + 1 }}（权重 {{ kr.weight }}%）</div>
                  <el-input v-model="kr.description" type="textarea" :rows="2" placeholder="关键结果描述" />
                  <el-input v-model="kr.targetValue" placeholder="目标值" style="margin-top: 4px" />
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <el-divider />

      <el-form label-width="90px">
        <el-form-item label="修订原因" required>
          <el-select v-model="revisionReasonCode" placeholder="请选择" style="width: 240px">
            <el-option label="市场变化（外部因素）" value="market_change" />
            <el-option label="战略调整（公司方向）" value="strategy_adjust" />
            <el-option label="资源不足（人力/预算/技术）" value="resource_shortage" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="revisionReasonCode === 'other' ? '原因说明' : '补充说明'"
          :required="revisionReasonCode === 'other'"
        >
          <el-input
            v-model="revisionReasonDetail"
            type="textarea"
            :rows="3"
            :placeholder="revisionReasonCode === 'other' ? '必填：请说明具体原因' : '选填：补充说明（建议不少于 30 字）'"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="revisionApplyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRevisionApply">提交修订申请</el-button>
      </template>
    </el-dialog>

    <!-- 修订历史 Dialog -->
    <el-dialog v-model="revisionHistoryVisible" title="修订历史" width="780px" top="5vh">
      <div v-if="revisionHistoryList.length === 0" class="revision-empty">
        暂无修订历史
      </div>
      <el-timeline v-else>
        <el-timeline-item
          v-for="rev in revisionHistoryList"
          :key="rev.id"
          :type="REVISION_STATUS_TYPE[rev.status] === 'danger' ? 'danger' : REVISION_STATUS_TYPE[rev.status] === 'warning' ? 'warning' : 'success'"
          :timestamp="rev.applyTime"
          placement="top"
        >
          <div class="revision-card">
            <div class="revision-card-header">
              <el-tag :type="REVISION_STATUS_TYPE[rev.status]" size="small">
                {{ REVISION_STATUS_LABEL[rev.status] }}
              </el-tag>
              <span class="revision-card-applicant">申请人：{{ rev.applicantName }}</span>
            </div>

            <div class="revision-card-section">
              <span class="revision-section-label">修订原因：</span>
              <el-tag size="small" type="info" effect="plain">
                {{ REVISION_REASON_LABEL[rev.reasonCode] }}
              </el-tag>
              <span v-if="rev.reasonDetail" class="revision-reason-detail">
                {{ rev.reasonDetail }}
              </span>
            </div>

            <div class="revision-card-diff">
              <div class="diff-col">
                <div class="diff-col-title">修改前</div>
                <div class="diff-field"><strong>标题：</strong>{{ rev.before.goalTitle }}</div>
                <div class="diff-field"><strong>描述：</strong>{{ rev.before.goalDescription || '—' }}</div>
                <div class="diff-field"><strong>权重：</strong>{{ rev.before.weight }}%</div>
              </div>
              <div class="diff-arrow">→</div>
              <div class="diff-col diff-col-after">
                <div class="diff-col-title">修改后</div>
                <div class="diff-field"><strong>标题：</strong>{{ rev.after.goalTitle }}</div>
                <div class="diff-field"><strong>描述：</strong>{{ rev.after.goalDescription || '—' }}</div>
                <div class="diff-field"><strong>权重：</strong>{{ rev.after.weight }}%</div>
              </div>
            </div>

            <div v-if="rev.approverName" class="revision-card-approve">
              <span class="revision-section-label">审批：</span>
              {{ rev.approverName }} · {{ rev.approveTime || '—' }}
              <span v-if="rev.approveComment" class="revision-comment">
                "{{ rev.approveComment }}"
              </span>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <el-button @click="revisionHistoryVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 审批修订 Dialog -->
    <el-dialog v-model="revisionApproveVisible" title="审批目标修订" width="780px" top="5vh">
      <div v-if="revisionApproving" class="revision-approve-body">
        <el-descriptions :column="2" border size="small" style="margin-bottom: 12px">
          <el-descriptions-item label="申请人">{{ revisionApproving.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ revisionApproving.applyTime }}</el-descriptions-item>
          <el-descriptions-item label="修订原因">
            <el-tag size="small" type="info" effect="plain">
              {{ REVISION_REASON_LABEL[revisionApproving.reasonCode] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="原因说明">
            {{ revisionApproving.reasonDetail || '—' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="revision-card-diff">
          <div class="diff-col">
            <div class="diff-col-title">修改前</div>
            <div class="diff-field"><strong>标题：</strong>{{ revisionApproving.before.goalTitle }}</div>
            <div class="diff-field"><strong>描述：</strong>{{ revisionApproving.before.goalDescription || '—' }}</div>
            <div class="diff-field"><strong>权重：</strong>{{ revisionApproving.before.weight }}%</div>
            <div v-if="revisionApproving.before.keyResults?.length" class="diff-krs">
              <div
                v-for="(kr, idx) in revisionApproving.before.keyResults"
                :key="idx"
                class="diff-kr"
              >
                <strong>KR{{ idx + 1 }}：</strong>{{ kr.description }}（{{ kr.weight }}%，目标 {{ kr.targetValue }}）
              </div>
            </div>
          </div>
          <div class="diff-arrow">→</div>
          <div class="diff-col diff-col-after">
            <div class="diff-col-title">修改后</div>
            <div class="diff-field"><strong>标题：</strong>{{ revisionApproving.after.goalTitle }}</div>
            <div class="diff-field"><strong>描述：</strong>{{ revisionApproving.after.goalDescription || '—' }}</div>
            <div class="diff-field"><strong>权重：</strong>{{ revisionApproving.after.weight }}%</div>
            <div v-if="revisionApproving.after.keyResults?.length" class="diff-krs">
              <div
                v-for="(kr, idx) in revisionApproving.after.keyResults"
                :key="idx"
                class="diff-kr"
              >
                <strong>KR{{ idx + 1 }}：</strong>{{ kr.description }}（{{ kr.weight }}%，目标 {{ kr.targetValue }}）
              </div>
            </div>
          </div>
        </div>

        <el-form label-width="90px" style="margin-top: 16px">
          <el-form-item label="审批意见" :required="true">
            <el-input
              v-model="revisionApproveComment"
              type="textarea"
              :rows="3"
              placeholder="通过时建议简要说明，驳回时必填"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="revisionApproveVisible = false">取消</el-button>
        <el-button type="danger" @click="submitRevisionReject">驳回</el-button>
        <el-button type="primary" @click="submitRevisionApprove">通过 · 修订生效</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Document, TopRight, Lock, Right } from '@element-plus/icons-vue'
import OKRCheckDrawer from './OKRCheckDrawer.vue'
import ModuleTabBar from '@/components/business/ModuleTabBar.vue'

const goalGroupTabs = [
  { label: '目标管理', path: '/perf/goal' },
  { label: '目标对齐视图', path: '/perf/goal-alignment' }
]
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import {
  getList,
  addItem,
  updateItem,
  deleteItem,
  approveGoal,
  resubmitGoal,
  updateGoalProgress,
  getGoalTemplates,
  getGoalProgressLogs,
  createGoalFromTemplate
} from '@/api/performanceGoal'
import type {
  PerformanceGoal,
  GoalProgressLog,
  GoalTemplate,
  KeyResult,
  KRType
} from '@/types/performanceGoal'
import {
  GOAL_MODE_MAP,
  GOAL_CATEGORY_MAP,
  GOAL_APPROVAL_STATUS_MAP,
  KR_TYPE_MAP,
  matchGoalMode,
  calcKRProgress
} from '@/types/performanceGoal'

defineOptions({ name: 'PerformanceGoal' })

const activeTab = ref<'list' | 'logs'>('list')

const queryParams = reactive({
  employeeName: '',
  departmentName: '',
  goalType: null as 1 | 2 | null,
  goalCategory: '' as 'company' | 'department' | 'personal' | '',
  approvalStatus: null as number | null,
  page: 1,
  pageSize: 10
})
const tableData = ref<PerformanceGoal[]>([])
const total = ref(0)

const okrCount = computed(() => tableData.value.filter((g) => g.goalType === 1).length)
const kpiCount = computed(() => tableData.value.filter((g) => g.goalType === 2).length)
const pendingApprovalCount = computed(() =>
  tableData.value.filter((g) => g.approvalStatus === 0 || g.approvalStatus === 3).length
)
const avgProgress = computed(() =>
  tableData.value.length
    ? Math.round(tableData.value.reduce((s, g) => s + g.progress, 0) / tableData.value.length)
    : 0
)

const fetchData = async () => {
  const res = await getList(queryParams)
  tableData.value = res.data?.list || []
  total.value = res.data?.total || 0
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}
const handleReset = () => {
  queryParams.employeeName = ''
  queryParams.departmentName = ''
  queryParams.goalType = null
  queryParams.goalCategory = ''
  queryParams.approvalStatus = null
  queryParams.page = 1
  fetchData()
}

const handleDelete = async (row: PerformanceGoal) => {
  await ElMessageBox.confirm(`确定删除「${row.goalTitle}」？`, '确认', { type: 'warning' })
  await deleteItem(row.id)
  ElMessage.success('已删除')
  fetchData()
}

/* ========== 新增 / 编辑 ========== */
const editDialogVisible = ref(false)
// AI OKR 质量检查
const aiOKRCheckVisible = ref(false)
const buildOKRCheckInput = () => {
  if (!editForm.goalTitle) return ''
  const krLines = (editForm.keyResults || [])
    .map((kr: any, i: number) => `KR${i + 1}：${kr.description || '-'}（目标：${kr.targetValue || '-'}，权重：${kr.weight || 0}%）`)
    .join('\n')
  return `O：${editForm.goalTitle}\n${krLines}`
}
const editFormRef = ref<FormInstance>()
const editForm = reactive<Partial<PerformanceGoal>>({})
const formRules = {
  employeeName: [{ required: true, message: '请输入员工', trigger: 'blur' }],
  departmentName: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  goalType: [{ required: true, message: '请选择目标模式', trigger: 'change' }],
  goalCategory: [{ required: true, message: '请选择层级', trigger: 'change' }],
  goalTitle: [{ required: true, message: '请输入目标标题', trigger: 'blur' }]
}

const krWeightSum = computed(() =>
  (editForm.keyResults || []).reduce((s, k) => s + (Number(k.weight) || 0), 0)
)
const krWeightOk = computed(() => krWeightSum.value === 100)

/* ========== KR 字段辅助（v3.1 简化：3 类度量方式） ========== */

/** 计算单条 KR 的实时进度（numeric/achieve 自动算，milestone 手动）
 *  纯函数无副作用；保存时再统一同步到 kr.progress（见 handleSave）
 */
const computedKRProgress = (kr: KeyResult): number => calcKRProgress(kr)

/** KR 度量方式 Tag 颜色 */
const getKRTypeTagType = (
  type?: KRType
): 'success' | 'warning' | 'primary' | 'info' | 'danger' => {
  if (type === 'numeric') return 'primary'
  if (type === 'achieve') return 'success'
  return 'warning' // milestone
}

/** 切换度量方式时初始化关键字段（v4：进度统一手动滑，仅 achieve 需要特殊处理）*/
const onKRTypeChange = (kr: KeyResult) => {
  if (kr.type === 'achieve') {
    if (kr.currentValue !== '已达成' && kr.currentValue !== '未达成') {
      kr.currentValue = '未达成'
    }
    kr.progress = kr.currentValue === '已达成' ? 100 : 0
  }
  // numeric / milestone：保持现有值，员工自己滑进度
}

/**
 * 防偷懒门槛：要触发 AI 检查，必须满足
 * - O 标题非空
 * - 至少 1 条 KR 的关键结果文本 ≥ 10 字（避免"加 测"这种 2 字 KR 调用 AI）
 */
const canTriggerAICheck = computed(() => {
  if (!editForm.goalTitle || !editForm.keyResults?.length) return false
  return editForm.keyResults.some((k) => (k.description || '').trim().length >= 10)
})


const parentGoalOptions = computed(() =>
  tableData.value.filter(
    (g) =>
      g.approvalStatus === 1 &&
      g.goalType === 1 &&
      (g.goalCategory === 'company' || g.goalCategory === 'department') &&
      g.id !== editForm.id
  )
)

const resetEditForm = () => {
  Object.assign(editForm, {
    id: undefined,
    employeeId: 0,
    employeeName: '',
    departmentId: undefined,
    departmentName: '',
    jobFamily: '技术研发',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalType: 1,
    goalTypeName: 'OKR',
    goalCategory: 'personal',
    parentGoalId: undefined,
    parentGoalTitle: undefined,
    goalTitle: '',
    goalDescription: '',
    weight: 40,
    targetValue: '',
    currentValue: '',
    keyResults: [
      { description: '', type: 'numeric', targetValue: '', currentValue: '', weight: 50, progress: 0 },
      { description: '', type: 'numeric', targetValue: '', currentValue: '', weight: 50, progress: 0 }
    ],
    progress: 0,
    status: 0,
    approvalStatus: 0,
    frozen: 0
  })
}

const handleAdd = () => {
  resetEditForm()
  editDialogVisible.value = true
}

const handleEdit = (row: PerformanceGoal) => {
  resetEditForm()
  Object.assign(editForm, JSON.parse(JSON.stringify(row)))
  editDialogVisible.value = true
}

const autoMatchMode = () => {
  editForm.goalType = matchGoalMode(editForm.jobFamily)
  editForm.goalTypeName = editForm.goalType === 1 ? 'OKR' : 'KPI'
}

const buildBlankKR = (weight = 0): KeyResult => ({
  description: '',
  type: 'numeric',
  targetValue: '',
  currentValue: '',
  weight,
  progress: 0
})

const onGoalModeChange = () => {
  editForm.goalTypeName = editForm.goalType === 1 ? 'OKR' : 'KPI'
  if (editForm.goalType === 1 && (!editForm.keyResults || editForm.keyResults.length === 0)) {
    editForm.keyResults = [buildBlankKR(50), buildBlankKR(50)]
  }
}

const addKR = () => {
  editForm.keyResults!.push(buildBlankKR(0))
}
const removeKR = (idx: number) => {
  editForm.keyResults!.splice(idx, 1)
}

/* ========== AI 改写回填（OKRCheckDrawer emits） ========== */

const handleApplyObjective = (draft: { title: string; description: string }) => {
  editForm.goalTitle = draft.title
  if (draft.description) editForm.goalDescription = draft.description
}

const handleApplyKR = (idx: number, kr: KeyResult) => {
  if (!editForm.keyResults) editForm.keyResults = []
  // AI 改写版的索引若超出现有 KR 数量，则追加；否则覆盖原条目
  if (idx >= editForm.keyResults.length) {
    editForm.keyResults.push(kr)
  } else {
    editForm.keyResults[idx] = { ...editForm.keyResults[idx], ...kr }
  }
}

const handleApplyAll = (draft: {
  title: string
  description: string
  keyResults: KeyResult[]
}) => {
  editForm.goalTitle = draft.title
  if (draft.description) editForm.goalDescription = draft.description
  editForm.keyResults = draft.keyResults.map((kr) => ({ ...kr }))
}


const handleSave = async () => {
  await editFormRef.value?.validate()
  if (editForm.goalType === 1 && krWeightSum.value !== 100) {
    ElMessage.warning(`KR 权重和应为 100（当前 ${krWeightSum.value}）`)
    return
  }
  // 保存前同步 achieve 的进度（switch → 0/100）；numeric / milestone 已是手动滑的最新值
  if (editForm.goalType === 1) {
    editForm.keyResults?.forEach((k) => {
      if (k.type === 'achieve') {
        k.progress = k.currentValue === '已达成' ? 100 : 0
      }
    })
  }
  if (editForm.parentGoalId) {
    const p = tableData.value.find((g) => g.id === editForm.parentGoalId)
    if (p) editForm.parentGoalTitle = p.goalTitle
  }
  if (editForm.id) {
    await updateItem(editForm)
    ElMessage.success('已更新')
  } else {
    const now = new Date()
    editForm.goalNo = `GOAL${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Date.now()).slice(-4)}`
    await addItem(editForm)
    ElMessage.success('已新增，等待审批')
  }
  editDialogVisible.value = false
  fetchData()
}

/* ========== 审批 ========== */
const approveDialogVisible = ref(false)
const approveTargetGoal = ref<PerformanceGoal | null>(null)
const approveComment = ref('')

const handleApprove = (row: PerformanceGoal) => {
  approveTargetGoal.value = row
  approveComment.value = ''
  approveDialogVisible.value = true
}

const submitApprove = async (approved: boolean) => {
  if (!approveTargetGoal.value) return
  if (!approved && !approveComment.value) {
    ElMessage.warning('驳回必须填写意见')
    return
  }
  await approveGoal(approveTargetGoal.value.id, approved, approveComment.value)
  ElMessage.success(approved ? '已批准' : '已驳回')
  approveDialogVisible.value = false
  fetchData()
}

const handleResubmit = async (row: PerformanceGoal) => {
  try {
    await ElMessageBox.confirm(`确定重新提交「${row.goalTitle}」？请先编辑修改 KR 内容`, '重新提交', { type: 'info' })
    await resubmitGoal(row.id)
    ElMessage.success('已重新提交')
    fetchData()
  } catch {}
}

/* ========== 更新进度 ========== */
const progressDialogVisible = ref(false)
const progressTarget = ref<PerformanceGoal | null>(null)
const progressForm = reactive({
  afterProgress: 0,
  afterValue: '',
  highlights: '',
  issues: '',
  nextPlan: ''
})

const handleUpdateProgress = (row: PerformanceGoal) => {
  progressTarget.value = row
  progressForm.afterProgress = row.progress
  progressForm.afterValue = row.currentValue || ''
  progressForm.highlights = ''
  progressForm.issues = ''
  progressForm.nextPlan = ''
  progressDialogVisible.value = true
}

const submitProgress = async () => {
  if (!progressTarget.value) return
  await updateGoalProgress(progressTarget.value.id, {
    afterProgress: progressForm.afterProgress,
    afterValue: progressForm.afterValue,
    highlights: progressForm.highlights,
    issues: progressForm.issues,
    nextPlan: progressForm.nextPlan,
    updatedBy: progressTarget.value.employeeName,
    updatedById: progressTarget.value.employeeId
  })
  ElMessage.success('进度已更新')
  progressDialogVisible.value = false
  fetchData()
  loadLogs()
}

/* ========== 进度日志 ========== */
const logList = ref<GoalProgressLog[]>([])
const logsDialogVisible = ref(false)
const currentGoalLogs = ref<GoalProgressLog[]>([])

const loadLogs = async () => {
  const res = await getGoalProgressLogs({ pageSize: 100 })
  logList.value = (res.data?.list || []).sort((a: GoalProgressLog, b: GoalProgressLog) =>
    b.updateTime.localeCompare(a.updateTime)
  )
}

const handleViewLogs = (row: PerformanceGoal) => {
  currentGoalLogs.value = logList.value.filter((l) => l.goalId === row.id)
  logsDialogVisible.value = true
}

const goalTitleById = (id: number) => {
  const g = tableData.value.find((x) => x.id === id)
  return g ? `[${g.employeeName}] ${g.goalTitle}` : `#${id}`
}

/* ========== 模板库 ========== */
const templateDialogVisible = ref(false)
const templateList = ref<GoalTemplate[]>([])
const selectedTemplateId = ref<number | null>(null)

const loadTemplates = async () => {
  const res = await getGoalTemplates({ pageSize: 100 })
  templateList.value = res.data?.list || []
}

const handleApplyTemplate = async () => {
  if (!selectedTemplateId.value) return
  await createGoalFromTemplate(selectedTemplateId.value, {
    employeeId: 0,
    employeeName: '（待填写）',
    departmentName: '（待填写）',
    cycleId: 4,
    cycleName: '2026 Q2 OKR 季度考核',
    goalCategory: 'personal',
    weight: 30
  })
  ElMessage.success('已从模板创建，请在列表中编辑补充员工信息')
  templateDialogVisible.value = false
  fetchData()
}

/* ========== 目标修订（业界共识：飞书/钉钉/Lattice）========== */
import {
  REVISION_REASON_LABEL,
  REVISION_STATUS_LABEL,
  REVISION_STATUS_TYPE
} from '@/types/performanceGoal'
import type {
  GoalRevision,
  RevisionReasonCode,
  RevisionSnapshot
} from '@/types/performanceGoal'
import {
  submitGoalRevision,
  approveGoalRevision,
  rejectGoalRevision,
  getGoalRevisionHistory
} from '@/api/performanceGoal'

/* 修订申请 Dialog 状态 */
const revisionApplyVisible = ref(false)
const revisionTarget = ref<PerformanceGoal | null>(null)
const revisionBefore = ref<RevisionSnapshot>({
  goalTitle: '',
  goalDescription: '',
  weight: 0,
  keyResults: []
})
const revisionAfter = ref<RevisionSnapshot>({
  goalTitle: '',
  goalDescription: '',
  weight: 0,
  keyResults: []
})
const revisionReasonCode = ref<RevisionReasonCode>('market_change')
const revisionReasonDetail = ref('')
const revisionWeightStr = computed({
  get: () => String(revisionAfter.value.weight ?? ''),
  set: (v: string) => {
    const n = Number(v)
    revisionAfter.value.weight = isNaN(n) ? 0 : Math.max(0, Math.min(100, n))
  }
})

const handleApplyRevision = (row: PerformanceGoal) => {
  revisionTarget.value = row
  // 修改前快照（只读）
  revisionBefore.value = {
    goalTitle: row.goalTitle,
    goalDescription: row.goalDescription,
    weight: row.weight,
    keyResults: row.keyResults ? JSON.parse(JSON.stringify(row.keyResults)) : []
  }
  // 修改后初值 = 修改前（员工在右侧改）
  revisionAfter.value = JSON.parse(JSON.stringify(revisionBefore.value))
  revisionReasonCode.value = 'market_change'
  revisionReasonDetail.value = ''
  revisionApplyVisible.value = true
}

const submitRevisionApply = async () => {
  if (!revisionTarget.value) return
  if (!revisionAfter.value.goalTitle.trim()) {
    return ElMessage.warning('目标标题不能为空')
  }
  if (revisionReasonCode.value === 'other' && !revisionReasonDetail.value.trim()) {
    return ElMessage.warning('选择"其他"时必须填写原因说明')
  }
  // 校验：修改前后必须有差异
  const sameTitle = revisionBefore.value.goalTitle === revisionAfter.value.goalTitle
  const sameDesc = revisionBefore.value.goalDescription === revisionAfter.value.goalDescription
  const sameWeight = revisionBefore.value.weight === revisionAfter.value.weight
  const sameKRs =
    JSON.stringify(revisionBefore.value.keyResults) ===
    JSON.stringify(revisionAfter.value.keyResults)
  if (sameTitle && sameDesc && sameWeight && sameKRs) {
    return ElMessage.warning('修改前后内容一致，无需提交修订')
  }

  try {
    await submitGoalRevision(revisionTarget.value.id, {
      after: JSON.parse(JSON.stringify(revisionAfter.value)),
      reasonCode: revisionReasonCode.value,
      reasonDetail: revisionReasonDetail.value || undefined,
      applicantId: revisionTarget.value.employeeId,
      applicantName: revisionTarget.value.employeeName
    })
    ElMessage.success('修订申请已提交，等待审批')
    revisionApplyVisible.value = false
    fetchData()
  } catch (e: any) {
    ElMessage.error(e?.message || '提交失败')
  }
}

/* 修订历史 Dialog 状态 */
const revisionHistoryVisible = ref(false)
const revisionHistoryList = ref<GoalRevision[]>([])

const handleViewRevisions = async (row: PerformanceGoal) => {
  try {
    const res: any = await getGoalRevisionHistory(row.id)
    revisionHistoryList.value = res.data || []
    revisionHistoryVisible.value = true
  } catch {
    ElMessage.error('加载修订历史失败')
  }
}

/* 审批修订 Dialog 状态 */
const revisionApproveVisible = ref(false)
const revisionApproving = ref<GoalRevision | null>(null)
const revisionApproveComment = ref('')

const handleApproveRevision = (row: PerformanceGoal) => {
  if (!row.pendingRevision) {
    return ElMessage.warning('无待审批的修订申请')
  }
  revisionApproving.value = row.pendingRevision
  revisionApproveComment.value = ''
  revisionApproveVisible.value = true
}

const submitRevisionApprove = async () => {
  if (!revisionApproving.value) return
  try {
    await approveGoalRevision(revisionApproving.value.id, {
      approverId: revisionApproving.value.approverId || 0,
      approverName: revisionApproving.value.approverName || 'HR',
      approveComment: revisionApproveComment.value
    })
    ElMessage.success('修订已生效')
    revisionApproveVisible.value = false
    fetchData()
  } catch (e: any) {
    ElMessage.error(e?.message || '审批失败')
  }
}

const submitRevisionReject = async () => {
  if (!revisionApproving.value) return
  if (!revisionApproveComment.value.trim()) {
    return ElMessage.warning('驳回必须填写审批意见')
  }
  try {
    await rejectGoalRevision(revisionApproving.value.id, {
      approverId: revisionApproving.value.approverId || 0,
      approverName: revisionApproving.value.approverName || 'HR',
      approveComment: revisionApproveComment.value
    })
    ElMessage.success('已驳回，员工可重新申请')
    revisionApproveVisible.value = false
    fetchData()
  } catch (e: any) {
    ElMessage.error(e?.message || '驳回失败')
  }
}

onMounted(() => {
  fetchData()
  loadLogs()
  loadTemplates()
})
</script>

<style scoped lang="scss">
.perf-goal-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-grid {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.kpi-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }

  .kpi-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
  }

  .kpi-value {
    font-size: 26px;
    font-weight: 700;
    color: #303133;
    line-height: 1;
  }
}

.goal-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 4px 16px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }
  :deep(.el-tab-pane) {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.filter-card,
.data-card {
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

.filter-form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.filter-buttons {
  display: flex;

  .el-button:not(:first-child) {
    margin-left: 12px;
  }
}

.data-card {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-header {
    flex-shrink: 0;
    margin-bottom: 16px;

    .header-buttons {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }

  .table-container {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    flex-shrink: 0;
    margin-top: 16px;
  }
}

.muted {
  color: #909399;
  font-size: 12px;
}

.expand-box {
  padding: 12px 24px;
  background: #fafbfc;
  border-radius: 8px;
  margin: 0 8px;

  .expand-title {
    font-size: 13px;
    font-weight: 600;
    color: #606266;
    margin: 8px 0 6px;
  }

  .kr-list {
    margin-bottom: 10px;
  }
}

/* ========== KR 卡片化（v4：精简字段，进度纯手动） ========== */

/* 注意：`.kr-list` 同时被表格展开行（嵌套 el-table）和编辑弹窗使用 */

.kr-card {
  position: relative;
  padding: 14px 16px 4px;
  margin-bottom: 12px;
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #c6e2ff;
  }
}

.kr-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  .kr-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    height: 22px;
    padding: 0 8px;
    background: #409eff;
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    border-radius: 4px;
  }

  .kr-card-spacer {
    flex: 1;
  }

  .kr-progress-inline {
    font-size: 12px;
    color: #606266;

    strong {
      margin-left: 4px;
      color: #67c23a;
    }
  }
}

/* 卡片内 form-item：去掉默认底部空隙 */
.kr-form-item {
  margin-bottom: 12px !important;
}

.kr-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;

  .ai-trigger-hint {
    font-size: 12px;
    color: #909399;
  }
}

/* 度量方式 3 选 1 单选组（带 hint） */
.kr-type-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
}

.kr-type-radio {
  display: inline-flex;
  align-items: center;
  margin-right: 0 !important;
  height: auto;

  /* Element Plus radio 内部 label 容器 */
  :deep(.el-radio__label) {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    padding-left: 6px;
  }

  .kr-type-label {
    font-size: 13px;
    color: #303133;
  }

  .kr-type-hint {
    font-size: 12px;
    color: #909399;
  }
}

.kr-weight-hint {
  margin-left: auto;
  font-size: 12px;

  &.ok {
    color: #67c23a;
  }

  &.err {
    color: #f56c6c;
  }
}

.diff-text {
  margin-left: 8px;
  font-size: 12px;
  color: #67c23a;
}

/* ========== 修订申请 / 历史 / 审批 Dialog 样式 ========== */
.revision-compare {
  display: flex;
  gap: 16px;

  .revision-side {
    flex: 1;
    background: #fafbfc;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 12px;

    .revision-side-title {
      font-size: 13px;
      font-weight: 600;
      color: #909399;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #ebeef5;

      &.revision-side-after {
        color: #409eff;
      }
    }

    .kr-readonly {
      .kr-readonly-item {
        padding: 8px 10px;
        background: #fff;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        margin-bottom: 6px;
        font-size: 13px;

        .kr-no {
          font-weight: 600;
          color: #606266;
          margin-bottom: 4px;
        }

        .kr-meta {
          color: #909399;
          font-size: 12px;
          margin-top: 4px;
        }
      }
    }

    .kr-edit-list {
      .kr-edit-item {
        padding: 8px 10px;
        background: #fff;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        margin-bottom: 8px;

        .kr-no {
          font-size: 13px;
          font-weight: 600;
          color: #606266;
          margin-bottom: 4px;
        }
      }
    }
  }
}

.revision-empty {
  padding: 40px 0;
  text-align: center;
  color: #c0c4cc;
  font-size: 13px;
}

.revision-card {
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 12px 14px;

  .revision-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;

    .revision-card-applicant {
      font-size: 13px;
      color: #303133;
    }
  }

  .revision-card-section {
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 8px;

    .revision-section-label {
      color: #909399;
      margin-right: 4px;
    }

    .revision-reason-detail {
      margin-left: 8px;
      color: #606266;
    }
  }

  .revision-card-diff {
    display: flex;
    align-items: stretch;
    gap: 12px;
    margin: 12px 0;

    .diff-col {
      flex: 1;
      background: #fff;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      padding: 10px 12px;
      font-size: 13px;
      line-height: 1.8;

      &.diff-col-after {
        background: #f0f9eb;
        border-color: #c2e7b0;
      }

      .diff-col-title {
        font-size: 12px;
        font-weight: 600;
        color: #909399;
        margin-bottom: 6px;
      }

      .diff-field {
        color: #303133;

        strong {
          color: #606266;
        }
      }

      .diff-krs {
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px dashed #ebeef5;

        .diff-kr {
          font-size: 12px;
          line-height: 1.6;
          color: #606266;
        }
      }
    }

    .diff-arrow {
      align-self: center;
      color: #c0c4cc;
      font-size: 20px;
      flex-shrink: 0;
    }
  }

  .revision-card-approve {
    font-size: 13px;
    color: #606266;
    padding-top: 8px;
    border-top: 1px dashed #ebeef5;

    .revision-comment {
      margin-left: 8px;
      color: #909399;
      font-style: italic;
    }
  }
}

.revision-approve-body {
  font-size: 13px;
  line-height: 1.6;
}
</style>
