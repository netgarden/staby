import importlib

from django import template
from django.apps import apps

from ..base import Widget, WidgetNotFoundError

register = template.Library()


@register.tag
def render_widget(parser, token):
    try:
        # split_contents() knows not to split quoted strings.
        parts = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            "%r tag requires exactly two arguments" % token.contents.split()[0]
        )

    return WidgetNode(*parts)


class WidgetNode(template.Node):

    def __init__(self, func_name, widget_name, *args):
        self.widget_name = widget_name
        self.tpl_args = args

    def render(self, context):
        try:

            # widget_name = self._resolve_variable(context, self.tpl_widget_name)
            args = self._resolve_variables_list(context, self.tpl_args)

            widget_class = self._find_widget_class(self.widget_name)
            if widget_class is None:
                raise WidgetNotFoundError(f"Widget '{self.widget_name}' not found!")

            widget_instance = widget_class(*args)
            return widget_instance.render()

        except template.VariableDoesNotExist:
            return ''

    @classmethod
    def _find_widget_class(cls, widget_name):

        app_name, widget_class_name = widget_name.split(".", 2)

        app = apps.get_app_config(app_name)

        widgets_module = importlib.import_module(f"{app.module.__name__}.widgets")
        if widgets_module is None:
            return None

        if not hasattr(widgets_module, widget_class_name):
            return None

        widget_class = getattr(widgets_module, widget_class_name)
        if not issubclass(widget_class, Widget):
            return None

        return widget_class

    @classmethod
    def _resolve_variables_list(cls, context, variables):
        return [cls._resolve_variable(context, variable) for variable in variables]

    @classmethod
    def _resolve_variable(cls, context, variable):
        return template.Variable(variable).resolve(context)
