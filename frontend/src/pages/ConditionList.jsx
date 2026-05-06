import { useState, useEffect } from 'react';
import { conditionService, patientService } from '../services/dataService';

const ConditionList = () => {
  const [conditions, setConditions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id:'', code:'', display:'', clinical_status:'active', severity:'moderate', onset_date:'', note:'' });

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [c, p] = await Promise.all([conditionService.getAll(), patientService.getAll()]);
      setConditions(c.results||[]); setPatients(p.results||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await conditionService.create({...form, patient_id:parseInt(form.patient_id)});
    setShowForm(false); loadData();
  };
  const handleDelete = async (id) => { if(!confirm('Supprimer?')) return; await conditionService.delete(id); loadData(); };
  const sevColors = { mild:'bg-green-100 text-green-800', moderate:'bg-yellow-100 text-yellow-800', severe:'bg-red-100 text-red-800' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Conditions (Condition)</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{showForm?'Annuler':'+ Nouvelle Condition'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded p-2" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required>
            <option value="">-- Patient --</option>{patients.map(p=><option key={p.id} value={p.id}>{p.family_name} {p.given_name}</option>)}
          </select>
          <input className="border rounded p-2" placeholder="Code ICD-10" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Nom de la condition" value={form.display} onChange={e=>setForm({...form,display:e.target.value})} required />
          <select className="border rounded p-2" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}>
            <option value="mild">Légère</option><option value="moderate">Modérée</option><option value="severe">Sévère</option>
          </select>
          <input className="border rounded p-2" type="date" value={form.onset_date} onChange={e=>setForm({...form,onset_date:e.target.value})} />
          <textarea className="border rounded p-2" placeholder="Notes" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Créer</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sévérité</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {conditions.map(c=>(<tr key={c.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{c.patient_name}</td><td className="px-6 py-4 font-medium">{c.display}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{c.code}</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${sevColors[c.severity]||''}`}>{c.severity}</span></td>
              <td className="px-6 py-4"><button onClick={()=>handleDelete(c.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
            </tr>))}
            {conditions.length===0&&<tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Aucune condition</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ConditionList;
