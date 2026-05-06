import api from './api';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Patient
// ═══════════════════════════════════════════════════════════════════════════════
export const patientService = {
  getAll: async (params = {}) => {
    const response = await api.get('/patients/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/patients/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/patients/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/patients/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/patients/${id}/`);
  },
  getFhir: async (id) => {
    const response = await api.get(`/patients/${id}/fhir/`);
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/patients/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Observation
// ═══════════════════════════════════════════════════════════════════════════════
export const observationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/observations/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/observations/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/observations/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/observations/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/observations/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/observations/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/observations/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Practitioner
// ═══════════════════════════════════════════════════════════════════════════════
export const practitionerService = {
  getAll: async (params = {}) => {
    const response = await api.get('/practitioners/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/practitioners/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/practitioners/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/practitioners/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/practitioners/${id}/`);
  },
  getFhirList: async () => {
    const response = await api.get('/practitioners/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Encounter
// ═══════════════════════════════════════════════════════════════════════════════
export const encounterService = {
  getAll: async (params = {}) => {
    const response = await api.get('/encounters/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/encounters/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/encounters/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/encounters/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/encounters/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/encounters/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/encounters/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Condition
// ═══════════════════════════════════════════════════════════════════════════════
export const conditionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/conditions/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/conditions/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/conditions/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/conditions/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/conditions/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/conditions/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/conditions/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MedicationRequest
// ═══════════════════════════════════════════════════════════════════════════════
export const medicationRequestService = {
  getAll: async (params = {}) => {
    const response = await api.get('/medication-requests/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/medication-requests/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/medication-requests/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/medication-requests/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/medication-requests/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/medication-requests/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/medication-requests/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. AllergyIntolerance
// ═══════════════════════════════════════════════════════════════════════════════
export const allergyIntoleranceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/allergy-intolerances/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/allergy-intolerances/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/allergy-intolerances/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/allergy-intolerances/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/allergy-intolerances/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/allergy-intolerances/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/allergy-intolerances/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 8. Procedure
// ═══════════════════════════════════════════════════════════════════════════════
export const procedureService = {
  getAll: async (params = {}) => {
    const response = await api.get('/procedures/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/procedures/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/procedures/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/procedures/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/procedures/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/procedures/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/procedures/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 9. DiagnosticReport
// ═══════════════════════════════════════════════════════════════════════════════
export const diagnosticReportService = {
  getAll: async (params = {}) => {
    const response = await api.get('/diagnostic-reports/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/diagnostic-reports/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/diagnostic-reports/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/diagnostic-reports/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/diagnostic-reports/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/diagnostic-reports/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/diagnostic-reports/fhir/');
    return response.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Appointment
// ═══════════════════════════════════════════════════════════════════════════════
export const appointmentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/appointments/', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}/`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/appointments/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/appointments/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/appointments/${id}/`);
  },
  getByPatient: async (patientId) => {
    const response = await api.get('/appointments/', { params: { patient: patientId } });
    return response.data;
  },
  getFhirList: async () => {
    const response = await api.get('/appointments/fhir/');
    return response.data;
  },
};
