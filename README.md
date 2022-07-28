## 使い方

### Create a ｍerge commit
```yaml
      - uses: t-fujisaka-d1g/merge-pull-request@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Squash and merge
```yaml
      - uses: t-fujisaka-d1g/merge-pull-request@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          merge-method: squash
```

### Rebase and merge
```yaml
      - uses: t-fujisaka-d1g/merge-pull-request@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          merge-method: rebase
```

## パラメータ
| パラメータ名 | 必須 | 説明 |
|:---|:---:|:---|
|github-token |必須 | GitHubトークン |
|merge-method | | マージ方法(merge,squash,rebase) |

