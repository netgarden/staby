tinymce.init({
  
  selector: 'textarea.mceEditor',
  
  plugins: 'image code',

  file_picker_callback: function (cb, value, meta) {
    Media.showPopup(cb, '/admin/media/', true);
  }
  
});