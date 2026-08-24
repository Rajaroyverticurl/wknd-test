import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Add semantic classes to the authored rows.
  rows.forEach((row, index) => {
    row.classList.add(`footer-row-${index + 1}`);
  });

  // Optional: turn social links into icon links.
  const links = block.querySelectorAll('a');

  links.forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}
