# Generated by Django 3.1 on 2020-08-15 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gao', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projectuser',
            name='rate',
            field=models.FloatField(default=0, verbose_name='Ціна за годину консультації'),
        ),
    ]
