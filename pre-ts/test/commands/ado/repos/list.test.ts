import {expect, test} from '@oclif/test'

describe('ado/repos/list', () => {
  test
  .stdout()
  .command(['ado/repos/list'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['ado/repos/list', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
