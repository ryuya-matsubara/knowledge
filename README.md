# Knowledge

Markdownで知識を保存し、[Webアプリ](https://ryuya-matsubara.github.io/knowledge/)で閲覧・共有するリポジトリです。

## 記事の追加・更新

`knowledge/` に1記事につき1つの `.md` ファイルを置きます。サブフォルダも使えます。

```markdown
---
title: "記事のタイトル"
subtitle: "記事のサブタイトル"
---

ここに本文を書きます。
```

記事とルートの `index.json` を同じコミットで更新します。一覧の各項目には、Markdownと同じ `title`・`subtitle` と、ルートからの相対パス `path`（例 `knowledge/example.md`）を入れます。記事を削除するときは一覧からも削除します。ChatGPTのプロジェクトから登録する場合も同じ手順です。

## 公開と表示

- **GitHub Pages** の公開元は **Settings → Pages → Deploy from a branch → main / (root)** です。`.nojekyll` により、ルートのファイルをそのまま配信します。独自のActionsワークフローやnpmビルドは不要です。
- **Webアプリ**は `index.html`、`app.js`、`style.css` で構成します。`app.js` は `index.json` のタイトルとサブタイトルを一覧に表示し、記事を選ぶと対応する `.md` を取得します。
- **記事本文**はブラウザ内で `vendor/` のMarkedがHTMLに変換し、DOMPurifyで安全に表示できるよう処理します。原本はMarkdownのまま保存されます。

リポジトリとサイトは公開されます。公開してよい内容を追加してください。
