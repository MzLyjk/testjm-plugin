import fs from 'fs'
import logger from '../../../lib/logger.js'

// 输出提示
logger.info('=======================')
logger.info('JMComic下载插件加载中...')
logger.info('请确保已安装Python环境及JMComic-Crawler依赖')
logger.info('安装命令：pip install jmcomic')
logger.info('=======================')

// 加载插件
const files = fs.readdirSync('./plugins/JMComic-Downloader/apps')
  .filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')
  
  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

export { apps }