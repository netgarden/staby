describe('Calendar Popup Tests', function() {
    describe('Constructor', function () {
        it('Should be in global scope', function () {
            expect(window.CalendarPopup).to.be.a('function');
        });
        describe('First argument', function () {
            it('Should be defined', function () {
                var calendar;
                try {
                    calendar = new CalendarPopup();
                    expect(false).to.be.equal(true);
                } catch (e) {
                    expect(true).to.be.equal(true);
                }
            });
            it('Should be Element or valid selector', function () {
                var calendar;
                try {
                    calendar = new CalendarPopup(123);
                    expect(false).to.be.equal(true);
                } catch (e) {
                    expect(true).to.be.equal(true);
                }

                try {
                    calendar = new CalendarPopup('.selector');
                    expect(false).to.be.equal(true);
                } catch (e){
                    expect(true).to.be.equal(true);
                }

                // input element should have parentNode
                var input = document.createElement('input');
                input.id = "without_parent";

                try {
                    calendar = new CalendarPopup(input);
                    expect(false).to.be.equal(true);
                } catch (e){
                    expect(true).to.be.equal(true);
                }

                var input2 = createInput('testCalendarID');

                try {
                    calendar = new CalendarPopup('#testCalendarID');
                    expect(true).to.be.equal(true);
                } catch (e) {
                    expect(false).to.be.equal(true);
                }

            });
        });

        describe('After init', function () {
            it('Should create and append after container-popup-element', function () {
                var input = createInput('after_init');
                expect(0).to.be.equal(document.querySelectorAll('.calendar-popup-container').length);
                var calendar = new CalendarPopup(input);
                expect(3).to.be.equal(document.querySelectorAll('.calendar-popup-container').length);
                calendar.destructor();
                expect(0).to.be.equal(document.querySelectorAll('.calendar-popup-container').length);
                document.body.removeChild(input);
            });
        });
    });
    describe('Popup', function () {
        describe('Show/Hide positions', function () {
            describe('Source input element is in the top', function () {
                it('Should move popup below source input', function () {
                    var input = createInput('absolute_top');
                    input.style.position = 'absolute';
                    input.style.top = '0px';

                    var calendar = new CalendarPopup(input);
                    calendar.popup.show();
                    chai.expect(input.getBoundingClientRect().top).to.be.below(parseInt(calendar.popup.container.style.top || 0, 10));
                });
            });
            describe('Source input element is near with body\'s bottom', function () {
                it('Should move popup above source input if it in the bottom', function () {
                    var input = createInput('absolute_bottom');
                    input.style.position = 'absolute';
                    input.style.bottom = '0px';

                    var calendar = new CalendarPopup(input);
                    calendar.popup.show();
                    chai.expect(window.innerHeight + window.pageYOffset).to.be.above(parseInt(calendar.popup.container.style.top || 0, 10));
                });
            });
        });
        describe('Focus/Blur', function () {
            it('Should show calendar after native element has been got focus', function () {
                var input = createInput('test_focus');
                var calendar = new CalendarPopup(input);
                var popup = document.querySelector('.calendar-popup-container');
                simulateEvent('focus', 0, input);
                expect(popup.classList.contains('calendar-popup-container_active')).to.be.equal(true);
            });
            it('Should hide calendar after native element has been lost focus', function () {
                var input = createInput('test_blur');
                var calendar = new CalendarPopup(input);
                var popup = document.querySelector('.calendar-popup-container');
                simulateEvent('focus', 0, input);
                expect(popup.classList.contains('calendar-popup-container_active')).to.be.equal(true);
                simulateEvent('mousedown', 0, window);
                expect(popup.classList.contains('calendar-popup-container_active')).to.be.equal(false);
            });
        });
    });
    afterEach(function () {
        Object.keys(CalendarPopup.instances).forEach(function (key) {
            CalendarPopup.instances[key].destructor();
            delete CalendarPopup.instances[key];
        });
    });
});