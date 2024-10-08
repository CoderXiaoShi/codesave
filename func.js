const { asyncGit, formatChineseTime } = require('./utils');
const { execSync } = require('child_process')
const { configFileName } = require('./constant');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const pkg = require('./package.json')

const options = new Map();

const printMenu = () => {
  console.log('---------------------')
  console.log('欢迎使用 [码记]')
  console.log('作者: 程序员小石')
  console.log('微信: CoderXiaoShi')
  console.log('---------------------\n')
  for (const menuItem of options.values()) {
    console.log(menuItem.label)
  }
  console.log('请输入指令序号, 按下回车键结束:\n')
}

/*
  自动提交需求
    1. 定时提交
    2. 再次调用, 停止自动提交
*/

const autoPush = {
  label: `1. 开始自动同步 [${chalk.red('已关闭')}]`,
  timer: null,
  fn: () => {
    const filePath = path.join('./', configFileName);
    if (fs.existsSync(filePath)) {
      let conf = fs.readFileSync(path.join('./', configFileName), 'utf-8');
      conf = JSON.parse(conf);
      if (autoPush.timer !== null) {
        clearInterval(autoPush.timer);
        autoPush.timer = null
        autoPush.label = `1. 开始自动同步 [${chalk.red('已关闭')}]`;
        printMenu()
        console.log(chalk.red('已关闭自动同步'));
      } else {
        autoPush.label = `1. 开始自动同步 [${chalk.blue('已开启')}]`;
        printMenu()
        conf.isAutoPush = true;
        if (!conf.pushInterval) {
          conf.pushInterval = 1000 * 60 * 60; // 默认值
        } else if (conf.pushInterval < 1000 * 60) {
          conf.pushInterval = 1000 * 1; // 最快 1 分钟一次
        } else if (conf.pushInterval > 1000 * 60 * 60 * 24) {
          conf.pushInterval = 1000 * 60 * 60 * 24; // 最慢 1 天一次
        }
        console.log(chalk.blue('已开始自动同步'));
        console.log(`自动同步频率为: ${chalk.blue(formatChineseTime(conf.pushInterval))}`)
        asyncGit();
        clearInterval(autoPush.timer);
        autoPush.timer = setInterval(asyncGit, conf.pushInterval);
      }
    }
  }
}

options.set('1', autoPush)

options.set('2', {
  label: '2. 立刻同步代码',
  fn: () => {
    printMenu();
    asyncGit();
  }
})

options.set('3', {
  label: '3. 打开 vsCode',
  fn: () => {
    printMenu();
    execSync('code .')
    console.log('已执行 ')
  }
})

const toggleAutoPush = {
  label: `4. [${chalk.blue('已开启')}] 默认同步`,
  fn: () => {
    const filePath = path.join('./', configFileName);
    const conf = JSON.parse(fs.readFileSync(filePath));
    if (conf.isAutoPush) {
      conf.isAutoPush = false;
      toggleAutoPush.label = `4. [${chalk.red('已关闭')}] 默认同步`;
    } else {
      conf.isAutoPush = true;
      toggleAutoPush.label = `4. [${chalk.blue('已开启')}] 默认同步`;
    }
    fs.writeFileSync(path.join('./', configFileName), JSON.stringify(conf), { flag: 'w+' });
    printMenu();
  }
}

options.set('4', toggleAutoPush)

options.set('5', {
  label: '5. 当前目录',
  fn: () => {
    printMenu();
    console.log('当前目录为：', process.cwd());
  }
})

const help = {
  label: '6. 帮助',
  fn: () => {
    printMenu();
    console.log('帮助:')
    console.log('开发者: 程序员小石(抖音)')
    console.log(`当前版本: ${pkg.version}`)
    console.log('微信号: CoderXiaoShi')
    console.log('邮箱: 1003865572@qq.com')
    console.log('个人博客: https://xinglong.tech/')
    console.log('github: https://github.com/CoderXiaoShi/codesave')
  }
}

options.set('6', help)

options.set('7', {
  label: '7. 退出',
  fn: () => {
    process.exit(0)
  }
})

module.exports = {
  options,
  printMenu
};
