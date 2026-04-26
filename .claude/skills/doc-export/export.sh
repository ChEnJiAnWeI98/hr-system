#!/bin/bash
# export.sh · doc-export 技能的本地 Pandoc 导出脚本
#
# 功能:把 Markdown 文件本地转换为 Word(.docx),不联网。
#
# 用法:
#   1. 直接执行:bash export.sh <markdown文件> [template]
#   2. 作为函数:source export.sh && export_doc <markdown文件> [template]
#
# 参数:
#   $1: Markdown 文件路径(必填,支持相对/绝对路径)
#   $2: template 名称(可选,接受但当前不区分样式;为兼容 req-doc/pm-test-cases/pm-operation-manual)

export_doc() {
  local MD_FILE="$1"
  local TEMPLATE="$2"

  # ---------- 参数校验 ----------
  if [ -z "$MD_FILE" ]; then
    echo "❌ 错误: 缺少必要参数"
    echo ""
    echo "用法: $0 <markdown文件> [template]"
    echo ""
    echo "template(可选,目前接受但暂未区分样式):"
    echo "  req-doc / test-cases / operation-manual / default / formal / simple"
    echo ""
    echo "示例:"
    echo "  $0 docs/需求说明书.md"
    echo "  $0 docs/需求说明书.md req-doc"
    return 1
  fi

  # ---------- Pandoc 检查 ----------
  if ! command -v pandoc &>/dev/null; then
    echo "❌ 错误: 未检测到 pandoc"
    echo ""
    echo "请安装 Pandoc 后重试:"
    echo "  macOS:        brew install pandoc"
    echo "  Ubuntu/Debian: sudo apt install pandoc"
    echo "  其他系统:      https://pandoc.org/installing.html"
    return 1
  fi

  # ---------- 文件存在性检查 ----------
  if [ ! -f "$MD_FILE" ]; then
    echo "❌ 错误: 文件不存在: $MD_FILE"
    return 1
  fi

  # ---------- 路径处理 ----------
  local MD_FILE_ABS
  MD_FILE_ABS=$(cd "$(dirname "$MD_FILE")" && pwd)/$(basename "$MD_FILE")
  local MD_DIR
  MD_DIR=$(dirname "$MD_FILE_ABS")
  local MD_BASENAME
  MD_BASENAME=$(basename "$MD_FILE_ABS" .md)
  local OUTPUT_FILE="$MD_DIR/$MD_BASENAME.docx"
  local ORIGINAL_DIR
  ORIGINAL_DIR=$(pwd)

  echo "📂 输入文件: $MD_FILE_ABS"
  echo "📂 输出文件: $OUTPUT_FILE"

  # template 参数提示(向后兼容)
  if [ -n "$TEMPLATE" ]; then
    echo "ℹ️  template 参数: $TEMPLATE(当前版本统一使用 Pandoc 默认样式)"
  fi

  # ---------- 切换到 md 目录(让 Markdown 里的相对图片路径能被找到)----------
  cd "$MD_DIR" || {
    echo "❌ 错误: 无法切换到目录 $MD_DIR"
    return 1
  }

  # ---------- 调用本地 Pandoc ----------
  echo ""
  echo "🚀 正在调用本地 Pandoc..."
  pandoc "$MD_FILE_ABS" \
    -o "$OUTPUT_FILE" \
    --resource-path="$MD_DIR" \
    --from=markdown \
    --to=docx
  local EXIT_CODE=$?

  # ---------- 切回原目录 ----------
  cd "$ORIGINAL_DIR" || true

  # ---------- 结果检查 ----------
  if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ Pandoc 转换失败(退出码: $EXIT_CODE)"
    return 1
  fi

  if [ ! -f "$OUTPUT_FILE" ]; then
    echo ""
    echo "❌ 输出文件未生成: $OUTPUT_FILE"
    return 1
  fi

  # ---------- 文件大小报告(跨平台兼容)----------
  local FILE_SIZE
  if command -v du &>/dev/null; then
    FILE_SIZE=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1 | tr -d ' ')
  else
    FILE_SIZE=$(ls -lh "$OUTPUT_FILE" 2>/dev/null | awk '{print $5}')
  fi

  echo ""
  echo "✅ 导出成功!"
  echo "📄 文件: $OUTPUT_FILE"
  echo "📊 大小: $FILE_SIZE"
  return 0
}

# 直接执行 vs 被 source
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  export_doc "$@"
fi
