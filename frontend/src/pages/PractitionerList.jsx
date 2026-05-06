import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { practitionerService } from '../services/dataService';

const PractitionerList = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    family_name: '', given_name: '', gender: 'male',
    specialty: '', qualification: '', phone: '', email: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await practitionerService.getAll();
      setPractitioners(res.results || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await practitionerService.update(editingId, form);
      } else {
        await practitionerService.create(form);
      }
      setShowForm(false); setEditingId(null);
      setForm({ family_name: '', given_name: '', gender: 'male', specialty: '', qualification: '', phone: '', email: '' });
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (p) => {
    setForm({ family_name: p.family_name, given_name: p.given_name, gender: p.gender, specialty: p.specialty, qualification: p.qualification, phone: p.phone, email: p.email });
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce praticien ?')) return;
    await practitionerService.delete(id);
    loadData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Praticiens (Practitioner)</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ family_name: '', given_name: '', gender: 'male', specialty: '', qualification: '', phone: '', email: '' }); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? 'Annuler' : '+ Nouveau Praticien'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded p-2" placeholder="Nom" value={form.family_name} onChange={e => setForm({...form, family_name: e.target.value})} required />
          <input className="border rounded p-2" placeholder="Prénom" value={form.given_name} onChange={e => setForm({...form, given_name: e.target.value})} required />
          <select className="border rounded p-2" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
            <option value="male">Homme</option><option value="female">Femme</option><option value="other">Autre</option>
          </select>
          <input className="border rounded p-2" placeholder="Spécialité" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} />
          <input className="border rounded p-2" placeholder="Qualification" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} />
          <input className="border rounded p-2" placeholder="Téléphone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="border rounded p-2" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">{editingId ? 'Mettre à jour' : 'Créer'}</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {practitioners.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">Dr. {p.family_name} {p.given_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.specialty || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.phone || p.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${p.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.active ? 'Actif' : 'Inactif'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">Modifier</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
                </td>
              </tr>
            ))}
            {practitioners.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Aucun praticien</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PractitionerList;
