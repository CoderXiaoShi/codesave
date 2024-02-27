const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process')
const { configFileName, defaultConfig } = require('./constant');
const moment = require('moment')

/**
 * 提交函数
 * 1. 什么都没有提交
 * 2. 提交了: 多少文件 多少行 , 打印出 git log
 */
const asyncGit = () => {
  // 输出
  console.log("同步时间为：", moment().format('YYYY-MMM-DD H:mm:ss'));
  try {
    execSync('git add .');
    execSync('git commit -m "update"');
    execSync('git pull');
    execSync('git push');
    console.log('同步成功')
  } catch (error) {
    console.log('同步失败')
  }
}

asyncGit()

/**
 * 
 * @param {*} path 
 * 检查某个目录中是否有配置文件
 * 如果没有就创建并且新增倒 .gitignore 中
 */
const initLocalConf = (configPath) => {
  let filePath = path.join(configPath, configFileName)
  if (!fs.existsSync(filePath)) {
    // 配置不存在, 初始化
    fs.writeFileSync(filePath, JSON.stringify(defaultConfig), 'utf8')
    // 将配置添加到 .gitignore 中
    const gitignoreContent = fs.readFileSync(path.join(configPath, '.gitignore'), 'utf8')
    if (!gitignoreContent.includes('.codelog')) {
      fs.appendFileSync(path.join(configPath, '.gitignore'), `\n${configFileName}`, 'utf8')
    }
  }
}

module.exports = {
  asyncGit,
  initLocalConf,
}
