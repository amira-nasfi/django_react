import { useState, useEffect } from 'react';
import { encounterService, patientService, practitionerService } from '../services/dataService';

const EncounterList = () => {
  const [encounters, setEncounters] = useState([]);
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patient_id: '', practitioner_id: '', status: 'planned',
    encounter_class: 'AMB', reason: '', period_start: '', period_end: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [encRes, patRes, pracRes] = await Promise.all([
        encounterService.getAll(), patientService.getAll(), practitionerService.getAll(),
      ]);
      setEncounters(encRes.results || []);
      setPatients(patRes.results || []);
      setPractitioners(pracRes.results || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await encounterService.create({
        ...form,
        patient_id: parseInt(form.patient_id),
        practitioner_id: form.practitioner_id ? parseInt(form.practitioner_id) : null,
      });
      setShowForm(false);
      setForm({ patient_id: '', practitioner_id: '', status: 'planned', encounter_class: 'AMB', reason: '', period_start: '', period_end: '' });
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette rencontre ?')) return;
    await encounterService.delete(id);
    loadData();
  };

  const statusColors = {
    'planned': 'bg-yellow-100 text-yellow-800',
    'arrived': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'finished': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rencontres (Encounter)</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? 'Annuler' : '+ Nouvelle Rencontre'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded p-2" value={form.patient_id} onChange={e => setForm({...form, patient_id: e.target.value})} required>
            <option value="">-- Patient --</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.family_name} {p.given_name}</option>)}
          </select>
          <select className="border rounded p-2" value={form.practitioner_id} onChange={e => setForm({...form, practitioner_id: e.target.value})}>
            <option value="">-- Praticien (optionnel) --</option>
            {practitioners.map(p => <option key={p.id} value={p.id}>Dr. {p.family_name} {p.given_name}</option>)}
          </select>
          <select className="border rounded p-2" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="planned">Planifiée</option><option value="arrived">Arrivé</option>
            <option value="in-progress">En cours</option><option value="finished">Terminée</option><option value="cancelled">Annulée</option>
          </select>
          <select className="border rounded p-2" value={form.encounter_class} onChange={e => setForm({...form, encounter_class: e.target.value})}>
            <option value="AMB">Ambulatoire</option><option value="IMP">Hospitalisation</option>
            <option value="EMER">Urgence</option><option value="HH">Domicile</option><option value="VR">Virtuel</option>
          </select>
          <input className="border rounded p-2" placeholder="Motif" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
          <input className="border rounded p-2" type="datetime-local" value={form.period_start} onChange={e => setForm({...form, period_start: e.target.value})} required />
          <input className="border rounded p-2" type="datetime-local" placeholder="Fin (optionnel)" value={form.period_end} onChange={e => setForm({...form, period_end: e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Créer</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Praticien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Début</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {encounters.map(enc => (
              <tr key={enc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{enc.patient_name || `Patient #${enc.patient}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{enc.practitioner_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{enc.encounter_class}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[enc.status] || 'bg-gray-100'}`}>{enc.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{enc.period_start ? new Date(enc.period_start).toLocaleString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleDelete(enc.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
                </td>
              </tr>
            ))}
            {encounters.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Aucune rencontre</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EncounterList;
