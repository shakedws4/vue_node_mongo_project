/***
 * Psi logger module -
 * Print logs usually plus capability of logz.io and slack handlers for high level logs
 */
const toSource = require('tosource-polyfill')

const logzIOHost = 'listener.logz.io'
const logzToken = 'kQVIqxNryVJYkIusCMYJFwDfBDrYOQGY'

const LOG = 'log'

const DEBUG = 'debug'
const INFO = 'info'
const ERROR = 'error'

const slackWebhooks = {
  [INFO]: 'https://hooks.slack.com/services/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',
  [ERROR]: 'https://hooks.slack.com/services/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'
}

const icons = {
  [INFO]: 'http://img.installcore.com.s3.amazonaws.com/psi-utils/info.png',
  [ERROR]: 'http://img.installcore.com.s3.amazonaws.com/psi-utils/error.png'
}

const env = (process.env.NODE_ENV) ? process.env.NODE_ENV.trim() : 'development'
const isProd = env === 'production'
const isLocal = process.browser && location && location.hostname === 'localhost'
const onServerSide = typeof window === 'undefined'

const request = function () {
  if (!onServerSide) {
    return fetch || new Error("This browser doesn't supports logger module, fetch must be exists natively")
  }
  return require('node-fetch')
}()

module.exports = class Logger {
  constructor (projectName, options = {}) {
    this.name = projectName
    if (!options.disableLogzIO && onServerSide) {
      const logzio = require('logzio-nodejs')
      if (logzio && 'createLogger' in logzio) {
        this._logzio = logzio.createLogger({
          token: logzToken,
          host: logzIOHost,
          type: `psi_${this.name.toLowerCase().split(' ').join('_')}`
        })
      }
    }
    this.prefix = options.prefix || ''
    this.slack = options.slack || {}
  }
  [DEBUG] () {
    if (!isProd || isLocal) {
      this._log(arguments)
    }
  }
  [INFO] () {
    this._log(arguments)
    const msg = Logger._parseLog(arguments)
    this._updateSlack(msg, INFO)
  }
  [ERROR] () {
    this._log(arguments, ERROR, '* Error * | ')
    const msg = Logger._parseLog(arguments)
    this._updateSlack(msg, ERROR)
  }
  byStatusCode (statusCode) {
    return this[Logger._getLevelByStatusCode(statusCode)].bind(this)
  }
  _generalHandlers (args, level) {
    const msg = Logger._parseLog(args)
    this._updateLogzIO(msg, level)
  }
  _updateLogzIO (message, level) {
    if (this._logzio && !isLocal) {
      this._logzio.log({message, level, env})
    }
  }
  _log (args, level = LOG, prefix = '') {
    const latestArgs = [Logger._getNow(), this._generalPrefix, prefix].concat(Object.values(args))
    if (!args) console.log()
    else console[level].apply(console, latestArgs)
    this._generalHandlers(args, level)
  }
  get _generalPrefix () {
    const prefix = this.prefix ? `${this.prefix} | ` : ''
    return `[${this.name}] ${prefix}:`
  }
  _updateSlack (message, level) {
    if (!isLocal && isProd) {
      request(this.slack[level] || slackWebhooks[level], {
        method : 'POST',
        headers: {
          'Accept'      : 'application/json'
        },
        body   : JSON.stringify({
          'text'    : message,
          'username': this.slack.username || 'psi-bot',
          'icon_url': this.slack.icon || icons[level]
        })
      }).then(res => {
        if (res.status !== 200) {
          this._log([`msg: ${message}, statusText: ${res.statusText}`, ERROR, '* Failed adding to slack * | '])
        }
      })
    }
  }
  static _parseLog (args) {
    return Object.values(args).map((arg) => {
      if (arg instanceof Error) return arg.toString()
      return toSource(arg)
    }).join(' ')
  }
  static _parseParameter (param) {
    if (typeof param === 'string') {
      return param
    } else if (typeof params === 'number' || param instanceof Error) {
      return param.toString()
    }
    return JSON.stringify(param, null, 4)
  }
  static _getNow () {
    let d = new Date()
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
  }

  /***
   * Return logger level from response status code.
   * @param statusCode {int} status code of http response
   * @param strict {boolean} define if the message is important (info level) even if not error
   * @param optionsStatusCode {string | array} list of status code
   * @param exclude {boolean} include or exclude `optionsStatusCode` (include = if status code exists it's normal level)
   * @returns {string}
   * @private
   */

  static _getLevelByStatusCode (statusCode, strict = false, optionsStatusCode, exclude = false) {
    if (!statusCode) throw new Error('Status code is mandatory')
    const normalLevel = strict ? INFO : DEBUG
    if (optionsStatusCode) {
      optionsStatusCode = optionsStatusCode instanceof Array ? optionsStatusCode : [optionsStatusCode]
      if (exclude) {
        return !optionsStatusCode.includes(statusCode) ? normalLevel : ERROR
      }
      return optionsStatusCode.includes(statusCode) ? normalLevel : ERROR
    }
    return statusCode >= 200 && statusCode < 300 ? normalLevel : ERROR
  }

  static get _webpackExtension () {
    return {
      externals: [{
        'logzio-nodejs': {}
      }],
      node: {
        __filename: true
      }
    }
  }
}
