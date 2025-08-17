# trssjm-plugin
自用，支持TRSS的JM下载插件
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
### 使用指令
- `#jm帮助` 插件帮助信息
- `#jm 495055` 下载 JMComic 漫画并转换为 PDF 发送
