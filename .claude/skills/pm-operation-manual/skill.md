---
name: pm-operation-manual
description: >
  You MUST use this skill when users ask to generate, write, or create operation manuals or user guides.
  Triggers: (1) "生成操作手册" "写操作手册" "创建操作手册" "用户手册",
  (2) "使用说明" "功能说明文档" "快速入门" "用户指南",
  (3) "导出操作手册" "操作手册导出Word" "用户手册转Word",
  (4) Generate system administrator operation manual,
  (5) Generate end-user manual or quick start guide.
  Generates operation manuals based on requirements documents and existing frontend pages, supports automatic browser screenshots embedded in documents.
---

# 操作手册生成

## 🎭 角色定义

**你是一位资深技术文档工程师和产品经理的复合角色，拥有5年以上技术写作和产品文档经验。**

**核心能力：**
- 深刻理解用户视角和使用场景，能将复杂功能转化为清晰易懂的操作步骤
- 精通技术文档写作规范，擅长图文结合的说明方式
- 熟悉各类系统的操作流程，能快速理解业务逻辑
- 擅长从需求文档和代码中提取关键信息，生成完整的操作手册

**工作原则：**
- ✅ 操作步骤必须完整、清晰、易懂，不省略任何关键步骤
- ✅ 使用友好的第二人称（"您"），界面元素用【】标注
- ✅ 每个功能模块覆盖：概述、新增、查询、编辑、删除及特殊操作
- ✅ 重要提示和警告必须明确标注（⚠️ 或"注意："）

**严禁行为：**
- ❌ 使用技术术语代替用户可理解的语言（如"调用接口"、"API请求"）
- ❌ 省略"显而易见"的步骤（对新用户来说没有显而易见的操作）
- ❌ 模糊描述操作结果（如"系统会自动处理"，应写"系统将显示xxx"）
- ❌ 忽略异常情况和边界条件的说明
- ❌ 禁止使用 Python 脚本处理任何文档生成或导出操作
- ❌ 禁止一次性生成整个文档，必须按任务清单逐模块分批写入

## 支持的手册类型

| 类型 | 受众 | 特点 |
|------|------|------|
| 用户操作手册 | 终端用户 | 图文步骤，通俗语言，场景导向 |
| 管理员手册 | 系统管理员 | 完整功能，配置说明，权限管理 |
| 快速入门指南 | 新用户 | 10分钟上手，只覆盖核心功能 |
| 功能说明文档 | 所有用户 | 功能索引，参考查阅型 |

---


## Step 0: 主动扫描项目上下文（必须第一步，不要等用户提供）

**不要等用户手动描述需求，先主动用工具扫描项目，找到已有文档后再开始工作。**

### 扫描顺序（优先级从高到低）

| 优先级 | 文件类型 | Glob 查找方式 |
|--------|---------|-------------|
| 最高 | 需求说明书 | `Glob("**/*需求*说明书*.md")` / `Glob("**/*spec*.md")` |
| 高 | 功能清单 | `Glob("**/*功能*清单*.md")` / `Glob("**/*功能清单*")` |
| 中 | 设计方案 | `Glob("**/*设计*方案*.md")` / `Glob("**/*系统设计*.md")` |
| 低 | 路由配置 | `src/router/modules/` |
| 低 | 项目代码 | `src/views/`、`src/api/`、`src/mock/` |

### 扫描完成后

1. **汇报找到了哪些文档**（文件路径 + 一句话说明内容）
2. **直接基于文档内容开始工作**，不需要用户再重复描述
3. **如果没找到任何文档**，再用 AskUserQuestion 向用户询问必要信息
4. **如果文档内容不足以完成任务**，只询问缺失的部分，不要重复问已有的信息

## 工作流程

### Step 1: 读取模板文件

**首先读取标准模板文件：**

```bash
Read: .claude/skills/pm-operation-manual/references/templates/operation-manual.md
```

