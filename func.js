const { asyncGit, formatChineseTime } = require('./utils');
const { execSync } = require('child_process')
const { configFileName } = require('./constant');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const readline = require('readline');

const options = new Map();

const autoPush = {
  label: '1. 开始自动同步',
  timer: null,
  fn: () => {
    console.log('已开始自动同步')
    const filePath = path.join(__dirname, configFileName);
    if (fs.existsSync(filePath)) {
      let data = fs.readFileSync(path.join(__dirname, configFileName), 'utf-8');
      data = JSON.parse(data);
      data.isAutoPush = true;
      if (!data.pushInterval) {
        data.pushInterval = 1000 * 60 * 60; // 默认值
      } else if (data.pushInterval < 1000 * 60) {
        data.pushInterval = 1000 * 60; // 最快 1 分钟一次
      } else if (data.pushInterval > 1000 * 60 * 60 * 24) {
        data.pushInterval = 1000 * 60 * 60 * 24; // 最慢 1 天一次
      }
      asyncGit();
      clearInterval(autoPush.timer);
      autoPush.timer = setInterval(asyncGit, data.pushInterval);
      console.log(`已开始自动同步, 同步频率为: ${chalk.blue(formatChineseTime(data.pushInterval))}`)
    }
  }
}

options.set('1', autoPush)

options.set('2', {
  label: '2. 立刻同步代码',
  fn: asyncGit
})

options.set('3', {
  label: '3. 打开 vsCode',
  fn: () => {
    execSync('code .')
    console.log('已执行 ')
  }
})

const toggleAutoPush = {
  label: `4. [${chalk.blue('开启')}] 默认同步`,
  fn: () => {
    const filePath = path.join('./', configFileName)
    const conf = JSON.parse(fs.readFileSync(filePath))
    if (conf.isAutoPush) {
      console.log('关闭')
      clearInterval(autoPush.timer);
      autoPush.label = `1. 开始自动同步 [${chalk.red('关闭')}]`;
      toggleAutoPush.label = `4. [${chalk.blue('开启')}] 默认同步`
    } else {
      console.log('开启')
      autoPush.label = `1. 开始自动同步 [${chalk.blue('开启')}]`;
      toggleAutoPush.label = `4. [${chalk.red('关闭')}] 默认同步`
    }
  }
}

options.set('4', toggleAutoPush)

const help = {
  label: '5. 帮助',
  fn: () => {
    console.log('帮助:')
    console.log('开发者: 程序员小石(抖音)')
    console.log('微信号: CoderXiaoShi')
    console.log('个人博客: https://xinglong.tech/')
    console.log('github: https://github.com/CoderXiaoShi/codelog')
  }
}

options.set('5', help)

options.set('6', {
  label: '6. 退出',
  fn: () => {
    process.exit(0)
  }
})

module.exports = options;
