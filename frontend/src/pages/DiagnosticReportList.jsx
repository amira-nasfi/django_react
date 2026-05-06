import { useState, useEffect } from 'react';
import { diagnosticReportService, patientService, practitionerService } from '../services/dataService';

const DiagnosticReportList = () => {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id:'', practitioner_id:'', code:'', display:'', status:'final', category:'LAB', effective_date:'', conclusion:'' });

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [r,p,pr] = await Promise.all([diagnosticReportService.getAll(), patientService.getAll(), practitionerService.getAll()]);
      setReports(r.results||[]); setPatients(p.results||[]); setPractitioners(pr.results||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await diagnosticReportService.create({...form, patient_id:parseInt(form.patient_id), practitioner_id:form.practitioner_id?parseInt(form.practitioner_id):null});
    setShowForm(false); loadData();
  };
  const handleDelete = async (id) => { if(!confirm('Supprimer?')) return; await diagnosticReportService.delete(id); loadData(); };
  const catLabels = { LAB:'Laboratoire', RAD:'Radiologie', PAT:'Pathologie', OTH:'Autre' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rapports (DiagnosticReport)</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{showForm?'Annuler':'+ Nouveau Rapport'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded p-2" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required>
            <option value="">-- Patient --</option>{patients.map(p=><option key={p.id} value={p.id}>{p.family_name} {p.given_name}</option>)}
          </select>
          <select className="border rounded p-2" value={form.practitioner_id} onChange={e=>setForm({...form,practitioner_id:e.target.value})}>
            <option value="">-- Praticien --</option>{practitioners.map(p=><option key={p.id} value={p.id}>Dr. {p.family_name}</option>)}
          </select>
          <input className="border rounded p-2" placeholder="Code LOINC" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Nom du rapport" value={form.display} onChange={e=>setForm({...form,display:e.target.value})} required />
          <select className="border rounded p-2" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            <option value="LAB">Laboratoire</option><option value="RAD">Radiologie</option><option value="PAT">Pathologie</option><option value="OTH">Autre</option>
          </select>
          <input className="border rounded p-2" type="datetime-local" value={form.effective_date} onChange={e=>setForm({...form,effective_date:e.target.value})} required />
          <textarea className="border rounded p-2 md:col-span-2" placeholder="Conclusion" value={form.conclusion} onChange={e=>setForm({...form,conclusion:e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Créer</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rapport</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map(r=>(<tr key={r.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{r.patient_name}</td><td className="px-6 py-4 font-medium">{r.display}</td>
              <td className="px-6 py-4">{catLabels[r.category]||r.category}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{r.status}</span></td>
              <td className="px-6 py-4 text-sm">{r.effective_date?new Date(r.effective_date).toLocaleString():'-'}</td>
              <td className="px-6 py-4"><button onClick={()=>handleDelete(r.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
            </tr>))}
            {reports.length===0&&<tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Aucun rapport</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DiagnosticReportList;