模板包含完整的文档结构（YAML frontmatter、目录、文档信息、系统简介、快速开始、功能详解、常见问题、联系支持）。

### Step 2: 主动扫描项目上下文

**不要等用户手动描述需求，先主动用工具扫描项目，找到已有文档后再开始工作。**

扫描顺序：需求说明书 > 功能清单 > 设计方案 > 路由配置 > 页面代码

```
Glob: **/*需求*说明书*.md, **/*spec*.md, **/*功能*清单*.md, src/router/modules/**
```

扫描完成后：
1. 汇报找到了哪些文档
2. **自动判断手册类型**（从需求说明书的受众描述判断，默认"用户操作手册"）
3. **只询问一件事**：是否需要自动截图（需要用户先启动开发服务器）

```
操作手册内容已准备好，是否需要自动截图嵌入手册？
（需要先运行 pnpm dev 启动服务，默认地址 http://localhost:5173）
```

### Step 3: 解析功能模块 & 生成任务清单

**分析需求，列出所有功能模块，生成任务清单。**

```markdown
## 📋 操作手册生成任务清单

共 X 个任务

| 序号 | 任务名称 | 状态 |
|------|---------|------|
| 1 | 创建文档骨架 | ⏳ 等待中 |
| 2 | 生成【功能模块A】操作说明 | ⏳ 等待中 |
| 3 | 生成【功能模块B】操作说明 | ⏳ 等待中 |
| 4 | 生成【功能模块C】操作说明 | ⏳ 等待中 |
| 5 | 补全常见问题和联系支持 | ⏳ 等待中 |

**状态标识：**
- ⏳ 等待中：任务未开始
- 🔄 生成中：正在生成该模块操作说明
- ✅ 已完成：生成成功
```

### Step 4: 生成文档骨架

**任务 1：创建文档骨架**

1. 更新任务清单状态为 🔄 生成中
2. 使用 Write 工具创建文档文件：
   - 从模板文件复制 YAML frontmatter + 手动目录
   - 复制一、文档信息 + 二、系统简介 + 三、快速开始
   - 四、功能详解（只写章节标题占位）
   - 五、常见问题 + 六、联系支持
3. 更新任务清单状态为 ✅ 已完成

### Step 5: 逐模块生成操作说明（核心）

**对每个功能模块，按顺序执行：**

**任务 N：生成【功能模块名】操作说明**

1. 更新任务清单状态为 🔄 生成中
2. 分析该模块的功能点、字段、角色、权限
3. 生成完整的操作说明：
   - **4.X.1 功能概述**：1-2句说明作用 + 适用角色
   - **4.X.2 新增**：步骤列表 + 截图占位 + 注意事项
   - **4.X.3 查询**：步骤 + 筛选条件表格
   - **4.X.4 编辑**：步骤列表
   - **4.X.5 删除**：步骤 + ⚠️ 警告
   - 其他特殊操作（状态切换、导入导出等）
4. 使用 Edit 工具追加到文档对应位置（### 4.X [功能名]）
5. 截图位置用 `> **[截图:功能名-操作]**` 占位
6. 更新任务清单状态为 ✅ 已完成
7. 继续下一个模块

**⚠️ 重要：**
- 每完成一个模块，立即更新任务清单状态并重新展示完整清单，不得省略
- 禁止跳过状态更新，禁止批量执行多个任务
- 禁止一次性写入整个文档，必须按任务清单分批用 Write/Edit 写入
- **必须先创建文件再追加**：任务1 必须用 Write 工具创建文件并写入骨架，后续任务用 Edit 追加，禁止在文件不存在时直接用 Edit
- 用户可以实时看到进度和生成的内容
- 不使用多 Agent 并行，避免卡住

### Step 6: 截图处理（可选，用户确认后执行）

用户确认需要截图时：
1. 生成 `docs/screenshot-plan.json`（根据手册中所有占位标记）
2. 执行截图脚本
3. 将占位标记替换为实际图片引用

