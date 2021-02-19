from django.db import models


class Blog(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    published_at = models.DateField()
