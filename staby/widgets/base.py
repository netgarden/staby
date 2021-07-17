from django.template.loader import render_to_string


class Widget:

    def __init__(self):
        pass

    def get_title(self):
        raise NotImplementedError()

    def get_data(self):
        raise NotImplementedError()

    def get_template(self):
        raise NotImplementedError()

    def render(self):
        return render_to_string(self.get_template(), {'title': self.get_title(), **self.get_data()})


class WidgetNotFoundError(Exception):
    pass
