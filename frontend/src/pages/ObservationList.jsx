import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observationService, patientService } from '../services/dataService';

const ObservationList = () => {
  const [observations, setObservations] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');

  const obsTypes = [
    { value: 'blood-pressure', label: 'Tension artérielle' },
    { value: 'heart-rate', label: 'Fréquence cardiaque' },
    { value: 'temperature', label: 'Température' },
    { value: 'weight', label: 'Poids' },
    { value: 'height', label: 'Taille' },
  ];

  useEffect(() => {
    loadData();
  }, [filterType]);

  const loadData = async () => {
    try {
      const params = filterType ? { observation_type: filterType } : {};
      const [obsData, patientData] = await Promise.all([
        observationService.getAll(params),
        patientService.getAll()
      ]);
      
      setObservations(obsData.results || []);
      
      const patientMap = {};
      (patientData.results || []).forEach(p => {
        patientMap[p.id] = p;
      });
      setPatients(patientMap);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette observation ?')) return;
    
    try {
      await observationService.delete(id);
      setObservations(observations.filter(o => o.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const getTypeName = (type) => {
    const found = obsTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Observations</h1>
        <Link
          to="/observations/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nouvelle Observation
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
        >
          <option value="">Tous les types</option>
          {obsTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Valeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {observations.map((obs) => {
              const patient = patients[obs.patient];
              return (
                <tr key={obs.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient ? (
                      <Link to={`/patients/${patient.id}`} className="text-blue-600 hover:underline">
                        {patient.family_name} {patient.given_name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Patient #{obs.patient}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {getTypeName(obs.observation_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                    {obs.value} {obs.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(obs.effective_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/observations/${obs.id}/edit`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(obs.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {observations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune observation trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationList;
