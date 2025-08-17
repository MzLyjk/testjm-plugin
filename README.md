# TRSSJM-plugin
- 暂未测试
- 暂未测试
- 暂未测试
- 自用，支持TRSS-Yunzai的JM下载插件

[![MPL-2.0 License](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

本插件采用 Mozilla Public License 2.0 许可证，附加以下条款：
1. 仅限个人非商业使用
2. 使用者承担全部法律责任
3. 禁止用于非法内容分发
4. 开发者免责所有使用风险
## 安装与使用说明
### 安装步骤
#### 克隆插件到TRSS-Yunzai的plugins目录：
```shell
git clone https://github.com/MzLyjk/testjm-plugin.git ./plugins/TRSSJM-plugin
```
#### 安装Python依赖：
```shell
pip install jmcomic
```
#### 安装Node.js依赖：
```shell
cd TRSSJM-plugin
pnpm install pdf-lib sharp
```
#### 重启TRSS-Yunzai
## 使用指令
- `#jm帮助` 插件帮助信息
- `#jm 495055` 下载 JMComic 漫画并转换为 PDF 发送
