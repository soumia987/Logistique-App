import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, 
  Package, 
  Users, 
  TrendingUp, 
  Calendar,
  MapPin,
  Clock,
  Star
} from 'lucide-react';
import { annoncesAPI, demandesAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    annonces: 0,
    demandes: 0,
    demandesRecues: 0,
    demandesEnvoyees: 0,
  });
  const [recentAnnonces, setRecentAnnonces] = useState([]);
  const [recentDemandes, setRecentDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (user.role === 'conducteur') {
          // Fetch conducteur data
          const [annoncesRes, demandesRes] = await Promise.all([
            annoncesAPI.getMyAnnonces(),
            demandesAPI.getReceived()
          ]);

          setStats({
            annonces: annoncesRes.data.count || 0,
            demandes: demandesRes.data.count || 0,
            demandesRecues: demandesRes.data.count || 0,
            demandesEnvoyees: 0,
          });

          setRecentAnnonces(annoncesRes.data.annonces?.slice(0, 3) || []);
          setRecentDemandes(demandesRes.data.demandes?.slice(0, 3) || []);
        } else if (user.role === 'expediteur') {
          // Fetch expediteur data
          const [annoncesRes, demandesRes] = await Promise.all([
            annoncesAPI.getAll({ limit: 5 }),
            demandesAPI.getSent()
          ]);

          setStats({
            annonces: annoncesRes.data.count || 0,
            demandes: demandesRes.data.count || 0,
            demandesRecues: 0,
            demandesEnvoyees: demandesRes.data.count || 0,
          });

          setRecentAnnonces(annoncesRes.data.annonces?.slice(0, 3) || []);
          setRecentDemandes(demandesRes.data.demandes?.slice(0, 3) || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) greeting = 'Bonjour';
    else if (hour < 18) greeting = 'Bon après-midi';
    else greeting = 'Bonsoir';

    return `${greeting}, ${user.prenom} !`;
  };

  const getRoleSpecificContent = () => {
    if (user.role === 'conducteur') {
      return {
        title: 'Tableau de bord Conducteur',
        description: 'Gérez vos annonces et demandes reçues',
        stats: [
          {
            title: 'Mes Annonces',
            value: stats.annonces,
            icon: Truck,
            color: 'bg-blue-500',
            link: '/conducteur/annonces'
          },
          {
            title: 'Demandes Reçues',
            value: stats.demandesRecues,
            icon: Package,
            color: 'bg-green-500',
            link: '/conducteur/demandes'
          }
        ]
      };
    } else if (user.role === 'expediteur') {
      return {
        title: 'Tableau de bord Expéditeur',
        description: 'Trouvez des trajets et suivez vos demandes',
        stats: [
          {
            title: 'Annonces Disponibles',
            value: stats.annonces,
            icon: Truck,
            color: 'bg-blue-500',
            link: '/expediteur/recherche'
          },
          {
            title: 'Mes Demandes',
            value: stats.demandesEnvoyees,
            icon: Package,
            color: 'bg-green-500',
            link: '/expediteur/demandes'
          }
        ]
      };
    }
    return null;
  };

  const content = getRoleSpecificContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="mt-2 text-gray-600">{content?.description}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {content?.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = stat.link}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Annonces */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user.role === 'conducteur' ? 'Mes Annonces Récentes' : 'Annonces Récentes'}
            </h3>
            {recentAnnonces.length > 0 ? (
              <div className="space-y-4">
                {recentAnnonces.map((annonce) => (
                  <div key={annonce._id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {annonce.lieuDepart} → {annonce.destinationFinale}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(annonce.dateDepart).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        annonce.statut === 'active' ? 'bg-green-100 text-green-800' :
                        annonce.statut === 'complete' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {annonce.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {user.role === 'conducteur' ? 'Aucune annonce créée' : 'Aucune annonce disponible'}
              </p>
            )}
          </div>

          {/* Recent Demandes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user.role === 'conducteur' ? 'Demandes Reçues' : 'Mes Demandes'}
            </h3>
            {recentDemandes.length > 0 ? (
              <div className="space-y-4">
                {recentDemandes.map((demande) => (
                  <div key={demande._id} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {demande.detailsColis?.type} - {demande.detailsColis?.poids}kg
                        </p>
                        <p className="text-sm text-gray-600">
                          {demande.adresseEnlevement} → {demande.adresseLivraison}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        demande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                        demande.statut === 'acceptee' ? 'bg-green-100 text-green-800' :
                        demande.statut === 'refusee' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {demande.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {user.role === 'conducteur' ? 'Aucune demande reçue' : 'Aucune demande envoyée'}
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.role === 'conducteur' ? (
              <>
                <button
                  onClick={() => window.location.href = '/conducteur/annonces/create'}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Truck className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-700">Créer une annonce</span>
                </button>
                <button
                  onClick={() => window.location.href = '/conducteur/demandes'}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <Package className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-700">Voir les demandes</span>
                </button>
                <button
                  onClick={() => window.location.href = '/conducteur/historique'}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-700">Historique</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => window.location.href = '/expediteur/recherche'}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Truck className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-700">Rechercher un trajet</span>
                </button>
                <button
                  onClick={() => window.location.href = '/expediteur/demandes'}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <Package className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-700">Mes demandes</span>
                </button>
                <button
                  onClick={() => window.location.href = '/expediteur/historique'}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-700">Historique</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
