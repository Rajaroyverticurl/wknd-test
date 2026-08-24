/**
 * Decorates the Accordion block.
 * @param {Element} block The accordion block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    // Extract title (first column) and content (second column)
    const label = row.children[0];
    const body = row.children[1];

    if (label && body) {
      // Create semantic summary header
      const summary = document.createElement('summary');
      summary.className = 'accordion-item-label';
      summary.append(...label.childNodes);

      // Wrap body content
      body.className = 'accordion-item-body';

      // Create details element
      const details = document.createElement('details');
      details.className = 'accordion-item';
      details.append(summary, body);

      // Replace original row with decorated details element
      row.replaceWith(details);
    }
  });
}