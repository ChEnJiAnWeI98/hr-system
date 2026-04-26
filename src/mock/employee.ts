/**
 * 员工档案 Mock 数据
 */

import type { Employee, EmployeeListParams } from '@/types/employee'

// 数据存储
let employees: Employee[] = [
  {
    id: 1,
    employeeNo: 'EMP001',
    name: '张三',
    gender: 1,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 2,
    positionName: '前端工程师',
    status: 1,
    joinDate: '2023-01-15 09:00:00',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    idCard: '110101199001011234',
    birthDate: '1990-01-01',
    nation: '汉族',
    politicalStatus: '中共党员',
    maritalStatus: 1,
    registeredAddress: '北京市海淀区xxx街道xxx号',
    currentAddress: '北京市朝阳区xxx街道xxx号',
    educationRecords: [
      {
        id: 1,
        schoolName: '北京大学',
        major: '计算机科学与技术',
        education: '本科',
        degree: '学士',
        isFullTime: 1,
        startDate: '2008-09-01',
        endDate: '2012-06-30'
      }
    ],
    workRecords: [
      {
        id: 1,
        companyName: 'ABC科技有限公司',
        position: '前端开发工程师',
        startDate: '2012-07-01',
        endDate: '2018-12-31',
        description: '负责公司官网和后台管理系统的前端开发',
        leaveReason: '寻求更好的发展机会'
      }
    ],
    certificateRecords: [
      {
        id: 1,
        type: '身份证',
        number: '110101199001011234',
        issueDate: '2010-01-01',
        expiryDate: '2030-01-01'
      }
    ],
    emergencyContacts: [
      {
        id: 1,
        name: '李四',
        relationship: '配偶',
        phone: '13900139001',
        company: 'XYZ公司',
        remark: ''
      }
    ],
    hometown: '北京市',
    address: '北京市朝阳区xxx街道xxx号',
    emergencyContact: '李四',
    emergencyPhone: '13900139001',
    education: '本科',
    school: '北京大学',
    major: '计算机科学与技术',
    workExperience: '5年前端开发经验',
    remark: '',
    createTime: '2023-01-15 09:00:00',
    updateTime: '2023-01-15 09:00:00'
  },
  {
    id: 2,
    employeeNo: 'EMP002',
    name: '李四',
    gender: 1,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 3,
    positionName: '后端工程师',
    status: 0,
    joinDate: '2023-02-20 09:00:00',
    phone: '13800138002',
    email: 'lisi@example.com',
    idCard: '110101199102021234',
    birthDate: '1991-02-02',
    nation: '汉族',
    politicalStatus: '群众',
    maritalStatus: 0,
    registeredAddress: '上海市黄浦区xxx街道xxx号',
    currentAddress: '上海市浦东新区xxx街道xxx号',
    educationRecords: [
      {
        id: 2,
        schoolName: '清华大学',
        major: '软件工程',
        education: '硕士',
        degree: '硕士',
        isFullTime: 1,
        startDate: '2009-09-01',
        endDate: '2016-06-30'
      }
    ],
    workRecords: [],
    certificateRecords: [],
    emergencyContacts: [],
    hometown: '上海市',
    address: '上海市浦东新区xxx街道xxx号',
    emergencyContact: '王五',
    emergencyPhone: '13900139002',
    education: '硕士',
    school: '清华大学',
    major: '软件工程',
    workExperience: '6年后端开发经验',
    remark: '',
    createTime: '2023-02-20 09:00:00',
    updateTime: '2023-02-20 09:00:00'
  },
  {
    id: 3,
    employeeNo: 'EMP003',
    name: '王五',
    gender: 2,
    departmentId: 5,
    departmentName: '产品部',
    positionId: 5,
    positionName: '产品经理',
    status: 2,
    joinDate: '2024-03-10 09:00:00',
    phone: '13800138003',
    email: 'wangwu@example.com',
    idCard: '110101199203031234',
    birthDate: '1992-03-03',
    hometown: '广州市',
    address: '广州市天河区xxx街道xxx号',
    emergencyContact: '赵六',
    emergencyPhone: '13900139003',
    education: '本科',
    school: '中山大学',
    major: '工商管理',
    workExperience: '3年产品经验',
    remark: '',
    createTime: '2024-03-10 09:00:00',
    updateTime: '2024-03-10 09:00:00'
  },
  {
    id: 4,
    employeeNo: 'EMP004',
    name: '赵六',
    gender: 2,
    departmentId: 6,
    departmentName: '人事部',
    positionId: 8,
    positionName: 'HR专员',
    status: 0,
    joinDate: '2023-05-01 09:00:00',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    idCard: '110101199304041234',
    birthDate: '1993-04-04',
    hometown: '深圳市',
    address: '深圳市南山区xxx街道xxx号',
    emergencyContact: '孙七',
    emergencyPhone: '13900139004',
    education: '本科',
    school: '深圳大学',
    major: '人力资源管理',
    workExperience: '4年HR经验',
    remark: '',
    createTime: '2023-05-01 09:00:00',
    updateTime: '2023-05-01 09:00:00'
  },
  {
    id: 5,
    employeeNo: 'EMP005',
    name: '孙七',
    gender: 1,
    departmentId: 7,
    departmentName: '财务部',
    positionId: 10,
    positionName: '会计',
    status: 3,
    joinDate: '2022-06-15 09:00:00',
    phone: '13800138005',
    email: 'sunqi@example.com',
    idCard: '110101199405051234',
    birthDate: '1994-05-05',
    hometown: '杭州市',
    address: '杭州市西湖区xxx街道xxx号',
    emergencyContact: '周八',
    emergencyPhone: '13900139005',
    education: '本科',
    school: '浙江大学',
    major: '会计学',
    workExperience: '5年会计经验',
    remark: '已离职',
    createTime: '2022-06-15 09:00:00',
    updateTime: '2024-01-10 09:00:00'
  },
  {
    id: 6,
    employeeNo: 'EMP006',
    name: '周八',
    gender: 1,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 2,
    positionName: '前端工程师',
    status: 1,
    joinDate: '2023-07-10 09:00:00',
    phone: '13800138006',
    email: 'zhouba@example.com',
    idCard: '110101199506061234',
    birthDate: '1995-06-06',
    hometown: '成都市',
    address: '成都市武侯区xxx街道xxx号',
    emergencyContact: '吴九',
    emergencyPhone: '13900139006',
    education: '本科',
    school: '电子科技大学',
    major: '软件工程',
    workExperience: '3年前端开发经验',
    remark: '',
    createTime: '2023-07-10 09:00:00',
    updateTime: '2023-07-10 09:00:00'
  },
  {
    id: 7,
    employeeNo: 'EMP007',
    name: '吴九',
    gender: 2,
    departmentId: 5,
    departmentName: '产品部',
    positionId: 5,
    positionName: '产品经理',
    status: 1,
    joinDate: '2023-08-15 09:00:00',
    phone: '13800138007',
    email: 'wujiu@example.com',
    idCard: '110101199607071234',
    birthDate: '1996-07-07',
    hometown: '武汉市',
    address: '武汉市洪山区xxx街道xxx号',
    emergencyContact: '郑十',
    emergencyPhone: '13900139007',
    education: '硕士',
    school: '武汉大学',
    major: '市场营销',
    workExperience: '4年产品经验',
    remark: '',
    createTime: '2023-08-15 09:00:00',
    updateTime: '2023-08-15 09:00:00'
  },
  {
    id: 8,
    employeeNo: 'EMP008',
    name: '郑十',
    gender: 1,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 3,
    positionName: '后端工程师',
    status: 1,
    joinDate: '2023-09-20 09:00:00',
    phone: '13800138008',
    email: 'zhengshi@example.com',
    idCard: '110101199708081234',
    birthDate: '1997-08-08',
    hometown: '西安市',
    address: '西安市雁塔区xxx街道xxx号',
    emergencyContact: '王十一',
    emergencyPhone: '13900139008',
    education: '本科',
    school: '西安交通大学',
    major: '计算机科学与技术',
    workExperience: '2年后端开发经验',
    remark: '',
    createTime: '2023-09-20 09:00:00',
    updateTime: '2023-09-20 09:00:00'
  },
  {
    id: 9,
    employeeNo: 'EMP009',
    name: '王十一',
    gender: 2,
    departmentId: 6,
    departmentName: '人事部',
    positionId: 8,
    positionName: 'HR专员',
    status: 2,
    joinDate: '2024-01-10 09:00:00',
    phone: '13800138009',
    email: 'wangshiyi@example.com',
    idCard: '110101199809091234',
    birthDate: '1998-09-09',
    hometown: '南京市',
    address: '南京市鼓楼区xxx街道xxx号',
    emergencyContact: '李十二',
    emergencyPhone: '13900139009',
    education: '本科',
    school: '南京大学',
    major: '人力资源管理',
    workExperience: '1年HR经验',
    remark: '',
    createTime: '2024-01-10 09:00:00',
    updateTime: '2024-01-10 09:00:00'
  },
  {
    id: 10,
    employeeNo: 'EMP010',
    name: '李十二',
    gender: 1,
    departmentId: 7,
    departmentName: '财务部',
    positionId: 10,
    positionName: '会计',
    status: 1,
    joinDate: '2023-10-25 09:00:00',
    phone: '13800138010',
    email: 'lishier@example.com',
    idCard: '110101199910101234',
    birthDate: '1999-10-10',
    hometown: '天津市',
    address: '天津市南开区xxx街道xxx号',
    emergencyContact: '张十三',
    emergencyPhone: '13900139010',
    education: '本科',
    school: '天津财经大学',
    major: '会计学',
    workExperience: '2年会计经验',
    remark: '',
    createTime: '2023-10-25 09:00:00',
    updateTime: '2023-10-25 09:00:00'
  },
  // 技术部员工（departmentId: 2）
  {
    id: 11,
    employeeNo: 'EMP011',
    name: '张伟',
    gender: 1,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 1,
    positionName: '技术总监',
    status: 1,
    joinDate: '2022-01-10 09:00:00',
    phone: '13800138011',
    email: 'zhangwei@example.com',
    idCard: '110101198501011234',
    birthDate: '1985-01-01',
    hometown: '北京市',
    address: '北京市海淀区xxx街道xxx号',
    emergencyContact: '李娜',
    emergencyPhone: '13900139011',
    education: '硕士',
    school: '北京大学',
    major: '计算机科学',
    workExperience: '10年技术管理经验',
    remark: '',
    createTime: '2022-01-10 09:00:00',
    updateTime: '2022-01-10 09:00:00'
  },
  {
    id: 12,
    employeeNo: 'EMP012',
    name: '王芳',
    gender: 2,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 2,
    positionName: '前端工程师',
    status: 1,
    joinDate: '2022-03-15 09:00:00',
    phone: '13800138012',
    email: 'wangfang@example.com',
    idCard: '110101199001021234',
    birthDate: '1990-01-02',
    hometown: '上海市',
    address: '上海市浦东新区xxx街道xxx号',
    emergencyContact: '张强',
    emergencyPhone: '13900139012',
    education: '本科',
    school: '复旦大学',
    major: '软件工程',
    workExperience: '5年前端开发经验',
    remark: '',
    createTime: '2022-03-15 09:00:00',
    updateTime: '2022-03-15 09:00:00'
  },
  // 前端组员工（departmentId: 3）
  {
    id: 13,
    employeeNo: 'EMP013',
    name: '李明',
    gender: 1,
    departmentId: 3,
    departmentName: '前端组',
    positionId: 2,
    positionName: '前端工程师',
    status: 1,
    joinDate: '2022-05-20 09:00:00',
    phone: '13800138013',
    email: 'liming@example.com',
    idCard: '110101199201031234',
    birthDate: '1992-01-03',
    hometown: '广州市',
    address: '广州市天河区xxx街道xxx号',
    emergencyContact: '王丽',
    emergencyPhone: '13900139013',
    education: '本科',
    school: '中山大学',
    major: '计算机科学',
    workExperience: '4年前端开发经验',
    remark: '',
    createTime: '2022-05-20 09:00:00',
    updateTime: '2022-05-20 09:00:00'
  },
  {
    id: 14,
    employeeNo: 'EMP014',
    name: '赵敏',
    gender: 2,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 2,
    positionName: '前端工程师',
    status: 1,
    joinDate: '2022-07-10 09:00:00',
    phone: '13800138014',
    email: 'zhaomin@example.com',
    idCard: '110101199301041234',
    birthDate: '1993-01-04',
    hometown: '深圳市',
    address: '深圳市南山区xxx街道xxx号',
    emergencyContact: '李强',
    emergencyPhone: '13900139014',
    education: '本科',
    school: '深圳大学',
    major: '软件工程',
    workExperience: '3年前端开发经验',
    remark: '',
    createTime: '2022-07-10 09:00:00',
    updateTime: '2022-07-10 09:00:00'
  },
  // 后端组员工（departmentId: 4）
  {
    id: 15,
    employeeNo: 'EMP015',
    name: '孙杰',
    gender: 1,
    departmentId: 2,
    departmentName: '技术部',
    positionId: 3,
    positionName: '后端工程师',
    status: 1,
    joinDate: '2022-08-15 09:00:00',
    phone: '13800138015',
    email: 'sunjie@example.com',
    idCard: '110101199101051234',
    birthDate: '1991-01-05',
    hometown: '杭州市',
    address: '杭州市西湖区xxx街道xxx号',
    emergencyContact: '周芳',
    emergencyPhone: '13900139015',
    education: '硕士',
    school: '浙江大学',
    major: '计算机科学',
    workExperience: '6年后端开发经验',
    remark: '',
    createTime: '2022-08-15 09:00:00',
    updateTime: '2022-08-15 09:00:00'
  },
  {
    id: 16,
    employeeNo: 'EMP016',
    name: '周婷',
    gender: 2,
    departmentId: 4,
    departmentName: '后端组',
    positionId: 3,
    positionName: '后端工程师',
    status: 1,
    joinDate: '2022-09-20 09:00:00',
    phone: '13800138016',
    email: 'zhouting@example.com',
    idCard: '110101199201061234',
    birthDate: '1992-01-06',
    hometown: '南京市',
    address: '南京市鼓楼区xxx街道xxx号',
    emergencyContact: '吴强',
    emergencyPhone: '13900139016',
    education: '本科',
    school: '南京大学',
    major: '软件工程',
    workExperience: '4年后端开发经验',
    remark: '',
    createTime: '2022-09-20 09:00:00',
    updateTime: '2022-09-20 09:00:00'
  },
  // 产品部员工（departmentId: 5）
  {
    id: 17,
    employeeNo: 'EMP017',
    name: '吴磊',
    gender: 1,
    departmentId: 5,
    departmentName: '产品部',
    positionId: 5,
    positionName: '产品经理',
    status: 1,
    joinDate: '2022-10-10 09:00:00',
    phone: '13800138017',
    email: 'wulei@example.com',
    idCard: '110101199001071234',
    birthDate: '1990-01-07',
    hometown: '成都市',
    address: '成都市武侯区xxx街道xxx号',
    emergencyContact: '郑丽',
    emergencyPhone: '13900139017',
    education: '本科',
    school: '四川大学',
    major: '工商管理',
    workExperience: '5年产品经验',
    remark: '',
    createTime: '2022-10-10 09:00:00',
    updateTime: '2022-10-10 09:00:00'
  },
  {
    id: 18,
    employeeNo: 'EMP018',
    name: '郑秀',
    gender: 2,
    departmentId: 5,
    departmentName: '产品部',
    positionId: 5,
    positionName: '产品经理',
    status: 1,
    joinDate: '2022-11-15 09:00:00',
    phone: '13800138018',
    email: 'zhengxiu@example.com',
    idCard: '110101199101081234',
    birthDate: '1991-01-08',
    hometown: '武汉市',
    address: '武汉市武昌区xxx街道xxx号',
    emergencyContact: '王强',
    emergencyPhone: '13900139018',
    education: '本科',
    school: '武汉大学',
    major: '市场营销',
    workExperience: '4年产品经验',
    remark: '',
    createTime: '2022-11-15 09:00:00',
    updateTime: '2022-11-15 09:00:00'
  },
  // 人事部员工（departmentId: 6）
  {
    id: 19,
    employeeNo: 'EMP019',
    name: '王涛',
    gender: 1,
    departmentId: 6,
    departmentName: '人事部',
    positionId: 7,
    positionName: 'HR经理',
    status: 1,
    joinDate: '2022-12-01 09:00:00',
    phone: '13800138019',
    email: 'wangtao@example.com',
    idCard: '110101198801091234',
    birthDate: '1988-01-09',
    hometown: '西安市',
    address: '西安市雁塔区xxx街道xxx号',
    emergencyContact: '李娜',
    emergencyPhone: '13900139019',
    education: '本科',
    school: '西安交通大学',
    major: '人力资源管理',
    workExperience: '7年HR经验',
    remark: '',
    createTime: '2022-12-01 09:00:00',
    updateTime: '2022-12-01 09:00:00'
  },
  {
    id: 20,
    employeeNo: 'EMP020',
    name: '李娜',
    gender: 2,
    departmentId: 6,
    departmentName: '人事部',
    positionId: 8,
    positionName: 'HR专员',
    status: 1,
    joinDate: '2023-01-10 09:00:00',
    phone: '13800138020',
    email: 'lina@example.com',
    idCard: '110101199201101234',
    birthDate: '1992-01-10',
    hometown: '长沙市',
    address: '长沙市岳麓区xxx街道xxx号',
    emergencyContact: '张强',
    emergencyPhone: '13900139020',
    education: '本科',
    school: '湖南大学',
    major: '人力资源管理',
    workExperience: '3年HR经验',
    remark: '',
    createTime: '2023-01-10 09:00:00',
    updateTime: '2023-01-10 09:00:00'
  },
  // 财务部员工（departmentId: 7）
  {
    id: 21,
    employeeNo: 'EMP021',
    name: '张强',
    gender: 1,
    departmentId: 7,
    departmentName: '财务部',
    positionId: 9,
    positionName: '财务经理',
    status: 1,
    joinDate: '2023-02-15 09:00:00',
    phone: '13800138021',
    email: 'zhangqiang@example.com',
    idCard: '110101198701111234',
    birthDate: '1987-01-11',
    hometown: '重庆市',
    address: '重庆市渝中区xxx街道xxx号',
    emergencyContact: '王丽',
    emergencyPhone: '13900139021',
    education: '本科',
    school: '重庆大学',
    major: '会计学',
    workExperience: '8年财务经验',
    remark: '',
    createTime: '2023-02-15 09:00:00',
    updateTime: '2023-02-15 09:00:00'
  },
  {
    id: 22,
    employeeNo: 'EMP022',
    name: '王丽',
    gender: 2,
    departmentId: 7,
    departmentName: '财务部',
    positionId: 10,
    positionName: '会计',
    status: 1,
    joinDate: '2023-03-20 09:00:00',
    phone: '13800138022',
    email: 'wangli@example.com',
    idCard: '110101199101121234',
    birthDate: '1991-01-12',
    hometown: '天津市',
    address: '天津市南开区xxx街道xxx号',
    emergencyContact: '李强',
    emergencyPhone: '13900139022',
    education: '本科',
    school: '天津财经大学',
    major: '会计学',
    workExperience: '5年会计经验',
    remark: '',
    createTime: '2023-03-20 09:00:00',
    updateTime: '2023-03-20 09:00:00'
  },
  // 市场部员工（departmentId: 8）
  {
    id: 23,
    employeeNo: 'EMP023',
    name: '刘洋',
    gender: 1,
    departmentId: 8,
    departmentName: '市场部',
    positionId: 11,
    positionName: '市场经理',
    status: 1,
    joinDate: '2023-04-10 09:00:00',
    phone: '13800138023',
    email: 'liuyang@example.com',
    idCard: '110101198901131234',
    birthDate: '1989-01-13',
    hometown: '青岛市',
    address: '青岛市市南区xxx街道xxx号',
    emergencyContact: '赵敏',
    emergencyPhone: '13900139023',
    education: '本科',
    school: '中国海洋大学',
    major: '市场营销',
    workExperience: '6年市场经验',
    remark: '',
    createTime: '2023-04-10 09:00:00',
    updateTime: '2023-04-10 09:00:00'
  },
  {
    id: 24,
    employeeNo: 'EMP024',
    name: '赵敏',
    gender: 2,
    departmentId: 8,
    departmentName: '市场部',
    positionId: 12,
    positionName: '市场专员',
    status: 1,
    joinDate: '2023-05-15 09:00:00',
    phone: '13800138024',
    email: 'zhaomin2@example.com',
    idCard: '110101199201141234',
    birthDate: '1992-01-14',
    hometown: '大连市',
    address: '大连市中山区xxx街道xxx号',
    emergencyContact: '孙杰',
    emergencyPhone: '13900139024',
    education: '本科',
    school: '大连理工大学',
    major: '市场营销',
    workExperience: '3年市场经验',
    remark: '',
    createTime: '2023-05-15 09:00:00',
    updateTime: '2023-05-15 09:00:00'
  },
  // 销售部员工（departmentId: 9）
  {
    id: 25,
    employeeNo: 'EMP025',
    name: '孙杰',
    gender: 1,
    departmentId: 9,
    departmentName: '销售部',
    positionId: 13,
    positionName: '销售经理',
    status: 1,
    joinDate: '2023-06-01 09:00:00',
    phone: '13800138025',
    email: 'sunjie2@example.com',
    idCard: '110101198801151234',
    birthDate: '1988-01-15',
    hometown: '沈阳市',
    address: '沈阳市和平区xxx街道xxx号',
    emergencyContact: '周婷',
    emergencyPhone: '13900139025',
    education: '本科',
    school: '东北大学',
    major: '市场营销',
    workExperience: '7年销售经验',
    remark: '',
    createTime: '2023-06-01 09:00:00',
    updateTime: '2023-06-01 09:00:00'
  },
  {
    id: 26,
    employeeNo: 'EMP026',
    name: '周婷',
    gender: 2,
    departmentId: 9,
    departmentName: '销售部',
    positionId: 14,
    positionName: '销售专员',
    status: 1,
    joinDate: '2023-07-10 09:00:00',
    phone: '13800138026',
    email: 'zhouting2@example.com',
    idCard: '110101199101161234',
    birthDate: '1991-01-16',
    hometown: '哈尔滨市',
    address: '哈尔滨市南岗区xxx街道xxx号',
    emergencyContact: '吴磊',
    emergencyPhone: '13900139026',
    education: '本科',
    school: '哈尔滨工业大学',
    major: '市场营销',
    workExperience: '4年销售经验',
    remark: '',
    createTime: '2023-07-10 09:00:00',
    updateTime: '2023-07-10 09:00:00'
  },
  // 客服部员工（departmentId: 10）
  {
    id: 27,
    employeeNo: 'EMP027',
    name: '吴磊',
    gender: 1,
    departmentId: 10,
    departmentName: '客服部',
    positionId: 15,
    positionName: '客服经理',
    status: 1,
    joinDate: '2023-08-15 09:00:00',
    phone: '13800138027',
    email: 'wulei2@example.com',
    idCard: '110101198901171234',
    birthDate: '1989-01-17',
    hometown: '郑州市',
    address: '郑州市金水区xxx街道xxx号',
    emergencyContact: '郑秀',
    emergencyPhone: '13900139027',
    education: '本科',
    school: '郑州大学',
    major: '工商管理',
    workExperience: '6年客服经验',
    remark: '',
    createTime: '2023-08-15 09:00:00',
    updateTime: '2023-08-15 09:00:00'
  },
  {
    id: 28,
    employeeNo: 'EMP028',
    name: '郑秀',
    gender: 2,
    departmentId: 10,
    departmentName: '客服部',
    positionId: 16,
    positionName: '客服专员',
    status: 1,
    joinDate: '2023-09-20 09:00:00',
    phone: '13800138028',
    email: 'zhengxiu2@example.com',
    idCard: '110101199201181234',
    birthDate: '1992-01-18',
    hometown: '济南市',
    address: '济南市历下区xxx街道xxx号',
    emergencyContact: '王涛',
    emergencyPhone: '13900139028',
    education: '本科',
    school: '山东大学',
    major: '工商管理',
    workExperience: '3年客服经验',
    remark: '',
    createTime: '2023-09-20 09:00:00',
    updateTime: '2023-09-20 09:00:00'
  }
]

