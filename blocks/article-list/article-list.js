import { createOptimizedPicture } from '../../scripts/aem.js';

const PAGE_SIZE = 12;

async function fetchArticles(source, offset, pathPrefix) {
  const url = `${source}?limit=${PAGE_SIZE + 20}&offset=${offset}`;
  const resp = await fetch(url);
  if (!resp.ok) return { data: [], total: 0 };
  const json = await resp.json();
  const filtered = pathPrefix
    ? json.data.filter((a) => a.path && a.path.startsWith(pathPrefix))
    : json.data;
  return { data: filtered.slice(0, PAGE_SIZE), total: filtered.length };
}

function createCard(article) {
  const li = document.createElement('li');
  li.className = 'article-card';

  const link = document.createElement('a');
  link.href = article.path;
  link.setAttribute('aria-label', article.title);

  if (article.image) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'article-card-image';
    const img = new Image();
    img.src = article.image;
    img.alt = article.title || '';
    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
    imgWrapper.append(picture);
    link.append(imgWrapper);
  }

  const body = document.createElement('div');
  body.className = 'article-card-body';

  if (article.tags) {
    const tag = document.createElement('span');
    tag.className = 'article-card-tag';
    tag.textContent = article.tags.split(',')[0].trim();
    body.append(tag);
  }

  const title = document.createElement('h3');
  title.textContent = article.title || '';
  body.append(title);

  if (article.description) {
    const desc = document.createElement('p');
    desc.textContent = article.description;
    body.append(desc);
  }

  const readMore = document.createElement('span');
  readMore.className = 'article-card-cta';
  readMore.textContent = 'Read article →';
  body.append(readMore);

  link.append(body);
  li.append(link);
  return li;
}

export default async function decorate(block) {
  const configRow = block.querySelector(':scope > div > div');
  const configText = configRow?.textContent?.trim() || '';
  const [sourceLine, prefixLine] = configText.split('\n').map((s) => s.trim());
  const source = sourceLine || '/query-index.json';
  const pathPrefix = prefixLine || '/magazine/';
  block.textContent = '';

  const ul = document.createElement('ul');
  ul.className = 'article-list-grid';
  block.append(ul);

  let offset = 0;
  let total = 0;

  const moreBtn = document.createElement('div');
  moreBtn.className = 'article-list-more-wrapper';
  const btn = document.createElement('button');
  btn.className = 'button primary';
  btn.textContent = 'Load more articles';
  moreBtn.append(btn);

  async function loadPage() {
    btn.disabled = true;
    const result = await fetchArticles(source, offset, pathPrefix);
    total = result.total;
    result.data.forEach((article) => ul.append(createCard(article)));
    offset += result.data.length;
    btn.disabled = false;
    if (offset >= total) moreBtn.remove();
    else if (!moreBtn.parentElement) block.append(moreBtn);
  }

  btn.addEventListener('click', loadPage);
  await loadPage();

  if (!ul.children.length) {
    const empty = document.createElement('p');
    empty.className = 'article-list-empty';
    empty.textContent = 'No articles found. Check back soon!';
    block.append(empty);
  }
}
