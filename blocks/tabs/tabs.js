/**
 * Decorates the Tabs block into a 4-column card grid.
 * Explicitly separates Title and Description elements to avoid mixing.
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const titleRow = rows[0];
  const contentRow = rows[1];

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

    const tabId = `tab-btn-${index}`;
    const panelId = `tab-panel-${index}`;

    // 1. Tab Button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tabs-tab ${index === 0 ? 'active' : ''}`;
    button.id = tabId;
    button.textContent = tabName;

    // 2. Tab Panel
    const panel = document.createElement('div');
    panel.className = `tabs-panel ${index === 0 ? 'active' : ''}`;
    panel.id = panelId;

    if (contentEl) {
      const pictures = [...contentEl.querySelectorAll('picture')];

      if (pictures.length > 0) {
        pictures.forEach((pic) => {
          const card = document.createElement('div');
          card.className = 'tabs-card';

          // A. Add Image
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'tabs-card-image';
          imgWrapper.append(pic.cloneNode(true));
          card.append(imgWrapper);

          // B. Collect non-empty text elements following this picture
          const picParent = pic.closest('p') || pic.parentElement;
          const textElements = [];
          let sibling = picParent.nextElementSibling;

          while (sibling && !sibling.querySelector('picture')) {
            if (sibling.textContent.trim().length > 0) {
              textElements.push(sibling);
            }
            sibling = sibling.nextElementSibling;
          }

          // C. First text element = Title (h3)
          if (textElements.length > 0) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'tabs-card-title';
            titleEl.textContent = textElements[0].textContent.trim();
            card.append(titleEl);
          }

          // D. Second text element = Description (p)
          if (textElements.length > 1) {
            const descEl = document.createElement('p');
            descEl.className = 'tabs-card-desc';
            descEl.textContent = textElements[1].textContent.trim();
            card.append(descEl);
          }

          panel.append(card);
        });
      } else {
        [...contentEl.children].forEach((child) => {
          const card = document.createElement('div');
          card.className = 'tabs-card';
          card.append(child.cloneNode(true));
          panel.append(card);
        });
      }
    }

    // Toggle click event
    button.addEventListener('click', () => {
      tabList.querySelectorAll('.tabs-tab').forEach((btn) => btn.classList.remove('active'));
      panelsContainer.querySelectorAll('.tabs-panel').forEach((p) => p.classList.remove('active'));

      button.classList.add('active');
      panel.classList.add('active');
    });

    tabList.append(button);
    panelsContainer.append(panel);
  });

  block.replaceChildren(tabList, panelsContainer);
}