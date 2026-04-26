const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng(svgPath, pngPath, width, height) {
  try {
    // 读取 SVG 文件
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    // 创建 canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 将 SVG 转换为 data URL
    const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');

    // 加载并绘制图像
    const img = await loadImage(svgDataUrl);
    ctx.drawImage(img, 0, 0, width, height);

    // 保存为 PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pngPath, buffer);

    console.log(`✅ PNG 文件已生成: ${pngPath}`);
  } catch (error) {
    console.error('❌ 转换失败:', error.message);
    process.exit(1);
  }
}

// 执行转换
const svgPath = process.argv[2] || 'src/assets/img/common/logo.svg';
const pngPath = process.argv[3] || 'src/assets/img/common/logo-web.png';
const width = parseInt(process.argv[4]) || 81;
const height = parseInt(process.argv[5]) || 81;

convertSvgToPng(svgPath, pngPath, width, height);
