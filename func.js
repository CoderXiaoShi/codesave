const { asyncGit } = require('./utils')

const options = new Map()

options.set('1', {
  label: '1. 开始自动同步',
  fn: () => {
    console.log('已开始自动同步')
    asyncGit();
    clearInterval(timer);
    timer = setInterval(asyncGit, 1000 * 60 * 60)
  }
})

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

options.set('5', {
  label: '5. 帮助',
  fn: help
})

options.set('6', {
  label: '6. 退出',
  fn: () => {
    process.exit(0)
  }
})

module.exports = options;

