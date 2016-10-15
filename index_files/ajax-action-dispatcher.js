/**
 * Base class for ajax actions dispatching
 * Uses jquery ajaxSubmit and loadmask plugins
 *
 * Available options:
 *  containerEl (optional) - container for all elements that are used in send/receive/dispatch process. Body element by default
 *  masking (optional) - true/false to enable/disable masking while sending request to server. False by default
 *  maskEl (optional) - element for apply masking functionality. 'containerEl' is used by default
 *  loadingMessage (optional) - message that would be shown above the masked element. Empty by default
 *
 * Available callbacks:
 *  success
 *  error
 *  customJs - when action dispacher receives 'custom js' command, it will call this callback
 *
 * @param url string
 * @param options object (containerEl, masking, maskEl, loadingMessage)
 */
function AjaxDispatcher(url, options) {
    this.url = url;

    // options setup
    this.containerEl = (options.containerEl) ? options.containerEl : "body";
    this.masking = (options.masking) ? options.masking : false;
    this.maskEl = (options.maskEl) ? options.maskEl : null;
    this.loadingMessage = (typeof options.loadingMessage != 'undefined') ? options.loadingMessage : null;

    // setup callback functions
    this.success = (options.success) ? options.success : null;
    this.error = (options.error) ? options.error : null;
    this.customJs = (options.customJs) ? options.customJs : null;
}

AjaxDispatcher.ACTION_NONE = 'none';
AjaxDispatcher.ACTION_REDIRECT = 'redirect';
AjaxDispatcher.ACTION_SHOW_MESSAGE = 'show-message';
AjaxDispatcher.ACTION_SHOW_MESSAGE_AUDIT = 'show-message-audit';
AjaxDispatcher.ACTION_SHOW_FIELD_VALIDATION_STATUS = 'show-field-validation-status';
AjaxDispatcher.ACTION_SHOW_FORM_VALIDATION_ERRORS = 'show-form-validation-errors';
AjaxDispatcher.ACTION_RELOAD_GRID = 'reload-grid';
AjaxDispatcher.ACTION_CUSTOM_JS = 'custom-js';

AjaxDispatcher.prototype.dispatch = function() {};

AjaxDispatcher.prototype.maskContainer = function() {
    if (!$.isFunction($("body").mask) || !this.masking) {
        return;
    }

    if (this.loadingMessage != null) {
        $(this.maskEl ? this.maskEl : this.containerEl).mask(this.loadingMessage);
    } else {
        $(this.maskEl ? this.maskEl : this.containerEl).mask();
    }
};

AjaxDispatcher.prototype.unmaskContainer = function() {
    if (!$.isFunction($("body").unmask) || !this.masking) {
        return;
    }

    $(this.maskEl ? this.maskEl : this.containerEl).unmask();
};

/**
 * Function that decide what to do with actions in response
 *
 * @param data object
 */
AjaxDispatcher.prototype.dispatchAction = function(data) {
    switch (data.action) {
        case AjaxDispatcher.ACTION_NONE:
            break;
        case AjaxDispatcher.ACTION_REDIRECT:
            if (data.message) {
                showTooltipMessage(data.message, data.url);
            } else {
                redirect(data.url);
            }

            break;
        case AjaxDispatcher.ACTION_SHOW_MESSAGE:
            showTooltipMessage(data.message);
            break;
        case AjaxDispatcher.ACTION_SHOW_MESSAGE_AUDIT:
            showThankYouMessage();
            break;
        case AjaxDispatcher.ACTION_SHOW_FIELD_VALIDATION_STATUS:
            this.showFieldValidationStatus(data.fieldName, data.isValid, data.errors);
            break;
        case AjaxDispatcher.ACTION_SHOW_FORM_VALIDATION_ERRORS:
            this.showFormValidationErrors(data.errors);
            break;
        case AjaxDispatcher.ACTION_RELOAD_GRID:
            $("#" + data.gridId).trigger("reloadGrid");
            break;
        case AjaxDispatcher.ACTION_CUSTOM_JS:
            if ($.isFunction(this.customJs)) {
                this.customJs.call(this, data.data);
            }

            break;
    }
};

//
// =====================================================================================================================
//

/**
 * Class for dispatching action requests
 *
 * Available options:
 *  options from base class
 *  data (optional) - data that will be sent with general request data
 *
 * @param url string
 * @param options object (data)
 */
function AjaxActionDispatcherJson(url, options) {
    AjaxActionDispatcherJson.superclass.constructor.call(this, url, options);

    // setup options
    this.data = (options.data) ? options.data : {};
};

extendClass(AjaxActionDispatcherJson, AjaxDispatcher);

