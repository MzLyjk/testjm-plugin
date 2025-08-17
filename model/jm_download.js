import { spawn } from 'child_process'
import path from 'path'
import config from '../../config/config.js'
import { convertImagesToPDF } from './pdf_converter.js'
import fs from 'fs'

export async function downloadComic(comicId, outputDir) {
  try {
    // 调用Python爬虫下载图片
    const downloadSuccess = await runPythonScript(comicId, outputDir)
    
    if (!downloadSuccess) {
      throw new Error('Python爬虫下载失败')
    }
    
    // 转换为PDF
    const pdfPath = await convertImagesToPDF(outputDir, comicId)
    
    return pdfPath
  } catch (error) {
    throw error
  }
}

function runPythonScript(comicId, outputDir) {
  return new Promise((resolve, reject) => {
    // 获取Python脚本路径
    const scriptPath = path.join(process.cwd(), 'plugins/JMComic-Downloader/model/jm_crawler.py')
    
    const pythonProcess = spawn(config.pythonPath, [scriptPath, comicId, outputDir])
    
    let output = ''
    let errorOutput = ''
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(true)
      } else {
        console.error(`Python脚本执行错误: ${errorOutput}`)
        resolve(false)
      }
    })
    
    pythonProcess.on('error', (err) => {
      reject(err)
    })
  })
}