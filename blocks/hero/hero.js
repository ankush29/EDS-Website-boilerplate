export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cell = row.firstElementChild;
  if (!cell) return;

  const picture = cell.querySelector('picture');
  const content = document.createElement('div');
  content.className = 'hero-content';
  const inner = document.createElement('div');
  inner.className = 'hero-content-inner';

  [...cell.children].forEach((el) => {
    if (el !== picture) inner.append(el);
  });
  content.append(inner);
  block.replaceChildren(picture, content);
}
