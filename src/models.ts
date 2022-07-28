export const MergeMethods = {
  Merge: 'merge',
  Squash: 'squash',
  Rebase: 'rebase'
} as const
export type MergeMethod = typeof MergeMethods[keyof typeof MergeMethods]
export const isMergeMethod = (value: string): value is MergeMethod =>
  Object.values(MergeMethods).some(v => v === value)
