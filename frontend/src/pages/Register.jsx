// ==================== COMPOSANT REGISTER ====================

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { confirmPassword, acceptTerms, ...userData } = data;
      await registerUser(userData);
      toast.success('Inscription réussie ! Vérifiez votre email.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Section gauche - Invitation à la connexion */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-800 text-white">
        <div className="max-w-md w-full text-center space-y-6">
          <h3 className="text-2xl font-bold">Already have an account?</h3>
          <p className="text-gray-300">
            Connectez-vous pour accéder à votre espace TransportConnect
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 px-6 border border-white text-white hover:bg-white hover:text-gray-800 transition-colors font-medium"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Section droite - Formulaire d'inscription */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">REGISTER</h2>
            <p className="text-sm text-gray-600">
              Créez votre compte TransportConnect
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  {...register('nom')}
                  type="text"
                  className={`appearance-none relative block w-full px-3 py-3 border ${
                    errors.nom ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                  placeholder="Nom"
                />
                {errors.nom && (
                  <p className="mt-1 text-xs text-red-600">{errors.nom.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('prenom')}
                  type="text"
                  className={`appearance-none relative block w-full px-3 py-3 border ${
                    errors.prenom ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                  placeholder="Prénom"
                />
                {errors.prenom && (
                  <p className="mt-1 text-xs text-red-600">{errors.prenom.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                {...register('email')}
                type="email"
                className={`appearance-none relative block w-full px-3 py-3 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <input
                {...register('telephone')}
                type="tel"
                className={`appearance-none relative block w-full px-3 py-3 border ${
                  errors.telephone ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                placeholder="Téléphone"
              />
              {errors.telephone && (
                <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
              )}
            </div>

            {/* Rôle */}
            <div>
              <select
                {...register('role')}
                className={`appearance-none relative block w-full px-3 py-3 border ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
              >
                <option value="">Sélectionnez votre rôle</option>
                <option value="conducteur">Conducteur</option>
                <option value="expediteur">Expéditeur</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`appearance-none relative block w-full pl-3 pr-10 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`appearance-none relative block w-full pl-3 pr-10 py-3 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                  placeholder="Confirmer le mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Acceptation des conditions */}
            <div className="flex items-center">
              <input
                {...register('acceptTerms')}
                type="checkbox"
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                J'accepte les{' '}
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  conditions d'utilisation
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
            )}

            {/* Bouton d'inscription */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'REGISTER'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { Login, Register };