from django.db import models
from django.utils import timezone
from django.urls import reverse
from tinymce.models import HTMLField
from django.utils import timezone 



class Post(models.Model):
    meta_title = models.CharField(max_length=255, blank=True, null=True) 
    meta_descr = models.TextField(blank=True, null=True)
    alt        = models.CharField(max_length=255, blank=True, null=True)
    title      = models.CharField(verbose_name='заголовок',max_length=255, blank=True, null=True)
    slug       = models.SlugField(verbose_name='Посилання', max_length=255, unique=True)
    # body       = models.TextField(verbose_name='текст', blank=True, null=True)
    body       = HTMLField(verbose_name='текст', blank=True, null=True)
    image      = models.ImageField(verbose_name='зображення', blank=True, null=True)
    updated    = models.DateTimeField(auto_now_add=False, auto_now=True, blank=True, null=True)
    created    = models.DateTimeField(default=timezone.now)
    # created    = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True, null=True)
    author     = models.ForeignKey(to='Team', related_name="posts", blank=True, null=True, on_delete=models.CASCADE)

    class Meta:
        verbose_name='пост'
        verbose_name_plural='Блог'
        app_label='app'
        ordering = ('-id', )

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("post", kwargs={"slug": self.slug})


class Team(models.Model):
    meta_title  = models.CharField(max_length=255, blank=True, null=True) 
    meta_descr  = models.TextField(blank=True, null=True)
    alt         = models.CharField(max_length=255, blank=True, null=True)
    full_name   = models.CharField(verbose_name='Ім\'я', max_length=255, blank=True, null=True)
    area        = models.CharField(verbose_name='Галузь',max_length=255, blank=True, null=True)
    description = models.TextField(verbose_name="Опис", blank=True, null=True)
    address     = models.CharField(verbose_name="Адреса", max_length=255, blank=True, null=True)
    email       = models.EmailField(verbose_name='email', blank=True, null=True)
    photo       = models.ImageField(verbose_name="Фото", blank=True, null=True)
    phone       = models.CharField(verbose_name="Номер телефону", max_length=255, blank=True, null=True)
    phone2      = models.CharField(verbose_name="Номер телефону2", max_length=255, blank=True, null=True)
    slug        = models.SlugField(verbose_name="Посилання на сайті", max_length=255, blank=True, null=True)
    # created     = models.DateTimeField(blank=True, null=True,)
    updated     = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True, null=True)

    class Meta:
        verbose_name='учасник'
        verbose_name_plural='Команда'
        app_label='app'

    def __str__(self):
        return self.full_name

    def get_absolute_url(self):
        return reverse("member", kwargs={"slug": self.slug})
    

class Client(models.Model):
    title = models.CharField(verbose_name="Назва", max_length=255, blank=True, null=True)
    body  = models.TextField(verbose_name="Опис", blank=True, null=True)
    image = models.ImageField(verbose_name="Зображення", blank=True, null=True)
    alt   = models.CharField(verbose_name="alt", max_length=255, blank=True, null=True)

    class Meta:
        verbose_name='клієнт'
        verbose_name_plural='Клієнти'
        app_label='app'

    def __str__(self):
        return self.title


class Slider(models.Model):
    slider = models.CharField(verbose_name="Номер слайдера", max_length=255)
    clients = models.ManyToManyField(verbose_name="Клієнти", to="Client", related_name="sliders", blank=True, null=True)

    def __str__(self):
        return self.slider

    class Meta:
        verbose_name='Слайдер'
        verbose_name_plural='Слайдери'
        app_label='app'


class Contact(models.Model):
    name  = models.TextField(verbose_name='Імя', blank=True, null=True)
    email = models.TextField(verbose_name='Емайл', blank=True, null=True)
    phone = models.TextField(verbose_name='Телефон', blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.email}, {self.phone}"

    class Meta:
        verbose_name='Контакт'
        verbose_name_plural='Контакти'
        app_label='app'


from django.contrib.auth import get_user_model 



User = get_user_model()

class Document(models.Model):
    user = models.ForeignKey(verbose_name='Користувач', related_name='documents', on_delete=models.SET_NULL, to=User, blank=True, null=True)
    file = models.FileField(verbose_name='Файл')
    
    def __str__(self):
        return f'{self.user}: {self.file}'
    
    def document_is_pdf(self):
        return self.file.path.split('.')[-1] == '.pdf'
    
    class Meta:
        verbose_name = 'Документ'
        verbose_name_plural = 'Документ'


