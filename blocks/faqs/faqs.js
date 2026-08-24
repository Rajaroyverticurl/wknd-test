/**
 * FAQ block
 * @param {Element} block The FAQ block
 */
export default function decorate(block) {
  const rows = [...block.children];

  /*
   * Expected authored structure:
   *
   * Row 1: Title
   * Row 2: Image
   * Row 3: Description
   * Row 4+: FAQ question + answer
   * Last row: Need more help
   */

  if (!rows.length) return;

  // Create main layout
  const content = document.createElement('div');
  content.className = 'faq-content';

  const main = document.createElement('div');
  main.className = 'faq-main';

  const aside = document.createElement('aside');
  aside.className = 'faq-aside';

  // -------------------------
  // Title
  // -------------------------

  const title = rows[0];

  title.classList.add('faq-title');

  const heading = title.querySelector('h1, h2, h3');

  if (heading) {
    heading.classList.add('faq-heading');
  } else {
    const text = title.textContent.trim();

    title.textContent = '';

    const h1 = document.createElement('h1');
    h1.textContent = text;
    h1.className = 'faq-heading';

    title.append(h1);
  }

  main.append(title);

  // -------------------------
  // Image
  // -------------------------

  if (rows[1]) {
    const imageRow = rows[1];

    imageRow.classList.add('faq-image');

    main.append(imageRow);
  }

  // -------------------------
  // Description
  // -------------------------

  if (rows[2]) {
    const description = rows[2];

    description.classList.add('faq-description');

    main.append(description);
  }

  // -------------------------
  // FAQ accordion
  // -------------------------

  const accordion = document.createElement('div');
  accordion.className = 'faq-accordion';

  rows.slice(3).forEach((row) => {
    const cells = [...row.children];

    if (!cells.length) return;

    const question = cells[0];
    const answer = cells[1];

    const item = document.createElement('div');
    item.className = 'faq-item';

    const button = document.createElement('button');

    button.className = 'faq-question';
    button.type = 'button';

    button.innerHTML = `
      <span>${question.textContent.trim()}</span>
      <span class="faq-plus">+</span>
    `;

    item.append(button);

    if (answer && answer.textContent.trim()) {
      const answerContainer = document.createElement('div');

      answerContainer.className = 'faq-answer';
      answerContainer.hidden = true;
      answerContainer.append(answer.cloneNode(true));

      item.append(answerContainer);

      button.addEventListener('click', () => {
        const isOpen = !answerContainer.hidden;

        answerContainer.hidden = isOpen;
        item.classList.toggle('is-open', !isOpen);

        button.querySelector('.faq-plus').textContent = isOpen ? '+' : '−';
      });
    }

    accordion.append(item);
  });

  main.append(accordion);

  // -------------------------
  // Need more help
  // -------------------------

  const help = document.createElement('div');

  help.className = 'faq-help';

  help.innerHTML = `
    <h2>Need more help?</h2>
    <p>
      Reach us at <a href="mailto:info@example.com">info@example.com</a>
    </p>
    <p>
      Or visit our <a href="#">help center</a>.
    </p>
  `;

  aside.append(help);

  // -------------------------
  // Final layout
  // -------------------------

  content.append(main);
  content.append(aside);

  block.textContent = '';
  block.append(content);
}
