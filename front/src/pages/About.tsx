import { useState } from 'react';
import { BookOpen, Target, Users, Send } from 'lucide-react';

export default function About() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About AlgoMaster
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive platform for mastering algorithmics and C programming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide accessible, high-quality algorithmic education that empowers students to
              excel in computer science.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Approach</h3>
            <p className="text-gray-600 leading-relaxed">
              Interactive learning combined with practical exercises to build strong foundational
              skills in algorithmics and C programming.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Join thousands of students and educators using AlgoMaster to achieve their learning
              goals and teaching objectives.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Comprehensive Courses</h4>
                <p className="text-gray-600 text-sm">
                  Structured curriculum covering Algo1 and Algo2 topics with detailed explanations
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Interactive Exercises</h4>
                <p className="text-gray-600 text-sm">
                  Multiple choice questions, text answers, and code challenges to test your skills
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Progress Tracking</h4>
                <p className="text-gray-600 text-sm">
                  Monitor your learning journey with detailed analytics and statistics
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Real Code Examples</h4>
                <p className="text-gray-600 text-sm">
                  Learn from practical, well-documented code examples for every concept
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Achievement System</h4>
                <p className="text-gray-600 text-sm">
                  Earn badges and achievements as you progress through courses and exercises
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Beginner Friendly</h4>
                <p className="text-gray-600 text-sm">
                  Designed specifically for first-year students with clear, step-by-step guidance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center space-x-2">
                <span className="text-xl">✓</span>
                <span className="font-medium">Thank you! Your message has been sent.</span>
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
