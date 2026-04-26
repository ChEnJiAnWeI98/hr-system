/**
 * 组织架构图 Mock 数据
 */
import type { OrgChartNode } from '@/types/org-chart'

/**
 * 组织架构树数据
 */
const orgChartTree: OrgChartNode = {
  id: 1,
  name: '集团总部',
  leaderName: '张三',
  headcount: 500,
  currentCount: 480,
  parentId: null,
  children: [
    {
      id: 2,
      name: '技术研发中心',
      leaderName: '李四',
      headcount: 150,
      currentCount: 145,
      parentId: 1,
      children: [
        {
          id: 5,
          name: '前端开发部',
          leaderName: '王五',
          headcount: 50,
          currentCount: 48,
          parentId: 2,
          children: [
            {
              id: 11,
              name: 'Web前端组',
              leaderName: '赵六',
              headcount: 25,
              currentCount: 24,
              parentId: 5,
              children: []
            },
            {
              id: 12,
              name: '移动端开发组',
              leaderName: '钱七',
              headcount: 25,
              currentCount: 24,
              parentId: 5,
              children: []
            }
          ]
        },
        {
          id: 6,
          name: '后端开发部',
          leaderName: '孙八',
          headcount: 60,
          currentCount: 58,
          parentId: 2,
          children: [
            {
              id: 13,
              name: 'Java开发组',
              leaderName: '周九',
              headcount: 35,
              currentCount: 34,
              parentId: 6,
              children: []
            },
            {
              id: 14,
              name: 'Python开发组',
              leaderName: '吴十',
              headcount: 25,
              currentCount: 24,
              parentId: 6,
              children: []
            }
          ]
        },
        {
          id: 7,
          name: '测试部',
          leaderName: '郑十一',
          headcount: 40,
          currentCount: 39,
          parentId: 2,
          children: []
        }
      ]
    },
    {
      id: 3,
      name: '市场营销中心',
      leaderName: '陈十二',
      headcount: 120,
      currentCount: 115,
      parentId: 1,
      children: [
        {
          id: 8,
          name: '市场推广部',
          leaderName: '刘十三',
          headcount: 50,
          currentCount: 48,
          parentId: 3,
          children: []
        },
        {
          id: 9,
          name: '销售部',
          leaderName: '黄十四',
          headcount: 70,
          currentCount: 67,
          parentId: 3,
          children: [
            {
              id: 15,
              name: '华东销售组',
              leaderName: '林十五',
              headcount: 25,
              currentCount: 24,
              parentId: 9,
              children: []
            },
            {
              id: 16,
              name: '华南销售组',
              leaderName: '杨十六',
              headcount: 25,
              currentCount: 23,
              parentId: 9,
              children: []
            },
            {
              id: 17,
              name: '华北销售组',
              leaderName: '朱十七',
              headcount: 20,
              currentCount: 20,
              parentId: 9,
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: '综合管理中心',
      leaderName: '何十八',
      headcount: 80,
      currentCount: 78,
      parentId: 1,
      children: [
        {
          id: 10,
          name: '人力资源部',
          leaderName: '徐十九',
          headcount: 30,
          currentCount: 29,
          parentId: 4,
          children: []
        },
        {
          id: 18,
          name: '财务部',
          leaderName: '高二十',
          headcount: 25,
          currentCount: 24,
          parentId: 4,
          children: []
        },
        {
          id: 19,
          name: '行政部',
          leaderName: '马二十一',
          headcount: 25,
          currentCount: 25,
          parentId: 4,
          children: []
        }
      ]
    }
  ]
}

/**
 * 获取组织架构树 Mock 函数
 */
export function getOrgChartTreeMock() {
  return {
    tree: orgChartTree
  }
}
