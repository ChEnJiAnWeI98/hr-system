<template>
  <div class="emp-detail-container">
    <!-- 面包屑 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回花名册
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">员工档案：{{ emp?.nameZh || '' }}</span>
        </div>
      </div>
    </el-card>

    <el-scrollbar class="content-scrollbar" v-if="emp">
      <!-- 顶部员工卡片 -->
      <el-card class="emp-header-card">
        <div class="emp-header">
          <div class="emp-avatar">
            {{ emp.nameZh.charAt(0) }}
          </div>
          <div class="emp-main-info">
            <div class="name-row">
              <span class="name">{{ emp.nameZh }}</span>
              <el-tag :type="statusColor" size="small" style="margin-left: 12px">
                {{ dictStore.getLabel('EMP_STATUS', emp.status) }}
              </el-tag>
              <el-tag type="info" effect="plain" size="small" style="margin-left: 4px">
                {{ emp.employeeNo }}
              </el-tag>
            </div>
            <div class="sub-row">
              <span>{{ emp.positionName }}</span>
              <span class="divider-dot">·</span>
              <span>{{ emp.orgName }}</span>
              <span class="divider-dot">·</span>
              <span>{{ emp.level }}</span>
              <span class="divider-dot">·</span>
              <span>入职 {{ emp.seniority }} 年</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 8 Tab -->
      <el-card class="tabs-card">
        <el-tabs v-model="activeTab" class="emp-tabs">
          <!-- ========== Tab 1 基本信息 ========== -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="3" border size="default">
              <el-descriptions-item label="中文姓名">{{ emp.nameZh }}</el-descriptions-item>
              <el-descriptions-item label="英文名">{{ emp.nameEn || '-' }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ dictStore.getLabel('GENDER', emp.gender) }}</el-descriptions-item>
              <el-descriptions-item label="出生日期">{{ emp.birthDate }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ emp.age }} 岁</el-descriptions-item>
              <el-descriptions-item label="民族">{{ dictStore.getLabel('NATION', emp.nation) }}</el-descriptions-item>
              <el-descriptions-item label="国籍">{{ dictStore.getLabel('NATIONALITY', emp.nationality) }}</el-descriptions-item>
              <el-descriptions-item label="婚姻状况">{{ dictStore.getLabel('MARITAL_STATUS', emp.maritalStatus) }}</el-descriptions-item>
              <el-descriptions-item label="政治面貌">{{ dictStore.getLabel('POLITICAL_STATUS', emp.politicalStatus) }}</el-descriptions-item>
              <el-descriptions-item label="证件类型">{{ dictStore.getLabel('CERTIFICATE_TYPE', emp.certificateType) }}</el-descriptions-item>
              <el-descriptions-item label="证件号码" :span="2">
                <span>{{ displayCert(emp.certificateNo) }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="最高学历">{{ dictStore.getLabel('EDUCATION', emp.education) }}</el-descriptions-item>
              <el-descriptions-item label="毕业学校">{{ emp.graduatedSchool || '-' }}</el-descriptions-item>
              <el-descriptions-item label="专业">{{ emp.major || '-' }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ displayMobile(emp.mobile) }}</el-descriptions-item>
              <el-descriptions-item label="邮箱" :span="2">{{ emp.email }}</el-descriptions-item>
              <el-descriptions-item label="家庭住址" :span="3">
                {{ displayAddress(emp.homeAddress) }}
              </el-descriptions-item>
              <template v-if="emp.emergencyContact">
                <el-descriptions-item label="紧急联系人">{{ emp.emergencyContact.name }}</el-descriptions-item>
                <el-descriptions-item label="联系人关系">{{ dictStore.getLabel('EMERGENCY_RELATION', emp.emergencyContact.relation) }}</el-descriptions-item>
                <el-descriptions-item label="联系人电话">
                  {{ displayMobile(emp.emergencyContact.mobile) }}
                </el-descriptions-item>
              </template>
            </el-descriptions>
          </el-tab-pane>

          <!-- ========== Tab 2 岗位与组织 ========== -->
          <el-tab-pane label="岗位与组织" name="position">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="员工编号">{{ emp.employeeNo }}</el-descriptions-item>
              <el-descriptions-item label="员工状态">
                <el-tag :type="statusColor" size="small">
                  {{ dictStore.getLabel('EMP_STATUS', emp.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="雇佣类型">
                {{ EMPLOYMENT_TYPE_LABEL[emp.employmentType] }}
              </el-descriptions-item>
              <el-descriptions-item label="工作地点">{{ emp.workLocation }}</el-descriptions-item>
              <el-descriptions-item label="所在组织">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item v-for="o in orgPath" :key="o.id">{{ o.orgName }}</el-breadcrumb-item>
                </el-breadcrumb>
              </el-descriptions-item>
              <el-descriptions-item label="岗位">{{ emp.positionName }}</el-descriptions-item>
              <el-descriptions-item label="岗位族">
                <el-tag size="small">{{ dictStore.getLabel('JOB_FAMILY', emp.jobFamily) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="岗位序列">{{ emp.jobSequence }}</el-descriptions-item>
              <el-descriptions-item label="职级">{{ emp.level }}（{{ emp.levelTrack === 'management' ? '管理通道' : '专业通道' }}）</el-descriptions-item>
              <el-descriptions-item label="入职日期">{{ emp.entryDate }}</el-descriptions-item>
              <el-descriptions-item label="转正日期">{{ emp.regularizationDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="司龄">{{ emp.seniority }} 年</el-descriptions-item>
              <el-descriptions-item label="直属上级">
                <el-button v-if="supervisor" link type="primary" @click="goTo(supervisor.id)">
                  {{ supervisor.nameZh }}（{{ supervisor.positionName }}）
                </el-button>
                <span v-else style="color: #c0c4cc">-</span>
              </el-descriptions-item>
              <el-descriptions-item label="归属 HRBP">
                <el-button v-if="hrbp" link type="primary" @click="goTo(hrbp.id)">
                  {{ hrbp.nameZh }}（HRBP）
                </el-button>
                <span v-else style="color: #c0c4cc">-</span>
              </el-descriptions-item>
            </el-descriptions>

            <template v-if="emp.managedOrgIds?.length">
              <el-divider>分管组织（HRBP）</el-divider>
              <div class="managed-orgs">
                <el-tag
                  v-for="id in emp.managedOrgIds"
                  :key="id"
                  type="warning"
                  size="small"
                  effect="plain"
                  style="margin-right: 8px; margin-bottom: 8px"
                >
                  {{ orgStore.getById(id)?.orgName || id }}
                </el-tag>
              </div>
            </template>
          </el-tab-pane>

          <!-- ========== Tab 3 合同 ========== -->
          <el-tab-pane label="合同" name="contract">
            <template v-if="employeeContracts.length">
              <el-table :data="employeeContracts" border size="small">
                <el-table-column prop="contractNo" label="合同编号" width="150" />
                <el-table-column label="合同类型" width="160">
                  <template #default="{ row }">
                    {{ dictStore.getLabel('CONTRACT_TYPE', row.contractType) || row.type }}
                  </template>
                </el-table-column>
                <el-table-column prop="signDate" label="签订日期" width="120" />
                <el-table-column prop="startDate" label="开始日期" width="120" />
                <el-table-column prop="endDate" label="结束日期" width="120" />
                <el-table-column label="状态" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag :type="contractStatusType(row.status)" size="small">
                      {{ contractStatusLabel(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <el-empty v-else description="暂无合同记录" :image-size="80" />
          </el-tab-pane>

          <!-- ========== Tab 4 薪酬（Phase 4.12 档案联动） ========== -->
          <el-tab-pane label="薪酬" name="compensation" v-if="canViewSalary">
            <div class="comp-section">
              <div class="sub-title">当前薪资结构</div>
              <el-descriptions :column="3" border>
                <el-descriptions-item label="基本工资">
                  <span style="font-weight: 500">¥{{ formatMoney(emp.baseSalary) }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="岗位工资">
                  ¥{{ formatMoney(emp.positionSalary) }}
                </el-descriptions-item>
                <el-descriptions-item label="月固定合计">
                  <span style="color: var(--el-color-primary); font-weight: 500">
                    ¥{{ formatMoney((emp.baseSalary || 0) + (emp.positionSalary || 0)) }}
                  </span>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <div class="comp-section">
              <div class="sub-title">工资条历史（最近 {{ employeePayslips.length }} 期）</div>
              <el-table
                v-if="employeePayslips.length"
                :data="employeePayslips"
                border
                size="small"
                style="width: 100%"
              >
                <el-table-column prop="period" label="核算周期" width="110" align="center" />
                <el-table-column label="绩效" width="120" align="center">
                  <template #default="{ row }">
                    <el-tag size="small" :type="gradeTagType(row.performanceGrade)">
                      {{ row.performanceGrade }} × {{ row.performanceCoefficient }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="应发" min-width="120" align="right">
                  <template #default="{ row }">¥{{ formatMoney(row.grossAmount) }}</template>
                </el-table-column>
                <el-table-column label="扣缴" min-width="120" align="right">
                  <template #default="{ row }">
                    <span style="color: var(--el-color-warning)">
                      -¥{{ formatMoney(row.deductionAmount) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="实发" min-width="140" align="right">
                  <template #default="{ row }">
                    <span style="color: var(--el-color-success); font-weight: 500">
                      ¥{{ formatMoney(row.netAmount) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发放时间" min-width="170" />
              </el-table>
              <el-empty v-else description="暂无工资条记录" :image-size="60" />
            </div>
          </el-tab-pane>

          <!-- ========== Tab 5 绩效历史（Phase 4.12 补档联动 05 绩效模块） ========== -->
          <el-tab-pane label="绩效历史" name="performance">
            <template v-if="archiveView">
              <!-- 顶部 KPI -->
              <div class="training-kpi">
                <div class="kpi-card">
                  <div class="kpi-label">累计周期</div>
                  <div class="kpi-value primary">{{ archiveView.stats.totalCycles }}</div>
                  <div class="kpi-sub">期</div>
                </div>
                <div class="kpi-card">
                  <div class="kpi-label">历史均分</div>
                  <div class="kpi-value">{{ archiveView.stats.avgScore }}</div>
                  <div class="kpi-sub">分</div>
                </div>
                <div class="kpi-card">
                  <div class="kpi-label">最高档</div>
                  <div class="kpi-value success">
                    {{ topGrade }}
                  </div>
                  <div class="kpi-sub">{{ archiveView.stats.gradeCounts[topGrade] || 0 }} 次</div>
                </div>
                <div class="kpi-card">
                  <div class="kpi-label">人才标识</div>
                  <div class="kpi-value">
                    <el-tag v-if="archiveView.stats.isHiPo" type="success" size="small">高潜人才</el-tag>
                    <el-tag v-else-if="archiveView.stats.needsAttention" type="warning" size="small">需关注</el-tag>
                    <el-tag v-else type="info" size="small">稳定</el-tag>
                  </div>
                  <div class="kpi-sub">&nbsp;</div>
                </div>
              </div>

              <!-- S/A/B/C/D 分布 -->
              <div class="comp-section">
                <div class="sub-title">等级分布</div>
                <div class="grade-dist">
                  <div
                    v-for="g in ['S', 'A', 'B', 'C', 'D']"
                    :key="g"
                    class="grade-cell"
                  >
                    <el-tag :type="gradeTagType(g)" size="small">{{ g }}</el-tag>
                    <span class="grade-count">× {{ archiveView.stats.gradeCounts[g] || 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- 档案列表（按周期倒序） -->
              <div class="comp-section">
                <div class="sub-title">各周期档案（最近在前）</div>
                <el-table
                  :data="sortedArchives"
                  border
                  size="small"
                  style="width: 100%"
                >
                  <el-table-column prop="cycleName" label="周期" min-width="140" />
                  <el-table-column label="等级" width="80" align="center">
                    <template #default="{ row }">
                      <el-tag :type="gradeTagType(row.grade || row.rating)" size="small">
                        {{ row.grade || row.rating }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="finalScore" label="最终分" width="90" align="center" />
                  <el-table-column label="目标完成率" width="120" align="center">
                    <template #default="{ row }">
                      <span v-if="row.goalCompletionRate !== undefined">{{ row.goalCompletionRate }}%</span>
                      <span v-else style="color: #c0c4cc">—</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="部门排名" width="110" align="center">
                    <template #default="{ row }">
                      {{ row.ranking }} / {{ row.totalInDepartment }}
                    </template>
                  </el-table-column>
                  <el-table-column label="调薪比例" width="100" align="center">
                    <template #default="{ row }">
                      <span v-if="row.salaryAdjustment > 0" style="color: #67c23a">
                        +{{ row.salaryAdjustment }}%
                      </span>
                      <span v-else style="color: #c0c4cc">—</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="promotion" label="晋升" min-width="100" />
                  <el-table-column label="PIP" width="80" align="center">
                    <template #default="{ row }">
                      <el-tag v-if="row.hasPIP" type="danger" size="small">有</el-tag>
                      <span v-else style="color: #c0c4cc">—</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="developmentPlan" label="发展计划" min-width="200" show-overflow-tooltip />
                </el-table>
              </div>
            </template>
            <el-empty v-else description="暂无绩效档案" :image-size="80" />
          </el-tab-pane>

          <!-- ========== Tab 6 培训记录（Phase 4.12 档案联动） ========== -->
          <el-tab-pane label="培训记录" name="training">
            <!-- 培训汇总 KPI -->
            <div class="training-kpi">
              <div class="kpi-card">
                <div class="kpi-label">累计培训</div>
                <div class="kpi-value primary">{{ trainingRecords.length }}</div>
                <div class="kpi-sub">次</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">学习时长</div>
                <div class="kpi-value">{{ totalTrainingHours }}</div>
                <div class="kpi-sub">小时</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">通过认证</div>
                <div class="kpi-value success">{{ passedTrainingCount }}</div>
                <div class="kpi-sub">门</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">持有证书</div>
                <div class="kpi-value warning">{{ employeeCertificates.length }}</div>
                <div class="kpi-sub">张</div>
              </div>
            </div>

            <div class="comp-section">
              <div class="sub-title">培训记录</div>
              <el-table
                v-if="trainingRecords.length"
                :data="trainingRecords"
                border
                size="small"
                style="width: 100%"
              >
                <el-table-column prop="planName" label="培训计划" min-width="220" show-overflow-tooltip />
                <el-table-column prop="courseName" label="课程" min-width="180" show-overflow-tooltip />
                <el-table-column label="签到" width="80" align="center">
                  <template #default="{ row }">
                    <el-tag v-if="row.attended" type="success" size="small">已出勤</el-tag>
                    <el-tag v-else type="danger" size="small">缺勤</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="成绩" width="80" align="center">
                  <template #default="{ row }">
                    <span v-if="row.score !== undefined" :style="{ color: row.score >= 75 ? '#67c23a' : '#f56c6c' }">
                      {{ row.score }}
                    </span>
                    <span v-else style="color: #c0c4cc">—</span>
                  </template>
                </el-table-column>
                <el-table-column label="结业状态" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag v-if="row.completionStatus === 'passed'" type="success" size="small">通过</el-tag>
                    <el-tag v-else-if="row.completionStatus === 'failed'" type="danger" size="small">未通过</el-tag>
                    <el-tag v-else type="warning" size="small">进行中</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="completionTime" label="完成时间" width="170" />
              </el-table>
              <el-empty v-else description="暂无培训记录" :image-size="60" />
            </div>

            <div class="comp-section">
              <div class="sub-title">持有证书</div>
              <div v-if="employeeCertificates.length" class="cert-grid">
                <el-card
                  v-for="cert in employeeCertificates"
                  :key="cert.id"
                  class="cert-card"
                  shadow="never"
                >
                  <div class="cert-head">
                    <div class="cert-name">{{ cert.certificateName }}</div>
                    <el-tag
                      :type="cert.status === 'valid' ? 'success' : cert.status === 'expiring' ? 'warning' : 'danger'"
                      size="small"
                    >
                      {{ cert.status === 'valid' ? '有效' : cert.status === 'expiring' ? '即将到期' : '已过期' }}
                    </el-tag>
                  </div>
                  <div class="cert-sub">{{ cert.issuer }} · {{ cert.issueDate }}</div>
                  <div class="cert-meta">
                    有效期：{{ cert.validFrom }}
                    <span v-if="cert.validTo"> ~ {{ cert.validTo }}</span>
                    <span v-else style="color: #67c23a"> ~ 永久</span>
                  </div>
                </el-card>
              </div>
              <el-empty v-else description="暂无证书" :image-size="60" />
            </div>

            <div class="comp-section">
              <div class="sub-title">能力评估历史</div>
              <el-table
                v-if="employeeAssessments.length"
                :data="employeeAssessments"
                border
                size="small"
                style="width: 100%"
              >
                <el-table-column prop="assessmentPeriod" label="评估期" width="120" align="center" />
                <el-table-column label="评估类型" width="120" align="center">
                  <template #default="{ row }">
                    <el-tag effect="plain" size="small">
                      {{ ASSESSMENT_TYPE_LABEL_LOCAL[row.assessmentType] }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="能力项" width="100" align="center">
                  <template #default="{ row }">{{ row.items.length }}</template>
                </el-table-column>
                <el-table-column label="均分" width="100" align="center">
                  <template #default="{ row }">
                    <span :style="{ color: assessAvg(row) >= 4 ? '#67c23a' : '#409eff' }">
                      {{ assessAvg(row).toFixed(1) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="assessorName" label="评估人" width="110" />
                <el-table-column label="状态" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag v-if="row.status === 'draft'" type="info" size="small">草稿</el-tag>
                    <el-tag v-else-if="row.status === 'submitted'" type="primary" size="small">已提交</el-tag>
                    <el-tag v-else-if="row.status === 'approved'" type="success" size="small">已审批</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="overallComment" label="综合评语" min-width="220" show-overflow-tooltip />
              </el-table>
              <el-empty v-else description="暂无能力评估" :image-size="60" />
            </div>
          </el-tab-pane>

          <!-- ========== Tab 7 异动历史 ========== -->
          <el-tab-pane label="异动历史" name="transfer">
            <template v-if="transferHistory.length || offboardingHistory.length">
              <el-timeline>
                <el-timeline-item
                  v-for="item in mergedHistory"
                  :key="`${item.type}-${item.id}`"
                  :timestamp="item.time"
                  :type="item.color"
                  :color="item.dotColor"
                >
                  <div class="history-item">
                    <div class="history-head">
                      <el-tag :type="item.tagType" size="small">{{ item.tagLabel }}</el-tag>
                      <span class="history-title">{{ item.title }}</span>
                    </div>
                    <div v-if="item.description" class="history-desc">{{ item.description }}</div>
                    <div class="history-meta">
                      <span v-if="item.operator">操作人：{{ item.operator }}</span>
                      <span v-if="item.no">{{ item.no }}</span>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </template>
            <el-empty v-else description="暂无异动记录" :image-size="80" />
          </el-tab-pane>

          <!-- ========== Tab 8 证件（Phase 4.x 合并自 legacy 员工证件管理） ========== -->
          <el-tab-pane label="证件" name="certificates">
            <el-table :data="employeeCertificatesTab" border size="small" style="width: 100%">
              <el-table-column prop="typeLabel" label="证件类型" width="130">
                <template #default="{ row }">
                  <el-tag :type="row.typeTagType" size="small" effect="plain">{{ row.typeLabel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="certNo" label="证件号/编号" min-width="180" />
              <el-table-column prop="issuer" label="颁发机构" min-width="180" show-overflow-tooltip />
              <el-table-column prop="issueDate" label="颁发日期" width="120" />
              <el-table-column label="有效期" width="130">
                <template #default="{ row }">
                  <span v-if="row.validTo">{{ row.validTo }}</span>
                  <span v-else style="color: #67c23a">永久</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.statusType" size="small">{{ row.statusLabel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="附件" width="100" align="center">
                <template #default>
                  <el-button link type="primary" @click="handleViewAttachment">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-alert
              type="info"
              :closable="false"
              show-icon
              style="margin-top: 12px"
              title="证件说明"
              description="身份证、学历证书信息取自员工档案基础字段；健康证、职业资格证按员工历史记录汇总。真实环境下支持附件上传、到期提醒和批量审核。"
            />
          </el-tab-pane>

          <!-- ========== Tab 9 关联关系 ========== -->
          <el-tab-pane label="关联关系" name="relations">
            <div class="relations-grid">
              <!-- 直属上级 -->
              <div class="rel-section">
                <div class="rel-title">直属上级</div>
                <div v-if="supervisor" class="rel-card" @click="goTo(supervisor.id)">
                  <div class="rel-avatar">{{ supervisor.nameZh.charAt(0) }}</div>
                  <div>
                    <div class="rel-name">{{ supervisor.nameZh }}</div>
                    <div class="rel-sub">{{ supervisor.positionName }} · {{ supervisor.level }}</div>
                  </div>
                </div>
                <div v-else class="empty">无</div>
              </div>

              <!-- HRBP -->
              <div class="rel-section">
                <div class="rel-title">归属 HRBP</div>
                <div v-if="hrbp" class="rel-card" @click="goTo(hrbp.id)">
                  <div class="rel-avatar hrbp">{{ hrbp.nameZh.charAt(0) }}</div>
                  <div>
                    <div class="rel-name">{{ hrbp.nameZh }}</div>
                    <div class="rel-sub">{{ hrbp.positionName }}</div>
                  </div>
                </div>
                <div v-else class="empty">无</div>
              </div>

              <!-- 直属下属 -->
              <div class="rel-section">
                <div class="rel-title">直属下属（{{ subordinates.length }}）</div>
                <div v-if="subordinates.length" class="rel-card-grid">
                  <div
                    v-for="s in subordinates"
                    :key="s.id"
                    class="rel-card small"
                    @click="goTo(s.id)"
                  >
                    <div class="rel-avatar">{{ s.nameZh.charAt(0) }}</div>
                    <div>
                      <div class="rel-name">{{ s.nameZh }}</div>
                      <div class="rel-sub">{{ s.positionName }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">暂无直接下属</div>
              </div>

              <!-- 同部门 -->
              <div class="rel-section">
                <div class="rel-title">同组织成员（{{ sameOrg.length }}）</div>
                <div v-if="sameOrg.length" class="rel-card-grid">
                  <div
                    v-for="s in sameOrg.slice(0, 12)"
                    :key="s.id"
                    class="rel-card small"
                    @click="goTo(s.id)"
                  >
                    <div class="rel-avatar">{{ s.nameZh.charAt(0) }}</div>
                    <div>
                      <div class="rel-name">{{ s.nameZh }}</div>
                      <div class="rel-sub">{{ s.positionName }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">无</div>
                <div v-if="sameOrg.length > 12" class="more-tip">
                  仅显示前 12 位，共 {{ sameOrg.length }} 位同事
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useEmployeeStore } from '@/store/modules/employee'
import { useOrganizationStore } from '@/store/modules/organization'
import { useDictStore } from '@/store/modules/dict'
import { useRBACStore } from '@/store/modules/rbac'
import { maskMobile, maskCertificate, maskAddress } from '@/utils/desensitize'
import { EMPLOYMENT_TYPE_LABEL } from '@/types/employee/profile'
import type { EmployeeStatus } from '@/types/employee/profile'
// Phase 3.7 档案联动
import { getTransfersByEmployee } from '@/mock/employee/transfer'
import { getOffboardingsByEmployee } from '@/mock/employee/offboarding'
import { getContractsByEmployeeMock } from '@/mock/contract'
import {
  TRANSFER_TYPE_LABEL,
  TRANSFER_TYPE_COLOR,
  TRANSFER_STATUS_LABEL
} from '@/types/employee/transfer'
import { OFFBOARDING_TYPE_LABEL, OFFBOARDING_TYPE_COLOR } from '@/types/employee/offboarding'

// Phase 4.12 档案联动：薪酬 + 培训
import { getPayslipsByEmployee } from '@/mock/comp/payroll'
import { getRecordsByEmployee } from '@/mock/training/record'
import { getCertsByEmployee } from '@/mock/training/certificate'
import { getAssessmentsByEmployee } from '@/mock/training/assessment'

// Phase 4.12 补档联动：绩效历史（原 Phase 2 遗漏）
import { getEmployeeArchiveViewMock } from '@/mock/performanceArchive'

defineOptions({ name: 'HrmEmployeeDetail' })

const route = useRoute()
const router = useRouter()
const empStore = useEmployeeStore()
const orgStore = useOrganizationStore()
const dictStore = useDictStore()
const rbacStore = useRBACStore()

const activeTab = ref('basic')

const empId = computed(() => Number(route.params.id))
const emp = computed(() => empStore.getById(empId.value))

// 权限计算
const canViewSalary = computed(() => rbacStore.canViewSalary)

// 关联数据
const orgPath = computed(() => (emp.value ? orgStore.getPath(emp.value.orgId) : []))
const supervisor = computed(() => (emp.value?.supervisorId ? empStore.getById(emp.value.supervisorId) : null))
const hrbp = computed(() => (emp.value?.hrbpId ? empStore.getById(emp.value.hrbpId) : null))
const subordinates = computed(() => (emp.value ? empStore.getSubordinates(emp.value.id) : []))
const sameOrg = computed(() => {
  if (!emp.value) return []
  return empStore.getByOrg(emp.value.orgId, false).filter((e) => e.id !== emp.value!.id)
})

// === Phase 3.7 档案联动 ===
/** 该员工的所有合同 */
const employeeContracts = computed(() =>
  emp.value ? getContractsByEmployeeMock(emp.value.id) : []
)

/** 该员工的所有异动记录 */
const transferHistory = computed(() =>
  emp.value ? getTransfersByEmployee(emp.value.id) : []
)

/** 该员工的所有离职记录 */
const offboardingHistory = computed(() =>
  emp.value ? getOffboardingsByEmployee(emp.value.id) : []
)

// === Phase 4.12 档案联动：薪酬 + 培训 ===
/** 该员工的工资条历史 */
const employeePayslips = computed(() =>
  emp.value ? getPayslipsByEmployee(emp.value.id) : []
)

/** 该员工的培训记录 */
const trainingRecords = computed(() =>
  emp.value ? getRecordsByEmployee(emp.value.id) : []
)

/** 累计培训时长（小时） */
const totalTrainingHours = computed(() =>
  trainingRecords.value.reduce((s, r) => s + (r.actualDuration || 0), 0)
)

/** 通过的培训数量 */
const passedTrainingCount = computed(
  () => trainingRecords.value.filter((r) => r.completionStatus === 'passed').length
)

/** 该员工的证书 */
const employeeCertificates = computed(() =>
  emp.value ? getCertsByEmployee(emp.value.id) : []
)

/** 该员工的能力评估记录 */
const employeeAssessments = computed(() =>
  emp.value ? getAssessmentsByEmployee(emp.value.id) : []
)

/** 评估类型中文字典（避免引入 training 模块太多内容） */
const ASSESSMENT_TYPE_LABEL_LOCAL: Record<string, string> = {
  self: '自评',
  supervisor: '上级评',
  hrbp: 'HRBP 评',
  synthesis: '综合评估'
}

/** 单条评估的均分 */
const assessAvg = (row: { items: Array<{ score: number }> }) => {
  if (!row.items?.length) return 0
  return row.items.reduce((s, i) => s + i.score, 0) / row.items.length
}

/** 绩效 Tag 颜色 */
const gradeTagType = (
  g: string
): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const m: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    S: 'success',
    A: 'primary',
    B: 'info',
    C: 'warning',
    D: 'danger'
  }
  return m[g] || 'info'
}

/** 金额格式化 */
const formatMoney = (n?: number) => (n || 0).toLocaleString('zh-CN')

// Phase 4.x 证件 Tab：基于员工池字段动态构造证件列表
const EDUCATION_LABEL: Record<string, string> = {
  college: '大专',
  bachelor: '本科',
  master: '硕士',
  doctor: '博士'
}

const employeeCertificatesTab = computed(() => {
  if (!emp.value) return []
  const e = emp.value
  const list: any[] = []

  // 1. 身份证（员工池基础字段）
  list.push({
    typeLabel: '身份证',
    typeTagType: 'primary',
    certNo: maskCertificate(e.certificateNo || ''),
    issuer: '公安机关',
    issueDate: e.birthDate ? `${String(Number(e.birthDate.slice(0, 4)) + 18)}-01-01` : '-',
    validTo: undefined, // 简化：按永久算
    statusLabel: '有效',
    statusType: 'success'
  })

  // 2. 学历证书（基于 education + graduatedSchool）
  if (e.education) {
    list.push({
      typeLabel: EDUCATION_LABEL[e.education as string] || '学历证书',
      typeTagType: 'success',
      certNo: `EDU-${String(e.id).padStart(6, '0')}`,
      issuer: (e as any).graduatedSchool || '院校',
      issueDate: e.birthDate ? `${String(Number(e.birthDate.slice(0, 4)) + 22)}-07-01` : '-',
      validTo: undefined,
      statusLabel: '有效',
      statusType: 'success'
    })
  }

  // 3. 健康证（确定性：约 70% 员工有）
  if (e.id % 10 < 7) {
    list.push({
      typeLabel: '健康证',
      typeTagType: 'warning',
      certNo: `HC-${String(e.id).padStart(6, '0')}`,
      issuer: '区卫生和健康委员会',
      issueDate: '2025-03-15',
      validTo: '2026-03-15',
      statusLabel: '有效',
      statusType: 'success'
    })
  }

  // 4. 职业资格证（确定性：约 30% 员工有）
  if (e.id % 10 >= 7) {
    list.push({
      typeLabel: '职业资格',
      typeTagType: 'info',
      certNo: `QUAL-${String(e.id).padStart(6, '0')}`,
      issuer: '人社部职业技能鉴定中心',
      issueDate: '2024-11-20',
      validTo: undefined,
      statusLabel: '有效',
      statusType: 'success'
    })
  }

  return list
})

const handleViewAttachment = () => {
  ElMessage.info('Mock 环境：真实环境下会打开证件扫描件预览（PDF/图片）')
}

/** 该员工的绩效档案视图（Phase 4.12 补） */
const archiveView = computed(() =>
  emp.value ? getEmployeeArchiveViewMock(emp.value.id) : null
)

/** 按周期倒序（最近在前） */
const sortedArchives = computed(() => {
  if (!archiveView.value?.archives) return []
  return [...archiveView.value.archives].sort((a, b) =>
    (b.cycleEndDate || '').localeCompare(a.cycleEndDate || '')
  )
})

/** 最高档等级（用于 KPI 卡片） */
const topGrade = computed(() => {
  if (!archiveView.value) return 'B'
  const counts = archiveView.value.stats.gradeCounts
  for (const g of ['S', 'A', 'B', 'C', 'D']) {
    if ((counts[g] || 0) > 0) return g
  }
  return 'B'
})

/** 合并异动 + 离职 + 入职为单一时间线 */
const mergedHistory = computed(() => {
  const items: Array<{
    id: string | number
    type: 'transfer' | 'offboarding' | 'entry'
    time: string
    title: string
    description?: string
    operator?: string
    no?: string
    tagType: 'primary' | 'success' | 'info' | 'warning' | 'danger'
    tagLabel: string
    color: 'primary' | 'success' | 'info' | 'warning' | 'danger'
    dotColor?: string
  }> = []

  // 入职（虚拟，取 entryDate）
  if (emp.value) {
    items.push({
      id: `entry-${emp.value.id}`,
      type: 'entry',
      time: emp.value.entryDate,
      title: `入职到 ${emp.value.orgName} · ${emp.value.positionName}`,
      description: '由招聘入职办理创建档案',
      tagType: 'success',
      tagLabel: '入职',
      color: 'success'
    })
  }

  // 异动
  transferHistory.value.forEach((t) => {
    const parts: string[] = []
    if (t.fromOrgName && t.toOrgName && t.fromOrgName !== t.toOrgName) {
      parts.push(`组织：${t.fromOrgName} → ${t.toOrgName}`)
    }
    if (t.fromPositionName && t.toPositionName && t.fromPositionName !== t.toPositionName) {
      parts.push(`岗位：${t.fromPositionName} → ${t.toPositionName}`)
    }
    if (t.fromLevel && t.toLevel && t.fromLevel !== t.toLevel) {
      parts.push(`职级：${t.fromLevel} → ${t.toLevel}`)
    }
    items.push({
      id: `transfer-${t.id}`,
      type: 'transfer',
      time: t.effectiveDate || t.submitTime,
      title: `${TRANSFER_TYPE_LABEL[t.transferType]}（${TRANSFER_STATUS_LABEL[t.status]}）`,
      description: parts.length ? parts.join('\n') : t.reason,
      operator: t.submitterName,
      no: t.transferNo,
      tagType: TRANSFER_TYPE_COLOR[t.transferType],
      tagLabel: TRANSFER_TYPE_LABEL[t.transferType],
      color: t.status === 'effective' ? 'success' : 'primary'
    })
  })

  // 离职
  offboardingHistory.value.forEach((o) => {
    items.push({
      id: `offboarding-${o.id}`,
      type: 'offboarding',
      time: o.actualLastDay || o.expectedLastDay || o.submitTime,
      title: `离职（${OFFBOARDING_TYPE_LABEL[o.offboardingType]}）`,
      description: o.reason,
      operator: o.hrApproverName,
      no: o.offboardingNo,
      tagType: OFFBOARDING_TYPE_COLOR[o.offboardingType],
      tagLabel: '离职',
      color: 'danger'
    })
  })

  // 按时间倒序排列（最近的在上）
  return items.sort((a, b) => (b.time || '').localeCompare(a.time || ''))
})

// 合同状态
const contractStatusLabel = (status: number) => {
  const m: Record<number, string> = {
    1: '待签署',
    2: '履行中',
    3: '已到期',
    4: '已终止',
    5: '已续签',
    6: '审批中',
    7: '已驳回'
  }
  return m[status] || `状态${status}`
}
const contractStatusType = (status: number): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  const m: Record<number, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    1: 'warning',
    2: 'success',
    3: 'info',
    4: 'info',
    5: 'success',
    6: 'warning',
    7: 'danger'
  }
  return m[status] || 'info'
}

const statusColor = computed(() => {
  const map: Record<EmployeeStatus, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    pending_onboard: 'info',
    probation: 'warning',
    regular: 'success',
    transferring: 'primary',
    seconded: 'primary',
    offboarding: 'danger',
    terminated: 'info'
  }
  return map[emp.value?.status || 'regular']
})

// 敏感字段展示（按权限决定脱敏）
const displayMobile = (v?: string) => (rbacStore.canViewSensitive ? v || '-' : maskMobile(v) || '-')
const displayCert = (v?: string) => (rbacStore.canViewSensitive ? v || '-' : maskCertificate(v) || '-')
const displayAddress = (v?: string) => (rbacStore.canViewSensitive ? v || '-' : maskAddress(v) || '-')

// 导航
const handleBack = () => {
  router.push('/employee/profile')
}
const goTo = (id: number) => {
  router.push(`/employee/profile/detail/${id}`)
}

// Tab 占位组件（内联）
const TabPlaceholder = (props: { phase: string; note?: string }) =>
  h(
    'div',
    {
      style:
        'padding: 60px 20px; text-align: center; background: #fafafa; border-radius: 8px; color: #909399;'
    },
    [
      h('div', { style: 'font-size: 40px; margin-bottom: 12px' }, '🏗️'),
      h('div', { style: 'font-size: 15px; color: #606266' }, `将在 ${props.phase} 接入真实数据`),
      props.note
        ? h('div', { style: 'font-size: 12px; margin-top: 6px' }, props.note)
        : null
    ]
  )

// 滚动顶部
watch(empId, () => {
  activeTab.value = 'basic'
})
</script>

<style scoped lang="scss">
.emp-detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .breadcrumb-card {
    flex-shrink: 0;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
    }

    .breadcrumb-content {
      display: flex;
      width: 100%;
    }

    .breadcrumb-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .el-button {
        font-size: 14px;
        color: #606266;
        padding: 0;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .divider {
        color: #dcdfe6;
      }

      .page-info {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }
    }
  }

  .content-scrollbar {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}

.emp-header-card,
.tabs-card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;
}

.emp-header {
  display: flex;
  align-items: center;
  gap: 20px;

  .emp-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #409eff, #67c23a);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .emp-main-info {
    flex: 1;

    .name-row {
      display: flex;
      align-items: center;

      .name {
        font-size: 22px;
        font-weight: 600;
        color: #303133;
      }
    }

    .sub-row {
      margin-top: 6px;
      color: #606266;
      font-size: 14px;

      .divider-dot {
        margin: 0 8px;
        color: #c0c4cc;
      }
    }
  }
}

.emp-tabs {
  :deep(.el-tabs__content) {
    padding: 16px 4px 0;
  }
}

.managed-orgs {
  padding-top: 8px;
}

.relations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.rel-section {
  .rel-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
  }

  .rel-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      border-color: var(--el-color-primary);
      background: #f5faff;
    }

    &.small {
      padding: 6px 10px;
    }
  }

  .rel-card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .rel-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f0f2f5;
    color: #606266;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;

    &.hrbp {
      background: #fdf6ec;
      color: #e6a23c;
    }
  }

  .rel-name {
    font-weight: 500;
    color: #303133;
    font-size: 13px;
  }

  .rel-sub {
    color: #909399;
    font-size: 12px;
    margin-top: 2px;
  }

  .empty {
    color: #c0c4cc;
    font-size: 13px;
    padding: 16px 0;
  }

  .more-tip {
    color: #909399;
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
  }
}

// Tab 7 异动历史时间线
.history-item {
  .history-head {
    display: flex;
    align-items: center;
    gap: 8px;
    .history-title {
      font-weight: 500;
      color: #303133;
    }
  }
  .history-desc {
    margin-top: 6px;
    color: #606266;
    font-size: 13px;
    white-space: pre-line;
    line-height: 1.6;
  }
  .history-meta {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
    display: flex;
    gap: 12px;
  }
}

// === Phase 4.12 档案联动样式 ===
.comp-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .sub-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-left: 8px;
    border-left: 3px solid var(--el-color-primary);
  }
}

.training-kpi {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  .kpi-card {
    background: #fafafa;
    border-radius: 8px;
    padding: 14px 16px;

    .kpi-label {
      font-size: 12px;
      color: #909399;
    }

    .kpi-value {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin-top: 4px;
      display: inline;

      &.primary {
        color: var(--el-color-primary);
      }
      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
    }

    .kpi-sub {
      font-size: 12px;
      color: #909399;
      display: inline;
      margin-left: 4px;
    }
  }
}

.grade-dist {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  .grade-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #fafafa;
    border-radius: 6px;

    .grade-count {
      font-weight: 500;
      color: #303133;
    }
  }
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;

  .cert-card {
    border: 1px solid #ebeef5 !important;
    border-radius: 8px;

    :deep(.el-card__body) {
      padding: 14px 16px;
    }

    .cert-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;

      .cert-name {
        font-weight: 500;
        color: #303133;
      }
    }

    .cert-sub {
      font-size: 13px;
      color: #606266;
    }

    .cert-meta {
      font-size: 12px;
      color: #909399;
      margin-top: 6px;
    }
  }
}
</style>
