import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { evaluationsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

const EvaluationForm = ({ evaluatedId, onEvaluationSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const formik = useFormik({
        initialValues: {
            note: 0,
            commentaire: '',
        },
        validationSchema: Yup.object({
            note: Yup.number().min(1, 'La note est requise').max(5).required('La note est requise'),
            commentaire: Yup.string().required('Le commentaire est requis'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await evaluationsAPI.create({ ...values, evaluated: evaluatedId });
                toast.success('Évaluation soumise avec succès !');
                if (onEvaluationSuccess) {
                    onEvaluationSuccess();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Une erreur s'est produite.");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
                <label>Note</label>
                <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={ratingValue} onMouseEnter={() => setHoverRating(ratingValue)} onMouseLeave={() => setHoverRating(0)}>
                                <input type="radio" name="note" value={ratingValue} onClick={() => formik.setFieldValue('note', ratingValue)} className="hidden" />
                                <Star
                                    className={`h-8 w-8 cursor-pointer ${ratingValue <= (hoverRating || formik.values.note) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                />
                            </label>
                        );
                    })}
                </div>
                {formik.touched.note && formik.errors.note ? (
                    <div className="text-red-500 text-sm">{formik.errors.note}</div>
                ) : null}
            </div>
            
            <div>
                <label htmlFor="commentaire">Commentaire</label>
                <textarea
                    id="commentaire"
                    name="commentaire"
                    rows="4"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.commentaire}
                    className="w-full"
                />
                {formik.touched.commentaire && formik.errors.commentaire ? (
                    <div className="text-red-500 text-sm">{formik.errors.commentaire}</div>
                ) : null}
            </div>

            <button type="submit" disabled={isSubmitting || !formik.isValid} className="w-full bg-blue-600 text-white py-2 rounded-md">
                {isSubmitting ? 'Envoi...' : 'Envoyer mon évaluation'}
            </button>
        </form>
    );
};

export default EvaluationForm;
