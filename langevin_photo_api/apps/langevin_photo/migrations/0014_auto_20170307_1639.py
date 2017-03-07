# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-07 16:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wagtaildocs', '0007_merge'),
        ('langevin_photo', '0013_sellpage_sellphoto'),
    ]

    operations = [
        migrations.AddField(
            model_name='tarifpage',
            name='pdf',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtaildocs.Document'),
        ),
        migrations.AddField(
            model_name='tarifpage',
            name='titre_pdf',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
