import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { init } from './../src/index'
import { shouldHideMessage } from '../src/utils/misc';

describe('Integration test', () => {
  const pkgPath = path.resolve('__tests__/fixtures/pkg');

  const consolelog = global.console.log

  it('prints everything', async () => {

    let log = ''
    console.log = jest.fn().mockImplementation((str1, str2) => {
      log += str1 + str2
    })

    await init(pkgPath, false)

    console.log = consolelog
    const content = [
      'Thanks for installing pkg',
      'Please consider donating to help us maintain this package.',
      'GitHub',
      'https://github.com/users/Jack/sponsorship',
      'Patreon',
      'https://patreon.com/Jack',
      'Open Collective'
    ]

    content.forEach(sentence => {
      expect(log.includes(sentence)).toBe(true)
    })
  })


  it('returns expected result on postinstall script', async () => {
    process.env.GITHUB_SPONSORS_FORCE = true
    const { stdout: rawStdout } = await promisify(exec)('npm run postinstall', { cwd: pkgPath, env: process.env })
    const stdout = rawStdout.toString('utf8')
  
    const content = [
      'Thanks for installing pkg',
      'Please consider donating to help us maintain this package.'
    ]
    content.forEach(sentence => {
      expect(stdout.includes(sentence)).toBe(true)
    })
  })


})