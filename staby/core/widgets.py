from django.forms import DateInput, DateTimeInput


class DatePickerInput(DateInput):
    template_name = "staby/widgets/datepicker.html"

    class Media:
        css = {
            "all": (
                "staby/vendor/xdsoft_calendar_popup/build/calendar.css",
            )
        }
        js = (
            "staby/vendor/xdsoft_calendar_popup/build/calendar.full.min.js",
        )

class DateTimePickerInput(DateTimeInput):
    template_name = "staby/widgets/datetimepicker.html"

    class Media:
        css = {
            "all": (
                "staby/vendor/xdsoft_calendar_popup/build/calendar.css",
            )
        }
        js = (
            "staby/vendor/xdsoft_calendar_popup/build/calendar.full.min.js",
        )