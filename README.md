# Knowledge

覚えておきたい知識をMarkdownで保存し、Webサイトで閲覧・共有するリポジトリです。

## 記事を追加する

`knowledge/` に1テーマにつき1つの `.md` ファイルを作ります。サブフォルダも使えます。ファイル名は記事URLの一部になるので、公開後は維持するとリンクが切れません。

```markdown
---
title: "Ethernetとは？"
subtitle: "LAN内でデータを届ける仕組み"
---

ここに本文を書きます。Markdownの見出し、表、リンク、コードブロックを使えます。
```

`title` と `subtitle` は必須です。本文は2つ目の `---` の下に書きます。このリポジトリとGitHub Pagesは公開用です。公開してよい内容を追加してください。

## 一覧と公開の仕組み

`main` の `knowledge/` などに変更が入ると、GitHub Actionsがサイトをビルドします。タイトル、サブタイトル、ファイルパスをまとめた `dist/index.json` を毎回生成し、アプリと元のMarkdownファイルをまとめて公開します。索引を手で編集したり、Gitにコミットしたりする必要はありません。

アプリは一覧を表示する際に `index.json` を読みます。記事を選ぶと、その記事のMarkdownファイルを取得し、ブラウザで本文を整形します。

## GitHub Pagesの初回設定

1. リポジトリの **Settings → Pages** を開きます。
2. **Build and deployment → Source** で **GitHub Actions** を選択します。
3. **Actions → Publish knowledge to GitHub Pages → Run workflow** で、ブランチに `main` を選んで実行します。

デプロイ後のURLは、通常 `https://ryuya-matsubara.github.io/knowledge/` です。

## ローカルで生成する

Node.js 24を使います。

```sh
npm ci
npm run build
```

`npm ci` はロックファイルに記録された依存関係をインストールします。`npm run build` は、サイト、`index.json`、配信用のMarkdownを `dist/` に出力します。
