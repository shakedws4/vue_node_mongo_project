const Logger = require('../index.js')

const DEBUG = 'debug'
const INFO = 'info'
const ERROR = 'error'

const chai = require('chai')
const expect = chai.expect
describe('testing logger units', () => {
  /** should parse argument to string **/
  describe('_parseParameter()', () => {
    it('should return the same string from string', () => {
      const TEST_STRING  = 'blat'
      expect(Logger._parseParameter(TEST_STRING)).to.equal(TEST_STRING)
    })
    it('should return json stringify of the array', () => {
      const TEST_ARR  = ['blat', 'tfoo']
      expect(Logger._parseParameter(TEST_ARR)).to.equal(JSON.stringify(TEST_ARR, null, 4))
    })
  })

  /** should parse all arguments to one string **/
  describe('_parseLog()', () => {
    it('should return the correct string for an example array', () => {
      const TEST_ARR = [1, 'aaa', {a: 'b'}]
      const TEST_RESULT  = `1 aaa {
    "a": "b"
}`
      expect(Logger._parseLog(TEST_ARR)).to.equal(TEST_RESULT)
    })
  })
  describe('generalPrefix()', () => {
    it('Return string as prefix', () => {
      const logger = new Logger('test')
      expect(typeof logger._generalPrefix).to.equal('string')
    })
  })
  describe('_getLevelByStatusCode()', () => {
    it('Check if not strict status code 201 returns log without any special parameters', () => {
      expect(Logger._getLevelByStatusCode(201)).to.equal(DEBUG)
    })
    it('Check if not strict status code 300 returns error without any special parameters', () => {
      expect(Logger._getLevelByStatusCode(300)).to.equal(ERROR)
    })
    it('Check if strict status code 400 returns info with include of 400 status code', () => {
      expect(Logger._getLevelByStatusCode(400, true, 400)).to.equal(INFO)
    })
    it('Check if strict status code 400 returns log with exclude of 200 status code', () => {
      expect(Logger._getLevelByStatusCode(200, false, 201, true)).to.equal(DEBUG)
    })
  })
})