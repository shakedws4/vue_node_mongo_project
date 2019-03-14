const path = require('path')
const Logger = require(path.join(__dirname, '../../modules/psi-utils/logger/'))

const name = 'Certificate_System'
const slack = {
  error: 'https://hooks.slack.com/services/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',
  info: 'https://hooks.slack.com/services/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'
}

module.exports = new Logger(name, { slack })
