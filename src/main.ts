import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const pullRequest = github.context.payload.pull_request

    if (!pullRequest) {
      // プルリクエスト以外のイベントで実行された場合は終了
      core.setFailed('E0001')
      return
    }

    core.debug('======================== context ========================')
    core.debug(`${JSON.stringify(github.context, null, '  ')}`)
    core.debug('=========================================================')

    const octokit = github.getOctokit(token)

    // コメントを書き込む
    const result = await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pullRequest.number,
      body: '書き込みテスト'
    })

    core.debug(`result: ${JSON.stringify(result, null, '  ')}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