AjaxActionDispatcherJson.prototype.dispatch = function() {
    var t = this;

    $.ajax({
        url: this.url,
        type: "POST",
        data: this.data,
        dataType: 'json',
        success: function(data) {
            t.unmaskContainer();

            if (!data || !data.action) {
                showTooltipMessage(Config.generalErrorMessage);
                return;
            }

            t.dispatchAction(data);

            if ($.isFunction(t.success)) {
                t.success.call(t, data.action);
            }
        },
        error: function() {
            t.unmaskContainer();
//            showTooltipMessage(Config.generalErrorMessage);

            if ($.isFunction(t.error)) {
                t.error.call(t);
            }
        }
    });

    this.maskContainer();
};

//
// =====================================================================================================================
//

/**
 * Implements form response dispatching
 *
 * Available options:
 *  formEl - form element to collect data from
 *  data (optional) - data that will be sent with general request data
 *  fieldContainerEl (optional) - form field container element
 *  scrollToTopOnError (optional) - if true page will scroll to top when error occured
 *  validationDisplayMode (optional) - could be "per-field", "box" or "popup".
 *   - "per-field" displays error near each field
 *   - "box" displays errors in one box for error messages
 *   - "popup" displays popup window with error messages
 *  validateFields (optional)
 *  validateFieldsSelector (optional)
 *  validateFieldsUrl (optional)
 *  validationMessagesEl (optional) - all validation messages will be placed inside this element
 *  preValidateForm (optional, only when validateFields is true)
 *  validClass (optional)
 *  notValidClass (optional) - css class that would be added to invalid element container
 *
 * Available callbacks:
 *  customShowFormValidationErrors (optional) - callback for validation errors showing
 *  customHideFormValidationErrors (optional) - callback for validation errors hiding
 *
 * @param url string
 * @param options object
 */
function AjaxFormDispatcherJson(url, options) {
    AjaxFormDispatcherJson.superclass.constructor.call(this, url, options);

    // options
    this.formEl = options.formEl;
    this.fieldContainerEl = (options.fieldContainerEl) ? options.fieldContainerEl : ".jq-form-row";
    this.data = (options.data) ? options.data : {};

    this.validationDisplayMode = (options.validationDisplayMode) ? options.validationDisplayMode : "box";
    this.validateFields = options.validateFields ? options.validateFields : false;
    this.validateFieldsSelector = options.validateFieldsSelector ? options.validateFieldsSelector : this.formEl + " input[type=text], " + this.formEl + " textarea";
    this.validateFieldsUrl = (options.validateFieldsUrl) ? options.validateFieldsUrl : null;
    this.validationMessagesEl = (options.validationMessagesEl) ? options.validationMessagesEl : null;
    this.preValidateEnabled = (options.preValidateEnabled) ? options.preValidateEnabled : false;
    this.scrollToTopOnError = (typeof options.scrollToTopOnError != 'undefined') ? options.scrollToTopOnError : false;

    this.validClass = (options.validClass) ? options.validClass : "valid";
    this.notValidClass = (options.notValidClass) ? options.notValidClass : "error";

    // callback functions
    this.customShowFormValidationErrors = (options.customShowFormValidationErrors) ? options.customShowFormValidationErrors : null;
    this.customInjectionShowFormValidationErrors = (options.customInjectionShowFormValidationErrors) ? options.customInjectionShowFormValidationErrors : null;
    this.customHideFormValidationErrors = (options.customHideFormValidationErrors) ? options.customHideFormValidationErrors : null;

    // separate field validation
    if (this.validateFields && this.validateFieldsUrl) {
        var t = this;

        $(this.validateFieldsSelector).blur(function() {
            t.validateField($(this).attr("name"));
        });

        if (this.preValidateEnabled) {
            $(this.validateFieldsSelector).each(function() {
                if (!Validator.isEmpty($(this).val())) {
                    t.validateField($(this).attr("name"));
                }
            });
        }
    }
}

extendClass(AjaxFormDispatcherJson, AjaxDispatcher);

AjaxFormDispatcherJson.prototype.dispatch = function() {
    var t = this;

    $(this.formEl).ajaxSubmit({
        url: this.url,
        data: this.data,
        dataType: 'json',
        success: function(data, statusText, xhr, $form) {
            t.unmaskContainer();
            t.hideFormValidationErrors();

            if (!data || !data.action) {
                showTooltipMessage(Config.generalErrorMessage);
                return;
            }

            t.dispatchAction(data);

            if ($.isFunction(t.success)) {
                t.success.call(t, data.action);
            }
        },
        error: function() {
            t.unmaskContainer();
//            showTooltipMessage(Config.generalErrorMessage);

            if ($.isFunction(t.error)) {
                t.error.call(t);
            }
        }
    });

    this.maskContainer();
    this.hideFormValidationErrors();
};

