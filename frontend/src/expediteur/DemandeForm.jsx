import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { demandesAPI } from '../services/api';
import toast from 'react-hot-toast';

const DemandeForm = ({ annonceId, onDemandeSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            message: '',
            poidsColis: '',
            dimensions: {
                longueur: '',
                largeur: '',
                hauteur: ''
            },
        },
        validationSchema: Yup.object({
            message: Yup.string().required('Le message est requis'),
            poidsColis: Yup.number().required('Le poids est requis').positive('Le poids doit être positif'),
            dimensions: Yup.object({
                longueur: Yup.number().required('La longueur est requise').positive('La longueur doit être positive'),
                largeur: Yup.number().required('La largeur est requise').positive('La largeur doit être positive'),
                hauteur: Yup.number().required('La hauteur est requise').positive('La hauteur doit être positive'),
            }),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await demandesAPI.create({ ...values, annonce: annonceId });
                toast.success('Votre demande a été envoyée avec succès !');
                if (onDemandeSuccess) {
                    onDemandeSuccess();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Une erreur s'est produite lors de l'envoi de la demande.");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="message">Message pour le conducteur</label>
                <textarea
                    id="message"
                    name="message"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    rows="4"
                    className="w-full"
                />
                {formik.touched.message && formik.errors.message ? (
                    <div className="text-red-500 text-sm">{formik.errors.message}</div>
                ) : null}
            </div>

            <div>
                <label htmlFor="poidsColis">Poids du colis (en kg)</label>
                <input
                    id="poidsColis"
                    name="poidsColis"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.poidsColis}
                     className="w-full"
                />
                {formik.touched.poidsColis && formik.errors.poidsColis ? (
                    <div className="text-red-500 text-sm">{formik.errors.poidsColis}</div>
                ) : null}
            </div>

            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium">Dimensions (en cm)</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="longueur">Longueur</label>
                        <input id="longueur" name="dimensions.longueur" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.dimensions.longueur} />
                        {formik.touched.dimensions?.longueur && formik.errors.dimensions?.longueur ? <div className="text-red-500 text-sm">{formik.errors.dimensions.longueur}</div> : null}
                    </div>
                     <div>
                        <label htmlFor="largeur">Largeur</label>
                        <input id="largeur" name="dimensions.largeur" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.dimensions.largeur} />
                         {formik.touched.dimensions?.largeur && formik.errors.dimensions?.largeur ? <div className="text-red-500 text-sm">{formik.errors.dimensions.largeur}</div> : null}
                    </div>
                     <div>
                        <label htmlFor="hauteur">Hauteur</label>
                        <input id="hauteur" name="dimensions.hauteur" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.dimensions.hauteur} />
                         {formik.touched.dimensions?.hauteur && formik.errors.dimensions?.hauteur ? <div className="text-red-500 text-sm">{formik.errors.dimensions.hauteur}</div> : null}
                    </div>
                </div>
            </fieldset>

            <button type="submit" disabled={isSubmitting || !formik.isValid} className="w-full bg-blue-600 text-white py-2 rounded-md">
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
        </form>
    );
};

export default DemandeForm;
