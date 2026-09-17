from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import api_views

app_name = 'core'

router = DefaultRouter()
router.register(r'systems', api_views.BodySystemViewSet)
router.register(r'layers', api_views.AnatomyLayerViewSet)
router.register(r'organs', api_views.OrganViewSet)
router.register(r'diseases', api_views.DiseaseViewSet)
router.register(r'papers', api_views.ResearchPaperViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('api/v1/', include(router.urls)),
]
