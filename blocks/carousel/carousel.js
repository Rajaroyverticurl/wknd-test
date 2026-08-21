const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let currentSlide = 0;

    let autoPlay;


    /* =========================
       SHOW SLIDE
    ========================== */

    function showSlide(index) {

      if (index >= slides.length) {
        currentSlide = 0;
      }

      else if (index < 0) {
        currentSlide = slides.length - 1;
      }

      else {
        currentSlide = index;
      }


      /* Remove active classes */

      slides.forEach(slide => {
        slide.classList.remove("active");
      });

      dots.forEach(dot => {
        dot.classList.remove("active");
      });


      /* Add active classes */

      slides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");
    }


    /* =========================
       NEXT
    ========================== */

    function nextSlide() {
      showSlide(currentSlide + 1);
      restartAutoPlay();
    }


    /* =========================
       PREVIOUS
    ========================== */

    function previousSlide() {
      showSlide(currentSlide - 1);
      restartAutoPlay();
    }


    /* =========================
       BUTTON EVENTS
    ========================== */

    nextButton.addEventListener("click", nextSlide);

    prevButton.addEventListener("click", previousSlide);


    /* =========================
       DOT EVENTS
    ========================== */

    dots.forEach(dot => {

      dot.addEventListener("click", () => {

        const slideIndex = Number(
          dot.dataset.slide
        );

        showSlide(slideIndex);

        restartAutoPlay();

      });

    });


    /* =========================
       AUTOPLAY
    ========================== */

    function startAutoPlay() {

      autoPlay = setInterval(() => {

        showSlide(currentSlide + 1);

      }, 5000);

    }


    function restartAutoPlay() {

      clearInterval(autoPlay);

      startAutoPlay();

    }


    startAutoPlay();


    /* =========================
       PAUSE ON HOVER
    ========================== */

    const carousel =
      document.querySelector(".carousel");

    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoPlay);
    });

    carousel.addEventListener("mouseleave", () => {
      startAutoPlay();
    });


    /* =========================
       TOUCH / SWIPE
    ========================== */

    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener("touchstart", (event) => {

      touchStartX =
        event.changedTouches[0].screenX;

    });


    carousel.addEventListener("touchend", (event) => {

      touchEndX =
        event.changedTouches[0].screenX;

      handleSwipe();

    });


    function handleSwipe() {

      const distance =
        touchEndX - touchStartX;

      if (Math.abs(distance) < 50) {
        return;
      }

      if (distance < 0) {
        nextSlide();
      }

      else {
        previousSlide();
      }

    }