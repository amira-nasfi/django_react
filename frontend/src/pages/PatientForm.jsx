import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { patientService } from '../services/dataService';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      const data = await patientService.getById(id);
      reset({
        family_name: data.family_name,
        given_name: data.given_name,
        gender: data.gender,
        birth_date: data.birth_date,
      });
    } catch (err) {
      setError('Erreur lors du chargement du patient');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await patientService.update(id, data);
      } else {
        await patientService.create(data);
      }
      navigate('/patients');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Modifier le patient' : 'Nouveau patient'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nom de famille *
              </label>
              <input
                {...register('family_name', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {errors.family_name && (
                <p className="text-red-500 text-sm mt-1">{errors.family_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Prénom *
              </label>
              <input
                {...register('given_name', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {errors.given_name && (
                <p className="text-red-500 text-sm mt-1">{errors.given_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Genre *
              </label>
              <select
                {...register('gender', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Sélectionner...</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
                <option value="unknown">Inconnu</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                {...register('birth_date', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {errors.birth_date && (
                <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Link
              to="/patients"
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sauvegarde...' : (isEdit ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
