const { appCache } = require('../../funcs/utility/cache')

test('appCache.init', () => {
  expect(appCache.init()).toBeTruthy()
})