AjaxFormDispatcherJson.prototype.validateField = function(fieldName) {
    var t = this;
    var data = this.data;

    data.fieldName = fieldName;

    $(this.formEl).ajaxSubmit({
        url: this.validateFieldsUrl,
        data: this.data,
        dataType: 'json',
        success: function(data, statusText, xhr, $form) {
            t.hideFieldValidationStatus(fieldName);

            if (!data || !data.action) {
                showTooltipMessage(Config.generalErrorMessage);
                return;
            }

            t.dispatchAction(data);

            if ($.isFunction(t.success)) {
                t.success.call(t, data.action);
            }
        },
        error: function() {
//            showTooltipMessage(Config.generalErrorMessage);

            if ($.isFunction(t.error)) {
                t.error.call(t);
            }
        }
    });

    this.hideFieldValidationStatus(fieldName);
};

AjaxFormDispatcherJson.prototype.showFormValidationErrors = function(errors) {
    if (this.customShowFormValidationErrors) {
        this.customShowFormValidationErrors.call(this, errors);
        return;
    }
    if (this.customInjectionShowFormValidationErrors) {
        this.customInjectionShowFormValidationErrors.call(this, errors);
    }

    if (this.validationDisplayMode == "per-field") {
        for (var i in errors) {
            var error = errors[i];
            var $element = $(this.formEl + " [name=" + error.name + "]");

            $element.closest(this.fieldContainerEl).addClass(this.notValidClass);

            var separator = ", ";
            var msg = "";

            if ($.isArray(error.messages)) {
                msg += error.messages.join(separator);
            } else {
                msg += error.messages;
            }

            $element.closest(this.fieldContainerEl).find("label").append(" <span>" + msg + "</span>");
        }
    } else if (this.validationDisplayMode == "box" && this.validationMessagesEl) {
        $(this.containerEl + " " + this.validationMessagesEl).html(this.getValidationErrors(errors));
        $(this.containerEl + " " + this.validationMessagesEl).show();

        for (var i in errors) {
            var field = errors[i];
            $(this.formEl + " [name=\"" + field.name + "\"]").closest(this.fieldContainerEl).addClass(this.notValidClass);
        }
    } else {
        showTooltipMessage(this.getValidationErrors(errors, 'text'));
    }

    if (this.scrollToTopOnError && typeof scrollToTop != 'undefined' && $.isFunction(scrollToTop)) {
        scrollToTop();
    }
};

AjaxFormDispatcherJson.prototype.hideFormValidationErrors = function() {
    if (this.customHideFormValidationErrors) {
        this.customHideFormValidationErrors.call(this);
        return;
    }

    if (this.validationDisplayMode == "per-field") {
        $(this.formEl + " " + this.fieldContainerEl).removeClass(this.notValidClass);
        $(this.formEl + " " + this.fieldContainerEl + " label span").remove();
    } else if (this.validationDisplayMode == "box" && this.validationMessagesEl) {
        $(this.containerEl + " " + this.validationMessagesEl).empty();
        $(this.containerEl + " " + this.validationMessagesEl).hide();
    }
};

AjaxFormDispatcherJson.prototype.showFieldValidationStatus = function (fieldName, isValid, errors) {
    if (isValid) {
        $(this.formEl + " [name=\"" + fieldName + "\"]").closest(this.fieldContainerEl).addClass(this.validClass);
    } else {
        this.showFormValidationErrors(errors);
    }
};

AjaxFormDispatcherJson.prototype.hideFieldValidationStatus = function(fieldName) {
    $element = $(this.formEl + " [name=\"" + fieldName + "\"]");
    $element.closest(this.fieldContainerEl).removeClass(this.validClass);
    $element.closest(this.fieldContainerEl).removeClass(this.notValidClass);
    $element.closest(this.fieldContainerEl).find("label").find("span").remove();
}

AjaxFormDispatcherJson.prototype.getValidationErrors = function(errors, type) {
    if (!type) {
        type = 'html';
    }

    var output = "";

    if (type == 'html') {
        output += "<ul>";
    }

    for (var i in errors) {
        if (type == 'html') {
            output += "<li>";
        }

        var error = errors[i];

        if ($.isPlainObject(error)) {
            output += "<span class=\"field-label\">" + error.label + ":</span> ";

            if ($.isArray(error.messages)) {
                output += error.messages.join("; ");
            } else {
                output += error.messages;
            }
        } else {
            // some custom error, not linked to any field
            output += errors[i];
        }

        if (type == 'html') {
            output += "</li>";
        } else {
            output += "\n";
        }
    }

    if (type == 'html') {
        output += "</ul>";
    }

    return output;
};
