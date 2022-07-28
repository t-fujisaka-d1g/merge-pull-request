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

    core.debug(`mergeMethod: ${mergeMethod}`)
    core.debug('======================== pullRequest ========================')
    core.debug(`${JSON.stringify(pullRequest, null, '    ')}`)
    core.debug('======================== context ========================')
    core.debug(`${JSON.stringify(github.context, null, '    ')}`)
    core.debug('=========================================================')

    // アクションの実行イベントを検証
    if (!pullRequest) {
      core.setFailed('ERROR: プルリクエストのイベントから実行してください。')
      return
    }

    const octokit = github.getOctokit(token)

    // プルリクエストにコメントを書き込む
    const comment = async (message: string): Promise<void> => {
      const result = await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: pullRequest.number,
        body: message
      })
      core.debug(`result: ${JSON.stringify(result, null, '    ')}`)
    }

    // マージ方法を検証
    if (mergeMethod === null) {
      const errors: string[] = []
      errors.push(
        'マージ方法(merge-method)には merge,squash,rebaseのいずれかを指定してください。'
      )
      const message = `merge-pull-request: ERROR \n${errors.join('\n')}`
      await comment(message)
      core.setFailed(message)
      return
    }

    // マージをスキップするか判定
    const skips: string[] = []
    if (pullRequest.assignees.length > 0) {
      skips.push('Assigneesが指定されているため')
    }
    if (pullRequest.requested_reviewers.length > 0) {
      skips.push('Reviewersが指定されているため')
    }
    if (skips.length > 0) {
      const message = `merge-pull-request: SKIP \n${skips.join('\n')}`
      await comment(message)
    }

    // プルリクエストをマージ
    await comment(`merge-pull-request: ${mergeMethod}`)
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
