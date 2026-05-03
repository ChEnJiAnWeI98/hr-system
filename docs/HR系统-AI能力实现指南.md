# AI 能力实现指南

> **本文档用途**：5 个嵌入式 AI 能力（meeting_agenda / risk_alert / comment_polish / resume_parse / salary_sanity_check）接入真实 LLM 时的工程实现细节，包括 RAG 接口契约、规则层异常检测、LLM Prompt 模板、后处理校验、失败重试等。
>
> **本文档来源**：从 [`HR系统-AI能力说明.md`](./HR系统-AI能力说明.md) §3.2~§3.6 各能力的"防编造工程方案"段抽出。
>
> **当前阶段**：Mock 阶段不需要落地——所有 sample 数据已通过预置示例符合"防编造"规则。本文档是**接入真 LLM 时的工程指引**，供后端 / AI 工程师参考。
>
> **最近更新**：2026-05-03

---

## 通用模式

5 个能力的工程方案都遵循同样的"两/三层架构 + Step 1-N"模式：

- **Step 1 · 规则层做计算/抽取**：所有客观数据（数字、阈值、分位、规则判定）由后端代码完成，**不让 LLM 算**
- **Step 2 · LLM 仅做自然语言翻译/洞察**：输入 = Step 1 结果，禁止编造 Step 1 之外的事实
- **Step 3 · 后处理校验**：拦截违禁关键词、伪精度数字、AI 越界决策
- **Step 4 · 失败重试 + 降级**：违规输出不允许展示给用户

具体到每个能力，下文列出特化的接口、Prompt、校验规则。

---

## 1. 员工资料卡（meeting_agenda）

**Mock 阶段**：通过预置 sample 输出演示规则——所有 sample 数据均符合"两层架构 + 脱敏 + 不写对话设计"原则。

**MVP 阶段**（接入真 LLM）：

### Step 1 · RAG 数据接口（Mock 阶段不做，但需提前规划）

```typescript
interface EmployeeRAGContext {
  basicInfo: { name: string; level: string; department: string }
  okrProgress: Array<{ title: string; progress: number }>
  feedback360: {
    dimensions: Array<{ name: string; lastAvg: number; currentAvg: number }>
    selfVsOthersGap: number  // 自评-他评差，仅汇总值，不含原始数据
  }
  attendance: { overtimeChange: number; absenceCount: number }
  codeActivity: { commitChangeRatio: number }
  lastMeeting: {
    daysAgo: number
    topics: string[]
    selfRatedResolved: number  // 0~100
  }
}
```

### Step 2 · 规则层异常检测（5~10 条阈值）

```yaml
rules:
  okr_progress:
    - 当前进度 < 50% 且季度过半 → ⚠️ "落后"
  feedback_360:
    - 单维度评分降 > 0.3 → ⚠️ "下降"
    - 自评 vs 他评差 > 0.5 → ⚠️ "认知偏差"
  attendance:
    - 加班环比 > +20% → ⚠️ "加班增"
  code_activity:
    - commit 环比 < -30% → ⚠️ "产出降"
  historical:
    - 上次议题与当前异常文本相似度 > 70% → 🔁 "延续议题"
```

### Step 3 · LLM Prompt 模板

```
你是 HR 系统的员工资料卡生成助手。

【输入】员工 RAG 数据 + 已标注的异常 / 延续标记

【任务】
1. 基于多个 ⚠️ 的组合，推断业务含义（≤ 5 行洞察）
   例：(O 进度落后 ⚠️) + (协作分降 ⚠️) + (加班增 ⚠️) → "可能跨团队协作卡点"
2. 对延续议题用 🔁 标注（系统已标，你只需高亮）
3. 按"数据信号强度"对关注点排序

【严格规则】
- ❌ 禁止生成"建议询问 X" / "可以这么开场" / 提问方向
- ❌ 禁止编造数据（数据缺失则显示"暂无"）
- ❌ 360 数据只输出维度均值，不输出具体评估人
- ✅ 只做现状洞察 + 优先级排序

【输出】
📊 数据快照（来自规则层）
🤖 AI 智能洞察（≤ 5 行）
📋 重点关注（按优先级）
```

### Step 4 · 后处理校验（伪代码）

