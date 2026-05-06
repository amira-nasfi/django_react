import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientService, observationService } from '../services/dataService';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [patientData, obsData] = await Promise.all([
        patientService.getById(id),
        observationService.getByPatient(id)
      ]);
      setPatient(patientData);
      setObservations(obsData.results || []);
    } catch (err) {
      setError('Erreur lors du chargement');
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

  if (error || !patient) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Patient non trouvé'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {patient.family_name} {patient.given_name}
        </h1>
        <div className="space-x-2">
          <Link
            to={`/patients/${id}/edit`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Modifier
          </Link>
          <Link
            to="/patients"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Retour
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations patient */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informations</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Identifiant</dt>
              <dd className="font-medium">{patient.identifier}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Genre</dt>
              <dd>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  patient.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                  patient.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {patient.gender === 'male' ? 'Homme' : 
                   patient.gender === 'female' ? 'Femme' : 'Autre'}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Date de naissance</dt>
              <dd className="font-medium">{new Date(patient.birth_date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Créé le</dt>
              <dd className="font-medium">{new Date(patient.created_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* Observations du patient */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Observations</h2>
            <Link
              to={`/observations/new?patient=${id}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Ajouter
            </Link>
          </div>
          
          {observations.length > 0 ? (
            <div className="space-y-3">
              {observations.map((obs) => (
                <div key={obs.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-medium">
                    {obs.observation_type === 'blood-pressure' ? 'Tension artérielle' :
                     obs.observation_type === 'heart-rate' ? 'Fréquence cardiaque' :
                     obs.observation_type === 'temperature' ? 'Température' :
                     obs.observation_type === 'weight' ? 'Poids' :
                     obs.observation_type === 'height' ? 'Taille' : obs.observation_type}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {obs.value} {obs.unit}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(obs.effective_date).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune observation</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
