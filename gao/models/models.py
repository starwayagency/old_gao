from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.urls import reverse
from django.utils import timezone 
from django.contrib.auth.models import User, AbstractBaseUser, AbstractUser

from .mixins import * 

import calendar 
from datetime import datetime, date, time, timedelta


# users area 


class User(AbstractUser):
  CLIENT_ROLE  = 'client'
  ADVOCAT_ROLE = 'advocat'
  USER_ROLES = [
    (CLIENT_ROLE, "client"),
    (ADVOCAT_ROLE, "advocat"),
  ]
  full_name    = models.CharField(
      verbose_name="Повне ім'я", max_length=150, blank=False, null=False,
  )
  birth_date   = models.DateField(
      verbose_name="Дата народження", blank=True, null=True,
  )
  sex          = models.CharField(
      verbose_name="Стать", max_length=50, blank=True, null=True,
  )
  phone_number = models.CharField(
      verbose_name="Номер телефону", max_length=255, blank=True, null=True,
  )
  role         = models.CharField(
      verbose_name="Роль", choices=USER_ROLES, default=CLIENT_ROLE, max_length=255,
  )
  rate         = models.FloatField(
      verbose_name="Ціна за годину консультації", default=0,
  )
  faculties    = models.ManyToManyField(
      verbose_name="Галузі права", to="gao.Faculty", blank=True, related_name="advocats",
  )

  def get_days_info(self, year, month):
    days = []
    for i in range(1, calendar.monthrange(year, month)[-1]+1):
      day = date(year, month, i)
      days.append({
        "day":day, 
        "status":self.get_day_status(day),
      })
    return days

  def get_day_status(self, day):
    '''
    rest        - зайнятий, без консультацій
    blocked     - зайнятий, з консультаціями 
    free        - вільний, без консультацій
    partly_busy - вільний, з консультаціями 
    unknown     - помилка в логіці перевірок
    '''
    week_days = UserWeekDay.objects.filter(user=self)
    week_day_codes = week_days.values_list('week_day__code', flat=True)
    if str(day.isoweekday()) not in week_day_codes:
      status = 'rest'
    elif False:
      # TODO: ! blocked
      status = 'blocked'
    elif False:
      # TODO: ! free
      status = 'free'
    elif False:
      # TODO: ! partly_busy
      status = 'partly_busy'
    else:
      status = 'unknown'
    return status

  def get_hours_info(self, date):
    working_hours = []
    user_working_day = UserWorkingDay.objects.filter(
      advocat=self, 
      date=date,
    ).first()
    user_week_day = UserWeekDay.objects.filter(
      user=self, 
      week_day__code=date.isoweekday(),
    ).first()
    if user_working_day:
      start = user_working_day.start
      end = user_working_day.end
    elif user_week_day:
      start = user_week_day.start
      end = user_week_day.end
    else:
      start = None
      end = None
    if start and end:
      start = time.strftime(start, '%H:%M')
      end   = time.strftime(end, '%H:%M')
      if start.endswith(':30'):
        start = start.split(':')[0]
        start = int(start)+1
      else:
        start = start.split(':')[0]
      if end.endswith(':30'):
        end = end.split(':')[0]
        end = int(end) + 1 
      else:
        end = end.split(':')[0]
      raw_working_hours = list(range(int(start), int(end)+1))
      for raw_working_hour in raw_working_hours:
        working_hours.append({
          "hour":f'{raw_working_hour}:00',
          "status":self.get_hour_status(raw_working_hour)
        })    
        if raw_working_hour != raw_working_hours[-1]:
          working_hours.append({
            "hour":f"{raw_working_hour}:30",
            "status":self.get_hour_status(raw_working_hour)
          })      
    return working_hours

  def get_hour_status(self, hour):
    if False:
      # TODO: ! free
      status = "free"
    elif False:
      # TODO: ! busy
      status = "busy"
    else:
      status = 'unknown'
    return status 

  def timerange_is_free(self, date, start, end):
    consultations = Consultation.objects.filter(date=date)
    if self.role == User.ADVOCAT_ROLE:
      consultations = consultations.filter(advocat=self)
    elif self.role == User.CLIENT_ROLE:
      consultations = consultations.filter(client=self)
    # Обмеження по статичному дню тижня
    weekdays = UserWeekDay.objects.filter(
      user=self, 
      week_day__code=date.isoweekday(),
    )
    weekday = weekdays.first()
    if weekday:
      if start < weekday.start or end > weekday.end:
        return False 
    else:
      return False 
    # TODO: Обмеження по динамічному окремому дню(WorkingDay)
    # Обмеження по існуючих консультаціях
    consultations = consultations.filter(
      Q(start__lt=start, end__gt=end)|
      Q(start__gt=start, start__lt=end)|
      Q(end__gt=start, end__lt=end)|
      Q(start__lt=start, start__gt=end)
    )
    if consultations.exists():
      return False
    return True

  def get_working_days(self):
    return WorkingDay.objects.filter(advocat=self)

  def get_consultations(self):
    if self.role == User.ADVOCAT_ROLE:
      consultations = Consultation.objects.filter(advocat=self)
    elif self.role == User.CLIENT_ROLE:
      consultations =  Consultation.objects.filter(client=self)
    return consultations

  def get_client_consultations(self):
    return Consultation.objects.filter(client=self)

  def __str__(self):
    return f"{self.first_name} {self.last_name} ({self.username}, {self.phone_number}, {self.email})"
  
  class Meta:
    verbose_name = ('Користувач')
    verbose_name_plural = ('Користувачі')


