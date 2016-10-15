var EqualBlocksHeight = function (elements, options) {
    "use strict";
    this.elements = elements;
    this.settings = $.extend(
        {
            splitBy     : false,
            isResizable : true,
            isFullLoaded: false,
            isBoxSized  : false
        },
        options || {});
    this.init();
};
EqualBlocksHeight.prototype = (function () {
    "use strict";
    /**
     * Init - Do magic
     *
     * @public
     */
    var init = function () {
            var root = this,
                win$ = $(window);
            // Equalize all elements on window resize event
            if (this.settings.isResizable) {
                var currentW = win$.width();
                win$.on('resize', function () {
                    var resizeW = $(this).width();
                    if(resizeW !== currentW) {
                        root.elements.css('height', '');
                        initEqualization.call(this, root);
                        currentW = resizeW;
                    }
                });
            }
            // Equalize all elements on window load event
            if (this.settings.isFullLoaded) {
                win$.on('load', function () {
                    root.elements.css('height', '');
                    initEqualization.call(this, root);
                });
            }
            // Run Equalization
            initEqualization.call(this, root);
        },
        /**
         * initEqualization
         *
         * @param {Object} thisObj EqualBlocksHeight object
         * @private
         */
            initEqualization = function (thisObj) {
            // Equalize all elements in the collection
            if (!thisObj.settings.splitBy) {
                equalizeHeightOfElements.call(thisObj, thisObj.elements);
            } else { // Equalize the set of elements in the collection
                var elementsSize = thisObj.elements.size(),
                    fixedLimit = thisObj.settings.splitBy,
                    floatLimit = 0;
                while (elementsSize > 0) {
                    var collection = thisObj.elements.slice(floatLimit, fixedLimit);
                    equalizeHeightOfElements.call(thisObj, collection);
                    floatLimit += thisObj.settings.splitBy;
                    fixedLimit += thisObj.settings.splitBy;
                    elementsSize -= thisObj.settings.splitBy;
                }
            }
        },
        /**
         * equalizeHeightOfElements
         *
         * @param {jQuery} elements Elements
         * @private
         */
            equalizeHeightOfElements = function (elements) {
            var elementsMaxHeight = getMaxHeightOfElements.call(this, elements);
            setHeightOfElements.call(this, elements, elementsMaxHeight);
        },
        /**
         * getMaxHeightOfElements
         *
         * @param {jQuery} elements Elements
         * @returns {number} Max elements height
         * @private
         */
            getMaxHeightOfElements = function (elements) {
            var maxOuterHeight = 0;
            elements.each(function () {
                var element = $(this), elementHeight = element.outerHeight();
                if (elementHeight > maxOuterHeight) {
                    maxOuterHeight = elementHeight;
                }
            });
            return maxOuterHeight;
        },
        /**
         * setHeightOfElements
         *
         * @param {jQuery} elements Elements
         * @param {number} elementsMaxHeight Max elements height
		 * @private
         */
            setHeightOfElements = function (elements, elementsMaxHeight) {
            var boxSized = this.settings.isBoxSized;
            elements.each(function () {
                var equalHeightsElement = $(this),
                    elementHeight = equalHeightsElement.height(),
                    elementOuterHeight = equalHeightsElement.outerHeight(),
                    elementDiffHeight = elementOuterHeight - elementHeight,
                    // elementToHeight = (elementsMaxHeight - elementOuterHeight) + (elementOuterHeight - elementHeight - elementDiffHeight);
                    elementToHeight = (elementsMaxHeight) + (-elementHeight - elementDiffHeight);
                if(boxSized) {
                    var totalHeight = elementHeight + elementToHeight + elementDiffHeight;
                    equalHeightsElement.css('height', totalHeight);
                } else {
                    var totalHeight = elementHeight + elementToHeight;
                    equalHeightsElement.css('height', totalHeight);
                }
            });
        };
    return {
        init: init
    };
}());