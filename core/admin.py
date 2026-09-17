from django.contrib import admin
from .models import BodySystem, AnatomyLayer, Organ, Disease, ResearchPaper

@admin.register(BodySystem)
class BodySystemAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    search_fields = ('name',)

@admin.register(AnatomyLayer)
class AnatomyLayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'body_system', 'order')
    list_filter = ('body_system',)
    search_fields = ('name',)

@admin.register(Organ)
class OrganAdmin(admin.ModelAdmin):
    list_display = ('name', 'layer', 'body_system', 'model_name_3d')
    list_filter = ('body_system', 'layer')
    search_fields = ('name', 'model_name_3d')

@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ('name', 'severity')
    list_filter = ('severity',)
    search_fields = ('name',)

@admin.register(ResearchPaper)
class ResearchPaperAdmin(admin.ModelAdmin):
    list_display = ('title', 'publication_date', 'pubmed_id')
    search_fields = ('title', 'authors')
    list_filter = ('publication_date',)
