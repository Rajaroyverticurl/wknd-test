export default function decorate(block) {
  const rows = [...block.children];

  const slides = rows.map((row) => {
    const cells = [...row.children];

    const image = cells[0]?.querySelector('img');
    const title = cells[1]?.textContent.trim() || '';
    const description = cells[2]?.textContent.trim() || '';
    const link = cells[3]?.querySelector('a');

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    /* Background image */
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'carousel-image';

    if (image) {
      const img = image.cloneNode(true);
      imageWrapper.appendChild(img);
    }

    /* Content box */
    const content = document.createElement('div');
    content.className = 'carousel-content';

    if (title) {
      const heading = document.createElement('h2');
      heading.textContent = title;
      content.appendChild(heading);
    }

    if (description) {
      const text = document.createElement('p');
      text.textContent = description;
      content.appendChild(text);
    }

    if (link) {
      const button = document.createElement('a');
      button.className = 'carousel-button';
      button.href = link.href;
      button.textContent = link.textContent.trim() || 'VIEW TRIP';

      if (link.target) {
        button.target = link.target;
      }

      content.appendChild(button);
    }

    slide.appendChild(imageWrapper);
    slide.appendChild(content);

    return slide;
  });

  /* Clear authored content */
  block.innerHTML = '';

  /* Carousel */
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide) => {
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  block.appendChild(viewport);

  /* Controls */
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');

    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

    if (index === 0) {
      dot.classList.add('active');
    }

    dot.addEventListener('click', () => {
      goToSlide(index);
    });

    dots.appendChild(dot);
  });

  const arrows = document.createElement('div');
  arrows.className = 'carousel-arrows';

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'carousel-arrow carousel-prev';
  previous.setAttribute('aria-label', 'Previous slide');
  previous.innerHTML = '&#8592;';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-arrow carousel-next';
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

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  previous.addEventListener('click', () => {
    const newIndex =
      currentSlide === 0
        ? slides.length - 1
        : currentSlide - 1;

    goToSlide(newIndex);
  });

  next.addEventListener('click', () => {
    const newIndex =
      currentSlide === slides.length - 1
        ? 0
        : currentSlide + 1;

    goToSlide(newIndex);
  });
}