```typescript
function validate(input: RAGContext, output: string): { ok: boolean; reason?: string } {
  // 1. 禁词检测：不应出现"建议询问"、"可以问"、"开场"等对话设计词
  const FORBIDDEN_PHRASES = ['建议询问', '建议问', '可以问', '建议先肯定', '开场', '提问方向']
  for (const p of FORBIDDEN_PHRASES) {
    if (output.includes(p)) return { ok: false, reason: `检测到对话设计词：${p}` }
  }

  // 2. 数字事实校验：输出里的数字必须来自 input 的真实数据
  // （类似评语优化的 NER 校验）

  // 3. 360 脱敏校验：输出不应出现具体人名
  // ...

  return { ok: true }
}
```

### Step 5 · 失败重试 + 降级

- 校验失败 → 重新调 LLM（最多 3 次，每次 prompt 提醒"上次违反规则 X"）
- 3 次都失败 → **降级为纯规则层输出**（只显示数据快照，不显示 AI 洞察）
- 不允许把违规输出展示给用户

---

## 2. 高风险员工预警（risk_alert）

**Mock 阶段**：sample 输出严格符合"无心理标签 + 无行为数据 + 无 AI 决策建议"原则。

**MVP 阶段**（接入真 LLM）：

### Step 1 · 规则层多信号叠加（不让 LLM 判风险等级）

```typescript
function computeRiskLevel(signals: RiskSignalChange[]): RiskLevel {
  const concerningCount = signals.filter(s => s.flag === 'concerning').length
  const attentionCount = signals.filter(s => s.flag === 'attention').length

  if (concerningCount >= 3) return 'high'
  if (concerningCount >= 2 || attentionCount >= 3) return 'medium'
  return 'low'
}
```

### Step 2 · LLM 仅做"AI 一段话观察"（输入 = 规则层结果，禁止编造 L0 之外字段）

```
你是 HR 系统的风险预警观察助手。

【任务】基于以下结构化信号，生成 ≤ 80 字的事实陈述。

【严格规则】
- 只描述事实（"360 协作分由 4.2 降至 3.7"）
- 禁止建议性动词："建议 / 推荐 / 应该 / 必须"
- 禁止心理类标签："心理波动 / 抑郁 / 情绪 / EAP"
- 禁止子分类："离职倾向 / 绩效下滑 / 心理波动"
- 禁止 AI 决策："建议邀约 / 推荐 1on1 / 应该调薪"
- 禁止编造任何输入信号清单之外的事实

【输入 JSON】
{ employee: {...}, signals: [...], riskLevel: 'high' }

【输出】
一段 ≤ 80 字的事实陈述。
```

### Step 3 · 后处理校验（拦截违禁关键词 + 越界决策）

```typescript
const FORBIDDEN_KEYWORDS = [
  '心理波动', '抑郁', '情绪异常', '心理异常',
  'EAP', '心理干预', '心理问题',
  '建议邀约', '建议干预'
]

function sanitizeText(text: string): string {
  let safe = text
  FORBIDDEN_KEYWORDS.forEach(kw => {
    if (safe.includes(kw)) {
      console.warn(`[risk_alert] 拦截违禁关键词：${kw}`)
      safe = safe.replace(new RegExp(kw, 'g'), '[已拦截]')
    }
  })
  return safe
}

const FORBIDDEN_PATTERNS = [
  /\d+\.\d+\s*\/\s*10/,        // 伪精度 "9.1/10"
  /置信度\s*\d+%/,               // LLM 自评置信度
  /(建议|推荐|应该)(邀约|面试|调薪|裁员)/,  // AI 越界决策
  /准确度\s*\d+%/                // 模型准确度自评
]

function validateOutput(output: string): boolean {
  return !FORBIDDEN_PATTERNS.some(p => p.test(output))
}
```

### Step 4 · L0 引用越界检查（aiObservation 不得引用规则层输入之外的事实）

```typescript
function validateGrounding(observation: string, signals: RiskSignalChange[]): boolean {
  // 提取 observation 中所有数字、信号名
  // 必须能在 signals 中找到对应来源
  // 找不到 => 拒绝输出，要求 LLM 重做
}
```

---

## 3. 评语优化（comment_polish）

**Mock 阶段**：通过预置 sample 输出演示规则——所有 sample 输出都符合"不补事实"原则。

**MVP 阶段**（接入真实 LLM）：

### Step 1 · System Prompt 模板

