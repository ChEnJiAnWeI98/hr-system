---
name: doc-export
description: 把 Markdown 文档导出为 Word(.docx)格式。当用户提到「导出 Word」「转 docx」「转 word」「导出文档」「导出需求说明书/测试用例/操作手册到 word」等需求时使用本技能。完全基于本地 Pandoc 转换,不联网,数据不出本地。
---

# 文档导出技能 (doc-export)

把 Markdown 文件转成 Word 等格式,完全本地运行。

## 何时使用

当用户的需求涉及以下任意一种,触发本技能:
- 把 `.md` 文件导出为 `.docx`(Word)
- 导出需求说明书 / 测试用例 / 操作手册到 Word
- 把任何 Markdown 文档转为 Word 分发

## 特点

- ✅ **本地转换**:基于开源工具 Pandoc,不上传任何数据到外部服务器
- ✅ **图片自动嵌入**:自动处理 Markdown 中引用的本地图片
- ✅ **中文支持**:无需额外配置
- ✅ **跨平台**:macOS / Linux 通用
- ✅ **向后兼容**:兼容旧的 template 参数(`req-doc`、`test-cases`、`operation-manual` 等),允许其他 skill 无修改调用

## 前置条件

本机需安装 Pandoc(一次性)。检查方法:
```bash
pandoc --version
```

如未安装:
```bash
# macOS
brew install pandoc

# Ubuntu / Debian
sudo apt install pandoc
```

## 使用方式

### 基础调用
```bash
bash .claude/skills/doc-export/export.sh <markdown文件路径>
```

### 带 template 参数(兼容旧 skill)
```bash
bash .claude/skills/doc-export/export.sh <markdown文件路径> <template>
```

`<template>` 是可选参数,值可为 `req-doc` / `test-cases` / `operation-manual` / `default` 等。
**当前版本接受此参数但暂使用 Pandoc 默认样式**(后续可通过 `templates/` 目录下的 `--reference-doc` 文件实现差异化样式)。

### 使用示例

```bash
# 1. 直接转换面试答案文档
bash .claude/skills/doc-export/export.sh docs/招商金科外包二面-面试答案梳理.md

# 2. 兼容模式(传模板名)
bash .claude/skills/doc-export/export.sh docs/需求说明书.md req-doc

# 3. 在 docs/ 目录里相对路径调用
cd docs
bash ../.claude/skills/doc-export/export.sh 需求说明书.md req-doc
```

## 输出位置

转换后的 `.docx` 文件输出到与输入 `.md` 同目录,文件名相同(后缀变为 `.docx`)。
例:`docs/A.md` → `docs/A.docx`

## 与其他 Skill 的关系

被以下 skill 调用,提供文档导出能力:
- `req-doc`(需求说明书)
- `pm-test-cases`(测试用例)
- `pm-operation-manual`(操作手册)

这些 skill 在生成 `.md` 文件后,会调用本 skill 完成 Word 导出。

## 后续可扩展能力(目前未实现)

- **PDF 导出**:`--format pdf`(需额外安装 xelatex 或 weasyprint 等 PDF 引擎)
- **HTML / EPUB 导出**:Pandoc 原生支持,直接扩展即可
- **样式模板**:在 `templates/` 文件夹放置 `.docx` 样式模板,通过 `--reference-doc` 应用
