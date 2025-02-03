
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"

import Layout from "./components/Layout.jsx";
import Home from './components/pages/Home';

import './App.css'
import About from "./components/pages/About.jsx";
import News from "./components/pages/news/News.jsx";
import NewsShow from "./components/pages/news/NewsShow.jsx";
import Login from "./components/pages/auth/Login.jsx";
import Register, {action as RegisterAction} from "./components/pages/auth/Register.jsx";
import AuthProvider from "./components/contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./components/pages/admin/Dashboard.jsx";


function App() {
  const router = createBrowserRouter(createRoutesFromElements(

    <Route path = "/" element= {<Layout />}>
        <Route index element={<Home />}  />
        <Route path="about" element={<About />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsShow />} />
        <Route path="/dashboard/*" element={<ProtectedRoute isAuthenticated={false} />}>
            <Route path="admin" element={<Dashboard />} />
        </Route>
        <Route path="login"   element={<Login />} />
        <Route path="register"  action={RegisterAction}  element={<Register />} />
    </Route>

  ));
  return (
      <AuthProvider>
     <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App
