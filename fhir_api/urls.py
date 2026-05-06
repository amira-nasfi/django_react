from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet, ObservationViewSet, PractitionerViewSet,
    EncounterViewSet, ConditionViewSet, MedicationRequestViewSet,
    AllergyIntoleranceViewSet, ProcedureViewSet, DiagnosticReportViewSet,
    AppointmentViewSet,
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'observations', ObservationViewSet)
router.register(r'practitioners', PractitionerViewSet)
router.register(r'encounters', EncounterViewSet)
router.register(r'conditions', ConditionViewSet)
router.register(r'medication-requests', MedicationRequestViewSet)
router.register(r'allergy-intolerances', AllergyIntoleranceViewSet)
router.register(r'procedures', ProcedureViewSet)
router.register(r'diagnostic-reports', DiagnosticReportViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]