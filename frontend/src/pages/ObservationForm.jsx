import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { observationService, patientService } from '../services/dataService';

const ObservationForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const obsTypes = [
    { value: 'blood-pressure', label: 'Tension artérielle', unit: 'mmHg' },
    { value: 'heart-rate', label: 'Fréquence cardiaque', unit: 'bpm' },
    { value: 'temperature', label: 'Température', unit: '°C' },
    { value: 'weight', label: 'Poids', unit: 'kg' },
    { value: 'height', label: 'Taille', unit: 'cm' },
  ];

  useEffect(() => {
    loadPatients();
    if (isEdit) {
      loadObservation();
    } else {
      const patientId = searchParams.get('patient');
      if (patientId) {
        reset({ patient: patientId });
      }
    }
  }, [id]);

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data.results || []);
    } catch (err) {
      console.error('Erreur chargement patients:', err);
    }
  };

  const loadObservation = async () => {
    try {
      const data = await observationService.getById(id);
      reset({
        patient: data.patient,
        observation_type: data.observation_type,
        value: data.value,
        unit: data.unit,
        effective_date: data.effective_date?.slice(0, 16),
      });
    } catch (err) {
      setError('Erreur lors du chargement');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        patient_id: data.patient,
        observation_type: data.observation_type,
        value: data.value,
        unit: data.unit,
        effective_date: new Date(data.effective_date).toISOString(),
      };

      if (isEdit) {
        await observationService.update(id, payload);
      } else {
        await observationService.create(payload);
      }
      navigate('/observations');
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
          {isEdit ? 'Modifier l\'observation' : 'Nouvelle observation'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Patient *
              </label>
              <select
                {...register('patient', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Sélectionner un patient...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.family_name} {p.given_name}
                  </option>
                ))}
              </select>
              {errors.patient && (
                <p className="text-red-500 text-sm mt-1">{errors.patient.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Type d'observation *
              </label>
              <select
                {...register('observation_type', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Sélectionner...</option>
                {obsTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.observation_type && (
                <p className="text-red-500 text-sm mt-1">{errors.observation_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date et heure *
              </label>
              <input
                type="datetime-local"
                {...register('effective_date', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {errors.effective_date && (
                <p className="text-red-500 text-sm mt-1">{errors.effective_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Valeur *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('value', { 
                  required: 'Ce champ est requis',
                  min: { value: 0, message: 'La valeur doit être positive' }
                })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              {errors.value && (
                <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Unité *
              </label>
              <select
                {...register('unit', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Sélectionner...</option>
                <option value="mmHg">mmHg</option>
                <option value="bpm">bpm</option>
                <option value="°C">°C</option>
                <option value="kg">kg</option>
                <option value="cm">cm</option>
                <option value="mg/dL">mg/dL</option>
              </select>
              {errors.unit && (
                <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Link
              to="/observations"
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

export default ObservationForm;
