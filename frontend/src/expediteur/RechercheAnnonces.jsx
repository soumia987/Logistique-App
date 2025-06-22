import React, { useState, useEffect } from 'react';
import { annoncesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Search, MapPin, Calendar, Box } from 'lucide-react';
import Modal from '../components/Modal';
import DemandeForm from './DemandeForm';

const RechercheAnnonces = () => {
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        lieuDepart: '',
        destinationFinale: '',
        dateDepart: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnnonce, setSelectedAnnonce] = useState(null);

    const fetchAnnonces = async () => {
        setLoading(true);
        try {
            const response = await annoncesAPI.getAll(filters);
            setAnnonces(response.data.annonces);
        } catch (error) {
            toast.error("Erreur lors de la recherche d'annonces.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnonces(); // Initial fetch
    }, []);
    
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAnnonces();
    };

    const openDemandeModal = (annonce) => {
        setSelectedAnnonce(annonce);
        setIsModalOpen(true);
    };
    
    const onDemandeSuccess = () => {
        setIsModalOpen(false);
        setSelectedAnnonce(null);
        // Optionally, refresh data or give user feedback
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Trouver un transport pour votre colis</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="lieuDepart">Ville de départ</label>
                        <input type="text" name="lieuDepart" id="lieuDepart" value={filters.lieuDepart} onChange={handleFilterChange} placeholder="Ex: Paris" />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="destinationFinale">Ville d'arrivée</label>
                        <input type="text" name="destinationFinale" id="destinationFinale" value={filters.destinationFinale} onChange={handleFilterChange} placeholder="Ex: Lyon" />
                    </div>
                     <div className="md:col-span-1">
                        <label htmlFor="dateDepart">Date de départ</label>
                        <input type="date" name="dateDepart" id="dateDepart" value={filters.dateDepart} onChange={handleFilterChange} />
                    </div>
                    <div className="md:col-span-1">
                         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center">
                            <Search className="h-5 w-5 mr-2" />
                            Rechercher
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <p>Recherche en cours...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {annonces.length > 0 ? annonces.map((annonce) => (
                        <div key={annonce._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                           <div className="p-6">
                               <div className="flex items-center mb-2">
                                   <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                                   <h2 className="text-xl font-bold">{annonce.lieuDepart} → {annonce.destinationFinale}</h2>
                               </div>
                               <p className="text-gray-600 flex items-center mb-2"><Calendar className="h-4 w-4 mr-2" /> Le {new Date(annonce.dateDepart).toLocaleDateString()}</p>
                               <p className="text-gray-600 flex items-center mb-4"><Box className="h-4 w-4 mr-2" /> Espace disponible: {annonce.espaceDisponible}</p>
                               <div className="border-t pt-4">
                                   <p className="text-sm">Conducteur: {annonce.conducteur.prenom} {annonce.conducteur.nom}</p>
                                   <button onClick={() => openDemandeModal(annonce)} className="w-full mt-4 bg-green-500 text-white py-2 rounded-md">
                                       Faire une demande
                                   </button>
                               </div>
                           </div>
                        </div>
                    )) : <p>Aucune annonce ne correspond à votre recherche.</p>}
                </div>
            )}

            {selectedAnnonce && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Faire une demande de transport">
                    <DemandeForm annonceId={selectedAnnonce._id} onDemandeSuccess={onDemandeSuccess} />
                </Modal>
            )}
        </div>
    );
};

export default RechercheAnnonces;
