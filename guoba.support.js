import path from 'path'
import lodash from 'lodash'
import config from './config/config.js'

export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'jmcomic-downloader',
      title: 'JMComic下载器',
      description: '使用Python爬虫下载JM本子',
      author: 'YourName',
      authorLink: 'https://github.com/your-username',
      link: 'https://github.com/your-username/JMComic-Downloader',
      isV3: true,
      isV2: false,
      showInMenu: true,
      icon: 'mdi:book',
      iconColor: '#FF4081',
    },
    configInfo: {
      schemas: [
        {
          label: '基本配置',
          component: 'SOFT_GROUP_BEGIN',
        },
        {
          field: 'pythonPath',
          label: 'Python路径',
          bottomHelpMessage: '系统上Python解释器的路径',
          component: 'Input',
          required: true,
          componentProps: {
            placeholder: '例如：python3 或 /usr/bin/python3',
          },
        },
        {
          field: 'maxFileSize',
          label: '文件大小限制(MB)',
          bottomHelpMessage: '超过此大小的文件将提供下载链接',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 1,
            max: 500,
          },
        },
        {
          field: 'maxThreads',
          label: '最大下载线程数',
          bottomHelpMessage: '同时下载的图片数量',
          component: 'InputNumber',
          required: true,
          componentProps: {
            min: 1,
            max: 10,
          },
        },
        {
          label: '高级配置',
          component: 'SOFT_GROUP_BEGIN',
        },
        {
          field: 'maxRetry',
          label: '最大重试次数',
          bottomHelpMessage: '下载失败时的重试次数',
          component: 'InputNumber',
          componentProps: {
            min: 1,
            max: 10,
          },
        },
        {
          field: 'tempFileLifetime',
          label: '临时文件保留时间(分钟)',
          bottomHelpMessage: '下载完成后临时文件的保留时间',
          component: 'InputNumber',
          componentProps: {
            min: 1,
            max: 1440,
          },
        },
      ],
      getConfigData() {
        return {
          pythonPath: config.pythonPath,
          maxFileSize: config.maxFileSize,
          maxThreads: config.maxThreads,
          maxRetry: config.maxRetry,
          tempFileLifetime: config.tempFileLifetime,
        }
      },
      setConfigData(data, { Result }) {
        // 更新配置
        config.pythonPath = data.pythonPath || 'python3'
        config.maxFileSize = data.maxFileSize || 100
        config.maxThreads = data.maxThreads || 5
        config.maxRetry = data.maxRetry || 3
        config.tempFileLifetime = data.tempFileLifetime || 30
        
        return Result.ok({}, '配置保存成功')
      }
    }
  }
}