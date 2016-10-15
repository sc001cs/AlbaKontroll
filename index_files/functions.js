//load youtube iframe api
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//object to hold all players on the page
var players = {};

function onYouTubePlayerAPIReady() {
    $(document).ready(function () {
        $('iframe.ytplayer').each(function (event) {
            var iframeID = $(this).attr('id');
            players[iframeID] = new YT.Player(iframeID);
        });
    });
}

function stopYouTubeVideo(iframeID) {
    if(typeof players[iframeID].stopVideo === 'function') {
        players[iframeID].seekTo(0);
        players[iframeID].stopVideo();
    }
}

/**
 * BFM JS Functions
 * @constructor
 */
var BFMjs = function () {
    "use strict";
    var
        /**
         * Detect mobile browsers
         * @public
         * @return {boolean} TRUE if mobile client
         */
        isMobile = function () {
            var mobile;
            return (function (a) {
                mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
                return mobile;
            }(navigator.userAgent || navigator.vendor || window.opera));
        },

        /**
         * Init JS for all pages
         * @public
         */
        init = function () {
            // Cached vars
            var
                bodyObj = $('body'),
                menuObj = $('#menu'),
                headerObj = $('.header'),
                win$ = $(window),
                animateHeaderFrom = 10;

            /* animate header */
            function animateHeader() {
                var scrollTopPos = win$.scrollTop();
                function checkWinScrollPosition() {
                    if (scrollTopPos > animateHeaderFrom) {
                        if (!headerObj.hasClass('h-animated')) {
                            headerObj.addClass('h-animated');
                            bodyObj.addClass('b-animated');
                        }
                    } else {
                        if (headerObj.hasClass('h-animated')) {
                            headerObj.removeClass('h-animated');
                            bodyObj.removeClass('b-animated');
                        }
                    }
                }
                jQuery(window).on('scroll', function () {
                    scrollTopPos = $(this).scrollTop();
                    checkWinScrollPosition();
                });
                checkWinScrollPosition();
            }

            /* body desktop class */
            function bodyDesktopClass() {
                if (!isMobile()) {
                    bodyObj.addClass('desktop-mode');
                }
            }

            /* mobile menu */
            function mobileMenu() {
                if (menuObj.length) {
                    menuObj.mmenu();
                    menuObj.on("click", ".mob-menus .jq-has-drop", function (e) {
                        e.preventDefault();
                        $(this).parent("li").toggleClass('drop-open');
                    });
                }
            }

            /* header search */
            function headerSearch() {
                if (headerObj.length) {
                    headerObj.on("click", ".ht-simplemenu .jq-open-search", function (e) {
                        e.preventDefault();
                        $('.header').toggleClass('search-active');
                    });
                }
            }

            jQuery(document).ready(function () {
                animateHeader();
                bodyDesktopClass();
                mobileMenu();
                headerSearch();
            });
        },

        /*
        =Image loader
        */
        il                  = {
            loader: '<div class="img-loader"></div>',
            loaderTmp: false,
            imgL: 0,
            imgC: 0,
            imgF: true,
            render: function(el, clone_el) {
                var that    = this,
                    imgs    = $('[data-src]', el),
                    page_type = [];

                if (!imgs.length) {
                    return;
                }

                if(el.is('.fwbi-content')) {
                    // expanded content
                    page_type = ['.js-main-image', '.js-thumbnails'];
                } else if(el.is('.baac-hidden-row')) {
                    // before-after content
                    page_type = ['.baac-slider-frame', '.baac-slider-tn'];
                }

                this.imgF   = true;
                this.imgC   = 0;
                this.images = $(page_type[0] + ' [data-src]', clone_el || el);
                this.thumbs = $(page_type[1] + ' [data-src]', clone_el || el);
                this.imgL   = this.images.length;
                this.loaderTmp = false;

                this.images.each(function() {
                    that.eachClone($(this));
                });

                this.thumbs.each(function() {
                    that.eachClone($(this), true);
                });

                if (clone_el) {
                    imgs.each(function() {
                        that.eachImg($(this));
                    });
                }
            },
            eachClone: function(_self, is_thumb) {
                var my_src  = _self.attr('data-src'),
                    that    = this,
                    thumb_l;

                if (is_thumb) {
                    thumb_l = $(this.loader).insertBefore(_self);
                    thumb_l.parent()
                        .addClass('load-start');
                } else {
                    if (this.imgF) {
                        this.imgF = false;
                        this.loaderTmp = $(this.loader).insertBefore(_self);
                        this.loaderTmp.parent()
                            .addClass('load-start');
                    }
                }

                _self.attr('src', my_src)
                    .removeAttr('data-src')
                    .on('load', function() {
                        var _self = $(this);

                        if (is_thumb) {
                            that.removeLoader(thumb_l);
                            _self.parent()
                                .removeClass('load-start');
                        } else {
                            that.imgC += 1;

                            if (_self.is(that.loaderTmp.next())) {
                                that.loaderTmp.parent().addClass('first-loaded');
                                that.loaderTmp.parent()
                                    .removeClass('load-start');
                            }

                            if (that.imgC === that.imgL) {
                                that.removeLoader(that.loaderTmp);
                                that.loaderTmp = false;
                            }
                        }
                    });
            },
            eachImg: function(_self) {
                var my_src  = _self.attr('data-src');

                _self.attr('src', my_src)
                    .removeAttr('data-src');
            },
            removeLoader: function(el) {
                el.parent().addClass('loaded');

                setTimeout(function() {
                    el.remove();
                }, 500);
            }
        },

        /**
         * Init placeholder plugin
         * @public
         * @param {Object} obj jQuery object
         */
        setPlaceholders = function (obj) {
            if (typeof $.fn.placeholder === 'function') {
                obj.placeholder();
            } else {
                throw new Error('$.fn.placeholder is undefined!');
            }
        },

        /**
         * Init ezMark plugin
         * @public
         * @param {Object} obj jQuery object
         */
        setEZCheckboxes = function (obj) {
            if (typeof $.fn.ezMark === 'function') {
                obj.ezMark();
            } else {
                throw new Error('$.fn.setEZCheckboxes is undefined!');
            }
        },

        /**
         * Init bx slider
         * @public
         * @param {Object} slider jQuery object
         * @param {Object} options bxSlider options
         */
        setBxSlider = function (slider, options) {
            if (typeof $.fn.bxSlider === 'function') {
                var opt = options || {};
                slider.bxSlider(opt);
            } else {
                throw new Error('$.fn.bxSlider is undefined!');
            }
        },

        /**
         * Set scrollTo links
         * @public
         * @param {Object} link jQuery object
         */
        setScrollLinks = function (link) {
            var scrollSpeed = 800;
            link.on('click', function (e) {
                e.preventDefault();
                var hrefValue = $(this).attr('href'),
                    targetObj = $(hrefValue).offset().top;
                $('html, body').animate({ scrollTop: targetObj }, scrollSpeed);
            });
        },

        /**
         * Expand hidden block in Before and After sections
         * @public
         */
        expandBeforeAfterBlock = function () {
            // VARs
            var
                beforeAndAfterWrapper = $('.before-and-after-wrapper'),
                beforeAndAfterRow = $('.baac-row', beforeAndAfterWrapper),
                beforeAfterRowItem = $('.baac-item', beforeAndAfterRow),
                beforeAndAfterOpenButton = $('.baac-more a, .baac-img a', beforeAndAfterRow),
                beforeAfterImgTrigger = $('.js-baac-image-thigger', beforeAndAfterWrapper),
                win$ = $(window),
                offsetMargin = -48,
                scrollSpeed = 400,
                animateSpeed = 300,
                debugState = false,
                animationComplited = true;
            setCloseLinkHandler(beforeAndAfterWrapper.find('.baac-link-close'));
            // Hover
            beforeAfterRowItem.hover(function () {
                var parent = $(this).parent('.baac-visible-row');
                parent.addClass('baac-visible-row-hover');
                parent.find('.baac-item').not($(this)).addClass('faded');
            }, function () {
                var parent = $(this).parent('.baac-visible-row');
                parent.removeClass('baac-visible-row-hover');
                parent.find('.baac-item').not($(this)).removeClass('faded');
            });
            // Before and After click handler
            beforeAfterImgTrigger.each(function () {
                $(this).click(function (e) {
                    e.preventDefault();
                    $(this).closest('.baac-row').find('.baac-img a[data-index="1"]').trigger('click');
                });
            });
            var imgFrame = $('.baac-slider-frame');
            imgFrame.on('click', function (e)
            {
                e.preventDefault();
                var $e = $(e.target);
                if ($e.is('img, a')) {
                    var inactiveLink = $(this).closest('.baac-slider').find('.baac-slider-tn li').filter(':not(.active)');
                    inactiveLink.find('a').trigger('click');
                }
            });
            beforeAndAfterOpenButton.each(function () {
                var _link = $(this);
                _link.on('click', function (e) {
                    e.preventDefault();
                    if (!animationComplited) {
                        return;
                    }
                    // VARs
                    var _link = $(this),
                        parentRow = _link.closest('.baac-frame').closest('.baac-row'),
                        parentRowClasses = parentRow.attr('class'),
                        isCurrentLinkHasActiveClass = parentRowClasses.indexOf('baac-row-active'),
                        parentItemClasses = _link.closest('.baac-item').attr('class'),
                        isCurrentLinkInActiveItem = parentItemClasses.indexOf('baac-item-active'),
                        sliderRow = parentRow.find('.baac-slider-holder'),
                        sliderTn = parentRow.find('.baac-slider-tn'),
                        linkIndex = _link.data('index') - 1;

                    il.render(_link.closest('.baac-frame').find('.baac-hidden-row'));

                    setTNLinksHandler(sliderTn, sliderRow);
                    // Check where the window is open
                    if (beforeAndAfterWrapper.find('.baac-row-active').length) { // Hidden window is already open
                        debug('Hidden window is already open');
                        if (-1 !== isCurrentLinkHasActiveClass) { // Link is in the open window
                            debug('Link is in the open window');
                            if (-1 === isCurrentLinkInActiveItem) { // Change active window
                                debug('Change active window');
                                parentRow.find('.baac-item').removeClass('baac-item-active');
                                parentRow.find('.baac-item').eq(linkIndex).addClass('baac-item-active');
                                swapImages(sliderRow, linkIndex);
                                swapThumbnails(sliderTn, linkIndex);
                            } else {
                                debug('Open window');
                                openWindow(_link);
                            }
                        } else { // The window is open in another location
                            debug('The window is open in another location - swap window');
                            closeWindow(_link);
                        }
                    } else { // Open new hidden window
                        debug('Open new hidden window');
                        openWindow(_link);
                    }
                });
            });

            /* Help Functions */

            /**
             * Get object offset
             * @param obj
             * @param offsetMargin
             * @returns {number}
             * @private
             */
            function getOffset(obj, offsetMargin) {
                debug('Run getOffset()');
                return obj.offset().top + offsetMargin;
            }

            /**
             * Set display:block
             * @param obj
             * @private
             */
            function setDisplayCSS(obj) {
                debug('Run setDisplayCSS()');
                obj.css('display', 'block');
            }

            /**
             * Set display:none
             * @param obj
             * @private
             */
            function setHideCSS(obj) {
                debug('Run setHideCSS()');
                obj.css('display', 'none');
            }

            /**
             * Scroll to position
             * @param element
             * @param scrollPosition
             * @param scrollSpeed
             * @param options
             * @private
             */
            function setScrollTo(element, scrollPosition, scrollSpeed, options) {
                debug('Run setScrollTo()');
                element = $('html ,body');
                element.animate({
                    scrollTop: scrollPosition
                }, scrollSpeed).promise().done(function () {
                    if (typeof options.onAfter === "function") {
                        options.onAfter();
                    }
                });
            }

            /**
             * Swap images handler
             * @param sliderRow
             * @param linkIndex
             * @private
             */
            function swapImages(sliderRow, linkIndex) {
                debug('Run swapImages()');
                var imgToHide = null;
                switch (linkIndex) {
                    case 0:
                        imgToHide = 1;
                        break;
                    case 1:
                        imgToHide = 0;
                        break;
                }
                sliderRow
                    .find('.hidden')
                    .css('display', 'none')
                    .removeClass('hidden')
                    .css('display', '');
                sliderRow.find('img').eq(imgToHide)
                    .css('display', 'none')
                    .addClass('hidden')
                    .css('display', '');
            }

            /**
             * Swap thumbnails handler
             * @param sliderTn
             * @param linkIndex
             * @private
             */
            function swapThumbnails(sliderTn, linkIndex) {
                debug('Run swapThumbnails()');
                var tnToHide = null;
                switch (linkIndex) {
                    case 0:
                        tnToHide = 1;
                        break;
                    case 1:
                        tnToHide = 0;
                        break;
                }
                sliderTn.find('li').eq(tnToHide).removeClass('active');
                sliderTn.find('li').eq(linkIndex).addClass('active');
            }

            /**
             * Swap active block
             * @param ind
             * @private
             */
            function swapActiveBlocks(ind) {
                debug('Run swapActiveBlocks()');
                beforeAndAfterWrapper.find('.baac-row-active .baac-item').removeClass('baac-item-active');
                beforeAndAfterWrapper.find('.baac-row-active .baac-item').eq(ind).addClass('baac-item-active');
            }

            /**
             * Set thumbnails link handler
             * @param sliderTn
             * @param sliderRow
             * @private
             */
            function setTNLinksHandler(sliderTn, sliderRow) {
                debug('Run setTNLinksHandler()');
                var tnLinks = sliderTn.find('ul a');
                tnLinks.each(function (ind) {
                    $(this).on('click', function (e) {
                        e.preventDefault();
                        debug('On in setTNLinksHandler');
                        if (!$(this).closest('li').hasClass('active')) {
                            swapThumbnails(sliderTn, ind);
                            swapImages(sliderRow, ind);
                            swapActiveBlocks(ind);
                        }
                    });
                });
            }

            /**
             * Set close link handler
             * @param beforeAndAfterOpenButton
             * @private
             */
            function setCloseLinkHandler(beforeAndAfterOpenButton) {
                debug('Run setCloseLinkHandler()');
                beforeAndAfterOpenButton.each(function () {
                    $(this).on('click', function (e) {
                        e.preventDefault();
                        var parentItem, parentRow, hiddenRow, sliderRow, sliderTn;
                        animationComplited = false;
                        parentRow = $(this).closest('.baac-hidden-row').closest('.baac-frame').closest('.baac-row');
                        parentItem = parentRow.find('.baac-item');
                        hiddenRow = parentRow.find('.baac-hidden-row');
                        sliderRow = parentRow.find('.baac-slider-holder');
                        sliderTn = parentRow.find('.baac-slider-tn');

                        parentRow.removeClass('baac-row-active');
                        parentItem.removeClass('baac-item-active');
                        hiddenRow.animate({
                            'height': 0
                        }, animateSpeed, function () {
                            sliderRow.find('img')
                                .removeClass('hidden')
                                .show();
                            sliderTn.find('li').removeClass('active');
                            hiddenRow.css({
                                'height' : '',
                                'display': ''
                            });
                            animationComplited = true;
                        });
                    });
                });
            }

            /**
             * Close window
             * @param link
             * @private
             */
            function closeWindow(link) {
                debug('Run closeWindow()');
                var activeVisibleRow = beforeAndAfterWrapper.find('.baac-row-active'),
                    hiddenRow = activeVisibleRow.find('.baac-hidden-row'),
                    sliderRow = activeVisibleRow.find('.baac-slider-holder'),
                    sliderTn = activeVisibleRow.find('.baac-slider-tn'),
                    parentItem = activeVisibleRow.find('.baac-item');
                if (!animationComplited) {
                    return;
                }
                animationComplited = false;
                hiddenRow.animate({
                    'height': 0
                }, animateSpeed, function () {
                    sliderRow.find('img')
                        .removeClass('hidden')
                        .show();
                    sliderTn.find('li').removeClass('active');
                    parentItem.removeClass('baac-item-active');
                    setHideCSS(hiddenRow);
                    beforeAndAfterWrapper.find('.baac-row').removeClass('baac-row-active');
                    animationComplited = true;
                    openWindow(link);
                });
            }

            /**
             * Open window
             * @param link
             * @private
             */
            function openWindow(link) {
                debug('Run openWindow()');
                var parentRow = link.closest('.baac-frame').closest('.baac-row'),
                    sliderRow = parentRow.find('.baac-slider-holder'),
                    linkIndex = link.data('index') - 1,
                    sliderTn = parentRow.find('.baac-slider-tn'),
                    parentItem = link.closest('.baac-item'),
                    hiddenRow = parentRow.find('.baac-hidden-row');
                if (!animationComplited) {
                    return;
                }
                animationComplited = false;
                parentRow.addClass('baac-row-active');
                sliderRow.find('img').not(':eq(' + linkIndex + ')').addClass('hidden');
                sliderTn.find('li').eq(linkIndex).addClass('active');
                setDisplayCSS(hiddenRow);
                setScrollTo(
                    win$,
                    getOffset(hiddenRow, offsetMargin),
                    scrollSpeed,
                    {
                        onAfter: function () {
                            var hiddenWindowH = hiddenRow.find('.baac-hidden-item').innerHeight();
                            hiddenRow.animate({
                                'height': hiddenWindowH
                            }, animateSpeed, function () {
                                hiddenRow.css('height', 'auto');
                                animationComplited = true;
                            });
                            parentItem.addClass('baac-item-active');
                        }
                    }
                );
            }

            /**
             * Debug
             * @param msg
             * @private
             */
            function debug(msg) {
                if (debugState) {
                    console.info(msg);
                }
            }

        },

        /**
         * Expand video block in testimonial section
         * @public
         */
        expandTestimonialsBlock = function () {
            // VARs
            var testimonialsHolder = $('.all-testimonials'),
                testimonialRow = $('.testimonial-row', testimonialsHolder),
                testimonialOpenButtonParent = $('.at-item', testimonialRow),
                testimonialOpenButton = $('.occc-thumb-link', testimonialOpenButtonParent),
                testimonialCloseButton = testimonialsHolder.find('.btn-close-it'),
                win$ = $(window),
                offsetMargin = -68,
                scrollSpeed = 400,
                animateSpeed = 300,
                animationComplited = true;

            setCloseLinkHandler(testimonialCloseButton);

            $(window).on('resize', function () {
                var boxModel = testimonialsHolder.find('.at-item').eq(0).css('display'),
                    active = testimonialsHolder.find('.testimonial-row-active'),
                    activeitem = active.find('.at-item-active'),
                    hiddenRow = active.find('.testimonial-hidden-row');
                if (boxModel !== 'block') {
                    // desctop
                    if (active.length) {
                        var allItems = active.find('.at-item'),
                            allItemsLength = allItems.length;
                        if (!allItems.eq(allItemsLength - 1).next('.testimonial-hidden-row').length) {
                            active.find('.frame').append(hiddenRow);
                        }
                    }
                } else {
                    // mobile
                    if (activeitem.length && !activeitem.next('.testimonial-hidden-row').length) {
                        hiddenRow.insertAfter(activeitem);
                    }
                }
            });

            testimonialOpenButton.each(function () {
                var _link = $(this);
                _link.on('click', function (e) {
                    e.preventDefault();
                    if (!animationComplited) {
                        return;
                    }
                    var mode, boxModel = $(this).closest('.at-item').css('display'); // inline-block/block
                    if (boxModel !== 'block') {
                        mode = 2; // desctop
                    } else {
                        mode = 1; // mobile
                    }
                    // VARs
                    var _link = $(this),
                        parentRow = _link.closest('.testimonial-row'),
                        linkIndex = _link.data('open-item'),
                        hiddenRow = parentRow.find('.testimonial-hidden-row'),
                        parentItem = _link.closest('.at-item'),
                        parentRowClasses = parentRow.attr('class'),
                        isCurrentParentHasActiveClass = parentRowClasses.indexOf('testimonial-row-active'),
                        isCurrentLinkHasActiveParent = _link.closest(testimonialOpenButtonParent).attr('class').indexOf('at-item-active');

                    if (testimonialsHolder.find('.testimonial-row-active').length) {
                        if (-1 !== isCurrentParentHasActiveClass) { // Link is in the open window
                            if (-1 === isCurrentLinkHasActiveParent) { // Change active window
                                if (mode === 1) {
                                    closeWindow(_link);
                                } else {
                                    parentRow.find('.at-item').removeClass('at-item-active');
                                    _link.closest('.at-item').addClass('at-item-active');
                                    var iFrame = parentRow.find('.tr-item').filter(':visible').find('.video-box-inner iframe');
                                    iFrame.attr('src', iFrame.attr('src'));
                                    parentRow.find('.tr-item').filter(':visible').fadeOut(100, function () {
                                        parentRow.find('.tr-item').filter('[data-item="' + linkIndex + '"]').fadeIn();
                                    });
                                }
                            } else {
                                openWindow(_link, parentRow, hiddenRow, parentItem, linkIndex, mode);
                            }
                        } else { // The window is open in another location
                            var iFrame = $('.testimonial-hidden-row').filter(':visible').find('.tr-item').filter(':visible').find('.video-box-inner iframe');
                            iFrame.attr('src', iFrame.attr('src'));
                            closeWindow(_link);
                        }
                    } else {
                        openWindow(_link, parentRow, hiddenRow, parentItem, linkIndex, mode);
                    }
                });
            });

            /**
             * Set display:block
             * @param obj
             * @private

            function setDisplayCSS(obj) {
                obj.css('display', 'block');
            }
             */

            /**
             * Set display:none
             * @param obj
             * @private
             */
            function setHideCSS(obj) {
                obj.css('display', 'none');
            }

            /**
             * Scroll to position
             * @param element
             * @param scrollPosition
             * @param scrollSpeed
             * @param options
             * @private
             */
            function setScrollTo(element, scrollPosition, scrollSpeed, options) {
                element = $('html ,body');
                element.animate({
                    scrollTop: scrollPosition
                }, scrollSpeed).promise().done(function () {
                    if (typeof options.onAfter === "function") {
                        options.onAfter();
                    }
                });
            }

            /**
             * Get object offset
             * @param obj
             * @param offsetMargin
             * @returns {number}
             * @private
             */
            function getOffset(obj, offsetMargin) {
                return obj.offset().top + offsetMargin;
            }

            /**
             * Set close link handler
             * @param {Object} closeBtn
             * @private
             */
            function setCloseLinkHandler(closeBtn) {
                closeBtn.each(function () {
                    $(this).on('click', function (e) {
                        e.preventDefault();
                        var parentItem, parentRow, hiddenRow;
                        animationComplited = false;
                        parentRow = $(this).closest('.testimonial-row');
                        parentItem = parentRow.find('.at-item');
                        hiddenRow = parentRow.find('.testimonial-hidden-row');
                        parentRow.removeClass('testimonial-row-active');

                        hiddenRow.animate({
                            'height': 0
                        }, animateSpeed, function () {
                            var iFrame = hiddenRow.find('.tr-item').filter(':visible').find('.video-box-inner iframe');
                            iFrame.attr('src', iFrame.attr('src'));
                            hiddenRow.find('.tr-item').css('display', '');
                            hiddenRow.css({
                                'height' : '',
                                'display': ''
                            });
                            parentItem.removeClass('at-item-active');
                            animationComplited = true;
                        });
                    });
                });
            }

            /**
             * Close window
             * @param link
             * @private
             */
            function closeWindow(link) {
                var activeVisibleRow = testimonialsHolder.find('.testimonial-row-active'),
                    hiddenRow = activeVisibleRow.find('.testimonial-hidden-row'),
                    parentItem = activeVisibleRow.find('.at-item');
                if (!animationComplited) {
                    return;
                }
                animationComplited = false;
                hiddenRow.animate({
                    'height': 0
                }, animateSpeed, function () {
                    parentItem.removeClass('at-item-active');
                    setHideCSS(hiddenRow);
                    setHideCSS(hiddenRow.find('.tr-item'));
                    activeVisibleRow.removeClass('testimonial-row-active');
                    animationComplited = true;
                    var mode, boxModel = link.closest('.at-item').css('display'); // inline-block/block
                    if (boxModel !== 'block') {
                        mode = 2; // desctop
                    } else {
                        mode = 1; // mobile
                    }
                    var parentRowLink = link.closest('.testimonial-row'),
                        linkIndexLink = link.data('open-item'),
                        hiddenRowLink = parentRowLink.find('.testimonial-hidden-row'),
                        parentItemLink = link.closest('.at-item');
                    openWindow(link, parentRowLink, hiddenRowLink, parentItemLink, linkIndexLink, mode);
                });
            }

            /**
             * Open window
             * @param link
             * @param parentRow
             * @param hiddenRow
             * @param parentItem
             * @param linkIndex
             * @param mode
             * @private
             */
            function openWindow(link, parentRow, hiddenRow, parentItem, linkIndex, mode) {
                if (!animationComplited) {
                    return;
                }
                if (mode === 1) {
                    hiddenRow.insertAfter(parentItem);
                }
                animationComplited = false;
                parentRow.addClass('testimonial-row-active');
                hiddenRow.show(0, function () {
                    setScrollTo(
                        win$,
                        getOffset(hiddenRow, offsetMargin),
                        scrollSpeed,
                        {
                            onAfter: function () {
                                if (!hiddenRow.find('.tr-item').filter('[data-item="' + linkIndex + '"]').is(':visible')) {
                                    hiddenRow.find('.tr-item').filter('[data-item="' + linkIndex + '"]').show(0, function () {
                                        var hiddenWindowH = hiddenRow.find('.frame').innerHeight();
                                        hiddenRow.animate({
                                            'height': hiddenWindowH
                                        }, animateSpeed, function () {
                                            hiddenRow.css('height', 'auto');
                                            animationComplited = true;
                                        });
                                        parentItem.addClass('at-item-active');
                                    });
                                } else {
                                    animationComplited = true;
                                }
                            }
                        }
                    );
                });
            }

        },

        /**
         * Expand video block in testimonial section
         */
        expandVideosBlock = function () {
            // VARs
            var testimonialsHolder = $('.occ-all'),
                testimonialRow = $('.occ-columns', testimonialsHolder),
                testimonialOpenButtonParent = $('.occc-column', testimonialRow),
                testimonialOpenButton = $('.occc-thumb-link', testimonialOpenButtonParent),
                testimonialCloseButton = testimonialsHolder.find('.btn-close-it'),
                win$ = $(window),
                offsetMargin = -68,
                scrollSpeed = 400,
                animateSpeed = 300,
                animationComplited = true;

            setCloseLinkHandler(testimonialCloseButton);

            $(window).on('resize', function () {
                var boxModel = testimonialsHolder.find('.occc-column').eq(0).css('float'),
                    active = testimonialsHolder.find('.occ-columns-active'),
                    activeitem = active.find('.occc-column-active'),
                    hiddenRow = active.find('.testimonial-hidden-row');
                if (boxModel !== 'none') {
                    // desctop
                    var allItems = testimonialsHolder.find('.occc-column'),
                        allItemsSize = allItems.length;
                    if (!allItems.eq(allItemsSize - 1).next('.testimonial-hidden-row').length) {
                        active.append(hiddenRow);
                    }
                } else {
                    // mobile
                    if (activeitem.length && !activeitem.next('.testimonial-hidden-row').length) {
                        hiddenRow.insertAfter(activeitem);
                    }
                }
            });

            testimonialOpenButton.each(function () {
                var _link = $(this);
                _link.on('click', function (e) {
                    e.preventDefault();
                    if (!animationComplited) {
                        return;
                    }
                    var mode, boxModel = $(this).closest('.occc-column').css('float'); // inline-block/block
                    if (boxModel !== 'none') {
                        mode = 2; // desctop
                    } else {
                        mode = 1; // mobile
                    }
                    // VARs
                    var _link = $(this),
                        parentRow = _link.closest('.occ-columns'),
                        linkIndex = _link.data('open-item'),
                        hiddenRow = parentRow.find('.testimonial-hidden-row'),
                        parentItem = _link.closest('.occc-column'),
                        parentRowClasses = parentRow.attr('class'),
                        isCurrentParentHasActiveClass = parentRowClasses.indexOf('occ-columns-active'),
                        isCurrentLinkHasActiveParent = _link.closest(testimonialOpenButtonParent).attr('class').indexOf('occc-column-active');

                    if (testimonialsHolder.find('.occ-columns-active').length) {
                        if (-1 !== isCurrentParentHasActiveClass) { // Link is in the open window
                            if (-1 === isCurrentLinkHasActiveParent) { // Change active window
                                if (mode === 1) {
                                    closeWindow(_link);
                                } else {
                                    var iFrame = parentRow.find('.tr-item').filter(':visible').find('.video-box-inner iframe');
                                    parentRow.find('.occc-column').removeClass('occc-column-active');
                                    _link.closest('.occc-column').addClass('occc-column-active');
                                    iFrame.attr('src', iFrame.attr('src'));
                                    parentRow.find('.tr-item').filter(':visible').fadeOut(100, function () {
                                        parentRow.find('.tr-item').filter('[data-item="' + linkIndex + '"]').fadeIn();
                                    });
                                }
                            } else {
                                openWindow(_link, parentRow, hiddenRow, parentItem, linkIndex, mode);
                            }
                        } else { // The window is open in another location
                            closeWindow(_link);
                        }
                    } else {
                        openWindow(_link, parentRow, hiddenRow, parentItem, linkIndex, mode);
                    }
                });
            });

            /**
             * Set display:block
             *
             * @param obj
             * @private

            function setDisplayCSS(obj) {
                obj.css('display', 'block');
            }
             */

            /**
             * Set display:none
             *
             * @param obj
             * @private
             */
            function setHideCSS(obj) {
                obj.css('display', 'none');
            }

            /**
             * Scroll to position
             *
             * @param element
             * @param scrollPosition
             * @param scrollSpeed
             * @param options
             * @private
             */
            function setScrollTo(element, scrollPosition, scrollSpeed, options) {
                element = $('html ,body');
                element.animate({
                    scrollTop: scrollPosition
                }, scrollSpeed).promise().done(function () {
                        if (typeof options.onAfter === "function") {
                            options.onAfter();
                        }
                    });
            }

            /**
             * Get object offset
             *
             * @param obj
             * @param offsetMargin
             * @returns {number}
             * @private
             */
            function getOffset(obj, offsetMargin) {
                return obj.offset().top + offsetMargin;
            }

            /**
             * Set close link handler
             *
             * @param closeBtn
             * @private
             */
            function setCloseLinkHandler(closeBtn) {
                closeBtn.each(function () {
                    $(this).on('click', function (e) {
                        e.preventDefault();
                        var parentItem, parentRow, hiddenRow;
                        animationComplited = false;
                        parentRow = $(this).closest('.occ-columns');
                        parentItem = parentRow.find('.occc-column');
                        hiddenRow = parentRow.find('.testimonial-hidden-row');
                        parentRow.removeClass('occ-columns-active');

                        hiddenRow.animate({
                            'height': 0
                        }, animateSpeed, function () {
                            var iFrame = hiddenRow.find('.tr-item').filter(':visible').find('.video-box-inner iframe');
                            iFrame.attr('src', iFrame.attr('src'));
                            hiddenRow.find('.tr-item').css('display', '');
                            hiddenRow.css({
                                'height' : '',
                                'display': ''
                            });
                            parentItem.removeClass('occc-column-active');
                            animationComplited = true;
                        });
                    });
                });
            }

            /**
             * Close window
             *
             * @param link
             * @private
             */
            function closeWindow(link) {
                var activeVisibleRow = testimonialsHolder.find('.occ-columns-active'),
                    hiddenRow = activeVisibleRow.find('.testimonial-hidden-row'),
                    parentItem = activeVisibleRow.find('.occc-column');
                if (!animationComplited) {
                    return;
                }
                animationComplited = false;
                hiddenRow.animate({
                    'height': 0
                }, animateSpeed, function () {
                    parentItem.removeClass('occc-column-active');
                    setHideCSS(hiddenRow);
                    setHideCSS(hiddenRow.find('.tr-item'));
                    activeVisibleRow.removeClass('occ-columns-active');
                    animationComplited = true;
                    var mode, boxModel = link.closest('.occc-column').css('float'); // inline-block/block
                    if (boxModel !== 'none') {
                        mode = 2; // desctop
                    } else {
                        mode = 1; // mobile
                    }
                    var parentRowLink = link.closest('.occ-columns'),
                        linkIndexLink = link.data('open-item'),
                        hiddenRowLink = parentRowLink.find('.testimonial-hidden-row'),
                        parentItemLink = link.closest('.occc-column');
                    openWindow(link, parentRowLink, hiddenRowLink, parentItemLink, linkIndexLink, mode);
                });
            }

            /**
             * Open window
             * @param link
             * @param parentRow
             * @param hiddenRow
             * @param parentItem
             * @param linkIndex
             * @param mode
             * @private
             */
            function openWindow(link, parentRow, hiddenRow, parentItem, linkIndex, mode) {
                if (!animationComplited) {
                    return;
                }
                if (mode === 1) {
                    hiddenRow.insertAfter(parentItem);
                }
                animationComplited = false;
                parentRow.addClass('occ-columns-active');
                hiddenRow.show(0, function () {
                    setScrollTo(
                        win$,
                        getOffset(hiddenRow, offsetMargin),
                        scrollSpeed,
                        {
                            onAfter: function () {
                                if (!hiddenRow.find('.tr-item').filter('[data-item="' + linkIndex + '"]').is(':visible')) {
                                    hiddenRow.find('.tr-item').filter('[data-item="' + linkIndex + '"]').show(0, function () {
                                        var hiddenWindowH = hiddenRow.find('.frame').innerHeight();
                                        hiddenRow.animate({
                                            'height': hiddenWindowH
                                        }, animateSpeed, function () {
                                            hiddenRow.css('height', 'auto');
                                            animationComplited = true;
                                        });
                                        parentItem.addClass('occc-column-active');
                                    });
                                } else {
                                    animationComplited = true;
                                }
                            }
                        }
                    );
                });
            }

        },
        /**
         * Expand testimonials text
         * @public
         */
        expandTestimonials = function () {
            var moreLinkParent = $('.testimonial');
            if (moreLinkParent.length) {
                moreLinkParent.each(function () {
                    var moreContainer = $(this).find('.view-more-container'),
                        detailsContainer = $(this).find('.details'),
                        lessContainer = $(this).find('.re-collapse');

                    moreContainer.find('a').on('click', function (eo) {
                        var parentRow = $(this).closest('.frame'),
                            parentItems = parentRow.find('.at-item');
                        eo.preventDefault();
                        moreContainer.hide(0, function () {
                            detailsContainer.css('display', 'inline');
                            parentItems.css('height', '');
                            var testimonialsBlocks$EQ = new EqualBlocksHeight(parentItems, {
                                splitBy     : 2,
                                isResizable : true,
                                isFullLoaded: true,
                                isBoxSized  : true
                            });
                        });
                    });

                    lessContainer.find('a').on('click', function (eo) {
                        var parentRow = $(this).closest('.frame'),
                            parentItems = parentRow.find('.at-item');
                        eo.preventDefault();
                        detailsContainer.hide(0, function () {
                            moreContainer.show(0, function () {
                                parentItems.css('height', '');
                                var testimonialsBlocks$EQ = new EqualBlocksHeight(parentItems, {
                                    splitBy     : 2,
                                    isResizable : true,
                                    isFullLoaded: true,
                                    isBoxSized  : true
                                });
                            });
                        });
                    });
                });
            }
        },

        expandPortfolioBlocks = function() {

            var $_featuredWorkBlock = $('.js-featured-work-block'),
                $_scrollObject      = $('html, body'),
                $_wrapper           = $('.wrapper'),
                SCROLL_SPEED        = 400,
                SLIDE_SPEED         = 300,
                OFFSET_TOP          = -68;

            //function for set size mode: mode-1(mobile mode), mode-2(tablet mode), mode-3(desktop mode),
            function setSizeMode() {
                var windowSize = $(window).width();
                if (windowSize < 480) {
                    $_featuredWorkBlock.attr('data-mode', 'mode-1');
                }
                else if (windowSize > 480 && windowSize < 769) {
                    $_featuredWorkBlock.attr('data-mode', 'mode-2');
                }
                else {
                    $_featuredWorkBlock.attr('data-mode', 'mode-3');
                }
            }

            // function for show expanded
            function showExpandedObj(object) {
                var $_expandedMode = $('.js-featured-work-block .expanded-mode'),
                    scrollTopPosition = $_expandedMode.offset().top;
                $_expandedMode.addClass('d-none').removeAttr('style');
                $_scrollObject.animate({ scrollTop: scrollTopPosition + OFFSET_TOP }, SCROLL_SPEED, function () {
                    $_expandedMode.slideDown(SLIDE_SPEED);
                    object.addClass('active-lnk');
                });
            }

            //function for reorder expanded mode
            function reorderExpanded() {
                //expanded Object
                var expandedModeObj = $('.js-featured-work-block .expanded-mode'),
                    featuredWorkBlock = $('.js-featured-work-block');
                if (expandedModeObj.length !== 0) {
                    //init vars
                    var expandedBlockPosition = expandedModeObj.attr('data-block-position'),
                        blockMode = featuredWorkBlock.attr('data-mode'),
                        expandedElemPosition = +expandedModeObj.attr('data-elem-number'),
                        currentActiveElem,
                        blockContainer,
                        previousMode,
                        balanceNumber;
                    //check block position = top/bottom
                    if (expandedBlockPosition === 'f') {
                        blockContainer = $('.js-featured-work-block-top');
                    }
                    else {
                        blockContainer = $('.js-featured-work-block-bottom');
                    }
                    //get elements length of parent block (top/bottom)
                    var commonLength = $('.fwb-item', blockContainer).length;
                    //behavior for desktop mode
                    if (blockMode === 'mode-3') {
                        //get previous mode (before resize)
                        previousMode = $_wrapper.data('blockMode');
                        if (previousMode === 'mode-3') {
                            return false;
                        }
                        else if (previousMode === 'mode-2') {
                            //get balance number for elements order
                            balanceNumber = expandedElemPosition % 3;
                            if (balanceNumber === 1) {
                                if ((commonLength - 1) === expandedElemPosition) { //if we have the penultimate element
                                    currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition);
                                    expandedModeObj.insertAfter($(currentActiveElem));
                                }
                                else {
                                    currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition + 1);
                                    expandedModeObj.insertAfter($(currentActiveElem));
                                }
                            }
                            else if (balanceNumber === 2) {
                                currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition);
                                expandedModeObj.insertAfter($(currentActiveElem));
                            }
                            else {
                                currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition - 1);
                                expandedModeObj.insertAfter($(currentActiveElem));
                            }
                        }
                        //save new data mode
                        $_wrapper.data('blockMode', 'mode-3');
                    }
                    else if (blockMode === 'mode-2') {
                        //get previous mode (before resize)
                        previousMode = $_wrapper.data('blockMode');
                        if (previousMode === 'mode-3') {
                            //get balance number for elements order
                            balanceNumber = expandedElemPosition % 4;
                            if (balanceNumber === 1) {
                                currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition);
                                expandedModeObj.insertAfter($(currentActiveElem));
                            }
                            else if (balanceNumber === 2) {
                                currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition - 1);
                                expandedModeObj.insertAfter($(currentActiveElem));
                            }
                            else if (balanceNumber === 3) {
                                currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition);
                                expandedModeObj.insertAfter($(currentActiveElem));
                            }
                            else {
                                currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition - 1);
                                expandedModeObj.insertAfter($(currentActiveElem));
                            }
                        }
                        else if (previousMode === 'mode-2') {
                            return false;
                        }
                        else {
                            //get balance number for elements order
                            balanceNumber = expandedElemPosition % 2;
                            if (((commonLength - 1) === expandedElemPosition) && balanceNumber !== 1) { //if we have the penultimate element
                                currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition - 1);
                                expandedModeObj.insertAfter($(currentActiveElem));
                            }
                            else {
                                if (balanceNumber === 1) {
                                    currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition);
                                    expandedModeObj.insertAfter($(currentActiveElem));
                                }
                                else {
                                    currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition - 1);
                                    expandedModeObj.insertAfter($(currentActiveElem));
                                }
                            }
                        }
                        //save new data mode
                        $_wrapper.data('blockMode', 'mode-2');
                    }
                    else {
                        currentActiveElem = $('.fwb-item', blockContainer).eq(expandedElemPosition - 1);
                        expandedModeObj.insertAfter($(currentActiveElem));
                        $_wrapper.data('blockMode', 'mode-1');
                    }
                }
            }

            //function for each expanded mode
            function expandedMode(object, blockContainer, elemNumber, hiddenExpandedObj, blocksQty, blockMode, mode3SecondElem, mode3FirstElem, mode2FirstElem, blockPosition) {
                var expContentObjHTML = $('.fwbi-text', hiddenExpandedObj).clone(true),
                    balanceNumber;

                il.render(hiddenExpandedObj, expContentObjHTML);

                //added expanded Mode
                if (blockMode === 'mode-3') {
                    if (mode3SecondElem && elemNumber === blocksQty) {
                        $('.fwb-item', blockContainer).eq(elemNumber - 1).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                        expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                        showExpandedObj(object);
                    }
                    else if (mode3SecondElem && elemNumber === blocksQty - 1) {
                        $('.fwb-item', blockContainer).eq(elemNumber).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                        expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                        showExpandedObj(object);
                    }
                    else if (mode3FirstElem && elemNumber === blocksQty) {
                        $('.fwb-item', blockContainer).eq(elemNumber - 1).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                        expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                        showExpandedObj(object);
                    }
                    else {
                        balanceNumber = elemNumber % 3;
                        if (balanceNumber === 0) {
                            $('.fwb-item', blockContainer).eq(elemNumber - 1).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                            expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                            showExpandedObj(object);
                        }
                        else if (balanceNumber === 2) {
                            $('.fwb-item', blockContainer).eq(elemNumber).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                            expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                            showExpandedObj(object);
                        }
                        else {
                            $('.fwb-item', blockContainer).eq(elemNumber + 1).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                            expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                            showExpandedObj(object);
                        }
                    }
                }
                else if (blockMode === 'mode-2') {
                    if (mode2FirstElem && elemNumber === blocksQty) {
                        $('.fwb-item', blockContainer).eq(elemNumber - 1).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                        expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                        showExpandedObj(object);
                    }
                    else {
                        balanceNumber = elemNumber % 2;

                        if (balanceNumber === 0) {
                            $('.fwb-item', blockContainer).eq(elemNumber - 1).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                            expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                            showExpandedObj(object);
                        }
                        else if (balanceNumber === 1) {
                            $('.fwb-item', blockContainer).eq(elemNumber).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                            expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                            showExpandedObj(object);
                        }
                    }
                }
                else {
                    $('.fwb-item', blockContainer).eq(elemNumber - 1).after('<div style="position:absolute; visibility:hidden;" data-block-position="' + blockPosition + '" data-elem-number="' + elemNumber + '" class="expanded-mode"></div>');
                    expContentObjHTML.appendTo('.js-featured-work-block .expanded-mode');
                    showExpandedObj(object);
                }
            }

            // check hash
            function checkLocationHash() {
                var hash = window.location.hash;
                if (hash !== '') {
                    var elId = hash.replace('#', '');
                    var element = $('a[data-hash-id="'+elId+'"]');
                    if(element.length && !element.hasClass('active-lnk')) {
                        element.trigger('click');
                    }
                }
            }

            // add hash
            function addHash(link) {
                var id = link.data('hash-id');
                if (typeof id !== 'undefined' && id !== '') {
                    window.location.hash = id;
                }
            }

            function initLayout() {
                setSizeMode();
                $('.wrapper').data('blockMode', $('.featured-work-block').attr('data-mode'));
            }

            initLayout();

            //expanded simple gallery
            $('.js-ec-gallery .js-thumbnails a').on('click', function (e) {
                e.preventDefault();
                var _self = $(this),
                    currentClickLnkEq = _self.index(),
                    parentNode = _self.parents('.js-ec-gallery');
                $('.js-thumbnails a', parentNode).removeClass('active');
                $('.js-main-image img', parentNode).removeAttr('style');
                _self.addClass('active');
                $('.js-main-image img', parentNode).eq(currentClickLnkEq).show().animate({ opacity: 1}, 600);
            });

            function swapGalleryImages()
            {
                var mainImageBox    = $('.js-main-image');

                mainImageBox.on('click', function (e)
                {
                    e.preventDefault();
                    var parentBox  = $(this).closest('.js-ec-gallery'),
                        tnLinks    = parentBox.find('.js-thumbnails a'),
                        tnLinksLen = tnLinks.length,
                        $e         = $(e.target);

                    if ($e.is('img')) {
                        var nextImage = $(e.target).next('img'),
                            nextImageIndex = $e.index();

                        if (nextImage.length) {
                            $e.hide(0, function ()
                            {
                                $e.css('opacity', 0);
                                nextImage.css('opacity', 1);
                                nextImage.show();
                            });
                        } else {
                            nextImage = $(this).find('img').eq(0);
                            $e.hide(0, function ()
                            {
                                $e.css('opacity', 0);
                                nextImage.css('opacity', 1);
                                nextImage.show();
                                nextImageIndex = -1;
                            });
                        }

                        tnLinks.removeClass('active');
                        tnLinks.eq(nextImageIndex + 1).addClass('active');

                    } else if($e.is('a')) {
                        var parent = $e.closest('.js-main-image'),
                            activeImage = parent.find('img').filter(':visible'),
                            nextImage = activeImage.next('img'),
                            prevImage = activeImage.prev('img'),
                            nextImageIndex = activeImage.index();

                        if ($e.hasClass('ec-control-prev')) {
                            if (prevImage.length) {
                                activeImage.hide(0, function ()
                                {
                                    activeImage.css('opacity', 0);
                                    prevImage.css('opacity', 1);
                                    prevImage.show();
                                });
                            } else {
                                prevImage = parent.find('img').eq(tnLinksLen - 1);
                                activeImage.hide(0, function ()
                                {
                                    activeImage.css('opacity', 0);
                                    prevImage.css('opacity', 1);
                                    prevImage.show();
                                    nextImageIndex = tnLinksLen;
                                });
                            }

                            tnLinks.removeClass('active');
                            tnLinks.eq(nextImageIndex - 1).addClass('active');

                        } else if ($e.hasClass('ec-control-next')) {
                            if (nextImage.length) {
                                activeImage.hide(0, function ()
                                {
                                    activeImage.css('opacity', 0);
                                    nextImage.css('opacity', 1);
                                    nextImage.show();
                                });
                            } else {
                                nextImage = parent.find('img').eq(0);
                                activeImage.hide(0, function ()
                                {
                                    activeImage.css('opacity', 0);
                                    nextImage.css('opacity', 1);
                                    nextImage.show();
                                    nextImageIndex = -1;
                                });
                            }

                            tnLinks.removeClass('active');
                            tnLinks.eq(nextImageIndex + 1).addClass('active');
                        }
                    }
                });
            }

            swapGalleryImages();

            //window load event
            $(window).on('load', function () {
                checkLocationHash();
            });

            //window resize event
            $(window).on('resize', function () {
                setSizeMode();
                reorderExpanded();
            });

            //close links for each expanded mode
            $('.fwbi-close').on('click', function (e) {
                e.preventDefault();
                //remove expanded mode
                $('.js-fwbi-lnk').removeClass('active-lnk');
                $('.js-featured-work-block .expanded-mode').slideUp('300', function () {
                    $(this).remove();
                    if ( window.history && window.history.pushState ) {
                        history.pushState('', document.title, window.location.pathname);
                    }
                });
            });

            //click event for each image
            $('.js-fwbi-lnk').on('click', function (e) {
                e.preventDefault();
                var clickObj = $(this),
                    hiddenExpandedObj = clickObj.next(),
                    iDValue = hiddenExpandedObj.attr('id'),
                    elemNumber = +iDValue.substr(5),
                    blockPos = iDValue.substr(0, 1),
                    blockContainer,
                    blockMode = $('.js-featured-work-block').attr('data-mode'),
                    mode3SecondElem,
                    mode3FirstElem,
                    mode2FirstElem,
                    blockPosition,
                    expandedModeObj = $('.js-featured-work-block .expanded-mode');

                addHash($(this));

                $('.js-fwbi-lnk').removeClass('active-lnk');
                //get position of parent block
                if (blockPos === 'f') {
                    blockPosition = 'f';
                    blockContainer = $('.js-featured-work-block-top');
                    var topBlocksQty = $('.js-featured-work-block-top .fwb-item').length;

                    //get values for insert expanded mode in future
                    if (blockMode === 'mode-3') {
                        if (topBlocksQty % 3 === 2) {
                            mode3SecondElem = true;
                        }
                        else if (topBlocksQty % 3 === 1) {
                            mode3FirstElem = true;
                        }
                    }
                    else if (blockMode === 'mode-2') {
                        if (topBlocksQty % 2 === 1) {
                            mode2FirstElem = true;
                        }
                    }

                    if (expandedModeObj.length > 0) {
                        expandedModeObj.slideUp('300', function () {
                            $(this).remove();
                            expandedMode(clickObj, blockContainer, elemNumber, hiddenExpandedObj, topBlocksQty, blockMode, mode3SecondElem, mode3FirstElem, mode2FirstElem, blockPosition);
                        });
                    }
                    else {
                        expandedMode(clickObj, blockContainer, elemNumber, hiddenExpandedObj, topBlocksQty, blockMode, mode3SecondElem, mode3FirstElem, mode2FirstElem, blockPosition);
                    }
                }
                else {
                    blockPosition = 's';
                    blockContainer = $('.js-featured-work-block-bottom');
                    var bottomBlocksQty = $('.js-featured-work-block-bottom .fwb-item').length;
                    //get values for insert expanded mode in future
                    if (blockMode === 'mode-3') {
                        if (bottomBlocksQty % 3 === 2) {
                            mode3SecondElem = true;
                        }
                        else if (bottomBlocksQty % 3 === 1) {
                            mode3FirstElem = true;
                        }
                    }
                    else if (blockMode === 'mode-2') {
                        if (bottomBlocksQty % 2 === 1) {
                            mode2FirstElem = true;
                        }
                    }
                    if (expandedModeObj.length > 0) {
                        expandedModeObj.slideUp('300', function () {
                            $(this).remove();
                            expandedMode(clickObj, blockContainer, elemNumber, hiddenExpandedObj, bottomBlocksQty, blockMode, mode3SecondElem, mode3FirstElem, mode2FirstElem, blockPosition);
                        });
                    }
                    else {
                        expandedMode(clickObj, blockContainer, elemNumber, hiddenExpandedObj, bottomBlocksQty, blockMode, mode3SecondElem, mode3FirstElem, mode2FirstElem, blockPosition);
                    }
                }
            });

        },

        expandDemoVideoBlock = function() {
            var $_PARENT_BOX = $('.js-demo-video-holder'),
                $_HIDDEN_CONTENT = $_PARENT_BOX.find('.demo-video-box'),
                $_HIDDEN_CONTENT_CHILD = $_HIDDEN_CONTENT.find('.fwbi-text'),
                $_OPEN_BTN = $_PARENT_BOX.find('.js-open-video-box'),
                $_CLOSE_BTN = $_PARENT_BOX.find('.js-fwbi-close'),
                $_SCROLL_ELMS = $('html ,body'),
                $_IFRAME = $_HIDDEN_CONTENT_CHILD.find('iframe'),
                SCROLL_OFFSET = -68,
                SCROLL_SPEED = 400,
                ANIM_SPEED = 400,
                $_content_holder = $('.drb-main-content'),
                $_hidden_mobile = $_content_holder.find('.hide-from-mobile'),
                $_expanded_mode = $('.demo-video-box'),
                $_mobile_container = $('.mobile-container'),
                animated = false;

            function getOffset(obj, offsetMargin) {
                return obj.offset().top + offsetMargin;
            }

            function checkExpandedModePosition() {
                if ($_hidden_mobile.is(':visible')) {
                    if (!$_mobile_container.next('.demo-video-box').length) {
                        $_expanded_mode.insertAfter($_mobile_container);
                    }
                } else {
                    if (!$_content_holder.next('.demo-video-box').length) {
                        $_expanded_mode.insertAfter($_content_holder);
                    }
                }
            }

            checkExpandedModePosition();

            $(window).on('resize', function () {
                checkExpandedModePosition();
            });

            $_OPEN_BTN.on('click', function (e) {
                e.preventDefault();
                if (!$(this).hasClass('opened')) {
                    if(!animated) {
                        $_HIDDEN_CONTENT.show(0, function() {
                            animated = true;
                            var scroll_position = getOffset($_HIDDEN_CONTENT, SCROLL_OFFSET);
                            $_SCROLL_ELMS.animate({
                                scrollTop: scroll_position
                            }, SCROLL_SPEED).promise().done(function () {
                                var hidden_content_height = $_HIDDEN_CONTENT_CHILD.innerHeight();
                                $_HIDDEN_CONTENT.animate({
                                   height: hidden_content_height
                                }, ANIM_SPEED, function() {
                                    $_HIDDEN_CONTENT.css('height', 'auto');
                                    $_OPEN_BTN.addClass('opened');
                                    animated = false;
                                });
                            });
                        });
                    }
                } else {
                    var scroll_position = getOffset($_HIDDEN_CONTENT, SCROLL_OFFSET);
                    if(!animated) {
                        animated = true;
                        $_SCROLL_ELMS.animate({
                            scrollTop: scroll_position
                        }, SCROLL_SPEED, function() {
                            animated = false;
                        });
                    }
                }

            });

            $_CLOSE_BTN.on('click', function (e) {
                e.preventDefault();
                if(!animated) {
                    animated = true;
                    $_HIDDEN_CONTENT.animate({
                        height: 0
                    }, ANIM_SPEED, function() {
                        $_HIDDEN_CONTENT.css('height', '');
                        $_OPEN_BTN.removeClass('opened');
                        if($_IFRAME.length) {
                            $_IFRAME.attr('src', $_IFRAME.attr('src'));
                        }
                        animated = false;
                    });
                }
            });

        },

        eqCaptionText = function () {
            var elements = $('.occc-column .client-name .c');
            if (elements.length) {
                var testimonialsBlocks$EQ = new EqualBlocksHeight(elements, {
                    splitBy     : 3,
                    isResizable : true,
                    isFullLoaded: true,
                    isBoxSized  : true
                });
            }
        },

        expandModeImages = function () {
            jQuery.fn.toggleText = function (a, b) {
                var isClicked = false;
                var that = this;
                this.click(function () {
                    if (isClicked) {
                        that.text(a);
                        isClicked = false;
                    }
                    else {
                        that.text(b);
                        isClicked = true;
                    }
                });
                return this;
            };
            jQuery(".view-images").click(function (e) {
                e.preventDefault();
                jQuery(".preview-before").slideToggle("slow");
                jQuery(".preview-after-frame").slideToggle();
                jQuery(".preview-after-additional").slideToggle();
            }).toggleText("View Additional Images", "View details");
        },

        /**
         * Set float panel
         */
        setFloatPanel = function () {

            $(function () {
                // floating panel
                var float_panel_offset_top = $('.jq-float-panel').offset().top;

                $(window).on('resize', function () {
                    float_panel_offset_top = $('.jq-float-panel').offset().top;
                });

                var float_panel = function () {
                    var scroll_top = $(window).scrollTop();
                    if (scroll_top > float_panel_offset_top) {
                        $('.jq-float-panel').css({ 'position': 'fixed', 'top': 40 }).addClass('fix');
                    } else {
                        $('.jq-float-panel').css({ 'position': 'absolute', 'top': 150 }).removeClass('fix');
                    }
                };
                float_panel();
                $(window).scroll(function () {
                    float_panel();
                });
                $(window).scroll(function () {
                    var footertotop = ($('.footer').position().top);
                    // distance user has scrolled from top, adjusted to take in height of sidebar (500 pixels inc. padding)
                    var scrolltop = $(document).scrollTop() + 500;
                    // difference between the two
                    var difference = scrolltop - footertotop;
                    difference = difference + 100;
                    // if user has scrolled further than footer,
                    // pull sidebar up using a negative margin

                    if (scrolltop > footertotop) {

                        $('.jq-float-panel').css('margin-top', 0 - difference);
                    }

                    else {
                        $('.jq-float-panel').css('margin-top', 0);
                    }
                });

                $('.jq-go-top').click(function () {
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false;
                });
            });

        },

        /**
         * Set toTop button
         */
        setToTopBtn = function() {
            var SHOW_FROM = 200,
                SCROLL_TO = 0,
                SCROLL_SPEED = 400,
                $_window = $(window),
                $_scroll_object = $('html, body'),
                $_btn = $('<div class="btn-top"><span></span><em>Top</em></div>');
            var btn = $_btn.appendTo($('body'));

            function checkButtonVisibility() {
                if (getWindowScrollTop() > SHOW_FROM) {
                    if (!btn.hasClass('btn-top-active')) {
                        btn.addClass('btn-top-active');
                    }
                } else {
                    if (btn.hasClass('btn-top-active')) {
                        btn.removeClass('btn-top-active');
                    }
                }
            }

            function getWindowScrollTop() {
                return (function() {
                    return $_window.scrollTop();
                })();
            }

            function init() {
                checkButtonVisibility();
                btn.on('click', function (e) {
                    e.preventDefault();
                    $_scroll_object.animate({
                        scrollTop: SCROLL_TO
                    }, SCROLL_SPEED);
                });
            }

            $_window.on('scroll', function () {
                checkButtonVisibility();
            });

            init();

        },

        /**
         * expand home page works
         */
        expandHomePageWorks = function() {
            var $_linksHolder       = $('.olpc-board'),
                $_links             = $_linksHolder.find('a[data-expand-item-index]'),
                $_expandedMode      = $('.home-expanded-mode'),
                $_top_block         = $_linksHolder.find('div[data-expand-position=1]'),
                $_bottom_block      = $_linksHolder.find('div[data-expand-position=2]'),
                $_close_btn         = $_expandedMode.find('.js-fwbi-close'),
                $_window            = $(window),
                MOBILE_BREAKPOINT   = 480,
                is_animated         = false,
                ACTIVE,
                MODE,
                POS;

            var currentWinWidth     = getWinWidth();

            function getWinWidth() {
                return $_window.width();
            }

            function getLinkIndex(link) {
                return link.data('expand-item-index');
            }

            function checkExpandedModePosition(link) {
                if (currentWinWidth <= MOBILE_BREAKPOINT) {
                    MODE = 'm';     // mobile
                } else {
                    var link_index = getLinkIndex(link);
                    if (link_index <= 3) {
                        POS = 't';  // top block
                    } else {
                        POS = 'b';  // bottom block
                    }
                    MODE = 'd';     // desktop
                }
            }

            function checkExpandedInPosition(position, expanded) {
                if (!(position.next('.home-expanded-mode').length)) {
                    return true;
                } else {
                    return false;
                }
            }

            function appendExpandedToPosition(expanded, position) {
                expanded.insertAfter(position);
            }

            function setScrollTo(scrollPosition, cb, link) {
                var element = $('html ,body'),
                    scrollSpeed = 400;
                is_animated = true;
                element.animate({
                    scrollTop: scrollPosition
                }, scrollSpeed).promise().done(function () {
                    if (typeof cb === "function") {
                        cb(link);
                    }
                    is_animated = false;
                });
            }

            function getOffset(obj, offsetMargin) {
                return obj.offset().top + offsetMargin;
            }

            function getMobileAppendIndex(link) {
                var linkIndex = getLinkIndex(link),
                    appendIndex;
                switch (linkIndex) {
                    case 1:
                        appendIndex = $_linksHolder.find('div[data-expand-position=1] .olpcb-left-column');
                        break;
                    case 2:
                    case 3:
                        appendIndex = $_linksHolder.find('div[data-expand-position=1] .olpcb-right-column');
                        break;
                    case 4:
                    case 5:
                        appendIndex = $_linksHolder.find('div[data-expand-position=2] .olpcb-left-column');
                        break;
                    case 6:
                        appendIndex = $_linksHolder.find('div[data-expand-position=2] .olpcb-right-column');
                        break;
                }
                return appendIndex;
            }

            function checkIframe(object) {
                var Iframe = object.find('iframe'), IframeId;
                if (Iframe.length) {
                    IframeId = Iframe.attr('id');
                }
                return IframeId;
            }


            function reloadIframeContent(object) {
                var Iframe = object.find('iframe');
                if (Iframe.length) {
                    var src = Iframe.attr('src');
                    Iframe.attr('src', '');
                    Iframe.attr('src', src);
                }
            }

            function openWindow(link) {
                var linkIndex = getLinkIndex(link),
                    $_expandedItem = $('#c-em-' + linkIndex);
                is_animated = true;
                ACTIVE = linkIndex;

                $_links.filter('[data-expand-item-index='+ACTIVE+']').addClass('active');
                $_expandedItem
                    .css({
                        'height'  : 0,
                        'overflow': 'hidden'
                    })
                    .show(0, function () {
                        var innerBoxHeight = $(this).find('.ec-frame').height();
                        $(this)
                            .animate({
                                height: innerBoxHeight
                            }, 300, function () {
                                $(this).css({
                                    'height'  : '',
                                    'overflow': ''
                                });
                                is_animated = false;
                        });
                    });
            }

            function closeWindow(linkIndex, scopeMode, setScrollTo, openWindow, link) {
                var
                    $_expandedItem = $('#c-em-' + linkIndex),
                    is_animated = true,
                    offset;

                $_expandedItem
                    .css({
                        'overflow': 'hidden'
                    })
                    .animate({
                        'height': 0
                    }, 300, function () {

                        $(this).css({
                            'height'  : '',
                            'overflow': '',
                            'display' : 'none'
                        });

                        if(typeof checkIframe($_expandedItem) !== 'undefined' && checkIframe($_expandedItem) !=='') {
                            if(!BFM.isMobile()) {
                                if(players[checkIframe($_expandedItem)] instanceof Object) {
                                    stopYouTubeVideo(checkIframe($_expandedItem));
                                }
                            } else {
                                reloadIframeContent($_expandedItem);
                            }
                        }

                        $_links.filter('[data-expand-item-index=' + ACTIVE + ']').removeClass('active');

                        if(typeof scopeMode !== 'undefined') {
                            switch (scopeMode) {
                                case 'in-scope':
                                    if (typeof setScrollTo === 'function') {
                                        offset = getOffset($_expandedMode, -68);
                                        setScrollTo(offset, openWindow, link);
                                    }
                                    break;

                                case 'not-in-scope':
                                    if (POS === 't') { // top block
                                        if (checkExpandedInPosition($_top_block, $_expandedMode)) {
                                            appendExpandedToPosition($_expandedMode, $_top_block);
                                        }
                                    } else if (POS === 'b') { // bottom block
                                        if (checkExpandedInPosition($_bottom_block, $_expandedMode)) {
                                            appendExpandedToPosition($_expandedMode, $_bottom_block);
                                        }
                                    }
                                    if (typeof setScrollTo === 'function') {
                                        offset = getOffset($_expandedMode, -68);
                                        setScrollTo(offset, openWindow, link);
                                    }
                                    break;
                                case 'mobile-scope':
                                    var mobileAppendedItem = getMobileAppendIndex(link);
                                    if (checkExpandedInPosition(mobileAppendedItem, $_expandedMode)) {
                                        appendExpandedToPosition($_expandedMode, mobileAppendedItem);
                                    }
                                    if (typeof setScrollTo === 'function') {
                                        offset = getOffset($_expandedMode, -68);
                                        setScrollTo(offset, openWindow, link);
                                    }
                                    break;
                            }
                        }
                        ACTIVE = undefined;
                        is_animated = false;
                    });
            }

            $_links.on('click', function (e) {
                e.preventDefault();

                var $this = $(this),
                    offset;

                il.render($('#c-em-' + $this.data('expand-item-index')));

                if (is_animated) {
                    return;
                }

                is_animated = true;

                checkExpandedModePosition($this);

                if (typeof ACTIVE !== 'undefined') { // has active window

                    if (MODE === 'd') { // desktop mode
                        if ($this.hasClass('active')) { // current link is active
                            offset = getOffset($_expandedMode, -68);
                            setScrollTo(offset);
                        } else { // check link scope
                            var linkParent = $this.closest('div[data-expand-position]');
                            if (!checkExpandedInPosition(linkParent, $_expandedMode)) { // expanded in link scope
                                closeWindow(ACTIVE, 'in-scope', setScrollTo, openWindow, $this);
                            } else { // expanded not in link scope
                                closeWindow(ACTIVE ,'not-in-scope', setScrollTo, openWindow, $this);
                            }
                        }
                    } else { // mobile mode
                        if ($this.hasClass('active')) { // current link is active
                            offset = getOffset($_expandedMode, -68);
                            setScrollTo(offset);
                        } else {
                            closeWindow(ACTIVE ,'mobile-scope', setScrollTo, openWindow, $this);
                        }
                    }

                } else { // no active window
                    if (MODE === 'd') { // desktop mode
                        if (POS === 't') { // top block
                            if (checkExpandedInPosition($_top_block, $_expandedMode)) {
                                appendExpandedToPosition($_expandedMode, $_top_block);
                            }
                        } else if (POS === 'b') { // bottom block
                            if (checkExpandedInPosition($_bottom_block, $_expandedMode)) {
                                appendExpandedToPosition($_expandedMode, $_bottom_block);
                            }
                        }
                        offset = getOffset($_expandedMode, -68);
                        setScrollTo(offset, openWindow, $this);
                    } else { // mobile mode
                        var mobileAppendedItem = getMobileAppendIndex($this);
                        if (checkExpandedInPosition(mobileAppendedItem, $_expandedMode)) {
                            appendExpandedToPosition($_expandedMode, mobileAppendedItem);
                        }
                        offset = getOffset($_expandedMode, -68);
                        setScrollTo(offset, openWindow, $this);
                    }
                }

            });

            $_close_btn.on('click', function (e) {
                e.preventDefault();
                closeWindow(ACTIVE);
            });

            $_window.on('resize', function () {
                if(typeof ACTIVE !== 'undefined') {
                    var $winW = $(this).width();
                    if($winW !== currentWinWidth) {
                        currentWinWidth = $winW;
                        var activeLink = $_links.filter('[data-expand-item-index=' + ACTIVE + ']').eq(0);
                        checkExpandedModePosition(activeLink);
                        if (MODE === 'd') { // desktop mode
                            if (POS === 't') { // top block
                                if (checkExpandedInPosition($_top_block, $_expandedMode)) {
                                    appendExpandedToPosition($_expandedMode, $_top_block);
                                }
                            } else if (POS === 'b') { // bottom block
                                if (checkExpandedInPosition($_bottom_block, $_expandedMode)) {
                                    appendExpandedToPosition($_expandedMode, $_bottom_block);
                                }
                            }
                        } else {
                            var mobileAppendedItem = getMobileAppendIndex(activeLink);
                            if (checkExpandedInPosition(mobileAppendedItem, $_expandedMode)) {
                                appendExpandedToPosition($_expandedMode, mobileAppendedItem);
                            }
                        }
                    }
                }
            });

            //expanded simple gallery
            $('.js-ec-gallery .js-thumbnails a').on('click', function (e) {
                e.preventDefault();
                var _self = $(this),
                    currentClickLnkEq = _self.index(),
                    parentNode = _self.parents('.js-ec-gallery');
                $('.js-thumbnails a', parentNode).removeClass('active');
                $('.js-main-image img', parentNode).removeAttr('style');
                _self.addClass('active');
                $('.js-main-image img', parentNode).eq(currentClickLnkEq).show().animate({ opacity: 1}, 600);
            });

        };

    /**
     * Return public  methods
     */
    return {
        init                   : init,
        isMobile               : isMobile,
        setPlaceholders        : setPlaceholders,
        setBxSlider            : setBxSlider,
        setScrollLinks         : setScrollLinks,
        expandBeforeAfterBlock : expandBeforeAfterBlock,
        setEZCheckboxes        : setEZCheckboxes,
        setFloatPanel          : setFloatPanel,
        expandTestimonialsBlock: expandTestimonialsBlock,
        expandVideosBlock      : expandVideosBlock,
        expandTestimonials     : expandTestimonials,
        eqCaptionText          : eqCaptionText,
        expandModeImages       : expandModeImages,
        expandPortfolioBlocks  : expandPortfolioBlocks,
        expandDemoVideoBlock   : expandDemoVideoBlock,
        setToTopBtn            : setToTopBtn,
        expandHomePageWorks    : expandHomePageWorks
    };

};

