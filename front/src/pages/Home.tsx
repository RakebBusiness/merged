import { BookOpen, Users, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import StatsSection from "../components/StatsSection";
import { useState, useEffect } from "react";

interface Feedback {
  id: string;
  name: string;
  email: string | null;
  message: string;
  rating: number | null;
  created_at: string;
}

export default function Home() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:5000/feedback/approved');
        if (response.ok) {
          const data = await response.json();
          setFeedback(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch feedback:', err);
      }
    };

    fetchFeedback();
  }, []);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative pb-32 pt-20 bg-gradient-to-br from-blue-100 via-white to-green-200 overflow-hidden">
        {/* Gradient background bubbles */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Maîtrisez l'Algorithmique en{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent animate-gradient">
                Langage C
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Apprenez l’algorithmique et le langage C via des cours
              interactifs, des exercices progressifs et une plateforme moderne.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Commencer les cours</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/exercises"
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold 
             transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
             hover:bg-green-600 hover:text-white hover:border-green-800"
              >
                Explorer les Exercices
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* WHY SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pourquoi choisir AlgoMaster ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* CARD 1 */}
            <div className="bg-blue-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Cours structurés
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Une progression logique d’Algo1 à Algo2 pour maîtriser les bases
                jusqu’aux structures avancées.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-green-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Pratique intensive
              </h3>
              <p className="text-gray-600 leading-relaxed">
                QCM, quiz, exercices guidés, challenges en C : tout pour bien
                pratiquer.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-orange-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Suivi intelligent
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Statistiques, progression, badges, scores et système de
                motivation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      {feedback.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ce que disent nos utilisateurs
              </h2>
              <p className="text-lg text-gray-600 mt-4">
                Découvrez les témoignages de ceux qui ont appris avec AlgoMaster
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                    </div>
                    {renderStars(item.rating)}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à maîtriser l'algorithmique ?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Rejoignez des milliers d'étudiants qui réussissent grâce à
            AlgoMaster.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <span>Commencer maintenant</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
