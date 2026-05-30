from django.db import models
from django.conf import settings

class Fandom(models.Model):
    CATEGORY_CHOICES = (
        ('anime', 'Аніме'),
        ('books', 'Книги'),
        ('series', 'Серіали'),
        ('games', 'Ігри'),
        ('other', 'Інше'),
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image_url = models.URLField(max_length=500, blank=True)
    image = models.ImageField(upload_to='fandoms/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def members_count(self):
        return self.memberships.count()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Фандом'
        verbose_name_plural = 'Фандоми'

class FandomMembership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='fandom_memberships')
    fandom = models.ForeignKey(Fandom, on_delete=models.CASCADE, related_name='memberships')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'fandom')
        verbose_name = 'Учасник фандому'
        verbose_name_plural = 'Учасники фандомів'

class FandomRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'На розгляді'),
        ('approved', 'Схвалено'),
        ('rejected', 'Відхилено'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='fandom_requests')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=Fandom.CATEGORY_CHOICES)
    image = models.ImageField(upload_to='fandom_requests/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

    class Meta:
        verbose_name = 'Запит на створення фандому'
        verbose_name_plural = 'Запити на створення фандомів'

