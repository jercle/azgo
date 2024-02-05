import {expect, test} from '@oclif/test'

describe('acr/repos/list', () => {
  test
  .stdout()
  .command(['acr/repos/list'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['acr/repos/list', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