/**
 * JS for mobile devices
 *
 * @constructor
 */
var BFMMobilejs = function () {
    "use strict";
    var
        //"Our Latest Projects" board
        initOurLatestProjects = function () {
            var olpEcommerce = $('.olp-ecommerce'),
                olpiHoverStare = $('.olpi-hover-stare', olpEcommerce);
            if (olpEcommerce.length) {
                olpEcommerce.on('click', function () {
                    var _self = $(this);
                    if (!_self.hasClass('activated')) {
                        olpiHoverStare.show();
                        /*.css({
                         'visibility': 'visible',
                         'opacity'   : 1
                         });*/
                        _self.addClass('activated');
                    }
                    else {
                        olpiHoverStare.hide();
                        /*.css({
                         'visibility': 'hidden',
                         'opacity'   : 0
                         });*/
                        _self.removeClass('activated');
                    }
                });
            }
        },
        //"What We Do In a Nutshell" menu
        initWhatWeDoIn = function () {

            var
                bubble_click_elem = $('.sc-bubble > a'),
                bubble_ul_list = $('.sc-bubble ul'),
                bubble_container = $('.sc-bubble');

            if (bubble_click_elem.length) {
                bubble_click_elem.on('click', function (e) {
                    e.preventDefault();
                    var _self = $(this);
                    var parentSelf = _self.parent();

                    if (!_self.parent().hasClass('activated')) {
                        /*bubble_ul_list.css({
                         'visibility': 'hidden',
                         'opacity'   : 0
                         });*/
                        bubble_ul_list.hide();
                        bubble_container.removeClass('activated');
                        _self.next().show();
                        /*_self.next().css({
                         'visibility': 'visible',
                         'opacity'   : 1
                         });*/
                        parentSelf.addClass('activated');
                    }
                    else {
                        /*bubble_ul_list.css({
                         'visibility': 'hidden',
                         'opacity'   : 0
                         });*/
                        bubble_ul_list.hide();
                        bubble_container.removeClass('activated');
                    }
                });
            }
        };

    return {
        initOurLatestProjects: initOurLatestProjects,
        initWhatWeDoIn       : initWhatWeDoIn
    };
};

