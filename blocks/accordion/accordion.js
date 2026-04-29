export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [titleCell, contentCell] = row.children;
    if (!titleCell || !contentCell) return;

    titleCell.classList.add('accordion-item-title');
    contentCell.classList.add('accordion-item-content');
    contentCell.hidden = true;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'accordion-item-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `<span>${titleCell.innerHTML}</span><span class="accordion-icon" aria-hidden="true"></span>`;
    titleCell.textContent = '';
    titleCell.append(btn);

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      contentCell.hidden = expanded;
    });
  });
}
