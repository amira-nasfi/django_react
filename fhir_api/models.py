from django.db import models
import uuid


# ═══════════════════════════════════════════════════════════════════════════════
# 1. Patient  (FHIR Patient)
# ═══════════════════════════════════════════════════════════════════════════════
class Patient(models.Model):

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('unknown', 'Unknown'),
    ]

    identifier = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    family_name = models.CharField(max_length=100)
    given_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    birth_date = models.DateField()
    phone = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    address = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['identifier']),
            models.Index(fields=['family_name', 'given_name']),
        ]

    def __str__(self):
        return f"{self.family_name} {self.given_name}"


# ═══════════════════════════════════════════════════════════════════════════════
# 2. Observation  (FHIR Observation)
# ═══════════════════════════════════════════════════════════════════════════════
class Observation(models.Model):

    OBS_TYPES = [
        ('blood-pressure', 'Tension artérielle'),
        ('heart-rate', 'Fréquence cardiaque'),
        ('temperature', 'Température'),
        ('weight', 'Poids'),
        ('height', 'Taille'),
    ]

    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('preliminary', 'Preliminary'),
        ('final', 'Final'),
        ('amended', 'Amended'),
    ]

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='observations'
    )

    observation_type = models.CharField(max_length=50, choices=OBS_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='final')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    effective_date = models.DateTimeField()
    note = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'effective_date']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.observation_type}"


# ═══════════════════════════════════════════════════════════════════════════════
# 3. Practitioner  (FHIR Practitioner)
# ═══════════════════════════════════════════════════════════════════════════════
class Practitioner(models.Model):

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('unknown', 'Unknown'),
    ]

    identifier = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    family_name = models.CharField(max_length=100)
    given_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    birth_date = models.DateField(null=True, blank=True)
    qualification = models.CharField(max_length=200, blank=True, default='')
    specialty = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['identifier']),
        ]

    def __str__(self):
        return f"Dr. {self.family_name} {self.given_name}"


# ═══════════════════════════════════════════════════════════════════════════════
# 4. Encounter  (FHIR Encounter)
# ═══════════════════════════════════════════════════════════════════════════════
class Encounter(models.Model):

    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('arrived', 'Arrived'),
        ('in-progress', 'In Progress'),
        ('finished', 'Finished'),
        ('cancelled', 'Cancelled'),
    ]

    CLASS_CHOICES = [
        ('AMB', 'Ambulatory'),
        ('IMP', 'Inpatient'),
        ('EMER', 'Emergency'),
        ('HH', 'Home Health'),
        ('VR', 'Virtual'),
    ]

    identifier = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='encounters')
    practitioner = models.ForeignKey(
        Practitioner, on_delete=models.SET_NULL, null=True, blank=True, related_name='encounters'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    encounter_class = models.CharField(max_length=10, choices=CLASS_CHOICES, default='AMB')
    reason = models.TextField(blank=True, default='')
    period_start = models.DateTimeField()
    period_end = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'period_start']),
        ]

    def __str__(self):
        return f"Encounter {self.identifier} - {self.patient}"


# ═══════════════════════════════════════════════════════════════════════════════
# 5. Condition  (FHIR Condition)
# ═══════════════════════════════════════════════════════════════════════════════
class Condition(models.Model):

    CLINICAL_STATUS_CHOICES = [
        ('active', 'Active'),
        ('recurrence', 'Recurrence'),
        ('relapse', 'Relapse'),
        ('inactive', 'Inactive'),
        ('remission', 'Remission'),
        ('resolved', 'Resolved'),
    ]

    SEVERITY_CHOICES = [
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]

    CATEGORY_CHOICES = [
        ('problem-list-item', 'Problem List Item'),
        ('encounter-diagnosis', 'Encounter Diagnosis'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='conditions')
    encounter = models.ForeignKey(
        Encounter, on_delete=models.SET_NULL, null=True, blank=True, related_name='conditions'
    )
    code = models.CharField(max_length=20, help_text='ICD-10 or SNOMED code')
    display = models.CharField(max_length=255, help_text='Human-readable name')
    clinical_status = models.CharField(max_length=20, choices=CLINICAL_STATUS_CHOICES, default='active')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='moderate')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='encounter-diagnosis')
    onset_date = models.DateField(null=True, blank=True)
    abatement_date = models.DateField(null=True, blank=True)
    note = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'clinical_status']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.display}"


# ═══════════════════════════════════════════════════════════════════════════════
# 6. MedicationRequest  (FHIR MedicationRequest)
# ═══════════════════════════════════════════════════════════════════════════════
class MedicationRequest(models.Model):

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('on-hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('stopped', 'Stopped'),
    ]

    INTENT_CHOICES = [
        ('proposal', 'Proposal'),
        ('plan', 'Plan'),
        ('order', 'Order'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medication_requests')
    practitioner = models.ForeignKey(
        Practitioner, on_delete=models.SET_NULL, null=True, blank=True, related_name='medication_requests'
    )
    encounter = models.ForeignKey(
        Encounter, on_delete=models.SET_NULL, null=True, blank=True, related_name='medication_requests'
    )
    medication_code = models.CharField(max_length=20, help_text='RxNorm or ATC code')
    medication_display = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    intent = models.CharField(max_length=20, choices=INTENT_CHOICES, default='order')
    dosage_text = models.CharField(max_length=255, blank=True, default='')
    dosage_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dosage_unit = models.CharField(max_length=20, blank=True, default='')
    frequency = models.CharField(max_length=100, blank=True, default='', help_text='e.g. 2 times/day')
    authored_on = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'status']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.medication_display}"


