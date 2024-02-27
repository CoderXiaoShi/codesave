const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process')
const { configFileName, defaultConfig } = require('./constant');

/*
  解析 git 提交后的内容
*/
function parseGitPushOutput(output) {
  const lines = output.split('\n');
  const totalLine = lines.find(line => line.startsWith('Total '));
  const totalMatch = totalLine.match(/Total (\d+) /);
  const enumeratingObjectsLine = lines.find(line => line.startsWith('Enumerating objects:'));
  const enumeratingObjectsMatch = enumeratingObjectsLine.match(/Enumerating objects: (\d+),/);
  const writingObjectsLine = lines.find(line => line.startsWith('Writing objects:'));
  const writingObjectsMatch = writingObjectsLine.match(/Writing objects: 100% \((\d+)\/(\d+)\), (\d+\.\d+ [KMGT]iB) /);

  const result = {};

  if (totalMatch) {
    result.total = parseInt(totalMatch[1]);
  }

  // if (enumeratingObjectsMatch) {
  //   result.EnumeratingObjects = parseInt(enumeratingObjectsMatch[1]);
  // }

  // if (writingObjectsMatch) {
  //   result.WritingObjects = writingObjectsMatch[3];
  // }

  return result;
}


/**
 * 提交函数
 * 1. 什么都没有提交
 * 2. 提交了: 多少文件 多少行 , 打印出 git log
 */
const asyncGit = () => {
  try {
    // 获取当前时间
    var now = new Date();

    // 分别获取年、月、日、小时、分钟和秒
    var year = now.getFullYear(); // 获取完整的四位数年份
    var day = now.getDate(); // 获取日
    var hours = now.getHours(); // 获取小时（0-23）
    var minutes = now.getMinutes(); // 获取分钟
    var seconds = now.getSeconds(); // 获取秒

    // 输出
    console.log("当前时间为：", year, "年", day, "日 ", hours, "时", minutes, "分", seconds, "秒");
    try {
      execSync('git add .');
      execSync('git commit -m "update"');
      execSync('git pull');
      execSync('git push');
    } catch (error) {
    }
  } catch (error) {
    console.error(error);
  }
}

asyncGit()

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

module.exports = {
  asyncGit
}
