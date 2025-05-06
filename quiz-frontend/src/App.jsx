import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllQuizzes from './pages/AllQuizzes';
import Login from './pages/Login';
import Register from './pages/Register';
import MyQuizzes from './pages/MyQuizzes';
import ViewQuiz from './pages/ViewQuiz';
import EditQuiz from './pages/EditQuiz';
import CreateQuiz from './pages/CreateQuiz';
import AttemptQuiz from './pages/AttemptQuiz';
import GlobalLeaderboard from './pages/GlobalLeaderboard';
import QuizLeaderboard from './pages/QuizLeaderboard';
import MyAttempts from './pages/MyAttempts';
import Search from './pages/Search';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizzes" element={<AllQuizzes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-quizzes" element={<MyQuizzes />} />
          <Route path="/quiz/:id" element={<ViewQuiz />} />
          <Route path="/quiz/:id/edit" element={<EditQuiz />} />
          <Route path="/quiz/create" element={<CreateQuiz />} />
          <Route path="/quiz/:id/start" element={<AttemptQuiz />} />
          <Route path="/leaderboard" element={<GlobalLeaderboard />} />
          <Route path="/leaderboard/:quizId" element={<QuizLeaderboard />} />
          <Route path="/my-attempts" element={<MyAttempts />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />

  
          {/* More pages will come */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;