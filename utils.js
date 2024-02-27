const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { configFileName, defaultConfig } = require('./constant');
const moment = require('moment');
const chalk = require('chalk');

/**
 * 提交函数
 * 1. 什么都没有提交
 * 2. 提交了: 多少文件 多少行 , 打印出 git log
 */
const asyncGit = () => {
  // 输出
  // TODO 检查本目录是否为 git 仓库: 依赖 simple-git
  console.log("同步时间为：", chalk.red(moment().format('YYYY-MM-DD H:mm:ss')));
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

const formatChineseTime = (milliseconds) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟${seconds}秒`;
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds}秒`;
  } else {
    return `${seconds}秒`;
  }
}

module.exports = {
  asyncGit,
  initLocalConf,
  formatChineseTime,
}
