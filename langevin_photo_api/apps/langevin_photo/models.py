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
    photo_background = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )


    api_fields = ['titre', 'presentation', 'titre_bouton_gauche', 'url_bouton_gauche', 'titre_bouton_droit', 'url_bouton_droit','photo_background','photo_background_url']

    content_panels = Page.content_panels + [
        FieldPanel('titre'),
        FieldPanel('presentation'),
        FieldPanel('titre_bouton_gauche'),
        FieldPanel('url_bouton_gauche'),
        FieldPanel('titre_bouton_droit'),
        FieldPanel('url_bouton_droit'),
        FieldPanel('photo_background'),
    ]
    @property
    def photo_background_url(self):
        if self.photo_background:
            return settings.MEDIA_URL + 'original_images/' + self.photo_background.filename


class AlbumListPage(Page):
    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    api_fields = ['photo','photo_url','categories']
    
    
    subpage_types = ['langevin_photo.AlbumPage']

    content_panels = Page.content_panels + [
        FieldPanel('photo'),
        InlinePanel('categories', label="Categories"),
    ]

    @property
    def photo_url(self):
        if self.photo:
            return settings.MEDIA_URL + 'original_images/' + self.photo.filename

class Categorie(Orderable):
    page = ParentalKey(AlbumListPage, related_name='categories')
    nom_categorie = models.CharField(max_length=50)
    api_fields = ['nom_categorie']

    panels = [
        FieldPanel('nom_categorie'),
    ]
    def __unicode__(self):
        return self.nom_categorie



class AlbumPage(Page):
    body = models.CharField(max_length=150)
    body_cacher = models.CharField(max_length=150,null=True, blank=True)
    categorie = models.ForeignKey(Categorie, null=True, blank=True)
    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    api_fields = ['photos','body','photo','photo_url', 'categorie','body_cacher']
    
    parent_page_types = ['langevin_photo.AlbumListPage']
    subpage_types = []

    content_panels = Page.content_panels + [
        FieldPanel('categorie'),
        FieldPanel('body'),
        FieldPanel('body_cacher'),
        FieldPanel('photo'),
        InlinePanel('photos', label="Photos"),
    ]

    @property
    def photo_url(self):
        if self.photo:
            return settings.MEDIA_URL + 'original_images/' + self.photo.filename


class Photo(Orderable):
    page = ParentalKey(AlbumPage, related_name='photos')
    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    api_fields = ['photo', 'photo_url']

    panels = [
        FieldPanel('photo'),
    ]

    @property
    def photo_url(self):
        if self.photo:
            return settings.MEDIA_URL + 'original_images/' + self.photo.filename


class AboutPage(Page):
    body = RichTextField(blank=True)
    name = models.CharField(max_length=100)
    quote = models.CharField(max_length=255)
    mr_title = models.CharField(max_length=150)
    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    api_fields = ['body','photo','photo_url','name','quote','mr_title']

    content_panels = Page.content_panels + [
        FieldPanel('name'),
        FieldPanel('mr_title'),
        FieldPanel('body'),
        FieldPanel('quote'),
        FieldPanel('photo'),
    ]

    @property
    def photo_url(self):
        if self.photo:
            return settings.MEDIA_URL + 'original_images/' + self.photo.filename


class QuadPage(Page):
    body = RichTextField(blank=True)
    name = models.CharField(max_length=100)
    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    titre_pdf = models.CharField(max_length=100,null=True,blank=True)
    pdf = models.ForeignKey(
        'wagtaildocs.Document',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    api_fields = ['body','photo','photo_url','name','quadphotos','pdf','titre_pdf']

    content_panels = Page.content_panels + [
        FieldPanel('name'),
        FieldPanel('body'),
        FieldPanel('pdf'),
        FieldPanel('titre_pdf'),
        FieldPanel('photo'),
        InlinePanel('quadphotos', label="Photos"),
    ]


    @property
    def photo_url(self):
        if self.photo:
            return settings.MEDIA_URL + 'original_images/' + self.photo.filename

class QuadPhoto(Orderable):
    page = ParentalKey(QuadPage, related_name='quadphotos')
    photo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    api_fields = ['photo', 'photo_url']

    panels = [
        FieldPanel('photo'),
    ]

    @property
    def photo_url(self):
        if self.photo:
            return settings.MEDIA_URL + 'original_images/' + self.photo.filename