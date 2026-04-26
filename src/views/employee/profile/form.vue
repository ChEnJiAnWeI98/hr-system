<template>
  <div class="page-container">
    <!-- 面包屑卡片 -->
    <el-card class="breadcrumb-card">
      <div class="breadcrumb-content">
        <div class="breadcrumb-left">
          <el-button text @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回员工档案
          </el-button>
          <span class="divider">|</span>
          <span class="page-info">{{ pageTitle }}</span>
        </div>
        <div class="breadcrumb-actions">
          <el-button @click="handleBack">{{ isView ? '返回' : '取消' }}</el-button>
          <el-button v-if="!isView" type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </div>
    </el-card>

    <!-- 表单卡片 -->
    <el-card class="form-card">
      <el-scrollbar class="form-scrollbar">
        <div class="form-wrapper">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            :disabled="isView"
            label-width="120px"
          >
            <el-tabs v-model="activeTab" type="border-card">
              <!-- 标签页 1：基本信息 -->
              <el-tab-pane label="基本信息" name="basic">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="员工工号" prop="employeeNo">
                      <el-input
                        v-model="formData.employeeNo"
                        placeholder="系统自动生成"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="员工状态">
                      <el-input
                        :value="getStatusText(formData.status)"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input
                        v-model="formData.name"
                        placeholder="请输入姓名"
                        maxlength="50"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                      <el-select v-model="formData.gender" placeholder="请选择性别">
                        <el-option label="男" :value="1" />
                        <el-option label="女" :value="2" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="出生日期" prop="birthDate">
                      <el-date-picker
                        v-model="formData.birthDate"
                        type="date"
                        placeholder="请选择出生日期"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="身份证号" prop="idCard">
                      <el-input
                        v-model="formData.idCard"
                        placeholder="请输入身份证号"
                        maxlength="18"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="联系电话" prop="phone">
                      <el-input
                        v-model="formData.phone"
                        placeholder="请输入联系电话"
                        maxlength="11"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电子邮箱" prop="email">
                      <el-input
                        v-model="formData.email"
                        placeholder="请输入电子邮箱"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="民族" prop="nation">
                      <el-select v-model="formData.nation" placeholder="请选择民族" clearable>
                        <el-option label="汉族" value="汉族" />
                        <el-option label="回族" value="回族" />
                        <el-option label="蒙古族" value="蒙古族" />
                        <el-option label="藏族" value="藏族" />
                        <el-option label="维吾尔族" value="维吾尔族" />
                        <el-option label="苗族" value="苗族" />
                        <el-option label="彝族" value="彝族" />
                        <el-option label="壮族" value="壮族" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="政治面貌" prop="politicalStatus">
                      <el-select v-model="formData.politicalStatus" placeholder="请选择政治面貌" clearable>
                        <el-option label="群众" value="群众" />
                        <el-option label="共青团员" value="共青团员" />
                        <el-option label="中共党员" value="中共党员" />
                        <el-option label="民主党派" value="民主党派" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="婚姻状况" prop="maritalStatus">
                      <el-select v-model="formData.maritalStatus" placeholder="请选择婚姻状况" clearable>
                        <el-option label="未婚" value="未婚" />
                        <el-option label="已婚" value="已婚" />
                        <el-option label="离异" value="离异" />
                        <el-option label="丧偶" value="丧偶" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入职日期" prop="joinDate">
                      <el-date-picker
                        v-model="formData.joinDate"
                        type="date"
                        placeholder="请选择入职日期"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        :disabled="isEdit"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="所属部门" prop="departmentId">
                      <el-tree-select
                        v-model="formData.departmentId"
                        :data="departmentTree"
                        :props="{ label: 'name', children: 'children' }"
                        placeholder="请选择部门"
                        check-strictly
                        @change="handleDepartmentChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="岗位" prop="positionId">
                      <el-select v-model="formData.positionId" placeholder="请选择岗位">
                        <el-option
                          v-for="pos in positionList"
                          :key="pos.id"
                          :label="pos.name"
                          :value="pos.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="户籍地址" prop="registeredAddress">
                      <el-input
                        v-model="formData.registeredAddress"
                        placeholder="请输入户籍地址"
                        maxlength="200"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="现居住地址" prop="currentAddress">
                      <el-input
                        v-model="formData.currentAddress"
                        placeholder="请输入现居住地址"
                        maxlength="200"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <!-- 标签页 2：教育经历 -->
              <el-tab-pane label="教育经历" name="education">
                <div v-for="(item, index) in formData.educationRecords" :key="index" class="dynamic-item">
                  <el-card>
                    <template #header>
                      <div class="card-header">
                        <span>教育经历 {{ index + 1 }}</span>
                        <el-button type="danger" text @click="removeEducation(index)">删除</el-button>
                      </div>
                    </template>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="学校名称" :prop="`educationRecords.${index}.schoolName`" :rules="rules.required">
                          <el-input v-model="item.schoolName" placeholder="请输入学校名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="专业" :prop="`educationRecords.${index}.major`" :rules="rules.required">
                          <el-input v-model="item.major" placeholder="请输入专业" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="学历" :prop="`educationRecords.${index}.education`" :rules="rules.required">
                          <el-select v-model="item.education" placeholder="请选择学历">
                            <el-option label="高中" value="高中" />
                            <el-option label="大专" value="大专" />
                            <el-option label="本科" value="本科" />
                            <el-option label="硕士" value="硕士" />
                            <el-option label="博士" value="博士" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="学位">
                          <el-select v-model="item.degree" placeholder="请选择学位" clearable>
                            <el-option label="学士" value="学士" />
                            <el-option label="硕士" value="硕士" />
                            <el-option label="博士" value="博士" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="入学时间" :prop="`educationRecords.${index}.startDate`" :rules="rules.required">
                          <el-date-picker
                            v-model="item.startDate"
                            type="month"
                            placeholder="请选择入学时间"
                            format="YYYY-MM"
                            value-format="YYYY-MM"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="毕业时间" :prop="`educationRecords.${index}.endDate`" :rules="rules.required">
                          <el-date-picker
                            v-model="item.endDate"
                            type="month"
                            placeholder="请选择毕业时间"
                            format="YYYY-MM"
                            value-format="YYYY-MM"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="是否全日制">
                          <el-radio-group v-model="item.isFullTime">
                            <el-radio :value="1">是</el-radio>
                            <el-radio :value="0">否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
                <el-button type="primary" @click="addEducation" style="margin-top: 16px">添加教育经历</el-button>
              </el-tab-pane>

              <!-- 标签页 3：工作经历 -->
              <el-tab-pane label="工作经历" name="work">
                <div v-for="(item, index) in formData.workRecords" :key="index" class="dynamic-item">
                  <el-card>
                    <template #header>
                      <div class="card-header">
                        <span>工作经历 {{ index + 1 }}</span>
                        <el-button type="danger" text @click="removeWork(index)">删除</el-button>
                      </div>
                    </template>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="公司名称" :prop="`workRecords.${index}.companyName`" :rules="rules.required">
                          <el-input v-model="item.companyName" placeholder="请输入公司名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="职位" :prop="`workRecords.${index}.position`" :rules="rules.required">
                          <el-input v-model="item.position" placeholder="请输入职位" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="入职时间" :prop="`workRecords.${index}.startDate`" :rules="rules.required">
                          <el-date-picker
                            v-model="item.startDate"
                            type="month"
                            placeholder="请选择入职时间"
                            format="YYYY-MM"
                            value-format="YYYY-MM"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="离职时间" :prop="`workRecords.${index}.endDate`" :rules="rules.required">
                          <el-date-picker
                            v-model="item.endDate"
                            type="month"
                            placeholder="请选择离职时间"
                            format="YYYY-MM"
                            value-format="YYYY-MM"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="工作描述">
                          <el-input
                            v-model="item.description"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入工作描述"
                            maxlength="500"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="离职原因">
                          <el-input v-model="item.leaveReason" placeholder="请输入离职原因" maxlength="200" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
                <el-button type="primary" @click="addWork" style="margin-top: 16px">添加工作经历</el-button>
              </el-tab-pane>

              <!-- 标签页 4：证件信息 -->
              <el-tab-pane label="证件信息" name="certificate">
                <div v-for="(item, index) in formData.certificateRecords" :key="index" class="dynamic-item">
                  <el-card>
                    <template #header>
                      <div class="card-header">
                        <span>证件信息 {{ index + 1 }}</span>
                        <el-button type="danger" text @click="removeCertificate(index)">删除</el-button>
                      </div>
                    </template>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="证件类型" :prop="`certificateRecords.${index}.type`" :rules="rules.required">
                          <el-select v-model="item.type" placeholder="请选择证件类型">
                            <el-option label="身份证" value="身份证" />
                            <el-option label="护照" value="护照" />
                            <el-option label="驾驶证" value="驾驶证" />
                            <el-option label="劳动合同" value="劳动合同" />
                            <el-option label="资质证书" value="资质证书" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="证件号码" :prop="`certificateRecords.${index}.number`" :rules="rules.required">
                          <el-input v-model="item.number" placeholder="请输入证件号码" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="发证日期" :prop="`certificateRecords.${index}.issueDate`" :rules="rules.required">
                          <el-date-picker
                            v-model="item.issueDate"
                            type="date"
                            placeholder="请选择发证日期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="有效期" :prop="`certificateRecords.${index}.expiryDate`" :rules="rules.required">
                          <el-date-picker
                            v-model="item.expiryDate"
                            type="date"
                            placeholder="请选择有效期"
                            format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
                <el-button type="primary" @click="addCertificate" style="margin-top: 16px">添加证件信息</el-button>
              </el-tab-pane>

              <!-- 标签页 5：紧急联系人 -->
              <el-tab-pane label="紧急联系人" name="emergency">
                <div v-for="(item, index) in formData.emergencyContacts" :key="index" class="dynamic-item">
                  <el-card>
                    <template #header>
                      <div class="card-header">
                        <span>紧急联系人 {{ index + 1 }}</span>
                        <el-button type="danger" text @click="removeEmergency(index)">删除</el-button>
                      </div>
                    </template>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="姓名" :prop="`emergencyContacts.${index}.name`" :rules="rules.required">
                          <el-input v-model="item.name" placeholder="请输入姓名" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="关系" :prop="`emergencyContacts.${index}.relationship`" :rules="rules.required">
                          <el-select v-model="item.relationship" placeholder="请选择关系">
                            <el-option label="父母" value="父母" />
                            <el-option label="配偶" value="配偶" />
                            <el-option label="子女" value="子女" />
                            <el-option label="兄弟姐妹" value="兄弟姐妹" />
                            <el-option label="朋友" value="朋友" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="联系电话" :prop="`emergencyContacts.${index}.phone`" :rules="rules.phone">
                          <el-input v-model="item.phone" placeholder="请输入联系电话" maxlength="11" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="工作单位">
                          <el-input v-model="item.company" placeholder="请输入工作单位" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="备注">
                          <el-input v-model="item.remark" placeholder="请输入备注" maxlength="200" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
                <el-button type="primary" @click="addEmergency" style="margin-top: 16px">添加紧急联系人</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getEmployeeDetail, addEmployee, updateEmployee } from '@/api/employee'
