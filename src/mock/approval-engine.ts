// @ts-nocheck
import type {
  ApprovalTemplate,
  ApprovalInstance,
  ApprovalNodeRecord,
  ApprovalDelegate,
  ApprovalStatistics,
  ListParams
} from '@/types/approval-engine'

import {
  TemplateStatus,
  InstanceStatus,
  NodeStatus,
  ApprovalAction,
  DelegateScope
} from '@/types/approval-engine'

/**
 * 流程模板数据
 */
let templateData: ApprovalTemplate[] = [
  {
    id: 1,
    name: '请假审批流程',
    scope: '全公司',
    description: '员工请假审批流程，支持年假、病假、事假等',
    config: {
      nodes: [
        { id: 'start', type: 'start', name: '开始', nextNodes: ['node1'] },
        { id: 'node1', type: 'approval', name: '直属上级审批', approvers: { type: 'manager', mode: 'or' }, nextNodes: ['node2'] },
        { id: 'node2', type: 'approval', name: 'HR审批', approvers: { type: 'role', roleId: 2, mode: 'or' }, nextNodes: ['end'] },
        { id: 'end', type: 'end', name: '结束', nextNodes: [] }
      ],
      version: '1.0',
      description: '请假审批流程'
    },
    flowConfig: {
      nodes: [
        {
          id: 'node_start_1',
          type: 'circle',
          x: 300,
          y: 100,
          text: '开始',
          properties: { nodeType: 'start' }
        },
        {
          id: 'node_approval_1',
          type: 'rect',
          x: 300,
          y: 220,
          text: '直属上级审批',
          properties: {
            nodeType: 'approval',
            approverType: 'initiatorLeader',
            approvers: [],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_2',
          type: 'rect',
          x: 300,
          y: 340,
          text: 'HR审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['hr_admin'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_end_1',
          type: 'circle',
          x: 300,
          y: 460,
          text: '结束',
          properties: { nodeType: 'end' }
        }
      ],
      edges: [
        {
          id: 'edge_1',
          type: 'polyline',
          sourceNodeId: 'node_start_1',
          targetNodeId: 'node_approval_1'
        },
        {
          id: 'edge_2',
          type: 'polyline',
          sourceNodeId: 'node_approval_1',
          targetNodeId: 'node_approval_2'
        },
        {
          id: 'edge_3',
          type: 'polyline',
          sourceNodeId: 'node_approval_2',
          targetNodeId: 'node_end_1'
        }
      ]
    },
    status: 1,
    creator: '张三',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    name: '报销审批流程',
    scope: '全公司',
    description: '员工报销审批流程，支持差旅费、办公费等',
    config: {
      nodes: [
        { id: 'start', type: 'start', name: '开始', nextNodes: ['node1'] },
        { id: 'node1', type: 'approval', name: '直属上级审批', approvers: { type: 'manager', mode: 'or' }, nextNodes: ['node2'] },
        { id: 'node2', type: 'approval', name: '财务审批', approvers: { type: 'role', roleId: 3, mode: 'or' }, nextNodes: ['end'] },
        { id: 'end', type: 'end', name: '结束', nextNodes: [] }
      ],
      version: '1.0',
      description: '报销审批流程'
    },
    flowConfig: {
      nodes: [
        {
          id: 'node_start_2',
          type: 'circle',
          x: 300,
          y: 100,
          text: '开始',
          properties: { nodeType: 'start' }
        },
        {
          id: 'node_approval_21',
          type: 'rect',
          x: 300,
          y: 220,
          text: '直属上级审批',
          properties: {
            nodeType: 'approval',
            approverType: 'initiatorLeader',
            approvers: [],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_condition_1',
          type: 'diamond',
          x: 300,
          y: 340,
          text: '金额判断',
          properties: {
            nodeType: 'condition',
            conditions: [
              { field: 'amount', operator: 'gt', value: '5000' }
            ],
            conditionRelation: 'and'
          }
        },
        {
          id: 'node_approval_22',
          type: 'rect',
          x: 180,
          y: 460,
          text: '财务审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['finance_leader'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_23',
          type: 'rect',
          x: 420,
          y: 460,
          text: '总经理审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['general_manager'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_end_2',
          type: 'circle',
          x: 300,
          y: 580,
          text: '结束',
          properties: { nodeType: 'end' }
        }
      ],
      edges: [
        {
          id: 'edge_21',
          type: 'polyline',
          sourceNodeId: 'node_start_2',
          targetNodeId: 'node_approval_21'
        },
        {
          id: 'edge_22',
          type: 'polyline',
          sourceNodeId: 'node_approval_21',
          targetNodeId: 'node_condition_1'
        },
        {
          id: 'edge_23',
          type: 'polyline',
          sourceNodeId: 'node_condition_1',
          targetNodeId: 'node_approval_22',
          text: '≤5000'
        },
        {
          id: 'edge_24',
          type: 'polyline',
          sourceNodeId: 'node_condition_1',
          targetNodeId: 'node_approval_23',
          text: '>5000'
        },
        {
          id: 'edge_25',
          type: 'polyline',
          sourceNodeId: 'node_approval_22',
          targetNodeId: 'node_end_2'
        },
        {
          id: 'edge_26',
          type: 'polyline',
          sourceNodeId: 'node_approval_23',
          targetNodeId: 'node_end_2'
        }
      ]
    },
    status: 1,
    creator: '李四',
    createTime: '2024-01-16 11:00:00',
    updateTime: '2024-01-16 11:00:00'
  },
  {
    id: 3,
    name: '采购审批流程',
    scope: '全公司',
    description: '公司采购审批流程，根据金额自动路由',
    config: {
      nodes: [
        { id: 'start', type: 'start', name: '开始', nextNodes: ['node1'] },
        { id: 'node1', type: 'approval', name: '部门负责人审批', approvers: { type: 'manager', mode: 'or' }, nextNodes: ['node2'] },
        { id: 'node2', type: 'approval', name: '采购部审批', approvers: { type: 'role', roleId: 4, mode: 'or' }, nextNodes: ['node3'] },
        { id: 'node3', type: 'approval', name: '总经理审批', approvers: { type: 'user', users: ['admin'], mode: 'or' }, nextNodes: ['end'] },
        { id: 'end', type: 'end', name: '结束', nextNodes: [] }
      ],
      version: '1.0',
      description: '采购审批流程'
    },
    flowConfig: {
      nodes: [
        {
          id: 'node_start_3',
          type: 'circle',
          x: 300,
          y: 100,
          text: '开始',
          properties: { nodeType: 'start' }
        },
        {
          id: 'node_approval_31',
          type: 'rect',
          x: 300,
          y: 220,
          text: '部门负责人审批',
          properties: {
            nodeType: 'approval',
            approverType: 'deptLeader',
            approvers: [],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_32',
          type: 'rect',
          x: 300,
          y: 340,
          text: '采购部审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['dept_leader'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_33',
          type: 'rect',
          x: 300,
          y: 460,
          text: '财务审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['finance_leader'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_34',
          type: 'rect',
          x: 300,
          y: 580,
          text: '总经理审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['general_manager'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_end_3',
          type: 'circle',
          x: 300,
          y: 700,
          text: '结束',
          properties: { nodeType: 'end' }
        }
      ],
      edges: [
        {
          id: 'edge_31',
          type: 'polyline',
          sourceNodeId: 'node_start_3',
          targetNodeId: 'node_approval_31'
        },
        {
          id: 'edge_32',
          type: 'polyline',
          sourceNodeId: 'node_approval_31',
          targetNodeId: 'node_approval_32'
        },
        {
          id: 'edge_33',
          type: 'polyline',
          sourceNodeId: 'node_approval_32',
          targetNodeId: 'node_approval_33'
        },
        {
          id: 'edge_34',
          type: 'polyline',
          sourceNodeId: 'node_approval_33',
          targetNodeId: 'node_approval_34'
        },
        {
          id: 'edge_35',
          type: 'polyline',
          sourceNodeId: 'node_approval_34',
          targetNodeId: 'node_end_3'
        }
      ]
    },
    status: 1,
    creator: '王五',
    createTime: '2024-01-17 09:00:00',
    updateTime: '2024-01-17 09:00:00'
  },
  {
    id: 4,
    name: '调薪审批流程',
    scope: '全公司',
    description: '员工调薪审批流程，支持晋升调薪、年度调薪等',
    config: {
      nodes: [
        { id: 'start', type: 'start', name: '开始', nextNodes: ['node1'] },
        { id: 'node1', type: 'approval', name: '部门负责人审批', approvers: { type: 'manager', mode: 'or' }, nextNodes: ['node2'] },
        { id: 'node2', type: 'approval', name: 'HR审批', approvers: { type: 'role', roleId: 2, mode: 'or' }, nextNodes: ['node3'] },
        { id: 'node3', type: 'approval', name: '总经理审批', approvers: { type: 'user', users: ['admin'], mode: 'or' }, nextNodes: ['end'] },
        { id: 'end', type: 'end', name: '结束', nextNodes: [] }
      ],
      version: '1.0',
      description: '调薪审批流程'
    },
    flowConfig: {
      nodes: [
        {
          id: 'node_start_4',
          type: 'circle',
          x: 300,
          y: 100,
          text: '开始',
          properties: { nodeType: 'start' }
        },
        {
          id: 'node_approval_41',
          type: 'rect',
          x: 300,
          y: 220,
          text: '部门负责人审批',
          properties: {
            nodeType: 'approval',
            approverType: 'deptLeader',
            approvers: [],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_42',
          type: 'rect',
          x: 300,
          y: 340,
          text: 'HR审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['hr_admin'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_43',
          type: 'rect',
          x: 300,
          y: 460,
          text: '总经理审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['general_manager'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_end_4',
          type: 'circle',
          x: 300,
          y: 580,
          text: '结束',
          properties: { nodeType: 'end' }
        }
      ],
      edges: [
        {
          id: 'edge_41',
          type: 'polyline',
          sourceNodeId: 'node_start_4',
          targetNodeId: 'node_approval_41'
        },
        {
          id: 'edge_42',
          type: 'polyline',
          sourceNodeId: 'node_approval_41',
          targetNodeId: 'node_approval_42'
        },
        {
          id: 'edge_43',
          type: 'polyline',
          sourceNodeId: 'node_approval_42',
          targetNodeId: 'node_approval_43'
        },
        {
          id: 'edge_44',
          type: 'polyline',
          sourceNodeId: 'node_approval_43',
          targetNodeId: 'node_end_4'
        }
      ]
    },
    status: 0,
    creator: '赵六',
    createTime: '2024-01-18 14:00:00',
    updateTime: '2024-01-18 14:00:00'
  },
  {
    id: 5,
    name: '招聘审批流程',
    scope: '指定部门',
    description: '招聘需求审批流程',
    config: {
      nodes: [
        { id: 'start', type: 'start', name: '开始', nextNodes: ['node1'] },
        { id: 'node1', type: 'approval', name: '部门负责人审批', approvers: { type: 'manager', mode: 'or' }, nextNodes: ['node2'] },
        { id: 'node2', type: 'approval', name: 'HR审批', approvers: { type: 'role', roleId: 2, mode: 'or' }, nextNodes: ['end'] },
        { id: 'end', type: 'end', name: '结束', nextNodes: [] }
      ],
      version: '1.0',
      description: '招聘审批流程'
    },
    flowConfig: {
      nodes: [
        {
          id: 'node_start_5',
          type: 'circle',
          x: 300,
          y: 100,
          text: '开始',
          properties: { nodeType: 'start' }
        },
        {
          id: 'node_approval_51',
          type: 'rect',
          x: 300,
          y: 220,
          text: '部门负责人审批',
          properties: {
            nodeType: 'approval',
            approverType: 'deptLeader',
            approvers: [],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_approval_52',
          type: 'rect',
          x: 300,
          y: 340,
          text: 'HR审批',
          properties: {
            nodeType: 'approval',
            approverType: 'role',
            approvers: ['hr_admin'],
            approvalMode: 'or'
          }
        },
        {
          id: 'node_end_5',
          type: 'circle',
          x: 300,
          y: 460,
          text: '结束',
          properties: { nodeType: 'end' }
        }
      ],
      edges: [
        {
          id: 'edge_51',
          type: 'polyline',
          sourceNodeId: 'node_start_5',
          targetNodeId: 'node_approval_51'
        },
        {
          id: 'edge_52',
          type: 'polyline',
          sourceNodeId: 'node_approval_51',
          targetNodeId: 'node_approval_52'
        },
        {
          id: 'edge_53',
          type: 'polyline',
          sourceNodeId: 'node_approval_52',
          targetNodeId: 'node_end_5'
        }
      ]
    },
    status: 2,
    creator: '孙七',
    createTime: '2024-01-10 08:00:00',
    updateTime: '2024-01-20 16:00:00'
  }
]

let nextTemplateId = 6

/**
 * 审批实例数据
 */
let instanceData: ApprovalInstance[] = [
  // 请假审批 - 待审批
  {
    id: 1,
    code: 'AP202401150001',
    type: '请假审批',
    title: '张三的年假申请',
    templateName: '请假审批流程',
    applicant: '张三',
    currentNode: '直属上级审批',
    initiator: '张三',
    initiateTime: '2024-03-01 09:00:00',
    applyTime: '2024-03-01 09:00:00',
    finishTime: '',
    formData: { leaveType: '年假', startDate: '2024-03-10', endDate: '2024-03-12', days: 3, reason: '家庭旅游' },
    attachments: [],
    templateId: 1,
    status: 0
  },
  // 请假审批 - 审批中
  {
    id: 2,
    code: 'AP202401150002',
    type: '请假审批',
    title: '李四的病假申请',
    templateName: '请假审批流程',
    applicant: '李四',
    currentNode: 'HR审批',
    initiator: '李四',
    initiateTime: '2024-02-28 10:30:00',
    applyTime: '2024-02-28 10:30:00',
    finishTime: '',
    formData: { leaveType: '病假', startDate: '2024-03-01', endDate: '2024-03-03', days: 3, reason: '感冒发烧' },
    attachments: ['病假条.pdf'],
    templateId: 1,
    status: 1
  },
  // 请假审批 - 已通过
  {
    id: 3,
    code: 'AP202401150003',
    type: '请假审批',
    title: '王五的事假申请',
    templateName: '请假审批流程',
    applicant: '王五',
    currentNode: '结束',
    initiator: '王五',
    initiateTime: '2024-02-25 14:00:00',
    applyTime: '2024-02-25 14:00:00',
    finishTime: '2024-02-26 16:00:00',
    formData: { leaveType: '事假', startDate: '2024-02-28', endDate: '2024-02-28', days: 1, reason: '处理个人事务' },
    attachments: [],
    templateId: 1,
    status: 2
  },
  // 请假审批 - 已驳回
  {
    id: 4,
    code: 'AP202401150004',
    type: '请假审批',
    title: '赵六的年假申请',
    templateName: '请假审批流程',
    applicant: '赵六',
    currentNode: '直属上级审批',
    initiator: '赵六',
    initiateTime: '2024-02-20 11:00:00',
    applyTime: '2024-02-20 11:00:00',
    finishTime: '2024-02-21 09:00:00',
    formData: { leaveType: '年假', startDate: '2024-03-15', endDate: '2024-03-20', days: 6, reason: '出国旅游' },
    attachments: [],
    templateId: 1,
    status: 3
  },
  // 请假审批 - 已撤回
  {
    id: 5,
    code: 'AP202401150005',
    type: '请假审批',
    title: '孙七的病假申请',
    templateName: '请假审批流程',
    applicant: '孙七',
    currentNode: '直属上级审批',
    initiator: '孙七',
    initiateTime: '2024-02-18 15:30:00',
    applyTime: '2024-02-18 15:30:00',
    finishTime: '',
    formData: { leaveType: '病假', startDate: '2024-02-20', endDate: '2024-02-21', days: 2, reason: '身体不适' },
    attachments: [],
    templateId: 1,
    status: 4
  },
  // 报销审批 - 待审批
  {
    id: 6,
    code: 'AP202401160001',
    type: '报销审批',
    title: '张三的差旅费报销',
    templateName: '报销审批流程',
    applicant: '张三',
    currentNode: '直属上级审批',
    initiator: '张三',
    initiateTime: '2024-03-02 10:00:00',
    applyTime: '2024-03-02 10:00:00',
    finishTime: '',
    formData: { type: '差旅费', amount: 3500, items: [{ name: '机票', amount: 2000 }, { name: '住宿', amount: 1500 }] },
    attachments: ['发票1.pdf', '发票2.pdf'],
    templateId: 2,
    status: 0
  },
  // 报销审批 - 审批中
  {
    id: 7,
    code: 'AP202401160002',
    type: '报销审批',
    title: '李四的办公费报销',
    templateName: '报销审批流程',
    applicant: '李四',
    currentNode: '财务审批',
    initiator: '李四',
    initiateTime: '2024-03-01 11:30:00',
    applyTime: '2024-03-01 11:30:00',
    finishTime: '',
    formData: { type: '办公费', amount: 800, items: [{ name: '办公用品', amount: 800 }] },
    attachments: ['发票.pdf'],
    templateId: 2,
    status: 1
  },
  // 报销审批 - 已通过
  {
    id: 8,
    code: 'AP202401160003',
    type: '报销审批',
    title: '王五的交通费报销',
    templateName: '报销审批流程',
    applicant: '王五',
    currentNode: '结束',
    initiator: '王五',
    initiateTime: '2024-02-27 09:00:00',
    applyTime: '2024-02-27 09:00:00',
    finishTime: '2024-02-28 15:00:00',
    formData: { type: '交通费', amount: 500, items: [{ name: '打车费', amount: 500 }] },
    attachments: ['发票.pdf'],
    templateId: 2,
    status: 2
  },
  // 报销审批 - 已驳回
  {
    id: 9,
    code: 'AP202401160004',
    type: '报销审批',
    title: '赵六的餐费报销',
    templateName: '报销审批流程',
    applicant: '赵六',
    currentNode: '直属上级审批',
    initiator: '赵六',
    initiateTime: '2024-02-26 14:00:00',
    applyTime: '2024-02-26 14:00:00',
    finishTime: '2024-02-27 10:00:00',
    formData: { type: '餐费', amount: 1200, items: [{ name: '客户招待', amount: 1200 }] },
    attachments: [],
    templateId: 2,
    status: 3
  },
  // 报销审批 - 已撤回
  {
    id: 10,
    code: 'AP202401160005',
    type: '报销审批',
    title: '孙七的通讯费报销',
    templateName: '报销审批流程',
    applicant: '孙七',
    currentNode: '直属上级审批',
    initiator: '孙七',
    initiateTime: '2024-02-25 16:00:00',
    applyTime: '2024-02-25 16:00:00',
    finishTime: '',
    formData: { type: '通讯费', amount: 200, items: [{ name: '手机话费', amount: 200 }] },
    attachments: [],
    templateId: 2,
    status: 4
  },
  // 采购审批 - 待审批
  {
    id: 11,
    code: 'AP202401170001',
    type: '采购审批',
    title: '办公设备采购申请',
    templateName: '采购审批流程',
    applicant: '张三',
    currentNode: '部门负责人审批',
    initiator: '张三',
    initiateTime: '2024-03-03 10:00:00',
    applyTime: '2024-03-03 10:00:00',
    finishTime: '',
    formData: { items: [{ name: '笔记本电脑', quantity: 5, price: 6000, total: 30000 }], totalAmount: 30000 },
    attachments: ['报价单.pdf'],
    templateId: 3,
    status: 0
  },
  // 采购审批 - 审批中
  {
    id: 12,
    code: 'AP202401170002',
    type: '采购审批',
    title: '办公用品采购申请',
    templateName: '采购审批流程',
    applicant: '李四',
    currentNode: '采购部审批',
    initiator: '李四',
    initiateTime: '2024-03-02 11:00:00',
    applyTime: '2024-03-02 11:00:00',
    finishTime: '',
    formData: { items: [{ name: '打印纸', quantity: 100, price: 30, total: 3000 }], totalAmount: 3000 },
    attachments: [],
    templateId: 3,
    status: 1
  },
  // 采购审批 - 已通过
  {
    id: 13,
    code: 'AP202401170003',
    type: '采购审批',
    title: '办公家具采购申请',
    templateName: '采购审批流程',
    applicant: '王五',
    currentNode: '结束',
    initiator: '王五',
    initiateTime: '2024-02-28 09:30:00',
    applyTime: '2024-02-28 09:30:00',
    finishTime: '2024-03-01 16:00:00',
    formData: { items: [{ name: '办公桌椅', quantity: 10, price: 800, total: 8000 }], totalAmount: 8000 },
    attachments: ['报价单.pdf'],
    templateId: 3,
    status: 2
  },
  // 调薪审批 - 待审批
  {
    id: 14,
    code: 'AP202401180001',
    type: '调薪审批',
    title: '张三的晋升调薪申请',
    templateName: '调薪审批流程',
    applicant: 'HR',
    currentNode: '部门负责人审批',
    initiator: 'HR',
    initiateTime: '2024-03-04 10:00:00',
    applyTime: '2024-03-04 10:00:00',
    finishTime: '',
    formData: { employee: '张三', currentSalary: 15000, newSalary: 18000, reason: '晋升为高级工程师', effectiveDate: '2024-04-01' },
    attachments: [],
    templateId: 4,
    status: 0
  },
  // 调薪审批 - 审批中
  {
    id: 15,
    code: 'AP202401180002',
    type: '调薪审批',
    title: '李四的年度调薪申请',
    templateName: '调薪审批流程',
    applicant: 'HR',
    currentNode: 'HR审批',
    initiator: 'HR',
    initiateTime: '2024-03-03 11:00:00',
    applyTime: '2024-03-03 11:00:00',
    finishTime: '',
    formData: { employee: '李四', currentSalary: 12000, newSalary: 13000, reason: '年度调薪', effectiveDate: '2024-04-01' },
    attachments: [],
    templateId: 4,
    status: 1
  }
]

let nextInstanceId = 16

/**
 * 审批节点记录数据
 */
let nodeRecordData: ApprovalNodeRecord[] = [
  // 实例1的节点记录（待审批）
  { id: 1, instanceId: 1, nodeId: 'node1', nodeName: '直属上级审批', approver: '李经理', status: 0 },

  // 实例2的节点记录（审批中）
  { id: 2, instanceId: 2, nodeId: 'node1', nodeName: '直属上级审批', approver: '王经理', approveTime: '2024-02-28 15:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 3, instanceId: 2, nodeId: 'node2', nodeName: 'HR审批', approver: 'HR张', status: 0 },

  // 实例3的节点记录（已通过）
  { id: 4, instanceId: 3, nodeId: 'node1', nodeName: '直属上级审批', approver: '赵经理', approveTime: '2024-02-25 16:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 5, instanceId: 3, nodeId: 'node2', nodeName: 'HR审批', approver: 'HR李', approveTime: '2024-02-26 16:00:00', opinion: '同意', action: 1, status: 1 },

  // 实例4的节点记录（已驳回）
  { id: 6, instanceId: 4, nodeId: 'node1', nodeName: '直属上级审批', approver: '孙经理', approveTime: '2024-02-21 09:00:00', opinion: '当前工作繁忙，不建议请假', action: 2, status: 2 },

  // 实例5的节点记录（已撤回）
  { id: 7, instanceId: 5, nodeId: 'node1', nodeName: '直属上级审批', approver: '周经理', status: 0 },

  // 实例6的节点记录（待审批）
  { id: 8, instanceId: 6, nodeId: 'node1', nodeName: '直属上级审批', approver: '李经理', status: 0 },

  // 实例7的节点记录（审批中）
  { id: 9, instanceId: 7, nodeId: 'node1', nodeName: '直属上级审批', approver: '王经理', approveTime: '2024-03-01 14:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 10, instanceId: 7, nodeId: 'node2', nodeName: '财务审批', approver: '财务张', status: 0 },

  // 实例8的节点记录（已通过）
  { id: 11, instanceId: 8, nodeId: 'node1', nodeName: '直属上级审批', approver: '赵经理', approveTime: '2024-02-27 11:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 12, instanceId: 8, nodeId: 'node2', nodeName: '财务审批', approver: '财务李', approveTime: '2024-02-28 15:00:00', opinion: '同意', action: 1, status: 1 },

  // 实例9的节点记录（已驳回）
  { id: 13, instanceId: 9, nodeId: 'node1', nodeName: '直属上级审批', approver: '孙经理', approveTime: '2024-02-27 10:00:00', opinion: '缺少发票', action: 2, status: 2 },

  // 实例10的节点记录（已撤回）
  { id: 14, instanceId: 10, nodeId: 'node1', nodeName: '直属上级审批', approver: '周经理', status: 0 },

  // 实例11的节点记录（待审批）
  { id: 15, instanceId: 11, nodeId: 'node1', nodeName: '部门负责人审批', approver: '李经理', status: 0 },

  // 实例12的节点记录（审批中）
  { id: 16, instanceId: 12, nodeId: 'node1', nodeName: '部门负责人审批', approver: '王经理', approveTime: '2024-03-02 14:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 17, instanceId: 12, nodeId: 'node2', nodeName: '采购部审批', approver: '采购张', status: 0 },

  // 实例13的节点记录（已通过）
  { id: 18, instanceId: 13, nodeId: 'node1', nodeName: '部门负责人审批', approver: '赵经理', approveTime: '2024-02-28 11:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 19, instanceId: 13, nodeId: 'node2', nodeName: '采购部审批', approver: '采购李', approveTime: '2024-02-29 10:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 20, instanceId: 13, nodeId: 'node3', nodeName: '总经理审批', approver: 'admin', approveTime: '2024-03-01 16:00:00', opinion: '同意', action: 1, status: 1 },

  // 实例14的节点记录（待审批）
  { id: 21, instanceId: 14, nodeId: 'node1', nodeName: '部门负责人审批', approver: '李经理', status: 0 },

  // 实例15的节点记录（审批中）
  { id: 22, instanceId: 15, nodeId: 'node1', nodeName: '部门负责人审批', approver: '王经理', approveTime: '2024-03-03 14:00:00', opinion: '同意', action: 1, status: 1 },
  { id: 23, instanceId: 15, nodeId: 'node2', nodeName: 'HR审批', approver: 'HR张', status: 0 }
]

let nextNodeRecordId = 24

/**
 * 代理设置数据
 */
let delegateData: ApprovalDelegate[] = [
  {
    id: 1,
    delegator: '张三',
    delegate: '李四',
    startTime: '2024-03-01 00:00:00',
    endTime: '2024-03-15 23:59:59',
    scope: 1,
    types: [],
    status: 1,
    createTime: '2024-02-28 10:00:00'
  },
  {
    id: 2,
    delegator: '王五',
    delegate: '赵六',
    startTime: '2024-03-10 00:00:00',
    endTime: '2024-03-20 23:59:59',
    scope: 2,
    types: ['请假审批', '报销审批'],
    status: 1,
    createTime: '2024-03-09 15:00:00'
  },
  {
    id: 3,
    delegator: '孙七',
    delegate: '周八',
    startTime: '2024-02-01 00:00:00',
    endTime: '2024-02-29 23:59:59',
    scope: 1,
    types: [],
    status: 0,
    createTime: '2024-01-30 09:00:00'
  },
  {
    id: 4,
    delegator: '李四',
    delegate: '张三',
    startTime: '2024-04-01 00:00:00',
    endTime: '2024-04-10 23:59:59',
    scope: 2,
    types: ['采购审批'],
    status: 1,
    createTime: '2024-03-28 11:00:00'
  },
  {
    id: 5,
    delegator: '赵六',
    delegate: '王五',
    startTime: '2024-01-15 00:00:00',
    endTime: '2024-01-31 23:59:59',
    scope: 1,
    types: [],
    status: 0,
    createTime: '2024-01-14 14:00:00'
  }
]

let nextDelegateId = 6

/**
 * 获取模板列表 Mock
 */
export function getTemplateListMock(params: ListParams) {
  const { name, status, page = 1, pageSize = 20 } = params
  let filteredData = [...templateData]

  // 筛选
  if (name) {
    filteredData = filteredData.filter(item => item.name.includes(name))
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }

  // 排序（按创建时间倒序）
  filteredData.sort((a, b) => b.createTime.localeCompare(a.createTime))

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
 * 添加模板 Mock
 */
export function addTemplateMock(data: Partial<ApprovalTemplate>) {
  const newTemplate: ApprovalTemplate = {
    id: nextTemplateId++,
    name: data.name || '',
    scope: data.scope || '全公司',
    description: data.description || '',
    config: data.config || { nodes: [], version: '1.0', description: '' },
    status: data.status || 0,
    creator: data.creator || '系统管理员',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  templateData.push(newTemplate)
  return newTemplate
}

/**
 * 获取模板详情 Mock
 */
export function getTemplateDetailMock(id: number) {
  const template = templateData.find(item => item.id === id)
  if (!template) {
    throw new Error('模板不存在')
  }
  return template
}

/**
 * 更新模板 Mock
 */
export function updateTemplateMock(data: Partial<ApprovalTemplate>) {
  const index = templateData.findIndex(item => item.id === data.id)
  if (index !== -1) {
    templateData[index] = {
      ...templateData[index],
      ...data,
      updateTime: new Date().toLocaleString('zh-CN')
    }
    return templateData[index]
  }
  throw new Error('模板不存在')
}

/**
 * 删除模板 Mock
 */
export function deleteTemplateMock(id: number) {
  const index = templateData.findIndex(item => item.id === id)
  if (index !== -1) {
    templateData.splice(index, 1)
    return true
  }
  throw new Error('模板不存在')
}

/**
 * 复制模板 Mock
 */
export function copyTemplateMock(id: number) {
  const template = templateData.find(item => item.id === id)
  if (!template) {
    throw new Error('模板不存在')
  }

  const newTemplate: ApprovalTemplate = {
    id: nextTemplateId++,
    name: `${template.name}（副本）`,
    scope: template.scope,
    description: template.description,
    config: JSON.parse(JSON.stringify(template.config)),
    status: 0,
    creator: '系统管理员',
    createTime: new Date().toLocaleString('zh-CN'),
    updateTime: new Date().toLocaleString('zh-CN')
  }
  templateData.push(newTemplate)
  return newTemplate
}

/**
 * 切换模板状态 Mock
 */
export function toggleTemplateStatusMock(id: number, status: TemplateStatus) {
  const index = templateData.findIndex(item => item.id === id)
  if (index !== -1) {
    templateData[index].status = status
    templateData[index].updateTime = new Date().toLocaleString('zh-CN')
    return templateData[index]
  }
  throw new Error('模板不存在')
}

/**
 * 获取实例列表 Mock
 */
export function getInstanceListMock(params: ListParams) {
  const { type, status, initiator, startTime, endTime, page = 1, pageSize = 20 } = params
  let filteredData = [...instanceData]

  // 筛选
  if (type) {
    filteredData = filteredData.filter(item => item.type === type)
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }
  if (initiator) {
    filteredData = filteredData.filter(item => item.initiator.includes(initiator))
  }
  if (startTime) {
    filteredData = filteredData.filter(item => item.initiateTime >= startTime)
  }
  if (endTime) {
    filteredData = filteredData.filter(item => item.initiateTime <= endTime)
  }

  // 排序（按发起时间倒序）
  filteredData.sort((a, b) => b.initiateTime.localeCompare(a.initiateTime))

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
 * 创建实例 Mock
 */
export function createInstanceMock(data: Partial<ApprovalInstance>) {
  const template = templateData.find(item => item.id === data.templateId)
  if (!template) {
    throw new Error('流程模板不存在')
  }

  const newInstance: ApprovalInstance = {
    id: nextInstanceId++,
    code: `AP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(nextInstanceId).padStart(4, '0')}`,
    type: data.type || template.name,
    title: data.title || '',
    initiator: data.initiator || '当前用户',
    initiateTime: new Date().toLocaleString('zh-CN'),
    formData: data.formData || {},
    attachments: data.attachments || [],
    templateId: data.templateId!,
    currentNode: 'node1',
    status: 0
  }
  instanceData.unshift(newInstance)

  // 创建第一个节点记录
  const firstNode = template.config.nodes.find((n: any) => n.id === 'node1')
  if (firstNode) {
    const newNodeRecord: ApprovalNodeRecord = {
      id: nextNodeRecordId++,
      instanceId: newInstance.id,
      nodeId: firstNode.id,
      nodeName: firstNode.name,
      approver: '待分配',
      status: 0
    }
    nodeRecordData.push(newNodeRecord)
  }

  return newInstance
}

/**
 * 获取实例详情 Mock
 */
export function getInstanceDetailMock(id: number) {
  const instance = instanceData.find(item => item.id === id)
  if (!instance) {
    throw new Error('实例不存在')
  }

  // 获取该实例的所有节点记录
  const nodeRecords = nodeRecordData.filter(item => item.instanceId === id)

  return {
    instance,
    records: nodeRecords
  }
}

/**
 * 撤回实例 Mock
 */
export function withdrawInstanceMock(id: number) {
  const index = instanceData.findIndex(item => item.id === id)
  if (index !== -1) {
    if (instanceData[index].status !== 0 && instanceData[index].status !== 1) {
      throw new Error('只能撤回待审批或审批中的实例')
    }
    instanceData[index].status = 4
    return instanceData[index]
  }
  throw new Error('实例不存在')
}

/**
 * 催办实例 Mock
 */
export function urgeInstanceMock(id: number) {
  const instance = instanceData.find(item => item.id === id)
  if (!instance) {
    throw new Error('实例不存在')
  }
  if (instance.status !== 0 && instance.status !== 1) {
    throw new Error('只能催办待审批或审批中的实例')
  }
  return true
}

/**
 * 获取待办列表 Mock
 */
export function getTodoListMock(params: ListParams) {
  const { type, status, page = 1, pageSize = 20 } = params

  // 从节点记录中筛选待审批的记录
  let filteredData = nodeRecordData.filter(item => item.status === 0)

  // 关联实例信息
  const todoList = filteredData.map(record => {
    const instance = instanceData.find(item => item.id === record.instanceId)
    return {
      id: record.id,
      instanceId: record.instanceId,
      instanceCode: instance?.code || '',
      instanceTitle: instance?.title || '',
      instanceType: instance?.type || '',
      nodeId: record.nodeId,
      nodeName: record.nodeName,
      approver: record.approver,
      initiator: instance?.initiator || '',
      initiateTime: instance?.initiateTime || '',
      status: record.status
    }
  })

  // 筛选
  let result = [...todoList]
  if (type) {
    result = result.filter(item => item.instanceType === type)
  }

  // 排序（按发起时间倒序）
  result.sort((a, b) => b.initiateTime.localeCompare(a.initiateTime))

  // 分页
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = result.slice(start, end)

  return {
    list,
    total: result.length
  }
}

/**
 * 处理审批 Mock
 */
export function processApprovalMock(data: { id: number; action: ApprovalAction; opinion?: string }) {
  const nodeRecord = nodeRecordData.find(item => item.id === data.id)
  if (!nodeRecord) {
    throw new Error('审批节点不存在')
  }

  const instance = instanceData.find(item => item.id === nodeRecord.instanceId)
  if (!instance) {
    throw new Error('审批实例不存在')
  }

  // 更新节点记录
  nodeRecord.action = data.action
  nodeRecord.opinion = data.opinion || ''
  nodeRecord.approveTime = new Date().toLocaleString('zh-CN')

  if (data.action === ApprovalAction.APPROVE) {
    nodeRecord.status = NodeStatus.APPROVED

    // 查找下一个节点
    const template = templateData.find(item => item.id === instance.templateId)
    if (template) {
      const currentNode = template.config.nodes.find((n: any) => n.id === nodeRecord.nodeId)
      if (currentNode && currentNode.nextNodes && currentNode.nextNodes.length > 0) {
        const nextNodeId = currentNode.nextNodes[0]
        const nextNode = template.config.nodes.find((n: any) => n.id === nextNodeId)

        if (nextNode && nextNode.type === 'end') {
          // 流程结束
          instance.status = InstanceStatus.APPROVED
          instance.currentNode = 'end'
          instance.finishTime = new Date().toLocaleString('zh-CN')
        } else if (nextNode) {
          // 创建下一个节点记录
          instance.status = InstanceStatus.IN_PROGRESS
          instance.currentNode = nextNodeId

          const newNodeRecord: ApprovalNodeRecord = {
            id: nextNodeRecordId++,
            instanceId: instance.id,
            nodeId: nextNodeId,
            nodeName: nextNode.name,
            approver: '待分配',
            status: NodeStatus.PENDING
          }
          nodeRecordData.push(newNodeRecord)
        }
      }
    }
  } else if (data.action === ApprovalAction.REJECT) {
    nodeRecord.status = NodeStatus.REJECTED
    instance.status = InstanceStatus.REJECTED
    instance.completeTime = new Date().toLocaleString('zh-CN')
  }

  return {
    nodeRecord,
    instance
  }
}

/**
 * 批量处理 Mock
 */
export function batchProcessMock(data: { ids: number[]; action: ApprovalAction; opinion?: string }) {
  const results = data.ids.map(id => {
    try {
      return processApprovalMock({ id, action: data.action, opinion: data.opinion })
    } catch (error: any) {
      return { error: error.message }
    }
  })
  return results
}

/**
 * 获取代理列表 Mock
 */
export function getDelegateListMock(params: ListParams) {
  const { delegator, delegate, status, page = 1, pageSize = 20 } = params
  let filteredData = [...delegateData]

  // 筛选
  if (delegator) {
    filteredData = filteredData.filter(item => item.delegator.includes(delegator))
  }
  if (delegate) {
    filteredData = filteredData.filter(item => item.delegate.includes(delegate))
  }
  if (status !== undefined && status !== null && status !== '') {
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    filteredData = filteredData.filter(item => item.status === statusValue)
  }

  // 排序（按创建时间倒序）
  filteredData.sort((a, b) => b.createTime.localeCompare(a.createTime))

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
 * 添加代理 Mock
 */
export function addDelegateMock(data: Partial<ApprovalDelegate>) {
  const newDelegate: ApprovalDelegate = {
    id: nextDelegateId++,
    delegator: data.delegator || '',
    delegate: data.delegate || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    scope: data.scope || DelegateScope.ALL,
    types: data.types || [],
    status: data.status || 1,
    createTime: new Date().toLocaleString('zh-CN')
  }
  delegateData.push(newDelegate)
  return newDelegate
}

/**
 * 更新代理 Mock
 */
export function updateDelegateMock(data: Partial<ApprovalDelegate>) {
  const index = delegateData.findIndex(item => item.id === data.id)
  if (index !== -1) {
    delegateData[index] = {
      ...delegateData[index],
      ...data
    }
    return delegateData[index]
  }
  throw new Error('代理设置不存在')
}

/**
 * 删除代理 Mock
 */
export function deleteDelegateMock(id: number) {
  const index = delegateData.findIndex(item => item.id === id)
  if (index !== -1) {
    delegateData.splice(index, 1)
    return true
  }
  throw new Error('代理设置不存在')
}

/**
 * 切换代理状态 Mock
 */
export function toggleDelegateStatusMock(id: number, status: number) {
  const index = delegateData.findIndex(item => item.id === id)
  if (index !== -1) {
    delegateData[index].status = status
    return delegateData[index]
  }
  throw new Error('代理设置不存在')
}

/**
 * 获取统计数据 Mock
 */
export function getStatisticsMock() {
  const totalCount = instanceData.length
  const approvedCount = instanceData.filter(item => item.status === InstanceStatus.APPROVED).length
  const rejectedCount = instanceData.filter(item => item.status === InstanceStatus.REJECTED).length
  const pendingCount = instanceData.filter(item => item.status === InstanceStatus.PENDING || item.status === InstanceStatus.IN_PROGRESS).length
  const approvalRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0

  const completedInstances = instanceData.filter(item => item.finishTime && item.finishTime !== '')
  let avgDuration = 0
  if (completedInstances.length > 0) {
    const totalDuration = completedInstances.reduce((sum, item) => {
      const start = new Date(item.initiateTime).getTime()
      const end = new Date(item.finishTime!).getTime()
      return sum + (end - start)
    }, 0)
    avgDuration = Math.round(totalDuration / completedInstances.length / (1000 * 60 * 60))
  }

  const statistics: ApprovalStatistics = {
    totalCount,
    approvedCount,
    rejectedCount,
    pendingCount,
    approvalRate,
    avgDuration
  }

  return statistics
}

/**
 * 获取类型分布 Mock
 */
export function getTypeDistributionMock() {
  const typeMap = new Map<string, number>()

  instanceData.forEach(item => {
    const count = typeMap.get(item.type) || 0
    typeMap.set(item.type, count + 1)
  })

  const distribution = Array.from(typeMap.entries()).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / instanceData.length) * 100)
  }))

  return distribution
}

/**
 * 获取审批人效率 Mock
 */
export function getApproverEfficiencyMock() {
  const approverMap = new Map<string, { total: number; approved: number; rejected: number; avgTime: number }>()

  nodeRecordData.forEach(record => {
    if (record.status !== NodeStatus.PENDING && record.approveTime) {
      const stats = approverMap.get(record.approver) || { total: 0, approved: 0, rejected: 0, avgTime: 0 }
      stats.total++

      if (record.status === NodeStatus.APPROVED) {
        stats.approved++
      } else if (record.status === NodeStatus.REJECTED) {
        stats.rejected++
      }

      approverMap.set(record.approver, stats)
    }
  })

  const efficiency = Array.from(approverMap.entries()).map(([approver, stats]) => ({
    approver,
    total: stats.total,
    approved: stats.approved,
    rejected: stats.rejected,
    approvalRate: Math.round((stats.approved / stats.total) * 100)
  }))

  return efficiency
}

/**
 * 获取时效分析 Mock
 */
export function getTimeEfficiencyMock() {
  const completedInstances = instanceData.filter(item => item.finishTime && item.finishTime !== '')

  const timeRanges = {
    within24h: 0,
    within3days: 0,
    within7days: 0,
    over7days: 0
  }

  completedInstances.forEach(item => {
    const start = new Date(item.initiateTime).getTime()
    const end = new Date(item.finishTime!).getTime()
    const hours = (end - start) / (1000 * 60 * 60)

    if (hours <= 24) {
      timeRanges.within24h++
    } else if (hours <= 72) {
      timeRanges.within3days++
    } else if (hours <= 168) {
      timeRanges.within7days++
    } else {
      timeRanges.over7days++
    }
  })

  return [
    { range: '24小时内', count: timeRanges.within24h },
    { range: '3天内', count: timeRanges.within3days },
    { range: '7天内', count: timeRanges.within7days },
    { range: '7天以上', count: timeRanges.over7days }
  ]
}
