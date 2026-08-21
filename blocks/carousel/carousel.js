export default function decorate(block) {
  const rows = [...block.children];

  const slides = [];

  rows.forEach((row) => {
    const cells = [...row.children];

    if (!cells.length) return;

    /*
     * DA.live structure:
     *
     * 2 columns:
     * Image | Content
     *
     * OR
     *
     * 4 columns:
     * Image | Title | Description | Button
     */

    const imageCell = cells[0];
    const image = imageCell?.querySelector('img');

    if (!image) return;

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    /* IMAGE */
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'carousel-image';

    const img = image.cloneNode(true);
    imageWrapper.appendChild(img);

    slide.appendChild(imageWrapper);

    /* CONTENT */
    const content = document.createElement('div');
    content.className = 'carousel-content';

    if (cells.length === 2) {
      /*
       * 2-column DA.live structure
       * Image | Content
       */

      const contentCell = cells[1];

      /*
       * Copy the authored content.
       * This preserves heading, paragraph and link.
       */
      [...contentCell.children].forEach((element) => {
        const clone = element.cloneNode(true);
        content.appendChild(clone);
      });
    } else {
      /*
       * 4-column structure
       * Image | Title | Description | Button
       */

      const title = cells[1]?.textContent.trim();
      const description = cells[2]?.textContent.trim();
      const link = cells[3]?.querySelector('a');

      if (title) {
        const heading = document.createElement('h2');
        heading.textContent = title;
        content.appendChild(heading);
      }

      if (description) {
        const paragraph = document.createElement('p');
        paragraph.textContent = description;
        content.appendChild(paragraph);
      }

      if (link) {
        const button = link.cloneNode(true);
        button.className = 'carousel-button';

        if (!button.textContent.trim()) {
          button.textContent = 'VIEW TRIP';
        }

        content.appendChild(button);
      }
    }

    /* Convert authored link to button */
    const authoredLink = content.querySelector('a');

    if (authoredLink) {
      authoredLink.classList.add('carousel-button');

      if (!authoredLink.textContent.trim()) {
        authoredLink.textContent = 'VIEW TRIP';
      }
    }

    slide.appendChild(content);

    slides.push(slide);
  });

  /*
   * IMPORTANT:
   * If no slides were found, don't destroy the authored content.
   */
  if (!slides.length) {
    console.warn('Carousel: no valid slides found.');
    return;
  }

  /* Clear block */
  block.innerHTML = '';

  /* VIEWPORT */
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  /* TRACK */
  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide) => {
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  block.appendChild(viewport);

  /* CONTROLS */
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  /* DOTS */
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');

    dot.type = 'button';
    dot.className = 'carousel-dot';

    if (index === 0) {
      dot.classList.add('active');
    }

    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

    dot.addEventListener('click', () => {
      goToSlide(index);
    });

    dots.appendChild(dot);
  });

  /* ARROWS */
  const arrows = document.createElement('div');
  arrows.className = 'carousel-arrows';

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'carousel-arrow';
  previous.setAttribute('aria-label', 'Previous slide');
  previous.innerHTML = '&#8592;';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-arrow';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '&#8594;';

  arrows.appendChild(previous);
  arrows.appendChild(next);

  controls.appendChild(dots);
  controls.appendChild(arrows);

  block.appendChild(controls);

  let currentSlide = 0;

  function goToSlide(index) {
    currentSlide = index;

    track.style.transform =
      `translateX(-${currentSlide * 100}%)`;

    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  previous.addEventListener('click', () => {
    const index =
      currentSlide === 0
        ? slides.length - 1
        : currentSlide - 1;

    goToSlide(index);
  });

  next.addEventListener('click', () => {
    const index =
      currentSlide === slides.length - 1
        ? 0
        : currentSlide + 1;

    goToSlide(index);
  });
}