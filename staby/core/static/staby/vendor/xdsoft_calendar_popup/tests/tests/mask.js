describe('Mask Tests', function() {
    describe('Placeholder', function () {
        describe('Without wrapper', function () {
            it('Should add placeholder to native input', function () {
                var calendar = new CalendarPopup(createInput(), {
                    mask: true,
                    wrapSourceInput: false
                });
                expect(calendar.nativeElement.getAttribute('placeholder')).to.be.equal('____/__/__ __:__')
            });
            it('Should not change default placeholder from native input', function () {
                var input = createInput();

                input.setAttribute('placeholder', 'test')

                var calendar = new CalendarPopup(input, {
                    mask: true,
                    wrapSourceInput: false
                });
                expect(calendar.nativeElement.getAttribute('placeholder')).to.be.equal('test')
            });
            it('Should remove placeholder from native input after destruct', function () {
                var input = createInput();

                var calendar = new CalendarPopup(input, {
                    mask: true,
                    wrapSourceInput: false
                });
                expect(calendar.nativeElement.getAttribute('placeholder')).to.be.equal('____/__/__ __:__')
                calendar.destructor();
                expect(calendar.nativeElement.getAttribute('placeholder')).to.be.equal(null)
            });
        });
        describe('With wrapper', function () {
            it('Should add placeholder input before native input', function () {
                var calendar = new CalendarPopup(createInput(), {
                    mask: true,
                    wrapSourceInput: true
                });
                expect(calendar.nativeElement.getAttribute('placeholder')).to.not.be.equal('____/__/__ __:__')
                expect(calendar.wrapperNativeInput.container.querySelector('input').value).to.be.equal('____/__/__ __:__')
            });
        });
    });

    afterEach(function () {
        [].slice.call(document.querySelectorAll('._temp_input_class')).forEach(function (input) {
            input.parentNode.removeChild(input);
        });
        Object.keys(CalendarPopup.instances).forEach(function (key) {
            CalendarPopup.instances[key].destructor();
            delete CalendarPopup.instances[key];
        });
    });
});