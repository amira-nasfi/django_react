# fhir_api/admin.py

from django.contrib import admin
from .models import (
    Patient, Observation, Practitioner, Encounter, Condition,
    MedicationRequest, AllergyIntolerance, Procedure, DiagnosticReport, Appointment
)


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'family_name', 'given_name', 'gender', 'birth_date', 'created_at')
    search_fields = ('family_name', 'given_name', 'identifier')
    list_filter = ('gender',)


@admin.register(Observation)
class ObservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'observation_type', 'status', 'value', 'unit', 'effective_date')
    list_filter = ('observation_type', 'status')
    search_fields = ('patient__family_name', 'patient__given_name')


@admin.register(Practitioner)
class PractitionerAdmin(admin.ModelAdmin):
    list_display = ('id', 'family_name', 'given_name', 'specialty', 'qualification', 'active')
    list_filter = ('specialty', 'active', 'gender')
    search_fields = ('family_name', 'given_name')


@admin.register(Encounter)
class EncounterAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'practitioner', 'status', 'encounter_class', 'period_start')
    list_filter = ('status', 'encounter_class')
    search_fields = ('patient__family_name', 'reason')


@admin.register(Condition)
class ConditionAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'display', 'code', 'clinical_status', 'severity')
    list_filter = ('clinical_status', 'severity', 'category')
    search_fields = ('patient__family_name', 'display', 'code')


@admin.register(MedicationRequest)
class MedicationRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'medication_display', 'status', 'intent', 'authored_on')
    list_filter = ('status', 'intent')
    search_fields = ('patient__family_name', 'medication_display')


@admin.register(AllergyIntolerance)
class AllergyIntoleranceAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'display', 'clinical_status', 'allergy_type', 'category', 'criticality')
    list_filter = ('clinical_status', 'allergy_type', 'category', 'criticality')
    search_fields = ('patient__family_name', 'display')


@admin.register(Procedure)
class ProcedureAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'display', 'status', 'performed_date')
    list_filter = ('status',)
    search_fields = ('patient__family_name', 'display', 'code')


@admin.register(DiagnosticReport)
class DiagnosticReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'display', 'status', 'category', 'effective_date')
    list_filter = ('status', 'category')
    search_fields = ('patient__family_name', 'display', 'code')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'practitioner', 'status', 'appointment_type', 'start', 'end')
    list_filter = ('status', 'appointment_type')
    search_fields = ('patient__family_name', 'description', 'reason')