from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as filters

from .models import (
    Patient, Observation, Practitioner, Encounter, Condition,
    MedicationRequest, AllergyIntolerance, Procedure, DiagnosticReport, Appointment
)
from .serializers import (
    PatientSimpleSerializer, PatientFHIRSerializer,
    ObservationSimpleSerializer, ObservationFHIRSerializer,
    PractitionerSimpleSerializer, PractitionerFHIRSerializer,
    EncounterSimpleSerializer, EncounterFHIRSerializer,
    ConditionSimpleSerializer, ConditionFHIRSerializer,
    MedicationRequestSimpleSerializer, MedicationRequestFHIRSerializer,
    AllergyIntoleranceSimpleSerializer, AllergyIntoleranceFHIRSerializer,
    ProcedureSimpleSerializer, ProcedureFHIRSerializer,
    DiagnosticReportSimpleSerializer, DiagnosticReportFHIRSerializer,
    AppointmentSimpleSerializer, AppointmentFHIRSerializer,
)


# ─── Mixin: adds a /fhir/ endpoint returning HL7 FHIR R4 JSON ───────────────
class FhirMixin:
    """Adds a `fhir` list action that returns resources in FHIR R4 JSON format."""
    fhir_serializer_class = None

    @action(detail=False, methods=['get'], url_path='fhir')
    def fhir_list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        items = page if page is not None else queryset
        serializer = self.fhir_serializer_class(items, many=True)

        bundle = {
            "resourceType": "Bundle",
            "type": "searchset",
            "total": self.paginator.page.paginator.count if page is not None else queryset.count(),
            "entry": [{"resource": r} for r in serializer.data],
        }
        return Response(bundle)

    @action(detail=True, methods=['get'], url_path='fhir')
    def fhir_detail(self, request, pk=None):
        instance = self.get_object()
        serializer = self.fhir_serializer_class(instance)
        return Response(serializer.data)


# ═══════════════════════════════════════════════════════════════════════════════
# 1. Patient
# ═══════════════════════════════════════════════════════════════════════════════
class PatientViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSimpleSerializer
    fhir_serializer_class = PatientFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['gender', 'family_name']


# ═══════════════════════════════════════════════════════════════════════════════
# 2. Observation
# ═══════════════════════════════════════════════════════════════════════════════
class ObservationViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = Observation.objects.select_related('patient').all().order_by('-effective_date')
    serializer_class = ObservationSimpleSerializer
    fhir_serializer_class = ObservationFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'observation_type': ['exact'],
        'status': ['exact'],
        'effective_date': ['gte', 'lte'],
        'value': ['gte', 'lte'],
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 3. Practitioner
# ═══════════════════════════════════════════════════════════════════════════════
class PractitionerViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = Practitioner.objects.all().order_by('-created_at')
    serializer_class = PractitionerSimpleSerializer
    fhir_serializer_class = PractitionerFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['specialty', 'active', 'gender']


# ═══════════════════════════════════════════════════════════════════════════════
# 4. Encounter
# ═══════════════════════════════════════════════════════════════════════════════
class EncounterViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = Encounter.objects.select_related('patient', 'practitioner').all().order_by('-period_start')
    serializer_class = EncounterSimpleSerializer
    fhir_serializer_class = EncounterFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'practitioner': ['exact'],
        'status': ['exact'],
        'encounter_class': ['exact'],
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 5. Condition
# ═══════════════════════════════════════════════════════════════════════════════
class ConditionViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = Condition.objects.select_related('patient', 'encounter').all().order_by('-created_at')
    serializer_class = ConditionSimpleSerializer
    fhir_serializer_class = ConditionFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'clinical_status': ['exact'],
        'severity': ['exact'],
        'category': ['exact'],
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 6. MedicationRequest
# ═══════════════════════════════════════════════════════════════════════════════
class MedicationRequestViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = MedicationRequest.objects.select_related('patient', 'practitioner', 'encounter').all().order_by('-authored_on')
    serializer_class = MedicationRequestSimpleSerializer
    fhir_serializer_class = MedicationRequestFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'practitioner': ['exact'],
        'status': ['exact'],
        'intent': ['exact'],
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 7. AllergyIntolerance
# ═══════════════════════════════════════════════════════════════════════════════
class AllergyIntoleranceViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = AllergyIntolerance.objects.select_related('patient').all().order_by('-created_at')
    serializer_class = AllergyIntoleranceSimpleSerializer
    fhir_serializer_class = AllergyIntoleranceFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'clinical_status': ['exact'],
        'allergy_type': ['exact'],
        'category': ['exact'],
        'criticality': ['exact'],
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 8. Procedure
# ═══════════════════════════════════════════════════════════════════════════════
class ProcedureViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = Procedure.objects.select_related('patient', 'practitioner', 'encounter').all().order_by('-performed_date')
    serializer_class = ProcedureSimpleSerializer
    fhir_serializer_class = ProcedureFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'practitioner': ['exact'],
        'status': ['exact'],
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 9. DiagnosticReport
# ═══════════════════════════════════════════════════════════════════════════════
class DiagnosticReportViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = DiagnosticReport.objects.select_related('patient', 'practitioner', 'encounter').prefetch_related('observations').all().order_by('-effective_date')
    serializer_class = DiagnosticReportSimpleSerializer
    fhir_serializer_class = DiagnosticReportFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'practitioner': ['exact'],
        'status': ['exact'],
        'category': ['exact'],
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 10. Appointment
# ═══════════════════════════════════════════════════════════════════════════════
class AppointmentViewSet(FhirMixin, viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('patient', 'practitioner').all().order_by('-start')
    serializer_class = AppointmentSimpleSerializer
    fhir_serializer_class = AppointmentFHIRSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = {
        'patient': ['exact'],
        'practitioner': ['exact'],
        'status': ['exact'],
        'appointment_type': ['exact'],
    }
