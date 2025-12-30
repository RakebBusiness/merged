import { Code2, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">AlgoMaster</span>
            </div>
            <p className="text-sm text-gray-400">
              Master algorithmics in C with interactive courses and exercises.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm hover:text-blue-400 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/exercises" className="text-sm hover:text-blue-400 transition-colors">
                  Exercises
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-sm hover:text-blue-400 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AlgoMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
