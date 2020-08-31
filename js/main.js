//modal

jQuery(document).ready(function ($) {
    //trigger the animation - open modal window
    $('[data-type="modal-trigger"]').on('click', function () {
        var actionBtn = $(this),
            scaleValue = retrieveScale(actionBtn.next('.cd-modal-bg'));

        actionBtn.addClass('to-circle');
        actionBtn.next('.cd-modal-bg').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
        });

        //if browser doesn't support transitions...
        if (actionBtn.parents('.no-csstransitions').length > 0) animateLayer(actionBtn.next('.cd-modal-bg'), scaleValue, true);
    });

    //trigger the animation - close modal window
    $('.cd-section .cd-modal-close').on('click', function () {
        closeModal();
    });
    $(document).keyup(function (event) {
        if (event.which == '27') closeModal();
    });

    $(window).on('resize', function () {
        //on window resize - update cover layer dimention and position
        if ($('.cd-section.modal-is-visible').length > 0) window.requestAnimationFrame(updateLayer);
    });

    function retrieveScale(btn) {
        var btnRadius = btn.width() / 2,
            left = btn.offset().left + btnRadius,
            top = btn.offset().top + btnRadius - $(window).scrollTop(),
            scale = scaleValue(top, left, btnRadius, $(window).height(), $(window).width());

        btn.css('position', 'fixed').velocity({
            top: top - btnRadius,
            left: left - btnRadius,
            translateX: 0,
        }, 0);

        return scale;
    }

    function scaleValue(topValue, leftValue, radiusValue, windowW, windowH) {
        var maxDistHor = (leftValue > windowW / 2) ? leftValue : (windowW - leftValue),
            maxDistVert = (topValue > windowH / 2) ? topValue : (windowH - topValue);
        return Math.ceil(Math.sqrt(Math.pow(maxDistHor, 2) + Math.pow(maxDistVert, 2)) / radiusValue);
    }

    function animateLayer(layer, scaleVal, bool) {
        layer.velocity({
            scale: scaleVal
        }, 400, function () {
            $('body').toggleClass('overflow-hidden', bool);
            (bool) ?
            layer.parents('.cd-section').addClass('modal-is-visible').end().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'): layer.removeClass('is-visible').removeAttr('style').siblings('[data-type="modal-trigger"]').removeClass('to-circle');
        });
    }

    function updateLayer() {
        var layer = $('.cd-section.modal-is-visible').find('.cd-modal-bg'),
            layerRadius = layer.width() / 2,
            layerTop = layer.siblings('.btn').offset().top + layerRadius - $(window).scrollTop(),
            layerLeft = layer.siblings('.btn').offset().left + layerRadius,
            scale = scaleValue(layerTop, layerLeft, layerRadius, $(window).height(), $(window).width());

        layer.velocity({
            top: layerTop - layerRadius,
            left: layerLeft - layerRadius,
            scale: scale,
        }, 0);
    }

    function closeModal() {
        var section = $('.cd-section.modal-is-visible');
        section.removeClass('modal-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            animateLayer(section.find('.cd-modal-bg'), 1, false);
        });
        //if browser doesn't support transitions...
        if (section.parents('.no-csstransitions').length > 0) animateLayer(section.find('.cd-modal-bg'), 1, false);
    }
});

//modal
let mainSliderSelector = '.main-slider',
    navSliderSelector = '.nav-slider',
    interleaveOffset = 0.5;

// Main Slider
let mainSliderOptions = {
    loop: true,
    speed: 1000,
    autoplay: {
        delay: 3000
    },
    loopAdditionalSlides: 10,
    grabCursor: true,
    watchSlidesProgress: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        init: function () {
            this.autoplay.stop();
        },
        imagesReady: function () {
            this.el.classList.remove('loading');
            this.autoplay.start();
        },
        slideChangeTransitionEnd: function () {
            let swiper = this,
                captions = swiper.el.querySelectorAll('.caption');
            for (let i = 0; i < captions.length; ++i) {
                captions[i].classList.remove('show');
            }
            swiper.slides[swiper.activeIndex].querySelector('.caption').classList.add('show');
        },
        progress: function () {
            let swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
                let slideProgress = swiper.slides[i].progress,
                    innerOffset = swiper.width * interleaveOffset,
                    innerTranslate = slideProgress * innerOffset;
                swiper.slides[i].querySelector(".slide-bgimg").style.transform =
                    "translate3d(" + innerTranslate + "px, 0, 0)";
            }
        },
        touchStart: function () {
            let swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].style.transition = "";
            }
        },
        setTransition: function (speed) {
            let swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].style.transition = speed + "ms";
                swiper.slides[i].querySelector(".slide-bgimg").style.transition =
                    speed + "ms";
            }
        }
    }
};
let mainSlider = new Swiper(mainSliderSelector, mainSliderOptions);

// Navigation Slider
let navSliderOptions = {
    loop: true,
    loopAdditionalSlides: 10,
    speed: 1000,
    spaceBetween: 5,
    slidesPerView: 5,
    centeredSlides: true,
    touchRatio: 0.2,
    slideToClickedSlide: true,
    direction: 'vertical',
    on: {
        imagesReady: function () {
            this.el.classList.remove('loading');
        },
        click: function () {
            mainSlider.autoplay.stop();
        }
    }
};
let navSlider = new Swiper(navSliderSelector, navSliderOptions);

// Matching sliders
mainSlider.controller.control = navSlider;
navSlider.controller.control = mainSlider;