import plugin from '../../../lib/plugins/plugin.js'
import logger from '../../../lib/logger.js'
import config from '../config/config.js'
import { runPythonScript } from './jm_crawler.js'
import { convertImagesToPDF } from '../model/pdf_converter.js'
import fs from 'fs'
import path from 'path'

export class JMComicDownloader extends plugin {
  constructor() {
    super({
      name: 'JM本子下载器',
      dsc: '使用Python爬虫下载JM本子',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: '^#jm\\s+(\\d+)$',
          fnc: 'downloadComic',
          log: false
        }
      ]
    })
    
    // 确保临时目录存在
    this.tmpDir = path.join(process.cwd(), 'plugins/JMComic-Downloader/data/tmp')
    if (!fs.existsSync(this.tmpDir)) {
      fs.mkdirSync(this.tmpDir, { recursive: true })
    }
  }

  async downloadComic() {
    const comicId = this.e.msg.match(/#jm\s+(\d+)/)[1]
    
    try {
      // 发送等待消息
      const waitMsg = await this.reply(`开始下载 JM${comicId}，请稍候...`, true)
      
      // 创建临时目录
      const downloadDir = path.join(this.tmpDir, comicId)
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir)
      }
      
      // 调用Python爬虫
      const success = await runPythonScript(comicId, downloadDir)
      if (!success) {
        await this.reply(`下载失败，请检查ID是否正确或稍后重试`, true)
        return
      }
      
      // 转换为PDF
      const pdfPath = await convertImagesToPDF(downloadDir, comicId)
      
      // 发送文件
      await this.sendResult(pdfPath, comicId)
      
      // 清理临时文件
      this.cleanTempFiles(downloadDir, pdfPath)
      
      // 撤回等待消息
      if (waitMsg?.message_id) {
        await this.safeRecallMsg(waitMsg.message_id)
      }
      
    } catch (error) {
      logger.error(`下载出错: ${error.message}`)
      await this.reply(`下载出错: ${error.message}`, true)
    }
  }
  
  async sendResult(pdfPath, comicId) {
    const fileSize = fs.statSync(pdfPath).size
    const sizeMB = (fileSize / (1024 * 1024)).toFixed(2)
    
    if (sizeMB < 20) {
      // 小文件直接发送
      try {
        if (this.e.isGroup) {
          const group = Bot.pickGroup(this.e.group_id)
          await group.fs.upload(pdfPath)
        } else {
          const friend = Bot.pickFriend(this.e.user_id)
          await friend.sendFile(pdfPath)
        }
        await this.reply(`JM${comicId} 下载完成！`, true)
      } catch (error) {
        await this.reply(`文件发送失败: ${error.message}`, true)
      }
    } else {
      // 大文件生成临时链接
      const tmpFileUrl = this.createTempFileUrl(pdfPath)
      await this.reply(
        `文件过大(${sizeMB}MB)，请下载: ${tmpFileUrl}\n链接有效期10分钟`,
        true
      )
    }
  }
  
  createTempFileUrl(filePath) {
    // 这里使用简单的文件服务
    // 实际使用时应替换为您的安全文件服务
    const fileName = path.basename(filePath)
    return `https://your-file-service.com/download?file=${fileName}`
  }
  
  cleanTempFiles(downloadDir, pdfPath) {
    try {
      // 删除下载的图片
      if (fs.existsSync(downloadDir)) {
        fs.rmSync(downloadDir, { recursive: true, force: true })
      }
      
      // 删除PDF文件（如果已发送）
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath)
      }
    } catch (error) {
      logger.error(`清理临时文件失败: ${error.message}`)
    }
  }
  
  async safeRecallMsg(messageId) {
    try {
      if (!messageId) return false
      
      if (this.e.isGroup) {
        await Bot.pickGroup(this.e.group_id).recallMsg(messageId)
      } else if (this.e.isPrivate) {
        await Bot.pickFriend(this.e.user_id).recallMsg(messageId)
      }
      return true
    } catch (error) {
      logger.error(`撤回消息失败: ${error.message}`)
      return false
    }
  }
}