import { getDepartmentTree } from '@/api/department'
import { getPositionList } from '@/api/position'
import type { Employee, EducationRecord, WorkRecord, CertificateRecord, EmergencyContact } from '@/types/employee'

defineOptions({
  name: 'EmployeeProfileForm'
})

const route = useRoute()
const router = useRouter()

const activeTab = ref('basic')
const formRef = ref<FormInstance>()
const departmentTree = ref<any[]>([])
const positionList = ref<any[]>([])

const isEdit = computed(() => route.path.includes('edit'))
const isView = computed(() => route.path.includes('detail'))
const pageTitle = computed(() => {
  if (isView.value) return '员工详情'
  if (isEdit.value) return '编辑员工'
  return '新增员工'
})

const formData = reactive<Partial<Employee>>({
  employeeNo: '',
  name: '',
  gender: undefined,
  birthDate: '',
  idCard: '',
  phone: '',
  email: '',
  nation: '',
  politicalStatus: '',
  maritalStatus: undefined,
  registeredAddress: '',
  currentAddress: '',
  departmentId: undefined,
  positionId: undefined,
  joinDate: '',
  status: 2, // 默认试用期
  educationRecords: [],
  workRecords: [],
  certificateRecords: [],
  emergencyContacts: []
})

const rules: FormRules = {
  required: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  departmentId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  joinDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }]
}

