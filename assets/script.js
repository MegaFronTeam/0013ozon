(function() {
    'use strict';
    var components;

    components = {};

    $(function() {
        var component;
        for (component in components) {
            components[component]();
        }
    });

    window.hidePopup = function(popupId) {
        var $popup, activeClass;
        activeClass = 'popup_active';
        $popup = popupId ? $("#" + popupId) : $("." + activeClass);
        if (!$popup.length || !$popup.hasClass(activeClass)) {
            return false;
        }
        $popup.removeClass(activeClass).fadeOut();
        return $('body').removeClass('no-scroll');
    };

    window.initMap = function() {
        var map, marker;
        map = new ymaps.Map('map', {
            center: [55.734384569011134,37.59134149999998],
            zoom: 15,
            controls: ['zoomControl', 'geolocationControl', 'fullscreenControl']
        });
        marker = new ymaps.Placemark(map.getCenter(), {
            hintContent: 'НДФЛ Центр',
            balloonContent: 'НДФЛ. Центр оформления налоговых вычетов'
        }, {
            preset: 'islands#dotIcon'
        });
        map.geoObjects.add(marker);
        return map.behaviors.disable('scrollZoom');
    };

    window.showPopup = function(popupId) {
        var $popup, activeClass;
        $popup = $("#" + popupId);
        activeClass = 'popup_active';
        if (!$popup.length) {
            return false;
        }
        $popup.fadeIn().css('display', 'flex');
        $('body').addClass('no-scroll');
        $popup.addClass(activeClass);
        return $popup.scrollTop(0);
    };

    components.anchor = function() {
        return $('[data-anchor]').click(function(e) {
            var $section, offset, target;
            target = $(this).attr('href');
            $section = $("#" + (target.split('#')[1]));
            if ($section.length) {
                e.preventDefault();
                offset = window.innerWidth > 700 ? 61 : 0;
                return $('html, body').animate({
                    scrollTop: $section.offset().top - offset
                }, 1000);
            }
        });
    };

    components.carousel = function() {
        return $('.carousel').each(function() {
            var $carousel, config;
            $carousel = $(this).find('.carousel__slider');
            config = $(this).data('config');
            config = $.extend(config, {
                swipe: window.innerWidth <= 992,
                prevArrow: $(this).find('.carousel__arrow_prev'),
                nextArrow: $(this).find('.carousel__arrow_next'),
                appendDots: $(this).find('.carousel__dots-container'),
                dotsClass: 'carousel__dots',
                customPaging: function() {
                    return "<span class='carousel__dot'></span>";
                }
            });
            $carousel.slick(config);
            $carousel.on('setPosition', function() {
                var $activeSlides, $slickTrack, maxHeight;
                $slickTrack = $(this).find('.slick-track');
                if (window.innerWidth >= 800) {
                    $slickTrack.css('height', '');
                    $activeSlides = $(this).find('.carousel__item.slick-active');
                    maxHeight = Math.max.apply(null, $activeSlides.map(function() {
                        return $(this).height();
                    }));
                    return $slickTrack.css('height', maxHeight);
                } else {
                    return $slickTrack.css('height', '');
                }
            });
            return $carousel.slick('setPosition');
        });
    };

    components.filepicker = function() {
        var $input, FILE_SIZE;
        $input = $('.filepicker__file');
        FILE_SIZE = 5;
        return $input.change(function() {
            var $relatedCaption, defaultText;
            if (this.files.length) {
                $relatedCaption = $(this).closest('.filepicker').find('.filepicker__caption');
                if (this.files[0].size / 1024 / 1024 > FILE_SIZE) {
                    defaultText = $relatedCaption.data('default-text');
                    $relatedCaption.text(defaultText);
                    return $(this).replaceWith($(this).val('').clone(true));
                } else {
                    return $relatedCaption.text($(this)[0].files[0].name);
                }
            }
        });
    };

    components.gallery = function() {
        return $('.gallery2').each(function() {
            var $photo, images;
            $photo = $(this).find('.gallery__photo');
            images = ($(this).find($photo).map(function() {
                return {
                    src: $(this).data('zoom-src')
                };
            })).toArray();
            return $photo.click(function() {
                var index;
                index = $photo.index($(this));
                $(this).lightGallery({
                    dynamic: true,
                    dynamicEl: images,
                    index: index
                });
                return $(this).on('onCloseAfter.lg', function() {
                    var $gallery;
                    $gallery = $(this).data('lightGallery');
                    if ($gallery) {
                        return $gallery.destroy(true);
                    }
                });
            });
        });
    };

    components.nav = function() {
        var BREAKPOINT, bindNavButton, bindNavItems, bindSticky;
        BREAKPOINT = 700;
        bindNavButton = function() {
            var $button, $nav;
            $button = $('.nav-button');
            $nav = $('.nav');
            $button.click(function(e) {
                e.stopPropagation();
                return $nav.slideToggle();
            });
            return $(document).click(function(e) {
                var $target;
                $target = $(e.target);
                if (!$target.closest($nav).length && !$target.is($button) && window.innerWidth <= BREAKPOINT) {
                    return $nav.slideUp();
                }
            });
        };
        bindNavItems = function() {
            var $item, $menu;
            $item = $('.nav__item');
            $menu = $('.nav__menu');
            return $item.click(function() {
                var $targetMenu;
                if (window.innerWidth <= BREAKPOINT) {
                    $targetMenu = $(this).find('.nav__menu');
                    $menu.not($targetMenu).slideUp();
                    return $targetMenu.slideToggle();
                }
            });
        };
        bindSticky = function() {
            var $container, $nav, $window, checkState, fixedClass;
            $nav = $('.header__nav');
            $container = $('.header__nav-container');
            $window = $(window);
            fixedClass = 'header__nav_fixed';
            checkState = function() {
                if (($window.scrollTop() >= $container.offset().top) && window.innerWidth > BREAKPOINT) {
                    $nav.addClass(fixedClass);
                    return $container.css('height', $nav.height());
                } else {
                    $nav.removeClass(fixedClass);
                    return $container.css('height', '');
                }
            };
            checkState();
            return $window.on('scroll resize', function() {
                return checkState();
            });
        };
        bindNavButton();
        bindNavItems();
        return bindSticky();
    };

    components.popup = function() {
        var $body, $button, $popup, activeClass, noScrollClass;
        $popup = $('.popup');
        $button = $('[data-popup]');
        activeClass = 'popup_active';
        $body = $('body');
        noScrollClass = 'no-scroll';
        $button.click(function(e) {
            var $targetPopup;
            e.preventDefault();
            $targetPopup = $("#" + ($(this).data('popup')));
            if ($targetPopup.length) {
                $targetPopup.fadeIn().css('display', 'flex');
                $body.addClass(noScrollClass);
                $targetPopup.addClass(activeClass);
                return $targetPopup.scrollTop(0);
            }
        });
        $popup.click(function(e) {
            var $target;
            $target = $(e.target);
            if (!$target.closest('.popup__content').length || $target.is('.popup__close')) {
                $(this).removeClass(activeClass).fadeOut();
                return $body.removeClass(noScrollClass);
            }
        });
        return $(document).keydown(function(e) {
            var $activePopup;
            $activePopup = $("." + activeClass);
            if (e.keyCode === 27 && $activePopup.length) {
                $activePopup.removeClass(activeClass).fadeOut();
                return $body.removeClass(noScrollClass);
            }
        });
    };

    components.scrollup = function() {
        var $scrollup, $window, OFFSET, activeClass, checkState;
        $scrollup = $('.scrollup');
        $window = $(window);
        OFFSET = 1000;
        activeClass = 'scrollup_active';
        $scrollup.click(function() {
            return $('html, body').animate({
                scrollTop: 0
            }, 1000, null);
        });
        checkState = function() {
            if ($window.scrollTop() > OFFSET) {
                return $scrollup.addClass(activeClass);
            } else {
                return $scrollup.removeClass(activeClass);
            }
        };
        checkState();
        return $window.on('scroll resize', function() {
            return checkState();
        });
    };

    components.sidenav = function() {
        var activeListClass;
        activeListClass = 'sidenav__sublist_active';
        $('.sidenav__link').click(function(e) {
            e.preventDefault();
            return $(this).siblings('.sidenav__sublist').slideToggle(function() {
                return $(this).toggleClass(activeListClass);
            });
        });
        return $('.sidenav__title').click(function() {
            if (window.innerWidth <= 767) {
                return $(this).siblings('.sidenav__list').slideToggle();
            }
        });
    };

    components.stepForm = function() {
        var formContent, formSection;
        formContent = '.step-form__content';
        formSection = '.step-form__section';
        $(formContent).each(function() {
            return $(this).css('width', ($(this).find(formSection).length * 100) + "%");
        });
        return $('.step-form__button').click(function(e) {
            var $formContent, currentIndex, ref, sectionsCount;
            e.preventDefault();
            if ($(this).closest(formSection).next().length > 0) {
                $formContent = $(this).closest(formContent);
                sectionsCount = $formContent.find(formSection).length;
                currentIndex = (ref = $formContent.data('index')) != null ? ref : 0;
                $formContent.attr('data-index', currentIndex + 1);
                return $formContent.css('transform', "translateX(-" + (((currentIndex + 1) * 100) / sectionsCount) + "%)");
            }
        });
    };

}).call(this);