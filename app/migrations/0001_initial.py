# Generated by Django 3.0.2 on 2020-01-23 14:15

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import tinymce.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=250, null=True, verbose_name='Назва')),
                ('body', models.TextField(blank=True, null=True, verbose_name='Опис')),
                ('image', models.ImageField(blank=True, null=True, upload_to='', verbose_name='Зображення')),
                ('alt', models.CharField(blank=True, max_length=220, null=True, verbose_name='alt')),
            ],
            options={
                'verbose_name': 'клієнт',
                'verbose_name_plural': 'Клієнти',
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meta_title', models.CharField(blank=True, max_length=120, null=True)),
                ('meta_descr', models.TextField(blank=True, null=True)),
                ('alt', models.CharField(blank=True, max_length=120, null=True)),
                ('full_name', models.CharField(blank=True, max_length=250, null=True, verbose_name="Ім'я")),
                ('area', models.CharField(blank=True, max_length=250, null=True, verbose_name='Галузь')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Опис')),
                ('address', models.CharField(blank=True, max_length=250, null=True, verbose_name='Адреса')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='email')),
                ('photo', models.ImageField(blank=True, null=True, upload_to='', verbose_name='Фото')),
                ('phone', models.CharField(blank=True, max_length=12, null=True, verbose_name='Номер телефону')),
                ('phone2', models.CharField(blank=True, max_length=12, null=True, verbose_name='Номер телефону2')),
                ('slug', models.SlugField(blank=True, max_length=250, null=True, verbose_name='Посилання на сайті')),
            ],
            options={
                'verbose_name': 'учасник',
                'verbose_name_plural': 'Команда',
            },
        ),
        migrations.CreateModel(
            name='Slider',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slider', models.CharField(max_length=120, verbose_name='Номер слайдера')),
                ('clients', models.ManyToManyField(blank=True, null=True, related_name='sliders', to='app.Client', verbose_name='Клієнти')),
            ],
            options={
                'verbose_name': 'Слайдер',
                'verbose_name_plural': 'Слайдери',
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meta_title', models.CharField(blank=True, max_length=120, null=True)),
                ('meta_descr', models.TextField(blank=True, null=True)),
                ('alt', models.CharField(blank=True, max_length=120, null=True)),
                ('title', models.CharField(blank=True, max_length=250, null=True, verbose_name='заголовок')),
                ('slug', models.SlugField(blank=True, max_length=250, null=True, unique=True, verbose_name='Посилання')),
                ('body', tinymce.models.HTMLField(blank=True, null=True, verbose_name='текст')),
                ('image', models.ImageField(blank=True, null=True, upload_to='', verbose_name='зображення')),
                ('updated', models.DateTimeField(auto_now=True, null=True)),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='app.Team')),
            ],
            options={
                'verbose_name': 'пост',
                'verbose_name_plural': 'Блог',
                'ordering': ('-id',),
            },
        ),
    ]
