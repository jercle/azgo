import {expect, test} from '@oclif/test'

describe('config:devops:defaultSub', () => {
  test
  .stdout()
  .command(['config:devops:defaultSub'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['config:devops:defaultSub', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
