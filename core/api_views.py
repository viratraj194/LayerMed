from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import BodySystem, AnatomyLayer, Organ, Disease, ResearchPaper
from .serializers import (
    BodySystemSerializer, AnatomyLayerSerializer, OrganSerializer,
    DiseaseSerializer, ResearchPaperSerializer
)

class BodySystemViewSet(viewsets.ModelViewSet):
    queryset = BodySystem.objects.all()
    serializer_class = BodySystemSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['order', 'name']

class AnatomyLayerViewSet(viewsets.ModelViewSet):
    queryset = AnatomyLayer.objects.all()
    serializer_class = AnatomyLayerSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['body_system']
    search_fields = ['name']
    ordering_fields = ['order', 'name']

class OrganViewSet(viewsets.ModelViewSet):
    queryset = Organ.objects.all()
    serializer_class = OrganSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['layer', 'body_system']
    search_fields = ['name', 'model_name_3d']
    ordering_fields = ['name']

class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['severity', 'organ']
    search_fields = ['name', 'symptoms']
    ordering_fields = ['name']

class ResearchPaperViewSet(viewsets.ModelViewSet):
    queryset = ResearchPaper.objects.all()
    serializer_class = ResearchPaperSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['disease']
    search_fields = ['title', 'authors']
    ordering_fields = ['publication_date', 'title']