const getStatusText = (status: number | undefined) => {
  const map: Record<number, string> = {
    1: '在职',
    2: '试用期',
    3: '已离职',
    4: '停用'
  }
  return status ? map[status] : '试用期'
}

const loadDepartmentTree = async () => {
  try {
    const res = await getDepartmentTree()
    departmentTree.value = res.data.list || []
  } catch (error) {
    ElMessage.error('加载部门数据失败')
  }
}

const loadPositionList = async () => {
  try {
    const res = await getPositionList({ page: 1, pageSize: 1000 })
    positionList.value = res.data?.list || []
  } catch (error) {
    ElMessage.error('加载岗位数据失败')
  }
}

const handleDepartmentChange = () => {
  // Reset position when department changes
  formData.positionId = undefined
}

const loadDetail = async () => {
  if (!isEdit.value) {
    // 新增模式，生成员工编号
    formData.employeeNo = `EMP${Date.now().toString().slice(-6)}`
    return
  }

  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await getEmployeeDetail(id)
    if (res.data) {
      Object.assign(formData, res.data)
    }
  } catch (error) {
    ElMessage.error('加载员工详情失败')
  }
}

const addEducation = () => {
  formData.educationRecords = formData.educationRecords || []
  formData.educationRecords.push({
    schoolName: '',
    major: '',
    education: '',
    degree: '',
    isFullTime: 1,
    startDate: '',
    endDate: ''
  })
}

