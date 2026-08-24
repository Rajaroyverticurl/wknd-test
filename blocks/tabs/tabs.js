/**
 * Decorates the Tabs block for multi-card column authoring.
 * Accounts for table header rows and hyperlinked titles.
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Determine if Row 0 is the block header 'tabs'
  let titleRow = rows[0];
  let contentRow = rows[1];

  if (rows.length > 2 && titleRow.children.length === 1) {
    titleRow = rows[1];
    contentRow = rows[2];
  }

  if (!titleRow || !contentRow) return;

  const tabTitles = [...titleRow.children];
  const tabContents = [...contentRow.children];

  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'tabs-panels';

  tabTitles.forEach((titleEl, index) => {
    const tabName = titleEl.textContent.trim();
    const contentEl = tabContents[index];

    if (!tabName) return;

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
      const elements = [...contentEl.children];
      let i = 0;

      // Group elements into distinct cards: Image -> Title -> Description
      while (i < elements.length) {
        const el = elements[i];
        const pic = el.querySelector('picture') || (el.tagName === 'PICTURE' ? el : null);

        if (pic) {
          const card = document.createElement('div');
          card.className = 'tabs-card';

          // A. Card Image
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'tabs-card-image';
          imgWrapper.append(pic.cloneNode(true));
          card.append(imgWrapper);

          // B. Card Title (Preserves hyperlinked <a> tags)
          i++;
          if (i < elements.length && !elements[i].querySelector('picture')) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'tabs-card-title';
            titleEl.innerHTML = elements[i].innerHTML; // Keeps link HTML intact
            card.append(titleEl);
            i++;
          }

          // C. Card Description Subtext
          if (i < elements.length && !elements[i].querySelector('picture')) {
            const descEl = document.createElement('p');
            descEl.className = 'tabs-card-desc';
            descEl.innerHTML = elements[i].innerHTML;
            card.append(descEl);
            i++;
          }

          panel.append(card);
        } else {
          i++;
        }
      }
    }

    // Tab button click listener
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