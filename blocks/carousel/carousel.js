export default function decorate(block) {
  const rows = [...block.children];

  const slides = [];

  rows.forEach((row) => {
    const cells = [...row.children];

    // Need at least image, title and description
    if (cells.length < 3) return;

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    /* IMAGE */
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'carousel-image';

    const image = cells[0].querySelector('img');

    if (image) {
      const img = image.cloneNode(true);
      imageWrapper.appendChild(img);
    }

    /* CONTENT */
    const content = document.createElement('div');
    content.className = 'carousel-content';

    /* TITLE */
    const title = cells[1].textContent.trim();

    if (title) {
      const heading = document.createElement('h2');
      heading.textContent = title;
      content.appendChild(heading);
    }

    /* DESCRIPTION */
    const description = cells[2].textContent.trim();

    if (description) {
      const paragraph = document.createElement('p');
      paragraph.textContent = description;
      content.appendChild(paragraph);
    }

    /* BUTTON */
    if (cells[3]) {
      const link = cells[3].querySelector('a');

      if (link) {
        const button = document.createElement('a');

        button.className = 'carousel-button';
        button.href = link.href;
        button.textContent =
          link.textContent.trim() || 'VIEW TRIP';

        if (link.target) {
          button.target = link.target;
        }

        content.appendChild(button);
      }
    }

    slide.appendChild(imageWrapper);
    slide.appendChild(content);

    slides.push(slide);
  });

  /* Clear authored content */
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
  previous.setAttribute('aria-label', 'Previous');
  previous.innerHTML = '&#8592;';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-arrow';
  next.setAttribute('aria-label', 'Next');
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
      dot.classList.toggle(
        'active',
        i === currentSlide
      );
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