# ═══════════════════════════════════════════════════════════════════════════════
# 7. AllergyIntolerance  (FHIR AllergyIntolerance)
# ═══════════════════════════════════════════════════════════════════════════════
class AllergyIntolerance(models.Model):

    CLINICAL_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('resolved', 'Resolved'),
    ]

    TYPE_CHOICES = [
        ('allergy', 'Allergy'),
        ('intolerance', 'Intolerance'),
    ]

    CATEGORY_CHOICES = [
        ('food', 'Food'),
        ('medication', 'Medication'),
        ('environment', 'Environment'),
        ('biologic', 'Biologic'),
    ]

    CRITICALITY_CHOICES = [
        ('low', 'Low'),
        ('high', 'High'),
        ('unable-to-assess', 'Unable to Assess'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='allergies')
    code = models.CharField(max_length=20, help_text='SNOMED code for substance')
    display = models.CharField(max_length=255, help_text='Substance name')
    clinical_status = models.CharField(max_length=20, choices=CLINICAL_STATUS_CHOICES, default='active')
    allergy_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='allergy')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='medication')
    criticality = models.CharField(max_length=20, choices=CRITICALITY_CHOICES, default='low')
    onset_date = models.DateField(null=True, blank=True)
    reaction_description = models.TextField(blank=True, default='')
    note = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'clinical_status']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.display}"


# ═══════════════════════════════════════════════════════════════════════════════
# 8. Procedure  (FHIR Procedure)
# ═══════════════════════════════════════════════════════════════════════════════
class Procedure(models.Model):

    STATUS_CHOICES = [
        ('preparation', 'Preparation'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
        ('not-done', 'Not Done'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='procedures')
    practitioner = models.ForeignKey(
        Practitioner, on_delete=models.SET_NULL, null=True, blank=True, related_name='procedures'
    )
    encounter = models.ForeignKey(
        Encounter, on_delete=models.SET_NULL, null=True, blank=True, related_name='procedures'
    )
    code = models.CharField(max_length=20, help_text='SNOMED or CPT code')
    display = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    performed_date = models.DateTimeField()
    body_site = models.CharField(max_length=100, blank=True, default='')
    note = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'performed_date']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.display}"


# ═══════════════════════════════════════════════════════════════════════════════
# 9. DiagnosticReport  (FHIR DiagnosticReport)
# ═══════════════════════════════════════════════════════════════════════════════
class DiagnosticReport(models.Model):

    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('partial', 'Partial'),
        ('preliminary', 'Preliminary'),
        ('final', 'Final'),
    ]

    CATEGORY_CHOICES = [
        ('LAB', 'Laboratory'),
        ('RAD', 'Radiology'),
        ('PAT', 'Pathology'),
        ('OTH', 'Other'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='diagnostic_reports')
    practitioner = models.ForeignKey(
        Practitioner, on_delete=models.SET_NULL, null=True, blank=True, related_name='diagnostic_reports'
    )
    encounter = models.ForeignKey(
        Encounter, on_delete=models.SET_NULL, null=True, blank=True, related_name='diagnostic_reports'
    )
    code = models.CharField(max_length=20, help_text='LOINC code')
    display = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='final')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='LAB')
    issued = models.DateTimeField(auto_now_add=True)
    effective_date = models.DateTimeField()
    conclusion = models.TextField(blank=True, default='')
    observations = models.ManyToManyField(Observation, blank=True, related_name='diagnostic_reports')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'effective_date']),
        ]

    def __str__(self):
        return f"{self.patient} - {self.display}"


# ═══════════════════════════════════════════════════════════════════════════════
# 10. Appointment  (FHIR Appointment)
# ═══════════════════════════════════════════════════════════════════════════════
class Appointment(models.Model):

    STATUS_CHOICES = [
        ('proposed', 'Proposed'),
        ('pending', 'Pending'),
        ('booked', 'Booked'),
        ('arrived', 'Arrived'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
        ('noshow', 'No Show'),
    ]

    APPOINTMENT_TYPE_CHOICES = [
        ('routine', 'Routine'),
        ('walkin', 'Walk-In'),
        ('checkup', 'Checkup'),
        ('followup', 'Follow-Up'),
        ('emergency', 'Emergency'),
    ]

    identifier = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    practitioner = models.ForeignKey(
        Practitioner, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPE_CHOICES, default='routine')
    description = models.TextField(blank=True, default='')
    start = models.DateTimeField()
    end = models.DateTimeField()
    reason = models.CharField(max_length=255, blank=True, default='')
    note = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient', 'start']),
            models.Index(fields=['practitioner', 'start']),
        ]

    def __str__(self):
        return f"Appointment {self.identifier} - {self.patient}"
