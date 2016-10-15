//
// some general initialization here
//
if (typeof jQuery != "undefined") {
    $(function() {
        if ($.isFunction($.blockUI)) {
            // set default cursor for popup
            $.blockUI.defaults.css.cursor = "default";

            // enable overlay opacity for FF/Linux
            $.blockUI.defaults.applyPlatformOpacityRules = false;
        }
    });
}

/**
 * Redirects to url
 *
 * @param url Url to redirect
 */
function redirect(url) {
    window.location.href = url;
}

/**
 * Shows specified anchor
 *
 * @param name Name of anchor to show
 */
function goToAnchor(name) {
    var url = window.location.href;
    var parts = url.split("#");

    window.location.href = parts[0] + "#" + name;
}

function scrollToTop() {
    $("html, body").animate({scrollTop: 0}, 'fast');
}

/**
 * Convert new line symbols to html br
 *
 * @param value input string to convert
 * @return string
 */
function nl2br(value) {
    return value.replace(/\r\n/g, "<br />")
        .replace(/\n/g, "<br />")
        .replace(/\r/g, "<br />");
}

/**
 * Removes html entities from string
 *
 * @param value input string
 * @return string
 */
function stripTags(value) {
    return value.replace(/<\/?[^>]+>/gi, '');
}

/**
 * Returns alias way formatted string
 *
 * @param input
 * @return string
 */
function getAliasString(input) {
    return input.toLowerCase()
        .replace(/[^\w\d]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '');
}

/**
 * Creates alias string from one field and put it to another field
 *
 * @param fromElSelector
 * @param toElSelector
 */
function aliasCreator(fromElSelector, toElSelector) {
    var changeAlias = function() {
        var alias = $(fromElSelector).val();
        $(toElSelector).val(getAliasString(alias));
    };

    $(fromElSelector).keyup(changeAlias);
    $(fromElSelector).blur(changeAlias);
}

/**
 * Extends one class from another
 * 
 * @param child
 * @param parent
 */
function extendClass(child, parent) {
	var F = function() { };
	F.prototype = parent.prototype;
	
    child.prototype = new F();
	child.prototype.constructor = child;
	child.superclass = parent.prototype;
}

/**
 * Class for validation purposes
 */
var Validator = {
    isEmpty: function(value) {
        return value == "" || value == null;
    },
    isEmail: function(value) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
    }
};

var tooltipTimeout = null;

/**
 * Shows modal popup with message. Redirects to url if specified
 *
 * @param message Message to show
 * @param url Url to redirect (optional)
 */
function showTooltipMessage(message, url) {
    if (typeof jQuery != "undefined" && $.isFunction($("body").dialog)) {
        if ($("#message-dlg").length == 0) {
            $(document.body).append("<div id=\"message-dlg\" style=\"display: none;\"></div>")
        }

        $("#message-dlg").html(message);
        $("#message-dlg").dialog({
            title: "Message",
            minHeight: 0,
            modal: true,
            resizable: false,
            buttons: {
                "Ok": function() {
                    $(this).dialog("close");

                    if (url) {
                        redirect(url);
                    }
                }
            },
            close: function(event, ui) {
                clearTimeout(tooltipTimeout);

                if (url) {
                    redirect(url);
                }
            }
        });

        tooltipTimeout = setTimeout(function() {
            $("#message-dlg").dialog("close");

            if (url) {
                redirect(url);
            }
        }, 3000);
    } else {
        alert(message);
    }
}

/**
 * Shows confirmation modal popup with message
 *
 * @param message Message to show
 * @param okCallback
 * @param cancelCallback
 */
function showConfirmDlg(message, okCallback, cancelCallback) {
    if (typeof jQuery != "undefined" && $.isFunction($("body").dialog)) {
        if ($("#confirm-dlg").length == 0) {
            $(document.body).append("<div id=\"confirm-dlg\" style=\"display: none;\"></div>")
        }

        $("#confirm-dlg").html(message);
        $("#confirm-dlg").dialog({
            title: "Confirm",
            minHeight: 0,
            modal: true,
            resizable: false,
            buttons: {
                "Ok": function() {
                    $(this).dialog("close");

                    if ($.isFunction(okCallback)) {
                        okCallback.call(this);
                    }
                },
                "Cancel": function() {
                    $(this).dialog("close");

                    if ($.isFunction(cancelCallback)) {
                        cancelCallback.call(this);
                    }
                }
            }
        });
    } else {
        if (confirm(message)) {
            okCallback.call(this);
        } else {
            cancelCallback.call(this);
        }
    }
}

var _raqPopupCache;
var _raqPopupGlobalEventsInitialized = false;

function preloadRaqPopup() {
    if (_raqPopupCache) {
        return;
    }

    $.ajax({
        url: '/ajax/raq-popup',
        data: {format: "html"},
        async: false,
        success: function(data) {
            _raqPopupCache = data;
        }
    });
}

function showRaqPopup() {
    if (_raqPopupCache) {
        _showRaqPopup(_raqPopupCache);
        _initRaqPopup();
        return;
    }

    $.ajax({
        url: '/ajax/raq-popup',
        data: {format: "html"},
        async: false,
        success: function(data) {
            _raqPopupCache = data;
            _showRaqPopup(data);
            _initRaqPopup();
        },
        error: function() {
            showTooltipMessage(Config.generalErrorMessage);
        }
    });
}

