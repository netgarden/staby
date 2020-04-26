Media = {}

Media.init = function() {

    var opener = window.opener;
    if (opener != null && typeof(opener.fileChooserCallback) !== 'undefined') {
        django.jQuery('a.media-file').on('click', function(e) {
            e.preventDefault();

            var target = django.jQuery(e.target);
            var url = target.attr('href');
            var path = target.attr('data-path');

            opener.fileChooserCallback(url, path);
            window.close();

        });
    }

}

Media.showPopup = function(id_or_callback, url, useUrl = false) {

    var id2 = '';
    if (typeof(id_or_callback) === 'string') {
        
        id2 = String(id_or_callback).replace(/\-/g,"____").split(".").join("___");
        
        window.fileChooserCallback = function(fileUrl, filePath) {
            django.jQuery('#' + id_or_callback).val(useUrl ? fileUrl : filePath);
        }

    } else {
        window.fileChooserCallback = id_or_callback;
    }

    popup = window.open(url, id2, 'height=600,width=1000,resizable=yes,scrollbars=yes');
    popup.focus();

}