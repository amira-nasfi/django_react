import { useState, useEffect } from 'react';
import { allergyIntoleranceService, patientService } from '../services/dataService';

const AllergyIntoleranceList = () => {
  const [allergies, setAllergies] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id:'', code:'', display:'', allergy_type:'allergy', category:'medication', criticality:'low', reaction_description:'', note:'' });

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [a,p] = await Promise.all([allergyIntoleranceService.getAll(), patientService.getAll()]);
      setAllergies(a.results||[]); setPatients(p.results||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await allergyIntoleranceService.create({...form, patient_id:parseInt(form.patient_id)});
    setShowForm(false); loadData();
  };
  const handleDelete = async (id) => { if(!confirm('Supprimer?')) return; await allergyIntoleranceService.delete(id); loadData(); };
  const critColors = { low:'bg-green-100 text-green-800', high:'bg-red-100 text-red-800', 'unable-to-assess':'bg-gray-100 text-gray-800' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Allergies (AllergyIntolerance)</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{showForm?'Annuler':'+ Nouvelle Allergie'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded p-2" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required>
            <option value="">-- Patient --</option>{patients.map(p=><option key={p.id} value={p.id}>{p.family_name} {p.given_name}</option>)}
          </select>
          <input className="border rounded p-2" placeholder="Code SNOMED" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Substance" value={form.display} onChange={e=>setForm({...form,display:e.target.value})} required />
          <select className="border rounded p-2" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            <option value="food">Alimentaire</option><option value="medication">Médicament</option><option value="environment">Environnement</option><option value="biologic">Biologique</option>
          </select>
          <select className="border rounded p-2" value={form.criticality} onChange={e=>setForm({...form,criticality:e.target.value})}>
            <option value="low">Faible</option><option value="high">Élevée</option><option value="unable-to-assess">Indéterminée</option>
          </select>
          <input className="border rounded p-2" placeholder="Réaction" value={form.reaction_description} onChange={e=>setForm({...form,reaction_description:e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Créer</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Substance</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criticité</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {allergies.map(a=>(<tr key={a.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{a.patient_name}</td><td className="px-6 py-4 font-medium">{a.display}</td>
              <td className="px-6 py-4">{a.category}</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${critColors[a.criticality]||''}`}>{a.criticality}</span></td>
              <td className="px-6 py-4"><button onClick={()=>handleDelete(a.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
            </tr>))}
            {allergies.length===0&&<tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Aucune allergie</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AllergyIntoleranceList;
