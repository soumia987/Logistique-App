import React, { useState, useEffect } from 'react';
import { demandesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Check, X, Info } from 'lucide-react';

const DemandesRecues = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDemandes = async () => {
        try {
            setLoading(true);
            const response = await demandesAPI.getReceived();
            setDemandes(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des demandes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemandes();
    }, []);

    const handleUpdateStatus = async (id, statut, raison = '') => {
        try {
            await demandesAPI.updateStatus(id, statut, raison);
            toast.success(`Demande ${statut === 'acceptée' ? 'acceptée' : 'refusée'}.`);
            fetchDemandes(); // Refresh the list
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la demande.");
        }
    };
    
    const handleRefus = (id) => {
        const raison = prompt("Veuillez indiquer la raison du refus :");
        if (raison) {
            handleUpdateStatus(id, 'refusée', raison);
        } else {
            toast.error("Une raison est requise pour refuser une demande.");
        }
    };

    if (loading) return <p>Chargement des demandes...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Demandes Reçues</h1>
            {demandes.length === 0 ? (
                <p>Vous n'avez aucune demande pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {demandes.map((demande) => (
                        <div key={demande._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg">Annonce: {demande.annonce.lieuDepart} - {demande.annonce.destinationFinale}</p>
                                <p>Expéditeur: {demande.expediteur.prenom} {demande.expediteur.nom}</p>
                                <p className="text-gray-600">Message: "{demande.message}"</p>
                                <p className="text-sm text-gray-500">Statut: <span className={`font-semibold ${
                                    demande.statut === 'acceptée' ? 'text-green-600' : 
                                    demande.statut === 'refusée' ? 'text-red-600' : 'text-yellow-600'}`}>{demande.statut}</span></p>
                            </div>
                           {demande.statut === 'en attente' && (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleUpdateStatus(demande._id, 'acceptée')} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"><Check /></button>
                                    <button onClick={() => handleRefus(demande._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><X /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DemandesRecues;