function _initRaqPopup() {
    if (!_raqPopupGlobalEventsInitialized) {
        var escapeBtnHandler = function(e) {
            var code = e.keyCode ? e.keyCode : e.which;

            if (code == 27) {
                $.unblockUI();
            }
        };

        // setup esc button to exit from popup
        $(document).unbind('keyup', escapeBtnHandler);
        $(document).keyup(escapeBtnHandler);
    }

    _raqPopupGlobalEventsInitialized = true;

    $(".jq-raq-form").submit(function() {
        var dispatcher = new AjaxFormDispatcherJson(
            '/ajax/submit-raq',
            {
                containerEl: ".jq-raq-form-container",
                formEl: ".jq-raq-form",
                successCallback: function(data) {
                    redirect('/thankyou/');
                },
                fieldsErrorsCallback: function(errors) {
                    for (var i in errors) {
                        var error = errors[i];
                        var $element = $(".jq-raq-form [name=" + error.name + "]");

                        $element.closest(".jq-form-row").addClass("error");

                        var separator = ", ";
                        var msg = "";

                        if ($.isArray(error.messages)) {
                            msg += error.messages.join(separator);
                        } else {
                            msg += error.messages;
                        }

                        $element.closest(".jq-form-row").find("label").append(" <span>" + msg + "</span>");
                    }
                }
            }
        );

        $(".jq-raq-form .jq-form-row").removeClass("error");
        $(".jq-raq-form .jq-form-row label span").remove();

        dispatcher.dispatch();
    });

    $(".jq-raq-form input[type=text], .jq-raq-form input[type=email], .jq-raq-form input[type=tel], .jq-raq-form textarea").focus(function() {
        $(this).closest(".jq-form-row").addClass("focus");
    }).blur(function() {
        $(this).closest(".jq-form-row").removeClass("focus");
    });
}

function _showRaqPopup(html) {
    var id = "raq-popup";
    var selector = "#" + id;
    var $raq = $(selector);

    if ($raq.length == 0) {
        $(document.body).append("<div id=\"" + id + "\" style=\"display: none;\"></div>");
        $raq = $(selector);
    } else {
        $raq.empty();
    }

    $raq.html(html);
    $raq.find(".jq-raq-popup-verisign-container").html($(".jq-verisign-container").html());

    $.blockUI({
        message: $raq,
        css: {
            top: '50%',
            left: '50%',
            width: '632px',
            height: '549px',
            marginLeft: '-316px',
            marginTop: '-274px'
        }
    });
}

//
// RAQ popup events initialization
//
$(function() {
    $(".jq-raq-popup-btn").click(showRaqPopup);

    if ($(".jq-raq-popup-btn").length > 0) {
        preloadRaqPopup();
    }
});

var videoPopupCache = {};

/**
 * Shows popup with video
 *
 * @param type Type of video popup. Can be 'home', 'widget', 'portfolio', 'microsite-rd', 'wdd-cms', 'home-testimonials-1', 'home-testimonials-2', 'home-testimonials-3'
 */
function showVideoPopup(type) {
    if (!type) {
        type = "home";
    }

    if (videoPopupCache[type]) {
        _showVideoPopup(videoPopupCache[type]);
        return;
    }
    
    $.ajax({
        url: '/ajax/video-popup',
        data: {type: type, format: "html"},
        async: false,
        success: function(data) {
            videoPopupCache[type] = data;
            _showVideoPopup(data);

            var escapeBtnHandler = function(e) {
                var code = e.keyCode ? e.keyCode : e.which;

                if (code == 27) {
                    $.unblockUI();
                }
            };

            // setup esc button to exit from popup
            $(document).unbind('keyup', escapeBtnHandler);
            $(document).keyup(escapeBtnHandler);
        },
        error: function() {
            showTooltipMessage(Config.generalErrorMessage);
        }
    });
}

function _showVideoPopup(html) {
    var id = "video-popup";
    var selector = "#" + id;
    var $video = $(selector);

/*
    if ($video.length == 0) {
        $(document.body).append("<div id=\"" + id + "\" style=\"display: none;\"></div>");
        $video = $(selector);
    } else {
        $video.empty();
    }
    

    $video.html(html);
*/    
    html = "<div id=\"" + id + "\" style=\"display: block;\">"+html+"</div>";

    $.blockUI({
//        message: $video,
        message: html,
        css: {
            top: '50%',
            left: '50%',
            width: '714px',
            height: '560px',
            marginLeft: '-357px',
            marginTop: '-280px'
        }
    });
}

/**
 * Make specified element's text expandable
 *
 * @param symbols Number of symbols to show before "More" link (optional)
 * @param selector Selector for element(s) (optional)
 */
function makeExpandableText(symbols, selector) {
    if (typeof jQuery == "undefined" || !$.isFunction($("body").expander)) {
        return;
    }

    if (!symbols) {
        symbols = 180;
    }
    
    if (!selector) {
        selector = ".sys-expandable-text";
    }
    
    $(selector).expander({
        slicePoint: symbols,
        expandText: "Read More",
        userCollapseText: "Less"
    });
}
function makeExpandableText(symbols, selector) {

    
}



