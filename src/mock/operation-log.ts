/**
 * 操作日志 Mock 数据
 */

import type { OperationLog } from '@/types/system'
import { createCrudMock } from '@/utils/crud'

/**
 * 初始操作日志数据（20条固定数据）
 */
const initialData: OperationLog[] = [
  {
    id: '1',
    operatorName: '张三',
    operatorId: 1,
    module: '用户管理',
    operationType: '登录',
    operationContent: '用户登录系统',
    requestParams: '{"username":"zhangsan","loginType":"password"}',
    ipAddress: '192.168.1.100',
    operationTime: '2026-04-07 09:15:23',
    executionTime: 120,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '2',
    operatorName: '李四',
    operatorId: 2,
    module: '用户管理',
    operationType: '新增',
    operationContent: '新增用户：王五',
    requestParams: '{"username":"wangwu","realName":"王五","phone":"13800138005"}',
    ipAddress: '192.168.1.101',
    operationTime: '2026-04-07 09:20:15',
    executionTime: 230,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '3',
    operatorName: '张三',
    operatorId: 1,
    module: '角色管理',
    operationType: '修改',
    operationContent: '修改角色：普通员工',
    requestParams: '{"id":3,"roleName":"普通员工","menuIds":[1,2,3,4]}',
    ipAddress: '192.168.1.100',
    operationTime: '2026-04-07 09:35:42',
    executionTime: 180,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '4',
    operatorName: '李四',
    operatorId: 2,
    module: '员工管理',
    operationType: '删除',
    operationContent: '删除员工：赵六',
    requestParams: '{"id":15}',
    ipAddress: '192.168.1.101',
    operationTime: '2026-04-07 10:05:18',
    executionTime: 150,
    operationResult: 0,
    errorMessage: '该员工存在关联数据，无法删除'
  },
  {
    id: '5',
    operatorName: '王五',
    operatorId: 3,
    module: '用户管理',
    operationType: '查询',
    operationContent: '查询用户列表',
    requestParams: '{"page":1,"pageSize":20,"status":1}',
    ipAddress: '192.168.1.102',
    operationTime: '2026-04-07 10:15:30',
    executionTime: 85,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '6',
    operatorName: '张三',
    operatorId: 1,
    module: '部门管理',
    operationType: '新增',
    operationContent: '新增部门：研发中心',
    requestParams: '{"deptName":"研发中心","parentId":1,"sort":1}',
    ipAddress: '192.168.1.100',
    operationTime: '2026-04-07 10:30:45',
    executionTime: 200,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '7',
    operatorName: '李四',
    operatorId: 2,
    module: '角色管理',
    operationType: '查询',
    operationContent: '查询角色列表',
    requestParams: '{"page":1,"pageSize":20}',
    ipAddress: '192.168.1.101',
    operationTime: '2026-04-07 11:00:12',
    executionTime: 95,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '8',
    operatorName: '王五',
    operatorId: 3,
    module: '员工管理',
    operationType: '修改',
    operationContent: '修改员工信息：李四',
    requestParams: '{"id":2,"phone":"13900139002","email":"lisi@example.com"}',
    ipAddress: '192.168.1.102',
    operationTime: '2026-04-07 11:20:33',
    executionTime: 165,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '9',
    operatorName: '张三',
    operatorId: 1,
    module: '用户管理',
    operationType: '删除',
    operationContent: '删除用户：测试账号',
    requestParams: '{"id":99}',
    ipAddress: '192.168.1.100',
    operationTime: '2026-04-07 13:45:20',
    executionTime: 140,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '10',
    operatorName: '李四',
    operatorId: 2,
    module: '菜单管理',
    operationType: '新增',
    operationContent: '新增菜单：系统监控',
    requestParams: '{"menuName":"系统监控","menuType":1,"path":"/monitor"}',
    ipAddress: '192.168.1.101',
    operationTime: '2026-04-07 14:10:55',
    executionTime: 210,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '11',
    operatorName: '王五',
    operatorId: 3,
    module: '用户管理',
    operationType: '登录',
    operationContent: '用户登录系统',
    requestParams: '{"username":"wangwu","loginType":"password"}',
    ipAddress: '192.168.1.102',
    operationTime: '2026-04-07 14:30:08',
    executionTime: 110,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '12',
    operatorName: '张三',
    operatorId: 1,
    module: '角色管理',
    operationType: '删除',
    operationContent: '删除角色：临时角色',
    requestParams: '{"id":10}',
    ipAddress: '192.168.1.100',
    operationTime: '2026-04-07 15:00:42',
    executionTime: 175,
    operationResult: 0,
    errorMessage: '系统内置角色，无法删除'
  },
  {
    id: '13',
    operatorName: '李四',
    operatorId: 2,
    module: '员工管理',
    operationType: '查询',
    operationContent: '查询员工列表',
    requestParams: '{"page":1,"pageSize":20,"deptId":2}',
    ipAddress: '192.168.1.101',
    operationTime: '2026-04-07 15:25:17',
    executionTime: 90,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '14',
    operatorName: '王五',
    operatorId: 3,
    module: '部门管理',
    operationType: '修改',
    operationContent: '修改部门：技术部',
    requestParams: '{"id":2,"deptName":"技术部","sort":2}',
    ipAddress: '192.168.1.102',
    operationTime: '2026-04-07 16:10:30',
    executionTime: 195,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '15',
    operatorName: '张三',
    operatorId: 1,
    module: '用户管理',
    operationType: '修改',
    operationContent: '修改用户状态：李四',
    requestParams: '{"id":2,"status":0}',
    ipAddress: '192.168.1.100',
    operationTime: '2026-04-07 16:35:48',
    executionTime: 155,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '16',
    operatorName: '李四',
    operatorId: 2,
    module: '菜单管理',
    operationType: '修改',
    operationContent: '修改菜单：用户管理',
    requestParams: '{"id":5,"menuName":"用户管理","sort":1}',
    ipAddress: '192.168.1.101',
    operationTime: '2026-04-07 17:00:25',
    executionTime: 220,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '17',
    operatorName: '王五',
    operatorId: 3,
    module: '角色管理',
    operationType: '新增',
    operationContent: '新增角色：项目经理',
    requestParams: '{"roleName":"项目经理","roleCode":"PM","menuIds":[1,2,3,4,5]}',
    ipAddress: '192.168.1.102',
    operationTime: '2026-04-07 17:20:10',
    executionTime: 240,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '18',
    operatorName: '张三',
    operatorId: 1,
    module: '员工管理',
    operationType: '新增',
    operationContent: '新增员工：孙七',
    requestParams: '{"empName":"孙七","phone":"13700137007","deptId":2}',
    ipAddress: '192.168.1.100',
    operationTime: '2026-04-07 17:45:33',
    executionTime: 260,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '19',
    operatorName: '李四',
    operatorId: 2,
    module: '用户管理',
    operationType: '登出',
    operationContent: '用户退出系统',
    requestParams: '{}',
    ipAddress: '192.168.1.101',
    operationTime: '2026-04-07 18:00:00',
    executionTime: 50,
    operationResult: 1,
    errorMessage: ''
  },
  {
    id: '20',
    operatorName: '王五',
    operatorId: 3,
    module: '部门管理',
    operationType: '查询',
    operationContent: '查询部门树形结构',
    requestParams: '{}',
    ipAddress: '192.168.1.102',
    operationTime: '2026-04-07 18:15:42',
    executionTime: 105,
    operationResult: 1,
    errorMessage: ''
  }
]

/**
 * 创建操作日志 CRUD Mock
 */
const operationLogMock = createCrudMock<OperationLog>(initialData, {
  idField: 'id',
  searchFields: ['operatorName', 'module', 'operationType'],
  sortField: 'operationTime'
})

export default operationLogMock
