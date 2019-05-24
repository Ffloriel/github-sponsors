import {shouldHideMessage} from './../src/utils/misc'

describe('shouldHideMessage()', () => {

  // Force message
  ;[1, true].forEach(truthy => {
    it(`should not hide message when GITHUB_SPONSORS_FORCE is set to ${truthy}`, () => {
      const env = { GITHUB_SPONSORS_FORCE: truthy}
      expect(shouldHideMessage(env)).toBe(false);
    })
  })

  // Oracle postinstall
  ;[1, true].forEach(truthy => {
    it(`should hide message when OC_POSTINSTALL_TEST is set to ${truthy}`, () => {
      const env = { OC_POSTINSTALL_TEST: truthy }
      expect(shouldHideMessage(env)).toBe(true);
    })
  })

  // CI with CI env
  ;[1, true].forEach(truthy => {
    it(`should hide message when CI is set to ${truthy}`, () => {
      const env = { CI: truthy }
      expect(shouldHideMessage(env)).toBe(true);
    })
  })

  // CI with CONTINUOUS_INTEGRATION env
  ;[1, true].forEach(truthy => {
    it(`should hide message when CONTINUOUS_INTEGRATION is set to ${truthy}`, () => {
      const env = { CONTINUOUS_INTEGRATION: truthy }
      expect(shouldHideMessage(env)).toBe(true);
    })
  })

  // Dev environment
  ;['test', 'production'].forEach(nodeEnv => {
    it(`should hide message when node environment is not development`, () => {
      const env = { NODE_ENV: nodeEnv }
      expect(shouldHideMessage(env)).toBe(true);
    })
  })

})