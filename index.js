#!/usr/bin/env node

const { exec, execSync } = require('child_process');
const { options, printMenu } = require('./func');
const { initLocalConf } = require('./utils');
const { configFileName } = require('./constant');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

process.stdin.setEncoding('utf-8')

const init = () => {
  console.log('码记: 正在启动...')
  // 配置检查
  // initLocalConf()
  // 自动提交
  const filePath = path.join('./', configFileName)
  const conf = JSON.parse(fs.readFileSync(filePath))
  if (conf.isAutoPush) {
    options.get('1').label = `1. 开始自动同步 [${chalk.blue('开启')}]`;
    options.get('4').label = `4. [${chalk.red('关闭')}] 默认同步`;
    options.get('1').fn();
  } else {
    printMenu()
  }
}
init()

process.stdin.on('data', async data => {
  console.clear()
  let id = data.trim()
  const menuItem = options.get(id)
  if (menuItem) {
    try {
      menuItem.fn(id)
    } catch (error) {
      console.error(error);
    }
  } else {
    printMenu()
  }
  console.log('---------------------')
  console.log('请继续输入: ')
})

process.stdin.resume();
