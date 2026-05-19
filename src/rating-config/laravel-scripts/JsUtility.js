/**
Core script to handle the entire theme and core functions
**/
var JsUtility = function() {
    return {
        showToastr: function(type='success', title='', message='') {
            toastr[type](message, title, {
                closeButton: true,
                tapToDismiss: false,
                progressBar: true,
                timeOut: 3000,
                escapeHtml: false,
                positionClass: "toast-bottom-right"
            });
        },

        reload: function(time=5000) {
            setTimeout(function () {
                location.reload(true);
            }, time);
        }
    }
}();