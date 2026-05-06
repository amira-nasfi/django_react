from rest_framework import serializers
from .models import (
    Patient, Observation, Practitioner, Encounter, Condition,
    MedicationRequest, AllergyIntolerance, Procedure, DiagnosticReport, Appointment
)



class PatientSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'id', 'identifier', 'family_name', 'given_name',
            'gender', 'birth_date', 'phone', 'email', 'address',
        ]
        read_only_fields = ['id', 'identifier']


class ObservationSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Observation
        fields = [
            'id', 'patient_id', 'patient', 'patient_name',
            'observation_type', 'status', 'value', 'unit',
            'effective_date', 'note',
        ]
        read_only_fields = ['id', 'patient', 'patient_name']

    def get_patient_name(self, obj):
        return f"{obj.patient.given_name} {obj.patient.family_name}"


class PractitionerSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Practitioner
        fields = [
            'id', 'identifier', 'family_name', 'given_name',
            'gender', 'birth_date', 'qualification', 'specialty',
            'phone', 'email', 'active',
        ]
        read_only_fields = ['id', 'identifier']


class EncounterSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    practitioner_id = serializers.PrimaryKeyRelatedField(
        queryset=Practitioner.objects.all(), source='practitioner',
        write_only=True, required=False, allow_null=True
    )
    patient_name = serializers.SerializerMethodField()
    practitioner_name = serializers.SerializerMethodField()

    class Meta:
        model = Encounter
        fields = [
            'id', 'identifier', 'patient_id', 'patient', 'patient_name',
            'practitioner_id', 'practitioner', 'practitioner_name',
            'status', 'encounter_class', 'reason',
            'period_start', 'period_end',
        ]
        read_only_fields = ['id', 'identifier', 'patient', 'patient_name', 'practitioner', 'practitioner_name']

    def get_patient_name(self, obj):
        return str(obj.patient)

    def get_practitioner_name(self, obj):
        return str(obj.practitioner) if obj.practitioner else None


class ConditionSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    encounter_id = serializers.PrimaryKeyRelatedField(
        queryset=Encounter.objects.all(), source='encounter',
        write_only=True, required=False, allow_null=True
    )
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Condition
        fields = [
            'id', 'patient_id', 'patient', 'patient_name',
            'encounter_id', 'encounter',
            'code', 'display', 'clinical_status', 'severity', 'category',
            'onset_date', 'abatement_date', 'note',
        ]
        read_only_fields = ['id', 'patient', 'patient_name', 'encounter']

    def get_patient_name(self, obj):
        return str(obj.patient)


class MedicationRequestSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    practitioner_id = serializers.PrimaryKeyRelatedField(
        queryset=Practitioner.objects.all(), source='practitioner',
        write_only=True, required=False, allow_null=True
    )
    encounter_id = serializers.PrimaryKeyRelatedField(
        queryset=Encounter.objects.all(), source='encounter',
        write_only=True, required=False, allow_null=True
    )
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = MedicationRequest
        fields = [
            'id', 'patient_id', 'patient', 'patient_name',
            'practitioner_id', 'practitioner',
            'encounter_id', 'encounter',
            'medication_code', 'medication_display',
            'status', 'intent', 'dosage_text', 'dosage_value', 'dosage_unit',
            'frequency', 'authored_on', 'note',
        ]
        read_only_fields = ['id', 'patient', 'patient_name', 'practitioner', 'encounter', 'authored_on']

    def get_patient_name(self, obj):
        return str(obj.patient)


class AllergyIntoleranceSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = AllergyIntolerance
        fields = [
            'id', 'patient_id', 'patient', 'patient_name',
            'code', 'display', 'clinical_status', 'allergy_type',
            'category', 'criticality', 'onset_date',
            'reaction_description', 'note',
        ]
        read_only_fields = ['id', 'patient', 'patient_name']

    def get_patient_name(self, obj):
        return str(obj.patient)


class ProcedureSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    practitioner_id = serializers.PrimaryKeyRelatedField(
        queryset=Practitioner.objects.all(), source='practitioner',
        write_only=True, required=False, allow_null=True
    )
    encounter_id = serializers.PrimaryKeyRelatedField(
        queryset=Encounter.objects.all(), source='encounter',
        write_only=True, required=False, allow_null=True
    )
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Procedure
        fields = [
            'id', 'patient_id', 'patient', 'patient_name',
            'practitioner_id', 'practitioner',
            'encounter_id', 'encounter',
            'code', 'display', 'status', 'performed_date',
            'body_site', 'note',
        ]
        read_only_fields = ['id', 'patient', 'patient_name', 'practitioner', 'encounter']

    def get_patient_name(self, obj):
        return str(obj.patient)


class DiagnosticReportSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    practitioner_id = serializers.PrimaryKeyRelatedField(
        queryset=Practitioner.objects.all(), source='practitioner',
        write_only=True, required=False, allow_null=True
    )
    encounter_id = serializers.PrimaryKeyRelatedField(
        queryset=Encounter.objects.all(), source='encounter',
        write_only=True, required=False, allow_null=True
    )
    observation_ids = serializers.PrimaryKeyRelatedField(
        queryset=Observation.objects.all(), source='observations',
        many=True, required=False
    )
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = DiagnosticReport
        fields = [
            'id', 'patient_id', 'patient', 'patient_name',
            'practitioner_id', 'practitioner',
            'encounter_id', 'encounter',
            'code', 'display', 'status', 'category',
            'issued', 'effective_date', 'conclusion',
            'observation_ids', 'observations',
        ]
        read_only_fields = ['id', 'patient', 'patient_name', 'practitioner', 'encounter', 'issued', 'observations']

    def get_patient_name(self, obj):
        return str(obj.patient)


class AppointmentSimpleSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    practitioner_id = serializers.PrimaryKeyRelatedField(
        queryset=Practitioner.objects.all(), source='practitioner',
        write_only=True, required=False, allow_null=True
    )
    patient_name = serializers.SerializerMethodField()
    practitioner_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'identifier', 'patient_id', 'patient', 'patient_name',
            'practitioner_id', 'practitioner', 'practitioner_name',
            'status', 'appointment_type', 'description',
            'start', 'end', 'reason', 'note',
        ]
        read_only_fields = ['id', 'identifier', 'patient', 'patient_name', 'practitioner', 'practitioner_name']

    def get_patient_name(self, obj):
        return str(obj.patient)

    def get_practitioner_name(self, obj):
        return str(obj.practitioner) if obj.practitioner else None


# ═══════════════════════════════════════════════════════════════════════════════
# FHIR SERIALIZERS  (output format HL7 FHIR R4 JSON)
# ═══════════════════════════════════════════════════════════════════════════════

class PatientFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'identifier', 'family_name', 'given_name', 'gender', 'birth_date']

    def to_representation(self, instance):
        return {
            "resourceType": "Patient",
            "id": str(instance.id),
            "identifier": [{"system": "https://hopital.fr/identifiers", "value": str(instance.identifier)}],
            "name": [{"family": instance.family_name, "given": [instance.given_name]}],
            "gender": instance.gender,
            "birthDate": instance.birth_date.isoformat(),
            "telecom": [
                t for t in [
                    {"system": "phone", "value": instance.phone} if instance.phone else None,
                    {"system": "email", "value": instance.email} if instance.email else None,
                ] if t
            ],
            "address": [{"text": instance.address}] if instance.address else [],
            "meta": {"lastUpdated": instance.updated_at.isoformat()},
        }


class ObservationFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = ['id', 'observation_type', 'value', 'unit', 'effective_date']

    LOINC_MAP = {
        'blood-pressure': '85354-9',
        'heart-rate': '8867-4',
        'temperature': '8310-5',
        'weight': '29463-7',
        'height': '8302-2',
    }

    def to_representation(self, instance):
        return {
            "resourceType": "Observation",
            "id": str(instance.id),
            "status": instance.status,
            "code": {
                "coding": [{
                    "system": "http://loinc.org",
                    "code": self.LOINC_MAP.get(instance.observation_type, 'unknown'),
                    "display": instance.get_observation_type_display(),
                }]
            },
            "subject": {
                "reference": f"Patient/{instance.patient.id}",
                "display": str(instance.patient),
            },
            "effectiveDateTime": instance.effective_date.isoformat(),
            "valueQuantity": {
                "value": float(instance.value),
                "unit": instance.unit,
                "system": "http://unitsofmeasure.org",
                "code": instance.unit,
            },
            "note": [{"text": instance.note}] if instance.note else [],
            "issued": instance.created_at.isoformat(),
        }


class PractitionerFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Practitioner
        fields = ['id']

    def to_representation(self, instance):
        return {
            "resourceType": "Practitioner",
            "id": str(instance.id),
            "identifier": [{"system": "https://hopital.fr/practitioners", "value": str(instance.identifier)}],
            "active": instance.active,
            "name": [{"family": instance.family_name, "given": [instance.given_name]}],
            "gender": instance.gender,
            "birthDate": instance.birth_date.isoformat() if instance.birth_date else None,
            "qualification": [{
                "code": {
                    "text": instance.qualification,
                },
            }] if instance.qualification else [],
            "telecom": [
                t for t in [
                    {"system": "phone", "value": instance.phone} if instance.phone else None,
                    {"system": "email", "value": instance.email} if instance.email else None,
                ] if t
            ],
        }


class EncounterFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encounter
        fields = ['id']

    def to_representation(self, instance):
        return {
            "resourceType": "Encounter",
            "id": str(instance.id),
            "identifier": [{"system": "https://hopital.fr/encounters", "value": str(instance.identifier)}],
            "status": instance.status,
            "class": {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code": instance.encounter_class,
            },
            "subject": {"reference": f"Patient/{instance.patient.id}", "display": str(instance.patient)},
            "participant": [{
                "individual": {"reference": f"Practitioner/{instance.practitioner.id}", "display": str(instance.practitioner)}
            }] if instance.practitioner else [],
            "reasonCode": [{"text": instance.reason}] if instance.reason else [],
            "period": {
                "start": instance.period_start.isoformat(),
                "end": instance.period_end.isoformat() if instance.period_end else None,
            },
        }


class ConditionFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = ['id']

    def to_representation(self, instance):
        return {
            "resourceType": "Condition",
            "id": str(instance.id),
            "clinicalStatus": {
                "coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": instance.clinical_status}]
            },
            "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-category", "code": instance.category}]}],
            "severity": {
                "coding": [{"system": "http://snomed.info/sct", "code": instance.severity, "display": instance.get_severity_display()}]
            },
            "code": {
                "coding": [{"system": "http://hl7.org/fhir/sid/icd-10", "code": instance.code, "display": instance.display}],
                "text": instance.display,
            },
            "subject": {"reference": f"Patient/{instance.patient.id}", "display": str(instance.patient)},
            "encounter": {"reference": f"Encounter/{instance.encounter.id}"} if instance.encounter else None,
            "onsetDateTime": instance.onset_date.isoformat() if instance.onset_date else None,
            "abatementDateTime": instance.abatement_date.isoformat() if instance.abatement_date else None,
            "note": [{"text": instance.note}] if instance.note else [],
        }


class MedicationRequestFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationRequest
        fields = ['id']

    def to_representation(self, instance):
        return {
            "resourceType": "MedicationRequest",
            "id": str(instance.id),
            "status": instance.status,
            "intent": instance.intent,
            "medicationCodeableConcept": {
                "coding": [{"system": "http://www.nlm.nih.gov/research/umls/rxnorm", "code": instance.medication_code, "display": instance.medication_display}],
                "text": instance.medication_display,
            },
            "subject": {"reference": f"Patient/{instance.patient.id}", "display": str(instance.patient)},
            "requester": {"reference": f"Practitioner/{instance.practitioner.id}", "display": str(instance.practitioner)} if instance.practitioner else None,
            "encounter": {"reference": f"Encounter/{instance.encounter.id}"} if instance.encounter else None,
            "dosageInstruction": [{
                "text": instance.dosage_text,
                "doseAndRate": [{
                    "doseQuantity": {
                        "value": float(instance.dosage_value) if instance.dosage_value else None,
                        "unit": instance.dosage_unit,
                        "system": "http://unitsofmeasure.org",
                    }
                }] if instance.dosage_value else [],
                "timing": {"code": {"text": instance.frequency}} if instance.frequency else None,
            }],
            "authoredOn": instance.authored_on.isoformat(),
            "note": [{"text": instance.note}] if instance.note else [],
        }


class AllergyIntoleranceFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllergyIntolerance
        fields = ['id']

    def to_representation(self, instance):
        return {
            "resourceType": "AllergyIntolerance",
            "id": str(instance.id),
            "clinicalStatus": {
                "coding": [{"system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", "code": instance.clinical_status}]
            },
            "type": instance.allergy_type,
            "category": [instance.category],
            "criticality": instance.criticality,
            "code": {
                "coding": [{"system": "http://snomed.info/sct", "code": instance.code, "display": instance.display}],
                "text": instance.display,
            },
            "patient": {"reference": f"Patient/{instance.patient.id}", "display": str(instance.patient)},
            "onsetDateTime": instance.onset_date.isoformat() if instance.onset_date else None,
            "reaction": [{"description": instance.reaction_description}] if instance.reaction_description else [],
            "note": [{"text": instance.note}] if instance.note else [],
        }


class ProcedureFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedure
        fields = ['id']

    def to_representation(self, instance):
        return {
            "resourceType": "Procedure",
            "id": str(instance.id),
            "status": instance.status,
            "code": {
                "coding": [{"system": "http://snomed.info/sct", "code": instance.code, "display": instance.display}],
                "text": instance.display,
            },
            "subject": {"reference": f"Patient/{instance.patient.id}", "display": str(instance.patient)},
            "performer": [{
                "actor": {"reference": f"Practitioner/{instance.practitioner.id}", "display": str(instance.practitioner)}
            }] if instance.practitioner else [],
            "encounter": {"reference": f"Encounter/{instance.encounter.id}"} if instance.encounter else None,
            "performedDateTime": instance.performed_date.isoformat(),
            "bodySite": [{"text": instance.body_site}] if instance.body_site else [],
            "note": [{"text": instance.note}] if instance.note else [],
        }


class DiagnosticReportFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosticReport
        fields = ['id']

    def to_representation(self, instance):
        return {
            "resourceType": "DiagnosticReport",
            "id": str(instance.id),
            "status": instance.status,
            "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/v2-0074", "code": instance.category}]}],
            "code": {
                "coding": [{"system": "http://loinc.org", "code": instance.code, "display": instance.display}],
                "text": instance.display,
            },
            "subject": {"reference": f"Patient/{instance.patient.id}", "display": str(instance.patient)},
            "encounter": {"reference": f"Encounter/{instance.encounter.id}"} if instance.encounter else None,
            "effectiveDateTime": instance.effective_date.isoformat(),
            "issued": instance.issued.isoformat(),
            "performer": [{
                "reference": f"Practitioner/{instance.practitioner.id}", "display": str(instance.practitioner)
            }] if instance.practitioner else [],
            "result": [{"reference": f"Observation/{obs.id}"} for obs in instance.observations.all()],
            "conclusion": instance.conclusion,
        }


class AppointmentFHIRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id']

    def to_representation(self, instance):
        participants = [{"actor": {"reference": f"Patient/{instance.patient.id}", "display": str(instance.patient)}, "status": "accepted"}]
        if instance.practitioner:
            participants.append({"actor": {"reference": f"Practitioner/{instance.practitioner.id}", "display": str(instance.practitioner)}, "status": "accepted"})

        return {
            "resourceType": "Appointment",
            "id": str(instance.id),
            "identifier": [{"system": "https://hopital.fr/appointments", "value": str(instance.identifier)}],
            "status": instance.status,
            "appointmentType": {
                "coding": [{"system": "http://terminology.hl7.org/CodeSystem/v2-0276", "code": instance.appointment_type}]
            },
            "description": instance.description,
            "start": instance.start.isoformat(),
            "end": instance.end.isoformat(),
            "participant": participants,
            "reasonCode": [{"text": instance.reason}] if instance.reason else [],
            "comment": instance.note,
        }