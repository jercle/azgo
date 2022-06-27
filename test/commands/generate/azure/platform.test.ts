import {expect, test} from '@oclif/test'

describe('generate/azure/platform', () => {
  test
  .stdout()
  .command(['generate/azure/platform'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['generate/azure/platform', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
