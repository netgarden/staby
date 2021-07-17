from django import template
from django.template.loader import render_to_string

from ..models import Page

register = template.Library()


@register.tag
def render_menu(parser, token):

    try:
        # split_contents() knows not to split quoted strings.
        parts = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            "%r tag requires exactly one argument" % token.contents.split()[0]
        )

    del parts[0]

    return MenuNode(*parts)


class MenuNode(template.Node):

    def __init__(self, template_name=None):
        self.tpl_template_name = template_name

    def render(self, context):

        if self.tpl_template_name is not None:
            try:
                template_name = self._resolve_variable(context, self.tpl_template_name)
            except template.VariableDoesNotExist:
                return ''
        else:
            template_name = 'partials/menu.html'

        request_page_ids = self.__class__._get_request_page_ids(context)
        pages = Page.published.filter(show_in_menu=True).values('pk', 'parent_id', 'slug', 'title').order_by('tree_id', 'lft')

        pages_by_parent = {}

        for page in pages:

            parent_id = page['parent_id']

            if parent_id not in pages_by_parent:
                pages_by_parent[parent_id] = []
            pages_by_parent[parent_id].append(page)

        if None not in pages_by_parent:
            return ''

        tree = self.__class__._assemble_pages_tree(pages_by_parent[None], pages_by_parent, request_page_ids)

        return render_to_string(template_name, {'items': tree, 'menu_template_name': template_name})

    @classmethod
    def _get_request_page_ids(cls, context):

        request = cls._resolve_variable(context, 'request')
        if not hasattr(request, 'page_ids'):
            return []

        return request.page_ids

    @classmethod
    def _assemble_pages_tree(cls, pages, pages_by_parent, request_page_ids, base_url=''):

        if pages is None or len(pages) == 0:
            return None

        ret = []

        for page in pages:

            slug = page['slug']

            if base_url == '' and slug != '':
                base_url = '/'

            url = f'{base_url}{slug}/'

            page['url'] = url
            page['active'] = page['pk'] in request_page_ids
            page['children'] = None

            if page['pk'] in pages_by_parent:
                page['children'] = cls._assemble_pages_tree(
                    pages_by_parent[page['pk']],
                    pages_by_parent,
                    request_page_ids,
                    url
                )

            ret.append(page)

        return ret

    @classmethod
    def _resolve_variables_list(cls, context, variables):
        return [cls._resolve_variable(context, variable) for variable in variables]

    @classmethod
    def _resolve_variable(cls, context, variable):
        return template.Variable(variable).resolve(context)