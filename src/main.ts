import * as core from '@actions/core'
import * as github from '@actions/github'
import {isMergeMethod, MergeMethod} from './models'

const getMergeMethod = (): MergeMethod | null => {
  const value = core.getInput('merge-method')
  return isMergeMethod(value) ? value : null
}

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const mergeMethod = getMergeMethod()
    const pullRequest = github.context.payload.pull_request

    if (mergeMethod === null) {
      core.setFailed('E0001')
      return
    }
    if (!pullRequest) {
      // プルリクエスト以外のイベントで実行された場合は終了
      core.setFailed('E0002')
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
      body: `書き込みテスト(${mergeMethod})`
    })

    core.debug(`result: ${JSON.stringify(result, null, '  ')}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
