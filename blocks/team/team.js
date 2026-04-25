const PAGE_SIZE = 20;

/**
 * Fetches one page of team data from the AEM spreadsheet JSON endpoint.
 * Uses the API's built-in limit/offset for server-side pagination.
 * @param {string} path spreadsheet path (without .json)
 * @param {number} offset row offset
 * @returns {{ data: object[], total: number }}
 */
async function fetchPage(path, offset) {
  const resp = await fetch(`${path}.json?limit=${PAGE_SIZE}&offset=${offset}`);
  if (!resp.ok) throw new Error(resp.statusText);
  const json = await resp.json();
  // AEM API respects limit/offset; local static files return everything — slice as fallback
  const data = json.data.length > PAGE_SIZE
    ? json.data.slice(offset, offset + PAGE_SIZE)
    : json.data;
  return { data, total: json.total };
}

function renderCards(data) {
  const list = document.createElement('ul');
  list.className = 'team-list';

  data.forEach((member) => {
    const li = document.createElement('li');
    li.className = 'team-card';

    const name = document.createElement('h3');
    name.textContent = member.Name || '';

    const role = document.createElement('p');
    role.className = 'team-role';
    role.textContent = member.Role || '';

    const location = document.createElement('p');
    location.className = 'team-location';
    location.textContent = member.Location || '';

    const bio = document.createElement('p');
    bio.className = 'team-bio';
    bio.textContent = member.Bio || '';

    li.append(name, role, location, bio);
    list.append(li);
  });

  return list;
}

function renderPagination(offset, total, onPage) {
  const nav = document.createElement('nav');
  nav.className = 'team-pagination';
  nav.setAttribute('aria-label', 'Team pagination');

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const prev = document.createElement('button');
  prev.className = 'button secondary team-pagination-prev';
  prev.textContent = 'Previous';
  prev.disabled = offset === 0;
  prev.addEventListener('click', () => onPage(offset - PAGE_SIZE));

  const info = document.createElement('span');
  info.className = 'team-pagination-info';
  const from = offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);
  info.textContent = `${from}–${to} of ${total}`;
  info.setAttribute('aria-live', 'polite');

  const next = document.createElement('button');
  next.className = 'button secondary team-pagination-next';
  next.textContent = 'Next';
  next.disabled = currentPage >= totalPages;
  next.addEventListener('click', () => onPage(offset + PAGE_SIZE));

  nav.append(prev, info, next);
  return nav;
}

/**
 * Fetches team data from a spreadsheet published as JSON and renders member cards
 * with server-side pagination (20 results per page).
 * The block cell should contain the path to the spreadsheet, e.g. /data/team
 * @param {Element} block the team block element
 */
export default async function decorate(block) {
  const path = block.querySelector('a')?.getAttribute('href')
    || block.textContent.trim();

  if (!path) return;

  async function loadPage(offset) {
    block.setAttribute('aria-busy', 'true');

    let result;
    try {
      result = await fetchPage(path, offset);
    } catch {
      block.textContent = 'Could not load team data.';
      return;
    }

    const { data, total } = result;
    const list = renderCards(data);

    // only show pagination when there is more than one page
    if (total > PAGE_SIZE) {
      const nav = renderPagination(offset, total, (newOffset) => {
        loadPage(newOffset);
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      block.replaceChildren(list, nav);
    } else {
      block.replaceChildren(list);
    }

    block.removeAttribute('aria-busy');
  }

  await loadPage(0);
}
