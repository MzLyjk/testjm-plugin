import fs from 'fs'
import path from 'path'
import { PDFDocument } from 'pdf-lib'
import sharp from 'sharp'

export async function convertImagesToPDF(directory, comicId) {
  try {
    // 获取目录下所有图片文件
    const files = fs.readdirSync(directory)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort((a, b) => a.localeCompare(b))
    
    if (files.length === 0) {
      throw new Error('未找到图片文件')
    }
    
    // 创建PDF文档
    const pdfDoc = await PDFDocument.create()
    
    // 添加所有图片到PDF
    for (const file of files) {
      const filePath = path.join(directory, file)
      const image = await sharp(filePath).toBuffer()
      
      // 添加到PDF
      const imageType = path.extname(file).toLowerCase().substring(1)
      let pdfImage
      
      switch (imageType) {
        case 'jpg':
        case 'jpeg':
          pdfImage = await pdfDoc.embedJpg(image)
          break
        case 'png':
          pdfImage = await pdfDoc.embedPng(image)
          break
        case 'webp':
          // 将webp转换为png
          const pngBuffer = await sharp(image).png().toBuffer()
          pdfImage = await pdfDoc.embedPng(pngBuffer)
          break
        default:
          continue
      }
      
      // 创建页面
      const page = pdfDoc.addPage([
        pdfImage.width,
        pdfImage.height
      ])
      
      // 绘制图片
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: pdfImage.width,
        height: pdfImage.height,
      })
    }
    
    // 保存PDF
    const pdfBytes = await pdfDoc.save()
    const pdfPath = path.join(directory, `${comicId}.pdf`)
    fs.writeFileSync(pdfPath, pdfBytes)
    
    return pdfPath
  } catch (error) {
    throw new Error(`转换PDF失败: ${error.message}`)
  }
}