```
你是 HR 系统的评语优化助手。

任务：把管理者写的粗糙评语优化为更专业的表达。

【严格规则 - 必须遵守】
1. 禁止添加原稿没有的具体数据（数字、百分比、项目名、人名、时间点）
2. 禁止编造员工的业绩、行为、评分、能力等级
3. 只做：口语化 → 书面化、主观词 → 客观词、模糊词 → 准确词
4. 保持原稿的评价倾向（褒贬程度不变）
5. 输出长度 ≤ 原稿 2 倍
6. 不主动给"建议"或"展望"——除非原稿提到（构建性风格除外，可加 1 句温和期待）

【风格】
{{ tone: professional | concise | constructive }}
- professional: 书面化、规范、客观
- concise: 简洁、提炼最关键判断
- constructive: 在原稿基础上加 1 句温和的期待

【输入】{{ originalText }}

【输出】仅输出优化后的评语，不要解释。
```

### Step 2 · 输出层后处理校验（伪代码）

```typescript
function validate(input: string, output: string): {
  ok: boolean
  reason?: string
} {
  // 1. 抽取输入与输出的"事实实体"
  const inputNumbers = input.match(/\d+(\.\d+)?[%]?/g) || []
  const outputNumbers = output.match(/\d+(\.\d+)?[%]?/g) || []

  // 2. 输出里的数字必须是输入的子集
  const newNumbers = outputNumbers.filter(n => !inputNumbers.includes(n))
  if (newNumbers.length > 0) {
    return { ok: false, reason: `检测到编造数字：${newNumbers.join(', ')}` }
  }

  // 3. 长度校验
  if (output.length > input.length * 2) {
    return { ok: false, reason: '输出过长，疑似编造扩写' }
  }

  // 4. （进阶）NER 检测项目名/人名/时间，做同样的子集校验
  return { ok: true }
}
```

### Step 3 · 失败重试 + 降级

- 校验失败 → 重新调 LLM（最多 3 次，每次 prompt 提醒"上次违反规则 X"）
- 3 次都失败 → **降级返回原稿**，提示"AI 无法生成符合规则的优化版，请手动调整"
- 不允许把违规输出展示给用户

### Step 4 · 监控与迭代

- 留痕表记录每次调用：原稿 / 输出 / 校验结果 / 用户采纳与否
- HR 管理员可在 AI 中心查看"违规拦截率"——如果某个月违规率上升，说明 LLM 模型变化或 prompt 失效，需要调优

### 进阶版（可选）

- 接入 NER 模型（如 SpaCy / HanLP）识别项目名 / 人名 / 时间，更准确防止编造
- 接入员工真实数据（OKR 进度 / 360 评分），允许 AI 引用真数据——但这是另一个能力（"数据驱动评语"），不是本能力的扩展

---

## 4. 智能简历解析（resume_parse）

**Mock 阶段**：sample 输出严格符合"无伪精度 + 字段级校验 + L2 基于 L1"原则。

**MVP 阶段**（接入真 LLM）：

### Step 1 · L1 NER 抽取（不让 LLM 做匹配度判断 / L2 洞察）

```
你是 HR 系统的简历 NER 抽取助手。

【任务】从候选人简历文本中抽取结构化字段。

【严格规则】
- 只抽取，不编造（找不到就标"未提供"）
- 不输出整体置信度（不可靠）
- 不输出"匹配度 X / 10"这种数字
- 不做录用建议
- 不做与岗位匹配度评分（归 §3.7）
- 不做 L2 衍生洞察（留给 Step 3）

【输出 JSON】
{
  "basicInfo": { name, age, birth, gender, phone, email, location },
  "education": [{ school, major, degree, startDate, endDate }],
  "workExperience": [{ company, position, startDate, endDate, achievements, keywords }],
  "projects": [{ name, role, duration, output, techStack }],
  "skills": { primary, secondary, direction },
  "expectedSalary": { monthly, package, estimatedAnnual }
}
```

### Step 2 · 规则层做字段校验（伪代码）

```typescript
function validateFields(parsed: NERResult): FieldCheck[] {
  const checks: FieldCheck[] = []
  // 基本信息完整性
  if (!parsed.basicInfo.name) checks.push({ field: '姓名', status: 'warning', reason: '未识别' })
  // 工作经历时间完整性
  parsed.workExperience.forEach((w, i) => {
    if (w.endDate === '至今' && !w.isCurrent) {
      checks.push({ field: `工作经历${i + 1}`, status: 'warning', reason: '"至今"未指定结束时间' })
    }
  })
  // 期望薪资格式
  if (parsed.expectedSalary.package?.includes('year')) {
    checks.push({ field: '期望薪资', status: 'warning', reason: '格式可能歧义' })
  }
  return checks
}
```

