from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.wagtailcore.models import Page, Orderable
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailadmin.edit_handlers import FieldPanel, MultiFieldPanel, InlinePanel
from django.conf import settings


class HomePage(Page):
    titre = models.CharField(max_length=255)
    presentation = models.CharField(max_length=255)
    titre_bouton_gauche = models.CharField(max_length=255, default="")
    url_bouton_gauche = models.CharField(max_length=255)
    titre_bouton_droit = models.CharField(max_length=255, default="")
    url_bouton_droit = models.CharField(max_length=255)

    api_fields = ['titre', 'presentation', 'titre_bouton_gauche', 'url_bouton_gauche', 'titre_bouton_droit', 'url_bouton_droit']

    content_panels = Page.content_panels + [
        FieldPanel('titre'),
        FieldPanel('presentation'),
        FieldPanel('titre_bouton_gauche'),
        FieldPanel('url_bouton_gauche'),
        FieldPanel('titre_bouton_droit'),
        FieldPanel('url_bouton_droit'),
    ]
