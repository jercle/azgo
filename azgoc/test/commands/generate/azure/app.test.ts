import {expect, test} from '@oclif/test'

describe('generate/azure/app', () => {
  test
  .stdout()
  .command(['generate/azure/app'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['generate/azure/app', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
