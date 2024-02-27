const { exec, execSync } = require('child_process')

process.stdin.setEncoding('utf-8')

const help = () => {
  console.log('帮助:')
  console.log('开发者: 程序员小石(抖音)')
  console.log('微信号: CoderXiaoShi')
}
