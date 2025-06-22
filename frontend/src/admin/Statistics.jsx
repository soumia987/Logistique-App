import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await adminAPI.getStats();
                setStats(response.data);
            } catch (error) {
                toast.error("Erreur lors de la récupération des statistiques.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p>Chargement des statistiques...</p>;
    if (!stats) return <p>Aucune statistique à afficher.</p>;
    
    const userRolesData = {
        labels: ['Conducteurs', 'Expéditeurs'],
        datasets: [
            {
                label: 'Répartition des rôles',
                data: [stats.userRoles.conducteur, stats.userRoles.expediteur],
                backgroundColor: ['#36A2EB', '#FFCE56'],
            },
        ],
    };
    
    const annoncesStatusData = {
        labels: ['Actives', 'Terminées', 'Annulées'],
         datasets: [
            {
                label: 'Statut des annonces',
                data: [stats.annonceStatus.active, stats.annonceStatus.complete, stats.annonceStatus.cancelled],
                backgroundColor: ['#4BC0C0', '#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Statistiques de la plateforme</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-600">Utilisateurs Totaux</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-600">Annonces Totales</h3>
                    <p className="text-3xl font-bold">{stats.totalAnnonces}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-600">Demandes Totales</h3>
                    <p className="text-3xl font-bold">{stats.totalDemandes}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-600">Évaluations Totales</h3>
                    <p className="text-3xl font-bold">{stats.totalEvaluations}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-bold mb-4">Répartition des utilisateurs</h3>
                     <Pie data={userRolesData} />
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-bold mb-4">Statut des annonces</h3>
                     <Bar data={annoncesStatusData} />
                 </div>
            </div>
        </div>
    );
};

export default Statistics;
