from django.db import models

class BodySystem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    translations = models.JSONField(default=dict, blank=True, help_text="Store translated fields like name and description in different languages")

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class AnatomyLayer(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    body_system = models.ForeignKey(BodySystem, related_name='layers', on_delete=models.CASCADE)
    translations = models.JSONField(default=dict, blank=True, help_text="Store translated fields like name and description in different languages")

    class Meta:
        ordering = ['body_system', 'order', 'name']
        unique_together = ('name', 'body_system')

    def __str__(self):
        return f"{self.body_system.name} - {self.name}"

class Organ(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    layer = models.ForeignKey(AnatomyLayer, related_name='organs', on_delete=models.CASCADE)
    body_system = models.ForeignKey(BodySystem, related_name='organs', on_delete=models.CASCADE)
    
    # 3D Model Mapping
    model_name_3d = models.CharField(max_length=100, help_text="Maps to mesh name in GLB file")
    position_x = models.FloatField(default=0.0)
    position_y = models.FloatField(default=0.0)
    position_z = models.FloatField(default=0.0)

    translations = models.JSONField(default=dict, blank=True, help_text="Store translated fields like name and description in different languages")

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Disease(models.Model):
    SEVERITY_CHOICES = [
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
        ('critical', 'Critical'),
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    organ = models.ManyToManyField(Organ, related_name='diseases')
    symptoms = models.TextField(blank=True, null=True)
    causes = models.TextField(blank=True, null=True)
    treatments = models.TextField(blank=True, null=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='mild')
    prevalence = models.CharField(max_length=100, blank=True, null=True)
    
    translations = models.JSONField(default=dict, blank=True, help_text="Store translated fields like name, description, symptoms, causes, and treatments in different languages")

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class ResearchPaper(models.Model):
    title = models.CharField(max_length=255)
    authors = models.CharField(max_length=255)
    abstract = models.TextField(blank=True, null=True)
    doi_url = models.URLField(blank=True, null=True)
    pubmed_id = models.CharField(max_length=50, blank=True, null=True)
    disease = models.ManyToManyField(Disease, related_name='research_papers', blank=True)
    publication_date = models.DateField(blank=True, null=True)
    
    translations = models.JSONField(default=dict, blank=True, help_text="Store translated fields like title and abstract in different languages")

    class Meta:
        ordering = ['-publication_date', 'title']

    def __str__(self):
        return self.title
