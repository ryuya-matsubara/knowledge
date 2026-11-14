# Knowledge

覚えておきたい知識をMarkdownで保存し、Webサイトで閲覧・共有するリポジトリです。

## 記事を追加・更新する

`knowledge/` に1テーマにつき1つの `.md` ファイルを置きます。記事の先頭にはタイトルとサブタイトルをYAMLの文字列で書きます。本文は2つ目の `---` の下に書きます。

```markdown
---
title: "記事のタイトル"
subtitle: "記事のサブタイトル"
---

ここに本文を書きます。見出し、箇条書き、リンク、表、コードブロックを使えます。
```

記事と一緒に、ルートの `index.json` を同じコミットで更新します。

- 追加時は `title`、`subtitle`、`path` を持つ項目を追加します。タイトルとサブタイトルはMarkdownの先頭とそろえ、`path` にはルートからの相対パスを書きます。サブフォルダ内の記事も登録できます。
- 更新時は同じ `path` の項目を編集します。削除時は対応する項目も削除します。公開後にファイル名を変えると、以前の記事URLは使えなくなります。
- ChatGPTから記事を登録する場合は、プロジェクトの指示でMarkdownと `index.json` の両方を同じコミットに含めるよう指定します。

このリポジトリとGitHub Pagesには公開してよい内容を追加してください。

## 公開と表示の仕組み

GitHub Pagesの公開元は **Deploy from a branch → main / (root)** です。Pagesはルートの `index.html`、`app.js`、`style.css` などをそのまま公開します。

アプリは `index.json` を読み込んで一覧を表示します。記事を選ぶと `knowledge/` から対象のMarkdownを取得し、ブラウザで整形します。Markdownの変換には `vendor/` のMarkedを使い、DOMPurifyで表示前のHTMLをサニタイズします。
