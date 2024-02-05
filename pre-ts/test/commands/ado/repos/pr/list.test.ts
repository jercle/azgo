import {expect, test} from '@oclif/test'

describe('ado/repos/pr/list', () => {
  test
  .stdout()
  .command(['ado/repos/pr/list'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['ado/repos/pr/list', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
