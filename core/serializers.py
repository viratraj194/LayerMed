from rest_framework import serializers
from .models import BodySystem, AnatomyLayer, Organ, Disease, ResearchPaper

class BodySystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodySystem
        fields = '__all__'

class AnatomyLayerSerializer(serializers.ModelSerializer):
    body_system_name = serializers.ReadOnlyField(source='body_system.name')

    class Meta:
        model = AnatomyLayer
        fields = '__all__'

class OrganSerializer(serializers.ModelSerializer):
    layer_name = serializers.ReadOnlyField(source='layer.name')
    body_system_name = serializers.ReadOnlyField(source='body_system.name')

    class Meta:
        model = Organ
        fields = '__all__'

class DiseaseSerializer(serializers.ModelSerializer):
    organs = OrganSerializer(source='organ', many=True, read_only=True)

    class Meta:
        model = Disease
        fields = '__all__'

class ResearchPaperSerializer(serializers.ModelSerializer):
    diseases = DiseaseSerializer(source='disease', many=True, read_only=True)

    class Meta:
        model = ResearchPaper
        fields = '__all__'