### Step 3 · L2 衍生洞察（输入 = L1 JSON，禁止 LLM 引用 L1 之外字段）

```typescript
function deriveInsights(parsed: NERResult): Insights {
  // 平均在职时长：基于 L1 workExperience.duration 计算（规则层）
  const avgTenure = computeAvgTenure(parsed.workExperience)

  // 跳槽频率：基于 avgTenure + 段数（规则层判定）
  const jobHopFrequency = avgTenure > 3 ? 'low' : avgTenure > 1.5 ? 'normal' : 'high'

  // 技能使用上下文：scenarios 必须来自 workExperience.achievements / projects.output
  const skillContext = parsed.skills.primary.map(skill => ({
    skill,
    duration: computeSkillDuration(skill, parsed.workExperience),
    scenarios: extractScenarios(skill, parsed.workExperience, parsed.projects)
  }))

  // 行业聚焦度 + AI 一段话总结：轻量 LLM，prompt 强约束"只引用 L1"
  const aiSummary = llmSummarize(parsed)  // prompt: "你只能引用以下 JSON 字段..."

  return { averageTenure: `约 ${avgTenure} 年/段`, jobHopFrequency, skillContext, aiSummary, /* ... */ }
}
```

### Step 4 · 后处理校验（拦截伪精度 / AI 越界 / L2 引用越界）

```typescript
const FORBIDDEN_PATTERNS = [
  /\d+\.\d+\s*\/\s*10/,        // "9.1 / 10"
  /置信度\s*\d+%/,               // "置信度 92%"
  /推荐(邀约|面试|录用)/,         // AI 越界做录用决策
  /匹配\s*[P]?\d+\s*强/,         // 与岗位匹配度（本能力不允许）
]

function validateOutput(output: string): boolean {
  return !FORBIDDEN_PATTERNS.some(p => p.test(output))
}

// L2 越界检查：aiSummary 中的事实必须能在 L1 中找到
function validateInsightsGrounding(insights: Insights, l1: NERResult): boolean {
  // 提取 aiSummary 中的所有数字、公司名、技能名
  // 验证这些都出现在 l1 中，找不到 => 拒绝输出，要求 LLM 重做
}
```

---

## 5. 薪酬合理性检查（salary_sanity_check）

**Mock 阶段**：sample 输出严格符合"无方案推荐 / 无具体他人薪资 / 无管理倒挂判断"原则。

**MVP 阶段**（接入真 LLM）：

### Step 1 · 规则引擎计算所有客观数据（不让 LLM 算）

```typescript
function ruleBasedCheck(input: SalaryInput): RuleResult {
  const band = getBandFromCompSystem(input.position, input.level)  // 公司薪酬系统
  const peer = getPeerDistribution(input.position, input.level)    // SQL 查询
  const compaRatio = input.proposed / band.mid
  const quartile = computeQuartile(input.proposed, peer)
  const hasInversion = checkInversion(input.proposed, input.team)

  return { band, peer, compaRatio, quartile, hasInversion }
}
```

### Step 2 · LLM 仅做自然语言翻译（输入 = Step 1 结果，禁止编造）

```
你是 HR 系统的薪酬合理性检查助手。

【任务】基于以下结构化数据，生成 ≤ 60 字的事实陈述。

【严格规则】
- 只描述事实（"提议月薪 32k 超带宽上限 30k 约 7%"）
- 禁止建议性动词："建议 / 推荐 / 应该 / 必须 / 方案"
- 禁止主观判断："高风险 / 中风险 / 低风险 / 管理倒挂"
- 禁止跨域决策："建议晋升 / 应该调岗"
- 禁止暴露具体他人薪资数字（用分位描述）

【输入 JSON】
{ band: {...}, peer: {...}, compaRatio, quartile, hasInversion }

【输出】
一段 ≤ 60 字的事实陈述。
```

### Step 3 · 后处理校验（拦截违禁关键词）

```typescript
const FORBIDDEN_KEYWORDS = [
  '建议晋升', '推荐方案', '方案 A', '方案 B', '方案 C',
  '管理倒挂', '建议调整', '应该调整', '建议提高', '建议降低'
]

const FORBIDDEN_PATTERNS = [
  /(?:Leader|经理|主管|上级)\s*月薪\s*\d+/,  // 暴露具体他人薪资
  /(?:高|中|低)\s*风险/,                      // 主观风险等级
]

function sanitize(text: string): string {
  // 拦截命中关键词的文本
}
```
