/**
 * Decorates the Tabs block where Row 1 = Tab Titles and Row 2 = Content per Tab.
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 1 = Titles, Row 2 = Contents
  const titleRow = rows[0];
  const contentRow = rows[1];

  const tabTitles = [...titleRow.children];
  const tabContents = [...contentRow.children];

  // Container for tab buttons
  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  // Container for tab panels
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'tabs-panels';

  // Build tabs and panels by matching column index
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

    // 2. Create Corresponding Panel
    const panel = document.createElement('div');
    panel.className = `tabs-panel ${index === 0 ? 'active' : ''}`;
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);

    if (contentEl) {
      panel.append(...contentEl.childNodes);
    }

    // 3. Click Event Listener
    button.addEventListener('click', () => {
      // Deactivate all buttons & panels
      tabList.querySelectorAll('.tabs-tab').forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      panelsContainer.querySelectorAll('.tabs-panel').forEach((p) => {
        p.classList.remove('active');
      });

      // Activate clicked button & matching panel
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      panel.classList.add('active');
    });

    tabList.append(button);
    panelsContainer.append(panel);
  });

  // Replace original table HTML with Tab Bar + Panels
  block.replaceChildren(tabList, panelsContainer);
}