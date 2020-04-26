from django import template

register = template.Library()


@register.tag
def do_format_time(parser, token):
    try:
        # split_contents() knows not to split quoted strings.
        parts = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            "%r tag requires exactly two arguments" % token.contents.split()[0]
        )

    return WidgetNode(*parts)


class WidgetNode(template.Node):

    def __init__(self, widget_name, *args):
        self.tpl_widget_name = widget_name
        self.tpl_args = args

    def render(self, context):
        try:

            widget_name = self._resolve_variable(context, self.tpl_widget_name)
            args = self._resolve_args(context, self.tpl_args)

            return 'Widget ...'

        except template.VariableDoesNotExist:
            return ''

    @classmethod
    def _resolve_variables_list(cls, context, variables):
        return [cls._resolve_variable(context, variable) for variable in variables]

    @classmethod
    def _resolve_variable(cls, context, variable):
        return template.Variable(variable).resolve(context)
