import { useState, useEffect } from 'react';
import { appointmentService, patientService, practitionerService } from '../services/dataService';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient_id:'', practitioner_id:'', status:'booked', appointment_type:'routine', description:'', start:'', end:'', reason:'' });

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const [a,p,pr] = await Promise.all([appointmentService.getAll(), patientService.getAll(), practitionerService.getAll()]);
      setAppointments(a.results||[]); setPatients(p.results||[]); setPractitioners(pr.results||[]);
    } catch(e){console.error(e);} finally{setLoading(false);}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await appointmentService.create({...form, patient_id:parseInt(form.patient_id), practitioner_id:form.practitioner_id?parseInt(form.practitioner_id):null});
    setShowForm(false); loadData();
  };
  const handleDelete = async (id) => { if(!confirm('Supprimer?')) return; await appointmentService.delete(id); loadData(); };
  const statusColors = { proposed:'bg-gray-100 text-gray-800', pending:'bg-yellow-100 text-yellow-800', booked:'bg-blue-100 text-blue-800', fulfilled:'bg-green-100 text-green-800', cancelled:'bg-red-100 text-red-800', noshow:'bg-orange-100 text-orange-800' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rendez-vous (Appointment)</h1>
        <button onClick={()=>setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{showForm?'Annuler':'+ Nouveau RDV'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="border rounded p-2" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} required>
            <option value="">-- Patient --</option>{patients.map(p=><option key={p.id} value={p.id}>{p.family_name} {p.given_name}</option>)}
          </select>
          <select className="border rounded p-2" value={form.practitioner_id} onChange={e=>setForm({...form,practitioner_id:e.target.value})}>
            <option value="">-- Praticien --</option>{practitioners.map(p=><option key={p.id} value={p.id}>Dr. {p.family_name}</option>)}
          </select>
          <select className="border rounded p-2" value={form.appointment_type} onChange={e=>setForm({...form,appointment_type:e.target.value})}>
            <option value="routine">Routine</option><option value="walkin">Sans RDV</option><option value="checkup">Bilan</option><option value="followup">Suivi</option><option value="emergency">Urgence</option>
          </select>
          <input className="border rounded p-2" placeholder="Motif" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} />
          <input className="border rounded p-2" type="datetime-local" placeholder="Début" value={form.start} onChange={e=>setForm({...form,start:e.target.value})} required />
          <input className="border rounded p-2" type="datetime-local" placeholder="Fin" value={form.end} onChange={e=>setForm({...form,end:e.target.value})} required />
          <textarea className="border rounded p-2 md:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Créer</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Praticien</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map(a=>(<tr key={a.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{a.patient_name}</td>
              <td className="px-6 py-4">{a.practitioner_name||'-'}</td>
              <td className="px-6 py-4">{a.appointment_type}</td>
              <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${statusColors[a.status]||'bg-gray-100'}`}>{a.status}</span></td>
              <td className="px-6 py-4 text-sm">{a.start?new Date(a.start).toLocaleString():'-'}</td>
              <td className="px-6 py-4"><button onClick={()=>handleDelete(a.id)} className="text-red-600 hover:text-red-800">Supprimer</button></td>
            </tr>))}
            {appointments.length===0&&<tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Aucun rendez-vous</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AppointmentList;
