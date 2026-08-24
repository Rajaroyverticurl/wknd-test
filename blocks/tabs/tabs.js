/**
 * Decorates the Tabs block into a 4-column card grid with image, title, and description.
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const titleRow = rows[0];
  const contentRow = rows[1];

  const tabTitles = [...titleRow.children];
  const tabContents = [...contentRow.children];

  // Tab navigation bar container
  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  // Tab panels wrapper container
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'tabs-panels';

  tabTitles.forEach((titleEl, index) => {
    const tabName = titleEl.textContent.trim();
    const contentEl = tabContents[index];

    const tabId = `tab-btn-${index}`;
    const panelId = `tab-panel-${index}`;

    // 1. Create Tab Button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tabs-tab ${index === 0 ? 'active' : ''}`;
    button.id = tabId;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', panelId);
    button.textContent = tabName;

    // 2. Create Tab Panel
    const panel = document.createElement('div');
    panel.className = `tabs-panel ${index === 0 ? 'active' : ''}`;
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);

    if (contentEl) {
      // Find pictures and pair them with accompanying Title & Description
      const pictures = [...contentEl.querySelectorAll('picture')];

      if (pictures.length > 0) {
        pictures.forEach((pic) => {
          const card = document.createElement('div');
          card.className = 'tabs-card';

          // Image container
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'tabs-card-image';
          imgWrapper.append(pic.cloneNode(true));
          card.append(imgWrapper);

          // Find Title element (paragraph following picture)
          const parentPara = pic.closest('p') || pic.parentElement;
          let nextEl = parentPara ? parentPara.nextElementSibling : pic.nextElementSibling;

          if (nextEl) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'tabs-card-title';
            titleEl.textContent = nextEl.textContent.trim();
            card.append(titleEl);

            nextEl = nextEl.nextElementSibling;
          }

          // Find Description element (paragraph following title)
          if (nextEl && !nextEl.querySelector('picture')) {
            const descEl = document.createElement('p');
            descEl.className = 'tabs-card-desc';
            descEl.textContent = nextEl.textContent.trim();
            card.append(descEl);
          }

          panel.append(card);
        });
      } else {
        // Fallback for direct children
        [...contentEl.children].forEach((child) => {
          const card = document.createElement('div');
          card.className = 'tabs-card';
          card.append(child.cloneNode(true));
          panel.append(card);
        });
      }
    }

    // Tab toggle click listener
    button.addEventListener('click', () => {
      tabList.querySelectorAll('.tabs-tab').forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      panelsContainer.querySelectorAll('.tabs-panel').forEach((p) => p.classList.remove('active'));

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      panel.classList.add('active');
    });

    tabList.append(button);
    panelsContainer.append(panel);
  });

  block.replaceChildren(tabList, panelsContainer);
}