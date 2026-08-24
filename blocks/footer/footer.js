import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer fragment
  const footerPath = '/footer';

  const fragment = await loadFragment(footerPath);

  if (!fragment) {
    return;
  }

  // Replace block content with footer fragment content
  block.textContent = '';
  block.append(fragment);

  // Get the rows from the loaded fragment
  const rows = [...block.querySelectorAll(':scope > div > div')];

  rows.forEach((row, index) => {
    row.classList.add(`footer-row-${index + 1}`);
  });

  // External/social links
  const links = block.querySelectorAll('a');

  links.forEach((link) => {
    if (link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}