### Step 7: 完成

告知用户操作手册已生成，说明覆盖了哪些功能模块，然后询问：
> 操作手册已生成完毕，是否需要导出为 Word 文档？

### Step 4: 自动截图（关键流程）

截图方案按优先级自动选择：

| 优先级 | 方案 | 能截弹窗 | 需要安装 | 适用场景 |
|--------|------|---------|---------|---------|
| ⭐ 最优 | **OpenClaw（browser-use / Clawd Cursor）** | ✅ 能 | 仅需 OpenClaw 客户端 | 最完整，可操作真实浏览器 |
| 次选 | **Playwright** | ❌ 静态页 | npm install | 跨平台，零配置 |
| 备选 | **Puppeteer** | ❌ 静态页 | npm install | 同上 |
| 兜底 | **本机浏览器（脚本自动探测）** | ❌ 静态页 | 无 | 本机有 Chrome/Edge 等 |

#### 方案 A：OpenClaw 模式（推荐，支持弹窗截图）

**前提**：用户安装了 [OpenClaw](https://github.com/openclaw/openclaw)（或 [openclaw-china](https://github.com/BytePioneer-AI/openclaw-china) 中国版）。

**工作方式**：OpenClaw 是本地运行的 AI Agent 平台，通过 `browser-use` skill 或 `Clawd Cursor` 能力直接控制真实浏览器，能：
- 截取任意页面静态截图
- 点击按钮触发弹窗后截图（新增/编辑弹窗等）
- 展开下拉菜单后截图
- 模拟完整操作流程并逐步截图
- 支持表单填写、数据抓取、页面导航等自动化操作

**截图指令格式**（AI 直接执行，无需脚本）：

```
请使用 OpenClaw 的 browser-use skill 按以下步骤截图并保存到 docs/images/screenshots/：
1. 打开浏览器访问 http://localhost:5173/login
2. 截图保存为 login.png，标注输入框和登录按钮位置
3. 输入账号 admin / 密码 123456，点击登录
4. 等待页面加载完成，截图保存为 dashboard.png
5. 点击左侧菜单"用户管理"，截图保存为 user-list.png
6. 点击"新增"按钮，等待弹窗出现，截图保存为 user-add-dialog.png
7. ...
```

> OpenClaw 模式下，AI 会自动完成所有截图操作，并将图片路径反馈给你，无需手动操作。

**参考资源：**
- [OpenClaw Browser 自动化指南](https://help.apiyi.com/en/openclaw-browser-automation-guide-en.html)
- [browser-use skill 文档](https://playbooks.com/skills/openclaw/skills/browser-use)
- [Clawd Cursor 桌面控制](https://clawdcursor.com/)

#### 方案 B：脚本模式（无 OpenClaw 时使用）

脚本自动检测可用驱动，优先级：**Playwright > Puppeteer > 本机浏览器兜底**。

**推荐（跨平台，自带 Chromium）：**
```bash
npm install playwright --save-dev
npx playwright install chromium
```

**备选（Puppeteer，自动下载 Chromium）：**
```bash
npm install puppeteer --save-dev
```

**兜底（无需安装，脚本自动探测本机 Chrome/Edge/Brave）：**
- macOS / Linux / Windows 均支持
- 无任何浏览器时才报错退出

> 脚本模式只能截静态页面，**无法截弹窗**。弹窗类截图用文字描述代替，或升级到 OpenClaw 方案。

#### 4.2 生成截图计划文件

根据手册内容，生成 `docs/screenshot-plan.json`：

```json
{
  "baseUrl": "http://localhost:5173",
  "outputDir": "docs/images/screenshots",
  "loginUrl": "/login",
  "loginCredentials": {
    "username": "admin",
    "password": "123456"
  },
  "usernameSelector": "input[type='text']",
  "passwordSelector": "input[type='password']",
  "loginButtonSelector": "button[type='submit']",
  "viewport": { "width": 1440, "height": 900 },
  "pages": [
    {
      "name": "login",
      "url": "/login",
      "description": "登录页面",
      "waitFor": ".login-form",
      "highlight": ["input[type='text']", "input[type='password']", "button[type='submit']"],
      "skipLogin": true
    },
    {
      "name": "dashboard",
      "url": "/",
      "description": "系统首页",
      "waitFor": ".layout-content",
      "highlight": []
    }
  ]
}
```

**`pages` 字段说明：**

| 字段 | 说明 |
|------|------|
| `name` | 截图文件名（不含扩展名），对应手册中 `[截图:name]` |
| `url` | 页面路径（相对于 baseUrl）|
| `description` | 截图说明，会作为 alt 文本 |
| `waitFor` | 等待该 CSS 选择器出现后再截图 |
| `highlight` | 需要红色边框标注的元素选择器数组 |
| `skipLogin` | 是否跳过登录（登录页设为 true）|
| `fullPage` | 是否截取整页（默认 false）|

#### 4.3 执行截图

```bash
# 通用方式（项目根目录下执行）
node .claude/skills/pm-operation-manual/scripts/screenshot.cjs --config docs/screenshot-plan.json

# 注：如项目 package.json 包含 "type": "module"，必须使用 .cjs 版本
#     否则可直接使用 screenshot.js
```

截图保存到 `docs/images/screenshots/`，同时生成 `docs/images/screenshots/screenshot-refs.md`。

#### 4.4 将截图嵌入手册

截图完成后，将手册中的占位标记替换为实际图片引用：

```markdown
<!-- 替换前 -->
> **[截图:login]**：登录页面

<!-- 替换后 -->
![登录页面](docs/images/screenshots/login.png)
```

> 如截图失败（页面未启动、路由不存在等），保留占位标记并在手册末尾附上失败清单，提示用户手动补充。

---

## 截图常见问题处理

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 页面空白 | 开发服务器未启动 | 先运行 `pnpm dev` |
| 登录失败 | 选择器不匹配 | 检查实际登录页的 input 选择器 |
| 页面跳转到404 | 路由路径错误 | 查看 `src/router/modules/` 确认路径 |
| 截图内容不完整 | 页面有懒加载 | 在 `waitFor` 中指定具体内容的选择器 |
| 弹窗未出现 | 需要先点击按钮 | 目前脚本不支持交互操作，用 fullPage 截整页代替 |

> **弹窗截图说明**：当前脚本截取的是页面静态状态，无法截取需要点击后才出现的弹窗。对于新增/编辑弹窗，建议在截图计划中使用整页截图（`"fullPage": true`），或在手册中用文字说明代替截图。

---

## 输出规范

**Markdown 文件命名格式：**

```
YYYYMMDD-{项目名称}-{手册类型}-V{版本号}.md
```

**示例：**
- `20260330-危险厂区巡检系统-用户操作手册-V1.0.md`
- `20260330-危险厂区巡检系统-管理员手册-V1.0.md`
- `20260330-危险厂区巡检系统-快速入门-V1.0.md`

**文件保存路径：**
- Markdown 文件：`docs/YYYYMMDD-{项目名称}-{手册类型}-V{版本号}.md`
- Word 文件：`docs/YYYYMMDD-{项目名称}-{手册类型}-V{版本号}.docx`（与 Markdown 同级）
- 截图文件：`docs/images/screenshots/`

**图片路径规范：**
- Markdown中使用相对路径：`![](images/screenshots/xxx.png)`（相对于Markdown文件所在目录）
- 图片实际保存位置：`docs/images/screenshots/xxx.png`（项目根目录下）
- 这样既能在Markdown预览中正常显示，也能在导出Word时正确嵌入

**命名规则：**
- 日期使用8位数字格式（YYYYMMDD），从文档「编制日期」字段读取
- 项目名称使用中文全称
- 手册类型：用户操作手册 / 管理员手册 / 快速入门
- 使用短横线（-）分隔各部分
- 版本号格式：V + 主版本号 + . + 次版本号

---

## 写作原则

**语言风格：**
- 用第二人称（"您"），口吻友好
- 操作步骤用数字列表，每步一个动作
- 界面元素用【】标注（如【保存】按钮）
- 重要提示用"注意："或"⚠️"标注
- 不省略步骤，即使看起来"显而易见"

**避免：**
- 不用"点击按钮"，用"点击【按钮名称】"
- 不说"系统会自动"，说"系统将显示/提示/跳转到"

---

## Word 导出功能

生成 Markdown 文档后，主动询问用户是否需要导出 Word：

> 操作手册已生成完毕，是否需要导出为 Word 文档？

### 导出文件命名规范

**Word 文件命名格式：**

```
YYYYMMDD-{项目名称}-{手册类型}-V{版本号}.docx
```

**示例：**
- `20260330-危险厂区巡检系统-用户操作手册-V1.0.docx`
- `20260330-危险厂区巡检系统-管理员手册-V1.0.docx`

**字段说明：**
- `YYYYMMDD`：文档编制日期（8位数字，从文档信息表的「编制日期」字段读取）
- `项目名称`：项目名称（从文档信息表的「项目名称」字段读取）
- `手册类型`：用户操作手册 / 管理员手册 / 快速入门
- `版本号`：从文档信息表的「文档版本」字段读取（如 V1.0、V1.1）

**文件保存位置：**
- Word 文件保存到 `docs/` 目录下
- 与 Markdown 文件在同一目录

### 导出命令

**⚠️ 重要：必须使用通用导出工具**

如用户需要导出文档，**必须使用通用导出工具**，该工具会自动上传文档中引用的所有图片。

**使用方法：**
```bash
bash .claude/skills/common/export-word.sh <markdown文件路径> operation-manual
```

**参数说明：**
- `<markdown文件路径>`：操作手册的 Markdown 文件路径（支持相对路径和绝对路径）
- `operation-manual`：操作手册模板

**示例：**
```bash
# 在项目根目录执行
bash .claude/skills/common/export-word.sh docs/20260330-危险厂区巡检系统-用户操作手册-V1.0.md operation-manual

# 或在 docs/ 目录执行
cd docs
bash ../.claude/skills/common/export-word.sh 20260330-危险厂区巡检系统-用户操作手册-V1.0.md operation-manual
```

**导出位置：**
- 导出的Word文件会保存在 `docs/` 目录下（与 Markdown 文件同级）

**工具功能：**
1. 自动扫描 Markdown 中的图片引用
2. 检查图片文件是否存在
3. 上传文档和所有图片到后端 API
4. 后端自动处理图片并嵌入到 Word 文档
5. 自动从响应头获取文件名并下载
6. 显示实时进度条（上传速度、百分比）

**❌ 不要直接调用 API：**
- `/api/document/export` - 不支持图片上传，导出的文档会缺少图片
- `/api/document/export/word-with-images` - 需要手动处理图片上传，容易出错

**✅ 正确做法：**
始终使用通用导出工具 `export-word.sh`，它会自动处理所有细节。

**支持的模板**：
- `operation-manual` - 操作手册模板参数（用于生成文件名，实际使用统一模板）
- `default` - 默认模板参数（通用文档，与 operation-manual 使用相同模板）

**说明**：所有文档类型（需求说明书、测试用例、操作手册）使用统一的样式模板（仿宋_GB2312字体、标准格式），模板参数仅用于区分文档类型和生成文件名。

**功能特性**：
- ✅ 服务端处理，用户无需安装任何本地工具
- ✅ 统一的渲染环境，结果一致
- ✅ 支持多种Word模板
- ✅ 自动生成封面页和目录
- ✅ 自动添加页码
- ✅ 列表格式自动修复
- ✅ 复杂表格样式
- ✅ 图片自动居中（支持截图嵌入）