class WeekDay(models.Model):
    mon = 1
    tue = 2
    wed = 3
    thu = 4
    fri = 5
    sat = 6
    sun = 7
    CODE_CHOICES = [
        [mon, "mon"],
        [tue, "tue"],
        [wed, "wed"],
        [thu, "thu"],
        [fri, "fri"],
        [sat, "sat"],
        [sun, "sun"],
    ]
    name = models.CharField(verbose_name="Назва", max_length=255, unique=True)
    code = models.SlugField(verbose_name="Код", max_length=255, unique=True, choices=CODE_CHOICES)

    def __str__(self):
        return f'{self.name}|{self.code}'

    class Meta:
        unique_together     = ['name','code']
        verbose_name        = "День тижня"
        verbose_name_plural = "Дні тижня"


class UserWeekDay(models.Model):
    week_day = models.ForeignKey(verbose_name="День тижня", to="gao.WeekDay", on_delete=models.CASCADE)
    user     = models.ForeignKey(verbose_name="Користувачі", to="gao.User", on_delete=models.CASCADE)
    start    = models.TimeField(verbose_name="Початок робочого дня")
    end      = models.TimeField(verbose_name="Закінчення робочого дня")
    
    # TODO: додати clean() метод який не буде дозволяти створювати дати які не кратні півгодинам
    # TODO: додати clean() метод який не буде дозволяти створювати start>end

    def __str__(self):
        return f'{self.user.username}: {self.week_day}, {self.start}-{self.end}'

    class Meta:
        unique_together = ['week_day','user']
        verbose_name = "День тижня адвоката"
        verbose_name_plural = "Дні тижня адвоката"


class UserWorkingDay(models.Model):
    advocat   = models.ForeignKey(
        verbose_name="Адвокат", to="gao.User",
        on_delete=models.SET_NULL, blank=True, null=True,
    )
    date  = models.DateField(verbose_name="День")
    start = models.TimeField(verbose_name="Початок робочого дня")
    end   = models.TimeField(verbose_name="Завершення робочого дня")

    def  __str__(self):
        return f'{self.date}: {self.start} - {self.end}'

    class Meta:
        unique_together = ['date', 'advocat']
        verbose_name = "Робочий день"
        verbose_name_plural = "Робочі дні"


class Faculty(TimestampMixin):
    name = models.CharField(verbose_name="Назва", max_length=255)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = "Галузь права"
        verbose_name_plural = "Галузі права"


# consultations area 


