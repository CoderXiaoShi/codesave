const { asyncGit, formatChineseTime } = require('./utils');
const { configFileName } = require('./constant');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const options = new Map();

const autoPush = {
  label: '1. 开始自动同步',
  fn: () => {
    console.log('已开始自动同步')
    const filePath = path.join(__dirname, configFileName);
    if (fs.existsSync(filePath)) {
      let data = fs.readFileSync(path.join(__dirname, configFileName), 'utf-8')
      data = JSON.parse(data)
      data.isAutoPush = true;
      if (!data.pushInterval) {
        data.pushInterval = 1000 * 60 * 60; // 默认值
      } else if (data.pushInterval < 1000 * 60) {
        data.pushInterval = 1000 * 60; // 最快 1 分钟一次
      } else if (data.pushInterval > 1000 * 60 * 60 * 24) {
        data.pushInterval = 1000 * 60 * 60 * 24; // 最慢 1 天一次
      }
      asyncGit();
      clearInterval(timer);
      timer = setInterval(asyncGit, data.pushInterval);
      console.log(`已开始自动同步, 同步频率为: ${formatChineseTime(data.pushInterval)}`)
    }
  }
}

let timer = null;
options.set('1', autoPush)
autoPush.fn();

options.set('2', {
  label: '2. 立刻同步代码',
  fn: asyncGit
})

options.set('3', {
  label: '3. 打开 vsCode',
  fn: () => {
    exec('code .')
    console.log('已执行 ')
  }
})

options.set('4', {
  label: '4. 是否默认开启自动同步',
  fn: () => {
    // 写入 是否自动存储标记
  }
})

const help = {
  label: '5. 帮助',
  fn: help
}

options.set('5', {
  label: '5. 帮助',
  fn: () => {
    console.log('帮助:')
    console.log('开发者: 程序员小石(抖音)')
    console.log('微信号: CoderXiaoShi')
  }
})

options.set('6', {
  label: '6. 退出',
  fn: () => {
    process.exit(0)
  }
})

module.exports = options;

