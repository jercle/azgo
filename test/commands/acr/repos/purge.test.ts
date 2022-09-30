import {expect, test} from '@oclif/test'

describe('acr:repos:purge', () => {
  test
  .stdout()
  .command(['acr:repos:purge'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['acr:repos:purge', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
