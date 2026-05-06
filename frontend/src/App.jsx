import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import ObservationList from './pages/ObservationList';
import ObservationForm from './pages/ObservationForm';
import PractitionerList from './pages/PractitionerList';
import EncounterList from './pages/EncounterList';
import ConditionList from './pages/ConditionList';
import MedicationRequestList from './pages/MedicationRequestList';
import AllergyIntoleranceList from './pages/AllergyIntoleranceList';
import ProcedureList from './pages/ProcedureList';
import DiagnosticReportList from './pages/DiagnosticReportList';
import AppointmentList from './pages/AppointmentList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            {/* Patient */}
            <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
            <Route path="/patients/new" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
            <Route path="/patients/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
            <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
            {/* Observation */}
            <Route path="/observations" element={<ProtectedRoute><ObservationList /></ProtectedRoute>} />
            <Route path="/observations/new" element={<ProtectedRoute><ObservationForm /></ProtectedRoute>} />
            <Route path="/observations/:id/edit" element={<ProtectedRoute><ObservationForm /></ProtectedRoute>} />
            {/* Practitioner */}
            <Route path="/practitioners" element={<ProtectedRoute><PractitionerList /></ProtectedRoute>} />
            {/* Encounter */}
            <Route path="/encounters" element={<ProtectedRoute><EncounterList /></ProtectedRoute>} />
            {/* Condition */}
            <Route path="/conditions" element={<ProtectedRoute><ConditionList /></ProtectedRoute>} />
            {/* MedicationRequest */}
            <Route path="/medication-requests" element={<ProtectedRoute><MedicationRequestList /></ProtectedRoute>} />
            {/* AllergyIntolerance */}
            <Route path="/allergy-intolerances" element={<ProtectedRoute><AllergyIntoleranceList /></ProtectedRoute>} />
            {/* Procedure */}
            <Route path="/procedures" element={<ProtectedRoute><ProcedureList /></ProtectedRoute>} />
            {/* DiagnosticReport */}
            <Route path="/diagnostic-reports" element={<ProtectedRoute><DiagnosticReportList /></ProtectedRoute>} />
            {/* Appointment */}
            <Route path="/appointments" element={<ProtectedRoute><AppointmentList /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
