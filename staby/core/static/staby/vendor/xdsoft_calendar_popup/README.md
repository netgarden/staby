<div style="float: right; margin-top:30px;">
<input type="text" id="inlinecp"/>
</div>

# Calendar Popup

The project is written on [TypeScript](https://www.typescriptlang.org/) + [Less](http://lesscss.org/). 

For tests it uses [Mocha](https://mochajs.org/) + [Chai](http://chaijs.com/). 

For datetime parsing it uses [MomentJS](https://momentjs.com/)

Build is composed using [WebPack](https://webpack.js.org/)

<a class="btn btn-success" href="https://shopper.mycommerce.com/checkout/product/56809-11?currency=USD">Buy for 7$</a>

## Examples
Simple Date Time Picker
<input type="text" id="example"/>
Only Date Picker
<input type="text" id="datepicker"/>
Disable buttons
<input type="text" id="datepickerdb"/>

<link href="https://xdsoft.net/scripts/calendar-popup/build/calendar.css" rel="stylesheet" />
<script src="https://xdsoft.net/scripts/calendar-popup/build/calendar.full.min.js"></script>

<script>
var calendar = new CalendarPopup('#example')	
var calendar = new CalendarPopup('#datepicker', {
timepicker: false
})
var calendar = new CalendarPopup('#datepickerdb', {
timepicker: false,
format: 'YYYY/MM/DD',
choseOnClick: true,
closeButton: false,
choseButton: false,
})
var calendar = new CalendarPopup('#inlinecp', {
inlineMode: true
})
</script>	


[include update/buy/updater.php]

## Get start

First include to page css and js files

```html
<!-- this should go after your </body> -->
<link rel="stylesheet" href="build/calendar.css"/>
<script src="build/calendar.full.min.js"></script>
```

Archive has 3 bundle files
* `build/calendar.full.min.js` - Contains a file of locales and momentjs 
* `build/calendar.with-moment.min` - Contains momentjs 
* `build/calendar.min.js` - Only plugin without another libraries. Use this bundle then you already have MomentJS on your page

## Init
```javascript
var calendar = new CalendarPopup('#source_input');
```
or you can replace all Date inputs
```javascript
var calendars = new CalendarPopups('input[type=date]');
```
you can use jQuery
```javascript
var $calendars = $('input[type=date]').CalendarPopup();
// for access to native CalendarPopups use $calendars.eq(0).data('calendar-popup')
```
By default popup is shown when user sets focus inside source element, but you can show it from your code
```javascript
var calendar = new CalendarPopup('#source_input');
calendar.popup.show();
calendar.popup.hide();
calendar.popup.toggle();
```

## Destruct
This code will destruct calendar 
```javascript
var calendar = new CalendarPopup('#source_input');
calendar.destructor();
```

## Locale
You can change language using `locale` option
```javascript
var calendar = new CalendarPopup('#source_input', {
    locale: 'de'
});
```

Possible values:
```
en,af,ar-dz,ar-kw,ar-ly,ar-ma,ar-sa,ar-tn,ar,
az,be,bg,bn,bo,br,bs,ca,cs,cv,cy,da,de-at,de-ch,
de,dv,el,en-au,en-ca,en-gb,en-ie,en-nz,eo,es-do,
es,et,eu,fa,fi,fo,fr-ca,fr-ch,fr,fy,gd,gl,
gom-latn,he,hi,hr,hu,hy-am,id,is,it,ja,
jv,ka,kk,km,kn,ko,ky,lb,lo,lt,lv,me,
mi,mk,ml,mr,ms-my,ms,my,nb,ne,nl-be,nl,
nn,pa-in,pl,pt-br,pt,ro,ru,sd,se,si,
sk,sl,sq,sr-cyrl,sr,ss,sv,sw,ta,te,tet,
th,tl-ph,tlh,tr,tzl,tzm-latn,tzm,uk,
ur,uz-latn,uz,vi,x-pseudo,yo,
zh-cn,zh-hk,zh-tw 
```

## Mask
Hide mask
```javascript
var calendar = new CalendarPopup('#source_input', {
    showMask: false
});
```
Disable mask
```javascript
var calendar = new CalendarPopup('#source_input', {
    mask: false
});
```

Disable validate on blur
```javascript
var calendar = new CalendarPopup('#source_input', {
    validateOnBlur: false
});
```

Deny empty value
```javascript
var calendar = new CalendarPopup('#source_input', {
    allowBlank: false
});
```
 
## Show week Index
 ```javascript
 var calendar = new CalendarPopup('#source_input', {
     showWeekIndex: true
 });
 ```

## Input Output
### Datetime format
You can change datetime format. Use `format` option
```javascript
var calendar = new CalendarPopup('#source_input', {
    format: 'YYYY/MM/DD HH:mm'
});
```
### Set value
```javascript
var calendar = new CalendarPopup('#source_input', {
    format: 'DD.MM.YYYY'
});
calendar.value.set(new Date());
calendar.value.set('12.12.2012');
calendar.value.setYear(1998);
```
### Get value
```javascript
var calendar = new CalendarPopup('#source_input');
console.log(calendar.value.get()); // Date
console.log(calendar.value.getString()); // string
```

## Start of week
By default it uses Sunday like a first day of week
```javascript
var calendar = new CalendarPopup('#source_input', {
    dayOfWeekStart: true
});
```
## Inline mode
You can use calendar in inline mode
```javascript
var calendar = new CalendarPopup('#source_input', {
    inlineMode: true // Monday
});
```

## TimePicker & DatePicker
### Hide Timepicker
```javascript
var calendar = new CalendarPopup('#source_input', {
    timepicker: false
});
```
### Hide DatePicker
```javascript
var calendar = new CalendarPopup('#source_input', {
    datepicker: false
});
```
### Allow not fill time
and you can use two variants of DateTime format: with time and without time
```javascript
var calendar = new CalendarPopup('#source_input', {
    allowNotFillTime: true,
    formatWithoutTime: 'YYYY/MM/DD',
});
```
## Wrapper
By default source input is wrapped into wrap block. Disable this
```javascript
var calendar = new CalendarPopup('#source_input', {
    wrapSourceInput: false,
    allowKeyBoardEdit: true,
});
```


## Buttons
### Hide Close button
```javascript
var calendar = new CalendarPopup('#source_input', {
    closeButton: false
});
```

### Hide Chose button
```javascript
var calendar = new CalendarPopup('#source_input', {
    choseButton: false
});
```
## Behaviors
### Disable MouseWheel behavior
```javascript
var calendar = new CalendarPopup('#source_input', {
    mousewheel: false
});
```

### Chose date on one click
```javascript
var calendar = new CalendarPopup('#source_input', {
    choseOnClick: true
});
```

## Events
```javascript
var calendar = new CalendarPopup('#source_input');
```

### update
update datetime state
```javascript
calendar.datetime.on('update', function () {
    console.log(calendar.datetime.get());
});
```
### update_time
Was updated only time
```javascript
calendar.datetime.on('update_time', function () {
    console.log(calendar.datetime.get());
});
```

### after_init
Fire after init plugin
```javascript
calendar.datetime.on('after_init', function () {
    calendar.destructor;
});
```
### native_change
Fire then source input element change value
```javascript
calendar.datetime.on('native_change', function () {
    console.log(calendar.nativeElement.value);
});
```

### chosen
datetime or date was chosen
```javascript
calendar.datetime.on('chosen', function () {
    console.log(calendar.datetime.get());
});
```

### after_redraw
Calendar was repainted
```javascript
calendar.datetime.on('after_redraw', function () {
    var weekends = calendar.popup.container.querySelectorAll('.calendar-popup-month-dates.calendar-popup-month-dates_weekend');
    for (var i = 0; i < weekends.length; i += 1) {
        weekends[i].classList.remove('calendar-popup-month-dates_weekend');
    }
});
```

### close_popup
popup will be closed
```javascript
calendar.datetime.on('close_popup', function () {
    calendar.destructor();
});
```


## ReBuild

Build bundle files
```bash
npm install
npm run build
```

or run Hot Module Replacement server

```bash
npm install
npm start
```