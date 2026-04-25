/**
 * Fetches team data from a spreadsheet published as JSON and renders member cards.
 * The block cell should contain the path to the spreadsheet, e.g. /data/team
 * @param {Element} block the team block element
 */
export default async function decorate(block) {
  const path = block.querySelector('a')?.getAttribute('href')
    || block.textContent.trim();

  if (!path) return;

  let data;
  try {
    const resp = await fetch(`${path}.json`);
    if (!resp.ok) throw new Error(resp.statusText);
    ({ data } = await resp.json());
  } catch (e) {
    block.textContent = 'Could not load team data.';
    return;
  }

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

  block.replaceChildren(list);
}
