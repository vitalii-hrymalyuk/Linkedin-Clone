import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';
import { Toaster } from 'react-hot-toast';
import { useAuthUser } from './hooks/useProfile';
import NotificationsPage from './pages/NotificationsPage';
import NetworkPage from './pages/NetworkPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { authUser, isLoading } = useAuthUser();

  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
        />
        <Route
          path="/notifications"
          element={
            authUser ? <NotificationsPage /> : <Navigate to={'/login'} />
          }
        />
        <Route
          path="/network"
          element={authUser ? <NetworkPage /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
