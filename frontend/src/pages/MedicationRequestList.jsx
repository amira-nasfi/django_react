import { useState, useEffect } from 'react';
import { medicationRequestService, patientService, practitionerService } from '../services/dataService';

const MedicationRequestList = () => {
  const [meds, setMeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id:'', practitioner_id:'', medication_code:'', medication_display:'', status:'active', intent:'order', dosage_text:'', frequency:'', note:'' });

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [m,p,pr] = await Promise.all([medicationRequestService.getAll(), patientService.getAll(), practitionerService.getAll()]);
      setMeds(m.results||[]); setPatients(p.results||[]); setPractitioners(pr.results||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await medicationRequestService.create({...form, patient_id:parseInt(form.patient_id), practitioner_id:form.practitioner_id?parseInt(form.practitioner_id):null});
    setShowForm(false); loadData();
  };
  const handleDelete = async (id) => { if(!confirm('Supprimer?')) return; await medicationRequestService.delete(id); loadData(); };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Prescriptions (MedicationRequest)</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{showForm?'Annuler':'+ Nouvelle Prescription'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded p-2" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required>
            <option value="">-- Patient --</option>{patients.map(p=><option key={p.id} value={p.id}>{p.family_name} {p.given_name}</option>)}
          </select>
          <select className="border rounded p-2" value={form.practitioner_id} onChange={e=>setForm({...form,practitioner_id:e.target.value})}>
            <option value="">-- Prescripteur --</option>{practitioners.map(p=><option key={p.id} value={p.id}>Dr. {p.family_name}</option>)}
          </select>
          <input className="border rounded p-2" placeholder="Code médicament (RxNorm)" value={form.medication_code} onChange={e=>setForm({...form,medication_code:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Nom du médicament" value={form.medication_display} onChange={e=>setForm({...form,medication_display:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Posologie (ex: 500mg 2x/jour)" value={form.dosage_text} onChange={e=>setForm({...form,dosage_text:e.target.value})} />
          <input className="border rounded p-2" placeholder="Fréquence" value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Créer</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médicament</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posologie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {meds.map(m=>(<tr key={m.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{m.patient_name}</td><td className="px-6 py-4 font-medium">{m.medication_display}</td>
              <td className="px-6 py-4 text-sm">{m.dosage_text||'-'}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{m.status}</span></td>
              <td className="px-6 py-4"><button onClick={()=>handleDelete(m.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
            </tr>))}
            {meds.length===0&&<tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Aucune prescription</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MedicationRequestList;
