const INSTAGRAM_ORIGINS = ['www.instagram.com', 'instagram.com'];
const INSTAGRAM_PATH = /^\/(p|reel|tv)\/([^/?#]+)/;

function getInstagramPermalink(url) {
  try {
    const { hostname, pathname } = new URL(url);
    if (!INSTAGRAM_ORIGINS.includes(hostname)) return null;
    if (!INSTAGRAM_PATH.test(pathname)) return null;
    // Normalize to canonical permalink
    const [, type, id] = pathname.match(INSTAGRAM_PATH);
    return `https://www.instagram.com/${type}/${id}/`;
  } catch {
    return null;
  }
}

function loadEmbedScript() {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }
  if (document.querySelector('script[src*="instagram.com/embed.js"]')) return;
  const script = document.createElement('script');
  script.src = 'https://www.instagram.com/embed.js';
  script.async = true;
  document.head.append(script);
}

function createEmbed(permalink) {
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'instagram-media';
  blockquote.dataset.instgrmPermalink = permalink;
  blockquote.dataset.instgrmVersion = '14';
  blockquote.dataset.instgrmCaptioned = '';

  const placeholder = document.createElement('a');
  placeholder.href = permalink;
  placeholder.textContent = 'View this post on Instagram';
  blockquote.append(placeholder);

  return blockquote;
}

/**
 * Decorate an embed block containing an Instagram URL.
 * @param {Element} block the embed block element
 */
export default function decorate(block) {
  const anchor = block.querySelector('a[href]');
  if (!anchor) return;

  const permalink = getInstagramPermalink(anchor.href);
  if (!permalink) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'embed-instagram';
  wrapper.append(createEmbed(permalink));

  block.replaceChildren(wrapper);
  loadEmbedScript();
}
