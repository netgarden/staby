# Generated by Django 2.2.11 on 2020-04-25 12:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubMenuPage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='pages.Page')),
            ],
            options={
                'ordering': ('tree_id', 'lft'),
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('pages.page',),
        ),
        migrations.AddField(
            model_name='page',
            name='show_in_menu',
            field=models.BooleanField(default=True, verbose_name='show in menu'),
        ),
    ]