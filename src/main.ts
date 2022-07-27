import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const pullNumber: string = core.getInput('pull-number')
    core.debug(`pullNumber: ${pullNumber}`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const octokit = github.getOctokit(token)

    // コメントを書き込む
    const result = await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: Number(pullNumber),
      body: '書き込みテスト'
    })

    core.debug(`result: ${JSON.stringify(result, null, '  ')}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
