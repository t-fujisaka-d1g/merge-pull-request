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
      core.setFailed(
        'ERROR: マージ方法(merge-method)には merge,squash,rebaseのいずれかを指定してください。'
      )
      return
    }
    if (!pullRequest) {
      core.setFailed('ERROR: プルリクエストのイベントから実行してください。')
      return
    }
    if (pullRequest.assignees.length > 0) {
      core.info('スキップ: Assigneesが指定されているため')
      return
    }
    if (pullRequest.requested_reviewers.length > 0) {
      core.info('スキップ: Reviewersが指定されているため')
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

    octokit.rest.pulls.merge({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: pullRequest.number,
      merge_method: mergeMethod
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
