import React, { useState, useEffect } from 'react';
import { annoncesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const HistoriqueTrajets = () => {
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                setLoading(true);
                // Assuming getMyAnnonces fetches all annonces for the logged-in conducteur
                const response = await annoncesAPI.getMyAnnonces();
                setTrajets(response.data);
            } catch (error) {
                toast.error("Erreur lors de la récupération de l'historique des trajets.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistorique();
    }, []);

    if (loading) return <p>Chargement de l'historique...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Historique de mes Trajets</h1>
            {trajets.length === 0 ? (
                <p>Vous n'avez aucun trajet dans votre historique.</p>
            ) : (
                <div className="space-y-4">
                    {trajets.map((trajet) => (
                        <div key={trajet._id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg">
                                        <Link to={`/annonces/${trajet._id}`} className="text-blue-600 hover:underline">
                                            {trajet.lieuDepart} → {trajet.destinationFinale}
                                        </Link>
                                    </p>
                                    <p className="text-gray-600">
                                        Date de départ: {new Date(trajet.dateDepart).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold text-lg ${
                                        trajet.statut === 'terminé' ? 'text-gray-500' :
                                        trajet.statut === 'annulé' ? 'text-red-600' :
                                        'text-green-600'
                                    }`}>
                                        {trajet.statut.charAt(0).toUpperCase() + trajet.statut.slice(1)}
                                    </p>
                                     <p className="text-sm text-gray-500">
                                        {trajet.demandes.filter(d => d.statut === 'acceptée').length} demande(s) acceptée(s)
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoriqueTrajets;
