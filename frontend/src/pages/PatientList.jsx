import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../services/dataService';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data.results || []);
    } catch (err) {
      setError('Erreur lors du chargement des patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) return;
    
    try {
      await patientService.delete(id);
      setPatients(patients.filter(p => p.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const filteredPatients = patients.filter(p => 
    `${p.family_name} ${p.given_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
        <Link
          to="/patients/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nouveau Patient
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de naissance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {patient.family_name} {patient.given_name}
                  </div>
                  <div className="text-sm text-gray-500">{patient.identifier}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    patient.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                    patient.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.gender === 'male' ? 'Homme' : 
                     patient.gender === 'female' ? 'Femme' : 'Autre'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(patient.birth_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    to={`/patients/${patient.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Voir
                  </Link>
                  <Link
                    to={`/patients/${patient.id}/edit`}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun patient trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
