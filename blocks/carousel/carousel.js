document.addEventListener("DOMContentLoaded", function () {

    const slider = document.getElementById("slider");

    const carousel = document.getElementById("carousel");

    const slides = document.querySelectorAll(".slide");

    const dots = document.querySelectorAll(".dot");

    const nextButton = document.getElementById("next");

    const prevButton = document.getElementById("prev");


    let currentIndex = 0;

    let timer;


    /* =========================
       GO TO SLIDE
    ========================= */

    function goToSlide(index) {

        /*
        Loop back to first slide
        */

        if (index >= slides.length) {
            index = 0;
        }


        /*
        Loop to last slide
        */

        if (index < 0) {
            index = slides.length - 1;
        }


        currentIndex = index;


        /*
        Move slider
        */

        slider.style.transform =
            `translateX(-${currentIndex * 100}%)`;


        /*
        Update dots
        */

        dots.forEach(function(dot, i) {

            dot.classList.toggle(
                "active",
                i === currentIndex
            );

        });

    }


    /* =========================
       NEXT BUTTON
    ========================= */

    nextButton.addEventListener("click", function () {

        goToSlide(currentIndex + 1);

        restartTimer();

    });


    /* =========================
       PREVIOUS BUTTON
    ========================= */

    prevButton.addEventListener("click", function () {

        goToSlide(currentIndex - 1);

        restartTimer();

    });


    /* =========================
       DOT BUTTONS
    ========================= */

    dots.forEach(function(dot) {

        dot.addEventListener("click", function () {

            const index =
                Number(dot.dataset.index);

            goToSlide(index);

            restartTimer();

        });

    });


    /* =========================
       AUTO PLAY
    ========================= */

    function startTimer() {

        timer = setInterval(function () {

            goToSlide(currentIndex + 1);

        }, 5000);

    }


    function restartTimer() {

        clearInterval(timer);

        startTimer();

    }


    /* =========================
       PAUSE ON HOVER
    ========================= */

    carousel.addEventListener(
        "mouseenter",
        function () {

            clearInterval(timer);

        }
    );


    carousel.addEventListener(
        "mouseleave",
        function () {

            startTimer();

        }
    );


    /* =========================
       TOUCH SWIPE
    ========================= */

    let startX = 0;

    let endX = 0;


    carousel.addEventListener(
        "touchstart",
        function (event) {

            startX =
                event.touches[0].clientX;

        },
        { passive: true }
    );


    carousel.addEventListener(
        "touchend",
        function (event) {

            endX =
                event.changedTouches[0].clientX;

            const distance =
                endX - startX;


            if (Math.abs(distance) < 50) {
                return;
            }


            if (distance < 0) {

                goToSlide(
                    currentIndex + 1
                );

            } else {

                goToSlide(
                    currentIndex - 1
                );

            }


            restartTimer();

        }
    );


    /* =========================
       START
    ========================= */

    goToSlide(0);

    startTimer();

});