function newsletterSignUp(ajaxUrl, helperId) {
    var switchNewsletterView = function(view) {
        if (view == "form") {
            $("#" + helperId + "-newsletter-thankyou-container").fadeOut("fast", function() {
                $("#" + helperId + "-newsletter-form-container").fadeIn("fast");
            });
        } else {
            // thankyou
            $("#" + helperId + "-newsletter-form-container").fadeOut("fast", function() {
                $("#" + helperId + "-newsletter-thankyou-container").fadeIn("fast");
            });
        }
    };

    var dispatcher = new AjaxFormDispatcherJson(
        ajaxUrl,
        {
            containerEl: "#" + helperId + "-newsletter-container",
            formEl: "#" + helperId + "-newsletter-form",
            masking: true,
            loadingMessage: null,
            customJs: function() {
                $("#" + helperId + "-newsletter-form [name=Email]").val("");

                switchNewsletterView("thankyou");
                setTimeout(switchNewsletterView, 3000, "form");

                $("#" + helperId + "-newsletter-message").hide();
                $("#" + helperId + "-newsletter-message").empty();
                $("#" + helperId + "-newsletter-form-container").removeClass("newsletter_error");
            },
            customShowFormValidationErrors: function(errors) {
                var separator = "; ";
                var html = "";

                for (var i in errors) {
                    var error = errors[i];

                    if ($.isArray(error.messages)) {
                        html += error.messages.join(separator);
                    } else if ($.isPlainObject(error.messages)) {
                        var messages = "";

                        for (var i in error.messages) {
                            if (messages.length > 0) {
                                messages += separator;
                            }

                            messages += error.messages[i];
                        }

                        html += messages;
                    } else {
                        html += error.messages;
                    }
                }

                $("#" + helperId + "-newsletter-message").html(html);
                $("#" + helperId + "-newsletter-message").show();
                $("#" + helperId + "-newsletter-form-container").addClass("newsletter_error");
            }
        }
    );

    $("#" + helperId + "-newsletter-form").submit(function() {
        dispatcher.dispatch();
    });
    $("#" + helperId + "-newsletter-form [name=signUpBtn]").click(function() {
        dispatcher.dispatch();
    });
}
