import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/Scroll/ScrollToTop"; // Corrigé le chemin
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Exercises from "./pages/Exercises";
import ExerciseDetail from "./pages/ExerciseDetail";
import Profile from "./pages/Profile";
import ProfilEnseignant from "./pages/ProfilEnseignant";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PanelEns from "./pages/ens-panel/PanelEns";
import AdminPanel from "./pages/admin-panel/AdminPanel";

function AppContent() {
  const location = useLocation();

  // Routes sans layout (Header/Footer)
  const noLayoutRoutes = ["/login", "/signup", "/panelens", "/adminpanel"];
  const pathname = location.pathname.toLowerCase();
  const hideLayout = noLayoutRoutes.includes(pathname);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* ScrollToTop */}
      <ScrollToTop />

      {/* Header */}
      {!hideLayout && <Header />}

      {/* Main content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute requireAuth>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/exercises" element={<Exercises />} />
          <Route
            path="/exercises/:id"
            element={
              <ProtectedRoute requireAuth>
                <ExerciseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireAuth>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/profil-ens/:id" element={<ProfilEnseignant />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/panelens"
            element={
              <ProtectedRoute requireTeacher>
                <PanelEns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminpanel" 
            element={
              <ProtectedRoute requireAdmin>
                  <AdminPanel/>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
