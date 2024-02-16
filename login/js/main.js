function setCookie(name, value, exp_days) {
    let d = new Date();
    d.setTime(d.getTime() + (exp_days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    let cookieName = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

function generateCSRFToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

(function($) {
    "use strict";

    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function() {
        $(this).on('blur', function() {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    })

    /*=============== [ Validate ]  ===============*/
    let input = $('.validate-input .input100');

    $('.validate-form').on('submit', function(event) {
        $(".loader").css("visibility", "visible");
        let check = true;
        for (let i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        let formData = {
            user: $("#User").val(),
            pass: $("#pass").val(),
            _csrf: getCookie('_csrf')
        };

        $.ajax({
            type: "POST",
            url: "https://healthconnect-server.onrender.com/login",
            crossDomain: true,
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function(data) {
            sessionStorage.setItem('user', $("#User").val());
            sessionStorage.setItem('token', data.token);
            location.href = "../dashboard/patient/";
        }).fail(function(data) {
            for (let i = 0; i < input.length; i++) {
                showValidate(input[i]);
                check = false;
            }
        });

        event.preventDefault();
        return check;
    });

    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ((!$(input).attr('type') == 'text') || (!$(input).attr('name') == 'password')) {
            return true;
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        let thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
        $(".alert-v").addClass('alert-validate-s');
        $(".loader").css("visibility", "hidden");
    }

    function hideValidate(input) {
        let thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
        $(".alert-v").removeClass('alert-validate-s');
    }

    /*==================================================================
    [ Show pass ]*/
    let showPass = 0;
    $('.btn-show-pass').on('click', function() {
        if (showPass == 0) {
            $(this).next('input').attr('type', 'text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        } else {
            $(this).next('input').attr('type', 'password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
    });

    // Generate and set CSRF token
    let csrfToken = generateCSRFToken();
    setCookie('_csrf', csrfToken, 1);

})(jQuery);
