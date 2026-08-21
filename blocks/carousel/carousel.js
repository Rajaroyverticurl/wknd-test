export default function decorate(block) {
  /*
   * The original DA.live content is:
   *
   * Row 1 = header
   * Row 2+ = carousel items
   *
   * We read the authored rows and rebuild
   * the block into the carousel structure.
   */

  const rows = [...block.children];

  if (!rows.length) return;

  /*
   * Remove the block heading/header row.
   */

  const header = rows.shift();

  /*
   * Create carousel wrapper
   */

  const carousel = document.createElement('div');
  carousel.className = 'carousel-wrapper';

  /*
   * Create slider
   */

  const slider = document.createElement('div');
  slider.className = 'carousel-slider';

  /*
   * Create navigation
   */

  const prev = document.createElement('button');
  prev.className = 'carousel-arrow carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '&#8592;';

  const next = document.createElement('button');
  next.className = 'carousel-arrow carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '&#8594;';

  /*
   * Dots
   */

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  /*
   * Build slides from DA.live rows
   */

  rows.forEach((row, index) => {
    const cells = [...row.children];

    if (!cells.length) return;

    const imageCell = cells[0];
    const titleCell = cells[1];
    const descriptionCell = cells[2];
    const linkCell = cells[3];

    /*
     * Create slide
     */

    const slide = document.createElement('article');
    slide.className = 'carousel-slide';

    /*
     * Image
     */

    const image = imageCell?.querySelector('img');

    if (image) {
      const picture = document.createElement('div');
      picture.className = 'carousel-image';

      picture.appendChild(image.cloneNode(true));

      slide.appendChild(picture);
    }

    /*
     * Content card
     */

    const content = document.createElement('div');
    content.className = 'carousel-content';

    /*
     * Title
     */

    if (titleCell) {
      const title = document.createElement('h2');

      title.innerHTML = titleCell.innerHTML;

      content.appendChild(title);
    }

    /*
     * Description
     */

    if (descriptionCell) {
      const description = document.createElement('p');

      description.innerHTML = descriptionCell.innerHTML;

      content.appendChild(description);
    }

    /*
     * Link
     */

    const link = linkCell?.querySelector('a');

    if (link) {
      const button = link.cloneNode(true);

      button.classList.add('carousel-button');

      content.appendChild(button);
    }

    slide.appendChild(content);

    slider.appendChild(slide);


    /*
     * Create dot
     */

    const dot = document.createElement('button');

    dot.className = 'carousel-dot';

    dot.setAttribute(
      'aria-label',
      `Go to slide ${index + 1}`,
    );

    dot.dataset.index = index;

    dots.appendChild(dot);
  });


  /*
   * Build final structure
   */

  carousel.appendChild(slider);

  carousel.appendChild(dots);

  carousel.appendChild(prev);

  carousel.appendChild(next);


  /*
   * Replace DA.live content
   */

  block.innerHTML = '';

  block.appendChild(carousel);


  /*
   * Get slides/dots
   */

  const slides = [
    ...slider.querySelectorAll('.carousel-slide'),
  ];

  const dotButtons = [
    ...dots.querySelectorAll('.carousel-dot'),
  ];


  if (!slides.length) return;


  let current = 0;


  /*
   * Show slide
   */

  function showSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    }

    if (index >= slides.length) {
      index = 0;
    }

    current = index;

    slider.style.transform =
      `translateX(-${current * 100}%)`;

    dotButtons.forEach((dot, i) => {
      dot.classList.toggle(
        'active',
        i === current,
      );
    });
  }


  /*
   * Previous
   */

  prev.addEventListener('click', () => {
    showSlide(current - 1);
    restartAutoplay();
  });


  /*
   * Next
   */

  next.addEventListener('click', () => {
    showSlide(current + 1);
    restartAutoplay();
  });


  /*
   * Dots
   */

  dotButtons.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.index));
      restartAutoplay();
    });
  });


  /*
   * Autoplay
   */

  let autoplay;

  function startAutoplay() {
    autoplay = setInterval(() => {
      showSlide(current + 1);
    }, 5000);
  }


  function restartAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }


  /*
   * Pause while mouse is over carousel
   */

  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoplay);
  });


  carousel.addEventListener('mouseleave', () => {
    startAutoplay();
  });


  /*
   * Touch/swipe
   */

  let startX = 0;

  carousel.addEventListener(
    'touchstart',
    (event) => {
      startX = event.touches[0].clientX;
    },
    { passive: true },
  );


  carousel.addEventListener(
    'touchend',
    (event) => {
      const endX =
        event.changedTouches[0].clientX;

      const distance = endX - startX;

      if (Math.abs(distance) < 50) return;

      if (distance < 0) {
        showSlide(current + 1);
      } else {
        showSlide(current - 1);
      }

      restartAutoplay();
    },
  );


  /*
   * Initial slide
   */

  showSlide(0);

  startAutoplay();
}