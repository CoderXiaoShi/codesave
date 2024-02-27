const { exec, execSync } = require('child_process')
const options = require('./func')
const { initLocalConf } = require('./utils')
const { configFileName } = require('./constant')
const fs = require('fs')
const path = require('path')

process.stdin.setEncoding('utf-8')

const printMenu = () => {
  console.log('---------------------')
  console.log('欢迎使用 [码记]')
  console.log('---------------------')
  for (const menuItem of options.values()) {
    console.log(menuItem.label)
  }
  console.log('请输入指令序号, 按下回车键结束:')
}


const init = () => {
  console.log('码记: 正在启动...')
  // 配置检查
  // initLocalConf()
  // 自动提交
  const filePath = path.join('./', configFileName)
  const conf = JSON.parse(fs.readFileSync(filePath))
  if (conf.isAutoPush) {
    console.log('默认开启自动同步')
    options.get('1').fn()
  }
}
init()

printMenu()
process.stdin.on('data', async data => {
  console.clear()
  printMenu()
  let id = data.trim()
  const menuItem = options.get(id)
  if (menuItem) {
    try {
      menuItem.fn()
    } catch (error) {
      console.error(error);
    }
    console.log('---------------------')
    console.log('请继续输入: ')
  } else {
    console.log('未知命令, 请重新输入')
  }
})

process.stdin.resume();
