import { useState, useEffect } from 'react';
import { procedureService, patientService, practitionerService } from '../services/dataService';

const ProcedureList = () => {
  const [procedures, setProcedures] = useState([]);
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id:'', practitioner_id:'', code:'', display:'', status:'completed', performed_date:'', body_site:'', note:'' });

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [pr,p,prac] = await Promise.all([procedureService.getAll(), patientService.getAll(), practitionerService.getAll()]);
      setProcedures(pr.results||[]); setPatients(p.results||[]); setPractitioners(prac.results||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await procedureService.create({...form, patient_id:parseInt(form.patient_id), practitioner_id:form.practitioner_id?parseInt(form.practitioner_id):null});
    setShowForm(false); loadData();
  };
  const handleDelete = async (id) => { if(!confirm('Supprimer?')) return; await procedureService.delete(id); loadData(); };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Procédures (Procedure)</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{showForm?'Annuler':'+ Nouvelle Procédure'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded p-2" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required>
            <option value="">-- Patient --</option>{patients.map(p=><option key={p.id} value={p.id}>{p.family_name} {p.given_name}</option>)}
          </select>
          <select className="border rounded p-2" value={form.practitioner_id} onChange={e=>setForm({...form,practitioner_id:e.target.value})}>
            <option value="">-- Praticien --</option>{practitioners.map(p=><option key={p.id} value={p.id}>Dr. {p.family_name}</option>)}
          </select>
          <input className="border rounded p-2" placeholder="Code SNOMED/CPT" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Nom de la procédure" value={form.display} onChange={e=>setForm({...form,display:e.target.value})} required />
          <select className="border rounded p-2" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            <option value="preparation">Préparation</option><option value="in-progress">En cours</option><option value="completed">Terminée</option><option value="not-done">Non réalisée</option>
          </select>
          <input className="border rounded p-2" type="datetime-local" value={form.performed_date} onChange={e=>setForm({...form,performed_date:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Site anatomique" value={form.body_site} onChange={e=>setForm({...form,body_site:e.target.value})} />
          <textarea className="border rounded p-2" placeholder="Notes" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Créer</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procédure</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {procedures.map(p=>(<tr key={p.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{p.patient_name}</td><td className="px-6 py-4 font-medium">{p.display}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{p.code}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{p.status}</span></td>
              <td className="px-6 py-4 text-sm">{p.performed_date?new Date(p.performed_date).toLocaleString():'-'}</td>
              <td className="px-6 py-4"><button onClick={()=>handleDelete(p.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
            </tr>))}
            {procedures.length===0&&<tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Aucune procédure</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProcedureList;