const removeEducation = (index: number) => {
  formData.educationRecords?.splice(index, 1)
}

const addWork = () => {
  formData.workRecords = formData.workRecords || []
  formData.workRecords.push({
    companyName: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    leaveReason: ''
  })
}

const removeWork = (index: number) => {
  formData.workRecords?.splice(index, 1)
}

const addCertificate = () => {
  formData.certificateRecords = formData.certificateRecords || []
  formData.certificateRecords.push({
    type: '',
    number: '',
    issueDate: '',
    expiryDate: ''
  })
}

const removeCertificate = (index: number) => {
  formData.certificateRecords?.splice(index, 1)
}

const addEmergency = () => {
  formData.emergencyContacts = formData.emergencyContacts || []
  formData.emergencyContacts.push({
    name: '',
    relationship: '',
    phone: '',
    company: '',
    remark: ''
  })
}

const removeEmergency = (index: number) => {
  formData.emergencyContacts?.splice(index, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const apiFunc = isEdit.value ? updateEmployee : addEmployee
    await apiFunc(formData as any)

    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    router.push('/employee')
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || '保存失败')
    }
  }
}

const handleBack = () => {
  router.push('/employee/profile')
}

onMounted(() => {
  loadDepartmentTree()
  loadPositionList()
  loadDetail()
})
</script>

<style scoped lang="scss">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;

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

        .el-icon {
          font-size: 16px;
        }
      }

      .divider {
        color: #dcdfe6;
        font-size: 14px;
      }

      .page-info {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }
    }

    .breadcrumb-actions {
      display: flex;

      .el-button:not(:first-child) {
        margin-left: 12px;
      }
    }
  }
}

.form-card {
  flex: 1;
  overflow: hidden;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .form-scrollbar {
    flex: 1;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      padding-bottom: 20px;
    }
  }

  .form-wrapper {
    :deep(.el-tabs) {
      .el-tabs__content {
        padding: 20px;
      }
    }

    :deep(.el-select),
    :deep(.el-date-picker) {
      width: 100%;
    }
  }
}

.dynamic-item {
  margin-bottom: 16px;

  .el-card {
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;
    background: #f5f7fa;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