let nextId = 29

/**
 * 获取员工列表 Mock 函数
 */
export function getEmployeeListMock(params: EmployeeListParams) {
  const { keyword, departmentId, positionId, status, joinDateStart, joinDateEnd, page = 1, pageSize = 20 } = params
  let filteredData = [...employees]

  // 筛选
  if (keyword) {
    filteredData = filteredData.filter(item =>
      item.name.includes(keyword) || item.employeeNo.includes(keyword)
    )
  }
  if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
    const deptId = typeof departmentId === 'string' ? parseInt(departmentId) : departmentId
    filteredData = filteredData.filter(item => item.departmentId === deptId)
  }
  if (positionId !== undefined && positionId !== null && positionId !== '') {
    const posId = typeof positionId === 'string' ? parseInt(positionId) : positionId
    filteredData = filteredData.filter(item => item.positionId === posId)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (joinDateStart) {
    filteredData = filteredData.filter(item => item.joinDate >= joinDateStart)
  }
  if (joinDateEnd) {
    filteredData = filteredData.filter(item => item.joinDate <= joinDateEnd)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = filteredData.slice(start, end)

  return {
    list,
    total: filteredData.length
  }
}

/**
 * 添加员工 Mock 函数
 */
export function addEmployeeMock(data: Partial<Employee>) {
  const newEmployee: Employee = {
    id: nextId++,
    employeeNo: data.employeeNo || `EMP${String(nextId).padStart(3, '0')}`,
    name: data.name || '',
    gender: data.gender || 1,
    departmentId: data.departmentId || 0,
    departmentName: data.departmentName || '',
    positionId: data.positionId || 0,
    positionName: data.positionName || '',
    status: data.status || 1,
    joinDate: data.joinDate || new Date().toISOString().split('T')[0],
    phone: data.phone,
    email: data.email,
    idCard: data.idCard,
    birthDate: data.birthDate,
    hometown: data.hometown,
    address: data.address,
    emergencyContact: data.emergencyContact,
    emergencyPhone: data.emergencyPhone,
    education: data.education,
    school: data.school,
    major: data.major,
    workExperience: data.workExperience,
    remark: data.remark,
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  employees.push(newEmployee)
  return newEmployee
}

/**
 * 更新员工 Mock 函数
 */
export function updateEmployeeMock(data: Partial<Employee>) {
  const index = employees.findIndex(item => item.id === data.id)
  if (index !== -1) {
    employees[index] = {
      ...employees[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return employees[index]
  }
  throw new Error('员工不存在')
}

/**
 * 删除员工 Mock 函数
 */
export function deleteEmployeeMock(id: number) {
  const index = employees.findIndex(item => item.id === id)
  if (index !== -1) {
    employees.splice(index, 1)
    return true
  }
  throw new Error('员工不存在')
}

/**
 * 批量删除员工 Mock 函数
 */
export function batchDeleteEmployeesMock(ids: number[]) {
  employees = employees.filter(item => !ids.includes(item.id))
  return true
}

/**
 * 获取员工详情 Mock 函数
 */
export function getEmployeeDetailMock(id: number) {
  const employee = employees.find(item => item.id === id)
  if (employee) {
    return employee
  }
  throw new Error('员工不存在')
}

/**
 * 更新员工状态 Mock 函数
 */
export function updateEmployeeStatusMock(id: number, status: number) {
  const index = employees.findIndex(item => item.id === id)
  if (index !== -1) {
    employees[index] = {
      ...employees[index],
      status,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return employees[index]
  }
  throw new Error('员工不存在')
}
