import React, { useState, useEffect } from 'react';
import { evaluationsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                />
            ))}
        </div>
    );
};


const EvaluationDisplay = ({ userId }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                setLoading(true);
                const response = await evaluationsAPI.getUserEvaluations(userId);
                setEvaluations(response.data.evaluations);
                setAverageRating(response.data.averageRating);
            } catch (error) {
                toast.error("Erreur lors de la récupération des évaluations.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchEvaluations();
        }
    }, [userId]);

    if (loading) return <p>Chargement des évaluations...</p>;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Évaluations Reçues</h2>
            <div className="flex items-center mb-4">
                <span className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                <StarRating rating={averageRating} />
                <span className="ml-2 text-gray-600">({evaluations.length} évaluations)</span>
            </div>

            <div className="space-y-4">
                {evaluations.length > 0 ? (
                    evaluations.map((evaluation) => (
                        <div key={evaluation._id} className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{evaluation.evaluateur.prenom} {evaluation.evaluateur.nom}</p>
                                <StarRating rating={evaluation.note} />
                            </div>
                            <p className="text-gray-600 mt-1">{evaluation.commentaire}</p>
                             <p className="text-xs text-gray-400 mt-1">Le {new Date(evaluation.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>Cet utilisateur n'a pas encore d'évaluation.</p>
                )}
            </div>
        </div>
    );
};

export default EvaluationDisplay;
