import {expect, test} from '@jest/globals'
import {isMergeMethod} from '../src/models'

test('isMergeMethod', () => {
  expect(isMergeMethod('merge'))
  expect(isMergeMethod('squash'))
  expect(isMergeMethod('rebase'))
  expect(!isMergeMethod('123'))
})
