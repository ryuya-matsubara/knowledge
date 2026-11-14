import DOMPurify from './vendor/purify.es.mjs';
import { marked } from './vendor/marked.esm.js';

const listView = document.querySelector('#list-view');
const listTitle = document.querySelector('#list-title');
const listStatus = document.querySelector('#list-status');
const articleList = document.querySelector('#articles');
const articleView = document.querySelector('#article-view');
const articleTitle = document.querySelector('#article-title');
const articleSubtitle = document.querySelector('#article-subtitle');
const articleStatus = document.querySelector('#article-status');
const articleBody = document.querySelector('#article-body');
const articles = new Map();
const links = new Map();
let articleRequest;
let lastArticlePath;

function makeArticleLink(article) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  const title = document.createElement('span');
  const subtitle = document.createElement('span');
  link.href = `#${encodeURIComponent(article.path)}`;
  title.className = 'article-link-title';
  title.textContent = article.title;
  subtitle.className = 'subtitle';
  subtitle.textContent = article.subtitle;
  link.append(title, subtitle);
  item.append(link);
  links.set(article.path, link);
  return item;
}

function activeArticlePath() {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return location.hash.slice(1);
  }
}

async function renderRoute() {
  articleRequest?.abort();
  const path = activeArticlePath();
  const returningToList = !articleView.hidden && !path;
  listView.hidden = Boolean(path);
  articleView.hidden = !path;

  if (!path) {
    document.title = 'Knowledge';
    if (returningToList) {
      (links.get(lastArticlePath) ?? listTitle).focus();
    }
    return;
  }

  lastArticlePath = path;
  const article = articles.get(path);
  articleTitle.textContent = article?.title ?? '記事が見つかりません';
  articleSubtitle.textContent = article?.subtitle ?? '';
  articleStatus.textContent = '';
  articleBody.replaceChildren();
  document.title = `${articleTitle.textContent} | Knowledge`;
  articleTitle.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  if (!article) return;

  const request = new AbortController();
  articleRequest = request;
  articleStatus.textContent = '記事を読み込んでいます…';

  try {
    const articleUrl = article.path.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`./${articleUrl}`, { signal: request.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const source = await response.text();
    if (request.signal.aborted) return;

    const markdown = source.replace(/^\uFEFF?---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '');
    const html = marked.parse(markdown);
    articleBody.replaceChildren(DOMPurify.sanitize(html, {
      RETURN_DOM_FRAGMENT: true,
      USE_PROFILES: { html: true },
    }));
    articleStatus.textContent = '';
  } catch (error) {
    if (!request.signal.aborted) {
      articleStatus.textContent = '記事を読み込めませんでした。ページを再読み込みしてください。';
      console.error(error);
    }
  }
}

try {
  const response = await fetch('./index.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const index = await response.json();
  for (const article of index) articles.set(article.path, article);
  articleList.replaceChildren(...index.map(makeArticleLink));
  listStatus.textContent = index.length ? '' : '記事はまだありません。';
  window.addEventListener('hashchange', renderRoute);
  await renderRoute();
} catch (error) {
  listStatus.textContent = '記事一覧を読み込めませんでした。ページを再読み込みしてください。';
  console.error(error);
}
