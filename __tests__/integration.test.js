import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { init } from './../src/index'

describe.skip('Integration test', () => {
  const pkgPath = path.resolve('__tests__/fixtures/pkg');

  it('prints everything', async () => {

    let log = ''
    process.stdout.write = (write => (string, encoding, fileDescriptor) => {
      log += string
      write.apply(process.stdout, arguments)
    })(process.stdout.write)

    await init(pkgPath, false)
    const content = [
      'Thanks for installing pkg',
      // 'Please consider donating to help us maintain this package.',
      // 'GitHub',
      // 'https://github.com/users/Jack/sponsorship',
      // 'Patreon',
      // 'https://patreon.com/Jack',
      // 'Open Collective'
    ]

    content.forEach(sentence => {
      expect(log.includes(sentence)).toBe(true)
    })
  })


  it('returns expected result on postinstall script', async () => {
    const { stdout: rawStdout } = await promisify(exec)('npm run postinstall', { cwd: pkgPath })
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