class Consultation(TimestampMixin):
    STATUS1 = 'STATUS1'
    STATUS2 = 'STATUS2'
    STATUS3 = 'STATUS3'
    FINISHED = 'FINISHED'
    STATUSES = (
        (STATUS1, "STATUS1"),
        (STATUS2, "STATUS2"),
        (STATUS3, "STATUS3"),
        (FINISHED, "FINISHED"),
    )
    SKYPE  = 'SKYPE'
    VIBER  = 'VIBER'
    GMEET  = 'GMEET'
    ZOOM   = 'ZOOM'
    MOBILE = 'MOBILE'
    FORMATS = [
        (SKYPE,  "SKYPE"),
        (VIBER,  "VIBER"),
        (GMEET,  "GMEET"),
        (ZOOM,   "ZOOM"),
        (MOBILE, "MOBILE"),
    ]
    format    = models.CharField(
      verbose_name="Формат", null=False, blank=False, choices=FORMATS, default=SKYPE, max_length=255,
    )
    status    = models.CharField(
      verbose_name="Статус", null=False, blank=False, choices=STATUSES, default=STATUS1, max_length=255,
    )
    # status    = models.ForeignKey(
    # verbose_name="Статус", to="gao.Status", on_delete=models.SET_NULL, null=True, blank=True,
    #)
    # format    = models.ForeignKey(
    # verbose_name="Формат", to="gao.Format", on_delete=models.SET_NULL, null=True, blank=True,
    #)
    date      = models.DateField(
      verbose_name="Дата",
    )
    faculty   = models.ForeignKey(
      verbose_name="Галузь права", to="gao.Faculty", blank=True, null=True, 
      on_delete=models.SET_NULL, related_name="consulations",
    )
    # TODO: clean метод який не позволить створити консультацію з start > end
    start = models.TimeField(
      verbose_name="Час початку",
    )
    end = models.TimeField(
      verbose_name="Час завершення",
    )
    comment   = models.TextField(
      verbose_name="Коментар", blank=True, null=True,
    )
    mark      = models.SmallIntegerField(
      verbose_name="Оцінка", blank=True, null=True,
    )
    advocat   = models.ForeignKey(
        verbose_name="Адвокат", to="gao.User", 
        related_name="advocat_consultations",
        on_delete=models.CASCADE, blank=False, null=False,
    )
    client    = models.ForeignKey(
        verbose_name="Клієнт", to="gao.User",
        related_name="client_consultations",
        on_delete=models.SET_NULL, blank=True, null=True,
    )

    def save(self, *args, **kwargs):
      consultations = Consultation.objects.filter(
        advocat=self.advocat,
        client=self.client,
        date=self.date,
      ).filter(
        Q(start__lt=self.start, end__gt=self.end)|
        Q(start__gt=self.start, start__lt=self.end)|
        Q(end__gt=self.start, end__lt=self.end)|
        Q(start__lt=self.start, start__gt=self.end)
      )
      # if False:
      # if consultations.exists():
      #   raise Exception('ERROR!!!')
      super().save()

    @property
    def documents(self):
      documents = ConsultationDocument.objects.filter(consultation=self)
      return documents

    @property
    def time(self):
        time = 1
        # if self.times.first().end and self.times.first().start :
        #     minutes = int(self.times.first().end.strftime('%M')) + int(self.times.first().start.strftime('%M'))
        #     hours = (int(self.times.first().end.strftime('%H')) - int(self.times.first().start.strftime("%H")))
        #     if minutes > 0:
        #         hours -= 1
        #     if minutes > 60:
        #         hours += 1
        #         minutes -= 60
        #     time = 60 - minutes + (hours * 60)
        return time
    
    @property
    def full_time(self):
        time = 0
        # if self.times.first().end and self.times.first().start :
        #     minutes = 60 - (int(self.times.first().end.strftime('%M')) + int(self.times.first().start.strftime('%M')))
        #     hours = (int(self.times.first().end.strftime('%H')) - int(self.times.first().start.strftime("%H")))
        #     if minutes > 0:
        #         hours -= 1
        #     if minutes > 60:
        #         hours += 1
        #         minutes -= 60
        #     time = f"{hours} год. {minutes} хв."
        return time
    
    @property
    def price(self):
        price = 1
        time = self.time
        # time = self.end - self.start 
        hours = time // 60
        minutes = (time % 60) / 60
        price = (self.advocat.rate * hours) + (self.advocat.rate * minutes)
        return price 
    
    def get_files_by_user(self):
        consultations = Consultation.objects.filter(client=self.client, advocat=self.advocat)
        return 

    class Meta:
        verbose_name = 'Консультація'
        verbose_name_plural = 'Консультації'

    def __str__(self):
        res = f'{self.date}, {self.start}-{self.end}, {self.advocat.username}'
        if self.client:
          res += f' -> {self.client.username}'
        return res 


class ConsultationDocument(TimestampMixin):
    file = models.FileField(verbose_name="Файл")
    author = models.ForeignKey(
        verbose_name="Автор", to="gao.User", on_delete=models.SET_NULL, null=True, blank=False,
    )
    consultation = models.ForeignKey(
        verbose_name="Консультація", to="gao.Consultation", on_delete=models.SET_NULL, null=True, blank=False, related_name="documents"
    )

    def __str__(self):
        return f'{self.consultation}'

    class Meta:
        verbose_name = "Документ до консультації"    
        verbose_name_plural = "Документи до консультацій"    


class ConsultationPayment(TimestampMixin):
    consultation = models.OneToOneField(
        verbose_name="Консультація", to="gao.Consultation", on_delete=models.SET_NULL, null=True, blank=False, related_name="payment"
    )
    amount = models.FloatField(verbose_name="Сумма")

    def __str__(self):
        return f'{self.consultation}'

    class Meta:
        verbose_name = "Оплата до консультації"    
        verbose_name_plural = "Оплати до консультацій"    


# old models from november 2019


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

    class Meta:
        verbose_name='учасник'
        verbose_name_plural='Команда'

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


class Contact(models.Model):
    name  = models.TextField(verbose_name='Імя', blank=True, null=True)
    email = models.TextField(verbose_name='Емайл', blank=True, null=True)
    phone = models.TextField(verbose_name='Телефон', blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.email}, {self.phone}"

    class Meta:
        verbose_name='Контакт'
        verbose_name_plural='Контакти'


class Document(models.Model):
    user = models.ForeignKey(verbose_name='Користувач', related_name='documents', on_delete=models.SET_NULL, to="gao.User", blank=True, null=True)
    file = models.FileField(verbose_name='Файл')
    
    def __str__(self):
        return f'{self.user}: {self.file}'
    
    def document_is_pdf(self):
        return self.file.path.split('.')[-1] == '.pdf'
    
    class Meta:
        verbose_name = 'Документ'
        verbose_name_plural = 'Документ'

