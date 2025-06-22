import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Trash2, Edit, Search, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const AnnonceManagement = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAnnonces = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnnonces({ page, limit: 10, search });
      setAnnonces(response.data.annonces);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Erreur lors de la récupération des annonces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces(currentPage, searchTerm);
  }, [currentPage]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAnnonces(1, searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await adminAPI.deleteAnnonce(id);
        fetchAnnonces(currentPage, searchTerm);
        toast.success('Annonce supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'annonce');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Annonces</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSearch} className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                placeholder="Rechercher par ville, conducteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Rechercher
            </button>
          </form>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conducteur</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trajet</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {annonces.map((annonce) => (
                    <tr key={annonce._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{annonce.conducteur?.nom} {annonce.conducteur?.prenom}</div>
                        <div className="text-sm text-gray-500">{annonce.conducteur?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{annonce.lieuDepart} → {annonce.destinationFinale}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(annonce.dateDepart).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          annonce.statut === 'active' ? 'bg-green-100 text-green-800' :
                          annonce.statut === 'complete' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {annonce.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(annonce._id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">
              Page {pagination.page} sur {pagination.pages}
            </span>
            <div className="flex space-x-1">
              <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="p-2 border rounded-md"><ChevronsLeft className="h-4 w-4" /></button>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-md"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.pages} className="p-2 border rounded-md"><ChevronRight className="h-4 w-4" /></button>
              <button onClick={() => handlePageChange(pagination.pages)} disabled={currentPage === pagination.pages} className="p-2 border rounded-md"><ChevronsRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnonceManagement;
