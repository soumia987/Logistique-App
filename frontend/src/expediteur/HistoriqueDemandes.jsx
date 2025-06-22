import React, { useState, useEffect } from 'react';
import { demandesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const HistoriqueDemandes = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDemandesEnvoyees = async () => {
            try {
                setLoading(true);
                const response = await demandesAPI.getSent();
                setDemandes(response.data);
            } catch (error) {
                toast.error("Erreur lors de la récupération de l'historique des demandes.");
            } finally {
                setLoading(false);
            }
        };

        fetchDemandesEnvoyees();
    }, []);

    if (loading) return <p>Chargement de l'historique...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Historique de mes demandes</h1>
            {demandes.length === 0 ? (
                <p>Vous n'avez envoyé aucune demande pour le moment.</p>
            ) : (
                <div className="space-y-4">
                    {demandes.map((demande) => (
                        <div key={demande._id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg">
                                        Annonce: 
                                        <Link to={`/annonces/${demande.annonce?._id}`} className="text-blue-600 hover:underline ml-2">
                                            {demande.annonce?.lieuDepart} - {demande.annonce?.destinationFinale}
                                        </Link>
                                    </p>
                                    <p className="text-gray-600">Conducteur: {demande.annonce?.conducteur?.prenom} {demande.annonce?.conducteur?.nom}</p>
                                    <p className="text-sm text-gray-500 mt-2">Envoyée le: {new Date(demande.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold text-lg ${
                                        demande.statut === 'acceptée' ? 'text-green-600' : 
                                        demande.statut === 'refusée' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                                        {demande.statut.charAt(0).toUpperCase() + demande.statut.slice(1)}
                                    </p>
                                    {demande.statut === 'refusée' && demande.raisonRefus && (
                                        <p className="text-sm text-gray-500 mt-1">Raison: {demande.raisonRefus}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoriqueDemandes;
