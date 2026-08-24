/**
 * Decorates the Adventures filterable tabs and grid block.
 * @param {Element} block The adventures block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Set to collect unique categories for tabs (default starts with ALL)
  const categories = new Set(['ALL']);
  const cardItems = [];

  // Parse authored rows
  rows.forEach((row) => {
    const picture = row.children[0]?.querySelector('picture') || row.children[0]?.querySelector('img');
    const title = row.children[1]?.textContent?.trim() || '';
    const category = row.children[2]?.textContent?.trim().toUpperCase() || 'OTHER';

    if (category) {
      category.split(',').forEach((cat) => categories.add(cat.trim()));
    }

    cardItems.push({
      picture,
      title,
      category,
    });
  });

  // 1. Build Filter Tabs Bar
  const tabsUl = document.createElement('ul');
  tabsUl.className = 'adventures-tabs';

  categories.forEach((cat) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `adventures-tab-btn ${cat === 'ALL' ? 'active' : ''}`;
    button.textContent = cat;
    button.dataset.category = cat;

    // Filter click handler
    button.addEventListener('click', () => {
      // Update active tab button style
      tabsUl.querySelectorAll('.adventures-tab-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter card visibility
      const selectedCategory = button.dataset.category;
      block.querySelectorAll('.adventures-card').forEach((card) => {
        const cardCat = card.dataset.category;
        if (selectedCategory === 'ALL' || cardCat.includes(selectedCategory)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });

    li.append(button);
    tabsUl.append(li);
  });

  // 2. Build 4-Column Cards Grid
  const grid = document.createElement('div');
  grid.className = 'adventures-grid';

  cardItems.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'adventures-card';
    card.dataset.category = item.category;

    // Image container
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'adventures-card-image';
    if (item.picture) {
      imgWrapper.append(item.picture.cloneNode(true));
    }

    // Card Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'adventures-card-title';
    titleEl.textContent = item.title;

    card.append(imgWrapper, titleEl);
    grid.append(card);
  });

  // Replace original table structure with generated Tabs & Grid
  block.replaceChildren(tabsUl, grid);
}