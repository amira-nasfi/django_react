import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  patientService, observationService, practitionerService,
  encounterService, conditionService, medicationRequestService,
  allergyIntoleranceService, procedureService, diagnosticReportService,
  appointmentService,
} from '../services/dataService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6'];

const resourceCards = [
  { key: 'patients', label: 'Patients', path: '/patients', color: 'bg-blue-500', },
  { key: 'observations', label: 'Observations', path: '/observations', color: 'bg-green-500', },
  { key: 'practitioners', label: 'Praticiens', path: '/practitioners', color: 'bg-purple-500', },
  { key: 'encounters', label: 'Rencontres', path: '/encounters', color: 'bg-cyan-500', },
  { key: 'conditions', label: 'Conditions', path: '/conditions', color: 'bg-red-500', },
  { key: 'medicationRequests', label: 'Prescriptions', path: '/medication-requests', color: 'bg-amber-500', },
  { key: 'allergies', label: 'Allergies', path: '/allergy-intolerances', color: 'bg-pink-500', },
  { key: 'procedures', label: 'Procédures', path: '/procedures', color: 'bg-indigo-500', },
  { key: 'diagnosticReports', label: 'Rapports', path: '/diagnostic-reports', color: 'bg-teal-500', },
  { key: 'appointments', label: 'Rendez-vous', path: '/appointments', color: 'bg-orange-500', },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [observationsByType, setObservationsByType] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState([]);
  const [recentObservations, setRecentObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [pat, obs, prac, enc, cond, med, allergy, proc, diag, appt] = await Promise.all([
        patientService.getAll(), observationService.getAll(), practitionerService.getAll(),
        encounterService.getAll(), conditionService.getAll(), medicationRequestService.getAll(),
        allergyIntoleranceService.getAll(), procedureService.getAll(), diagnosticReportService.getAll(),
        appointmentService.getAll(),
      ]);

      const patients = pat.results || [];
      const observations = obs.results || [];

      setCounts({
        patients: pat.count || patients.length,
        observations: obs.count || observations.length,
        practitioners: prac.count || (prac.results || []).length,
        encounters: enc.count || (enc.results || []).length,
        conditions: cond.count || (cond.results || []).length,
        medicationRequests: med.count || (med.results || []).length,
        allergies: allergy.count || (allergy.results || []).length,
        procedures: proc.count || (proc.results || []).length,
        diagnosticReports: diag.count || (diag.results || []).length,
        appointments: appt.count || (appt.results || []).length,
      });

      // Observations by type
      const typeCount = {};
      observations.forEach(o => {
        const t = o.observation_type || 'Autre';
        typeCount[t] = (typeCount[t] || 0) + 1;
      });
      setObservationsByType(Object.entries(typeCount).map(([name, value]) => ({ name, value })));

      // Gender distribution
      const genderCount = {};
      patients.forEach(p => {
        const g = p.gender || 'unknown';
        genderCount[g] = (genderCount[g] || 0) + 1;
      });
      setGenderDistribution(Object.entries(genderCount).map(([name, value]) => ({
        name: name === 'male' ? 'Homme' : name === 'female' ? 'Femme' : 'Autre', value,
      })));

      // Recent observations
      setRecentObservations(observations.slice(0, 10).map(o => ({
        date: new Date(o.effective_date || o.effectiveDateTime).toLocaleDateString(),
        value: parseFloat(o.value || 0),
        type: o.observation_type || 'Observation',
      })));

    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalResources = Object.values(counts).reduce((a, b) => a + b, 0);
  const resourceDistribution = resourceCards
    .map(r => ({ name: r.label, value: counts[r.key] || 0 }))
    .filter(r => r.value > 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard FHIR</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble des ressources</p>
      </div>

      {/* 10 Resource Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {resourceCards.map((rc) => (
          <Link key={rc.key} to={rc.path}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{rc.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full text-white ${rc.color}`}>FHIR</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{counts[rc.key] || 0}</p>
            <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">{rc.label} →</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Répartition des ressources</h2>
          {resourceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={resourceDistribution} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100} fill="#8884d8" dataKey="value">
                  {resourceDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Aucune donnée disponible</p>
          )}
        </div>

        {/* Observations by type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Observations par type</h2>
          {observationsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={observationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Aucune donnée disponible</p>
          )}
        </div>

        {/* Gender distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Répartition par genre</h2>
          {genderDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genderDistribution} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100} fill="#8884d8" dataKey="value">
                  {genderDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Aucune donnée disponible</p>
          )}
        </div>

        {/* Recent observations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Dernières observations</h2>
          {recentObservations.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentObservations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Aucune donnée disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
