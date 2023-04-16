import {expect, test} from '@oclif/test'

describe('ado/boards', () => {
  test
  .stdout()
  .command(['ado/boards'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['ado/boards', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
