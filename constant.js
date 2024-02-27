const configFileName = '.codelog'

const defaultConfig = {
  isAutoPush: true,             // 是否开启自动提交
  pushInterval: 1000 * 60 * 60, // 自动提交的频率
}

module.exports = {
  configFileName,
  defaultConfig
}
