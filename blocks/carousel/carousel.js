export default function decorate(block) {
  const rows = [...block.children];

  // Create carousel structure
  const track = document.createElement('div');
  track.className = 'carousel-track';

  rows.forEach((row) => {
    const cells = [...row.children];

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    // Image
    const imageCell = cells[0];
    const image = imageCell?.querySelector('img');

    const imageContainer = document.createElement('div');
    imageContainer.className = 'carousel-image';

    if (image) {
      imageContainer.appendChild(image);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'carousel-content';

    const title = cells[1]?.textContent.trim();
    const description = cells[2]?.textContent.trim();

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

    slide.appendChild(imageContainer);
    slide.appendChild(content);
    track.appendChild(slide);
  });

  // Remove original authored rows
  block.innerHTML = '';

  // Carousel wrapper
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  viewport.appendChild(track);

  // Buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-prev';
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.innerHTML = '&#10094;';

  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.innerHTML = '&#10095;';

  block.appendChild(viewport);
  block.appendChild(prevButton);
  block.appendChild(nextButton);

  const slides = [...track.children];
  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  updateCarousel();
}