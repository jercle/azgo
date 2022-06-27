import {expect, test} from '@oclif/test'

describe('acr/vulns', () => {
  test
  .stdout()
  .command(['acr/vulns'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['acr/vulns', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
