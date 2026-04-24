/**
 * Decorate a teaser block.
 * Expected row order: image, eyebrow, heading, description, CTA (all optional).
 * @param {Element} block the teaser block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const cta = block.querySelector('.button-wrapper');

  // plain paragraphs only — no image holders, no button wrappers
  const paras = [...block.querySelectorAll('p')].filter(
    (p) => !p.querySelector('picture') && !p.classList.contains('button-wrapper'),
  );
  const [eyebrow, description] = paras;

  const article = document.createElement('article');

  if (picture) {
    const figure = document.createElement('figure');
    figure.append(picture);
    article.append(figure);
  }

  const content = document.createElement('div');
  content.className = 'teaser-content';

  if (eyebrow) {
    eyebrow.className = 'teaser-eyebrow';
    content.append(eyebrow);
  }
  if (heading) content.append(heading);
  if (description) content.append(description);
  if (cta) content.append(cta);

  article.append(content);
  block.replaceChildren(article);
}
