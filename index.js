#!/usr/bin/env node

const { options, printMenu } = require('./func');
const { initLocalConf, initStatic } = require('./utils');
const { configFileName } = require('./constant');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const os = require('os');

process.stdin.setEncoding('utf-8');

function getRootPath() {
  const userHomeDir = os.homedir();
  const platform = os.platform();
  if (platform === 'win32') {
      const rootPath = path.join(userHomeDir, 'AppData', 'Roaming');
      // return 'Windows';
      return rootPath;
  } else if (platform === 'darwin') {
      // return 'Mac';
      const rootPath = path.join(userHomeDir,);
      return rootPath;
  } else {
      return 'Other'; // 对于其他系统，比如Linux，返回'Other'
  }
}

const saveGitPath = (curPath) => {
  // 拼接 userData 目录的路径
  const userDataDir = path.join(getRootPath(), '.codesave');
  let codesaveDataStore = getHistoryGitPath();
  codesaveDataStore.history[curPath] = 1;

  const directoryPath = path.dirname(userDataDir);
  // 确保目录存在，如果不存在则创建
  fs.mkdirSync(directoryPath, { recursive: true });

  fs.writeFileSync(userDataDir, JSON.stringify(codesaveDataStore), 'utf-8', { flag: 'w+' });
}

const getHistoryGitPath = () => {
  const userHomeDir = os.homedir();
  // 拼接 userData 目录的路径
  let codesaveDataStore = {
    history: {}
  };

  const directoryPath = path.dirname(userHomeDir);
  // 确保目录存在，如果不存在则创建
  fs.mkdirSync(directoryPath, { recursive: true });

  const userDataDir = path.join(getRootPath(), '.codesave');
  if (!fs.existsSync(userDataDir)) {
    
    const directoryPath = path.dirname(userDataDir);
    // 确保目录存在，如果不存在则创建
    fs.mkdirSync(directoryPath, { recursive: true });
    
    fs.writeFileSync(userDataDir, JSON.stringify(codesaveDataStore), { flag: 'w+' });
  } else {
    codesaveDataStore = fs.readFileSync(userDataDir, 'utf-8');
    codesaveDataStore = JSON.parse(codesaveDataStore);
  }
  return codesaveDataStore;
}

const entry = (curPath = './') => {
  process.chdir(curPath)
  saveGitPath(curPath)
  // 配置检查
  initLocalConf();
  // 初始化空仓库
  initStatic(curPath);
  // 自动提交
  const filePath = path.join('./', configFileName)
  const conf = JSON.parse(fs.readFileSync(filePath))
  console.clear()
  if (conf.isAutoPush) {
    options.get('1').label = `1. 开始自动同步 [${chalk.blue('已开启')}]`;
    options.get('4').label = `4. [${chalk.blue('已开启')}] 默认同步`;
    options.get('1').fn();
  } else {
    printMenu()
  }

  process.stdin.on('data', async data => {
    console.clear();
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
}

  ; (async () => {
    console.log('码记: 正在启动...');
    // console.clear();

    let curPath = process.cwd()
    // 判断当前仓库是否为 git 仓库

    let isGitRepo = await simpleGit(curPath).checkIsRepo('root');
    if (!isGitRepo) {
      let res = getHistoryGitPath()
      let list = Reflect.ownKeys(res.history);
      if (list.length === 0) {
        console.log('当前目录不是 git 仓库, 请进入 git 仓库后再运行本工具。');
        process.exit(0)
      }
      // 定义问题列表
      const questions = [
        {
          type: 'list',
          name: 'path',
          message: '当前目录不是 git 仓库, 您可以选择历史记录中的 git 仓库:',
          choices: list,
        },
      ];

      if (list.length === 1) {
        console.log('正在进入目录：', path.resolve(list[0]));
        entry(list[0])
      } else {
        // 使用 inquirer 提问
        inquirer.prompt(questions).then((answers) => {
          console.log('你选择是：', path.resolve(answers.path));
          curPath = answers.path
          entry(curPath)
        });
      }

    } else {
      entry(curPath)
    }

  })();