var BFM = new BFMjs();
var BFMMobile = new BFMMobilejs();
BFM.init();

function processSlider(sliderParent) {
    var sliderObject = sliderParent.find('.js-psc-slider'),
        sliderNav = sliderParent.find('.js-ps-nav'),
        sliderNavLinks = $('a', sliderNav),
        btnNext = sliderParent.find('.js-btn-simple'),
        slider;

    function setCurrentSlide(index) {
        sliderNavLinks.removeClass('active');
        sliderNav.find('.psn-item').removeClass('psn-item-active');
        sliderNavLinks.eq(index).addClass('active');
        sliderNavLinks.eq(index).closest('.psn-item').addClass('psn-item-active');
        sliderNav.removeClass('current-active-0 current-active-1 current-active-2 current-active-3 current-active-4');
        sliderNav.addClass('current-active-' + index);
    }

    function initSliderNav(slider) {
        sliderNavLinks.on('click', function (e) {
            e.preventDefault();
            var slideIndex = $(this).data('slide') - 1;
            if (!$(this).hasClass('active')) {
                sliderNavLinks.removeClass('active');
                setCurrentSlide(slideIndex);
                slider.goToSlide(slideIndex);
            }
        });
        btnNext.on('click', function (e) {
            e.preventDefault();
            slider.goToNextSlide();
        });
    }

    function init() {
        var sliderQty = sliderNavLinks.length;
        slider = sliderObject.bxSlider({
            mode            : 'fade', // fade, horizontal
            infiniteLoop    : false,
            adaptiveHeight  : true,
            pager           : false,
            controls        : true,
            hideControlOnEnd: true,
            onSliderLoad    : function (currentIndex) {
                setCurrentSlide(currentIndex);
            },
            onSlideBefore   : function ($slideElement, oldIndex, newIndex) {
                setCurrentSlide(newIndex);
                if (newIndex >= sliderQty - 1) {
                    btnNext.hide();
                } else {
                    btnNext.show();
                }
            }
        });
        initSliderNav(slider);
    }
    init();
}