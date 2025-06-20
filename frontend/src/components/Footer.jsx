import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">TransportConnect</h3>
            <p className="text-gray-300 mb-4">
              Plateforme intelligente de mise en relation entre conducteurs et expéditeurs pour un transport optimisé.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Accueil</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Annonces</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Demandes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">À propos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Mentions légales</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Confidentialité</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">CGU</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">
              Abonnez-vous pour recevoir les dernières annonces et conseils logistiques.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="px-3 py-2 text-gray-800 rounded-l focus:outline-none w-full"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} TransportConnect. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
