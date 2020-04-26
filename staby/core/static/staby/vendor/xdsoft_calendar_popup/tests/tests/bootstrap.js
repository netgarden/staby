var expect = chai.expect;

var simulateEvent = function (type, keyCodeArg, element, options) {
    var evt = (element.ownerDocument || document).createEvent('HTMLEvents')
    evt.initEvent(type, true, true);
    evt.keyCode = keyCodeArg;
    evt.which = keyCodeArg;
    if (options) {
        options(evt);
    }

    if (type.match(/^mouse/)) {
        ['pageX', 'pageY', 'clientX', 'clientY'].forEach(function (key) {
            if (evt[key] === undefined) {
                evt[key] = 0;
            }
        })
    }

    element.dispatchEvent(evt);
};

var createInput = function (id) {
    var input = document.createElement('input');

    if (id) {
        input.id = id;
    }

    input.className = '_temp_input_class';
    document.body.appendChild(input);
    return input;
};