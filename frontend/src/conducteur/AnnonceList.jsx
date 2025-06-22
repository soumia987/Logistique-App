import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { annoncesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, MapPin, Calendar, Clock } from 'lucide-react';

const AnnonceList = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        setLoading(true);
        const response = await annoncesAPI.getMyAnnonces();
        setAnnonces(response.data.annonces);
      } catch (error) {
        toast.error('Erreur lors de la récupération de vos annonces');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await annoncesAPI.delete(id);
        setAnnonces(annonces.filter(annonce => annonce._id !== id));
        toast.success('Annonce supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'annonce');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes Annonces</h1>
          <button
            onClick={() => navigate('/conducteur/annonces/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer une annonce
          </button>
        </div>

        {annonces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <div key={annonce._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {annonce.lieuDepart} → {annonce.destinationFinale}
                    </h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      annonce.statut === 'active' ? 'bg-green-100 text-green-800' :
                      annonce.statut === 'complete' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {annonce.statut}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(annonce.dateDepart).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{annonce.heureDepart}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{annonce.prix} €/kg</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/conducteur/annonces/edit/${annonce._id}`)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(annonce._id)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-900">Aucune annonce trouvée</h3>
            <p className="mt-2 text-gray-600">Commencez par créer votre première annonce de trajet !</p>
            <button
              onClick={() => navigate('/conducteur/annonces/create')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer une annonce
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnonceList;
