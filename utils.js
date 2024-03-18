const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { configFileName, defaultConfig } = require('./constant');
const moment = require('moment');
const chalk = require('chalk');
const simpleGit = require('simple-git');

/**
 * 提交函数
 * 1. 什么都没有提交
 * 2. 提交了: 多少文件 多少行 , 打印出 git log
 */
const asyncGit = () => {
  // 输出
  // TODO 检查本目录是否为 git 仓库: 依赖 simple-git
  console.log("本次同步时间为：", chalk.blue(moment().format('YYYY-MM-DD H:mm:ss')));
  try {
    execSync('git pull');
    execSync('git add .');
    execSync('git commit -m "update"');
    execSync('git push');
  } catch (error) {
    // console.log('同步失败')
  }
  console.log('同步成功')
}

/**
 * 
 * @param {*} path 
 * 检查某个目录中是否有配置文件
 * 如果没有就创建并且新增倒 .gitignore 中
 */
const initLocalConf = (configPath = './') => {
  let filePath = path.join(configPath, configFileName)
  if (!fs.existsSync(filePath)) {
    // 配置不存在, 初始化
    
    const directoryPath = path.dirname(filePath);
    // 确保目录存在，如果不存在则创建
    fs.mkdirSync(directoryPath, { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify(defaultConfig), 'utf8', { flag: 'w+' })
    if (fs.existsSync(path.join(configPath, '.gitignore'))) {
      // 将配置添加到 .gitignore 中
      const gitignoreContent = fs.readFileSync(path.join(configPath, '.gitignore'), 'utf8')
      if (!gitignoreContent.includes(configFileName)) {
        fs.appendFileSync(path.join(configPath, '.gitignore'), `\n${configFileName}`, 'utf8')
      }
    }
  }
}

// 如果进入了一个空目录, 需要自动创建一些文件
/*
  
  工作日志.md
  TaskList.md
  Journal.md
  ReadingList.md
  docs
*/
const initStatic = (configPath) => {
  let files = fs.readdirSync(configPath)
  if (files.length === 1 && files[0] === '.git') {
    console.log('正在帮助空文件夹创建文件')
    let fileList = [
      {
        fileName: '工作日志.md',
        type: 'file'
      },
      {
        fileName: 'TaskList.md',
        type: 'file'
      },
      {
        fileName: 'Journal.md',
        type: 'file'
      },
      {
        fileName: 'ReadingList.md',
        type: 'file'
      },
      {
        fileName: 'docs',
        type: 'directory'
      },
    ]
    for (const item of fileList) {
      if (item.type === 'file') {
          
        const directoryPath = path.dirname(configPath);
        // 确保目录存在，如果不存在则创建
        fs.mkdirSync(directoryPath, { recursive: true });

        fs.writeFileSync(path.join(configPath, item.fileName), '', { flag: 'w+' })
        console.log('已创建: ', item.fileName)
      } else if (item.type === 'directory') {
        fs.mkdirSync(path.join(configPath, item.fileName))
        console.log('已创建: ', item.fileName)
      }
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
  initStatic,
  formatChineseTime,
}
