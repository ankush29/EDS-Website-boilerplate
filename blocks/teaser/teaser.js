/**
 * Decorate a teaser block.
 * Row order: image, eyebrow, heading, description, CTA (all optional).
 * Works whether rows are wrapped in <p> tags or plain <div> text (CMS variance).
 * @param {Element} block the teaser block element
 */
export default function decorate(block) {
  const cells = [...block.children].map((row) => row.firstElementChild);

  const imgCell = cells.find((c) => c?.querySelector('picture'));
  const ctaCell = cells.find((c) => c?.querySelector('a[href]'));
  const textCells = cells.filter(
    (c) => c && c !== imgCell && c !== ctaCell && c.textContent.trim(),
  );
  const [eyebrowCell, headingCell, descCell] = textCells;

  const article = document.createElement('article');

  // image
  if (imgCell) {
    const figure = document.createElement('figure');
    figure.append(imgCell.querySelector('picture'));
    article.append(figure);
  }

  const content = document.createElement('div');
  content.className = 'teaser-content';

  // eyebrow
  if (eyebrowCell) {
    const p = document.createElement('p');
    p.className = 'teaser-eyebrow';
    p.textContent = eyebrowCell.textContent.trim();
    content.append(p);
  }

  // heading — promote plain text to <h2> if the CMS didn't add a heading tag
  if (headingCell) {
    const existing = headingCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (existing) {
      content.append(existing);
    } else {
      const h2 = document.createElement('h2');
      h2.textContent = headingCell.textContent.trim();
      content.append(h2);
    }
  }

  // description
  if (descCell) {
    const existing = descCell.querySelector('p');
    if (existing) {
      content.append(existing);
    } else {
      const p = document.createElement('p');
      p.textContent = descCell.textContent.trim();
      content.append(p);
    }
  }

  // CTA — works whether decorateButtons has already run or not
  if (ctaCell) {
    const buttonWrapper = ctaCell.querySelector('.button-wrapper');
    if (buttonWrapper) {
      content.append(buttonWrapper);
    } else {
      const a = ctaCell.querySelector('a[href]');
      if (a) {
        a.className = 'button primary';
        const wrapper = document.createElement('p');
        wrapper.className = 'button-wrapper';
        wrapper.append(a);
        content.append(wrapper);
      }
    }
  }

  article.append(content);
  block.replaceChildren(article);
}
