import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { annoncesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Clock, Box, Plus, Save, ArrowLeft } from 'lucide-react';

const schema = yup.object({
  lieuDepart: yup.string().required('Le lieu de départ est requis'),
  destinationFinale: yup.string().required('La destination finale est requise'),
  dateDepart: yup.string().required('La date de départ est requise'),
  heureDepart: yup.string().required('L\'heure de départ est requise'),
  capaciteDisponible: yup.number().typeError('La capacité doit être un nombre').positive('La capacité doit être positive').required('La capacité disponible est requise'),
  prix: yup.number().typeError('Le prix doit être un nombre').positive('Le prix doit être positif').required('Le prix est requis'),
  typeMarchandise: yup.string().required('Le type de marchandise est requis'),
  longueur: yup.number().typeError('La longueur doit être un nombre').optional(),
  largeur: yup.number().typeError('La largeur doit être un nombre').optional(),
  hauteur: yup.number().typeError('La hauteur doit être un nombre').optional(),
  instructions: yup.string().optional(),
}).required();

const AnnonceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchAnnonce = async () => {
        try {
          setLoading(true);
          const response = await annoncesAPI.getById(id);
          const annonce = response.data.annonce;
          
          // Populate form fields
          Object.keys(annonce).forEach(key => {
            if (key === 'dimensionsMax') {
              setValue('longueur', annonce.dimensionsMax?.longueur);
              setValue('largeur', annonce.dimensionsMax?.largeur);
              setValue('hauteur', annonce.dimensionsMax?.hauteur);
            } else if (key === 'dateDepart') {
              setValue(key, new Date(annonce[key]).toISOString().split('T')[0]);
            } else {
              setValue(key, annonce[key]);
            }
          });
        } catch (error) {
          toast.error('Erreur lors de la récupération de l\'annonce');
          navigate('/conducteur/annonces');
        } finally {
          setLoading(false);
        }
      };
      fetchAnnonce();
    }
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const annonceData = {
        ...data,
        dimensionsMax: {
          longueur: data.longueur,
          largeur: data.largeur,
          hauteur: data.hauteur,
        }
      };
      
      let response;
      if (isEditMode) {
        response = await annoncesAPI.update(id, annonceData);
        toast.success('Annonce mise à jour avec succès');
      } else {
        response = await annoncesAPI.create(annonceData);
        toast.success('Annonce créée avec succès');
      }
      
      navigate('/conducteur/annonces');
    } catch (error) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/conducteur/annonces')} 
          className="inline-flex items-center mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isEditMode ? 'Modifier l\'annonce' : 'Créer une nouvelle annonce'}
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Trajet */}
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-medium text-gray-700">Trajet</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="lieuDepart" className="block text-sm font-medium text-gray-700">Lieu de départ</label>
                  <div className="mt-1 relative">
                    <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    <input {...register('lieuDepart')} type="text" className="pl-10 w-full" />
                  </div>
                  {errors.lieuDepart && <p className="text-red-600 text-sm mt-1">{errors.lieuDepart.message}</p>}
                </div>
                <div>
                  <label htmlFor="destinationFinale" className="block text-sm font-medium text-gray-700">Destination finale</label>
                  <div className="mt-1 relative">
                    <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    <input {...register('destinationFinale')} type="text" className="pl-10 w-full" />
                  </div>
                  {errors.destinationFinale && <p className="text-red-600 text-sm mt-1">{errors.destinationFinale.message}</p>}
                </div>
                <div>
                  <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700">Date de départ</label>
                  <div className="mt-1 relative">
                    <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    <input {...register('dateDepart')} type="date" className="pl-10 w-full" />
                  </div>
                  {errors.dateDepart && <p className="text-red-600 text-sm mt-1">{errors.dateDepart.message}</p>}
                </div>
                <div>
                  <label htmlFor="heureDepart" className="block text-sm font-medium text-gray-700">Heure de départ</label>
                  <div className="mt-1 relative">
                    <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    <input {...register('heureDepart')} type="time" className="pl-10 w-full" />
                  </div>
                  {errors.heureDepart && <p className="text-red-600 text-sm mt-1">{errors.heureDepart.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* Marchandise */}
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-medium text-gray-700">Marchandise</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="typeMarchandise" className="block text-sm font-medium text-gray-700">Type de marchandise</label>
                  <div className="mt-1 relative">
                    <Box className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    <select {...register('typeMarchandise')} className="pl-10 w-full">
                      <option value="">Sélectionner un type</option>
                      <option value="fragile">Fragile</option>
                      <option value="liquide">Liquide</option>
                      <option value="alimentaire">Alimentaire</option>
                      <option value="electronique">Électronique</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  {errors.typeMarchandise && <p className="text-red-600 text-sm mt-1">{errors.typeMarchandise.message}</p>}
                </div>
                <div>
                  <label htmlFor="capaciteDisponible" className="block text-sm font-medium text-gray-700">Capacité disponible (kg)</label>
                  <input {...register('capaciteDisponible')} type="number" step="0.1" />
                  {errors.capaciteDisponible && <p className="text-red-600 text-sm mt-1">{errors.capaciteDisponible.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Dimensions maximales (cm)</label>
                  <div className="grid grid-cols-3 gap-4 mt-1">
                    <input {...register('longueur')} type="number" placeholder="Longueur" />
                    <input {...register('largeur')} type="number" placeholder="Largeur" />
                    <input {...register('hauteur')} type="number" placeholder="Hauteur" />
                  </div>
                  {errors.longueur && <p className="text-red-600 text-sm mt-1">{errors.longueur.message}</p>}
                  {errors.largeur && <p className="text-red-600 text-sm mt-1">{errors.largeur.message}</p>}
                  {errors.hauteur && <p className="text-red-600 text-sm mt-1">{errors.hauteur.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* Tarification */}
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="px-2 font-medium text-gray-700">Tarification et Instructions</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="prix" className="block text-sm font-medium text-gray-700">Prix (€/kg)</label>
                  <input {...register('prix')} type="number" step="0.01" />
                  {errors.prix && <p className="text-red-600 text-sm mt-1">{errors.prix.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions spéciales</label>
                  <textarea {...register('instructions')} rows="3" placeholder="Ex: Marchandise fragile, à garder au frais..."></textarea>
                  {errors.instructions && <p className="text-red-600 text-sm mt-1">{errors.instructions.message}</p>}
                </div>
              </div>
            </fieldset>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sauvegarde...' : (isEditMode ? <><Save className="h-4 w-4 mr-2" /> Mettre à jour</> : <><Plus className="h-4 w-4 mr-2" /> Publier</>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnonceForm;
