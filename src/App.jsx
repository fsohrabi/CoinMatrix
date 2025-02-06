
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
import Dashboard,{loader as newsLoader} from "./components/pages/admin/Dashboard.jsx";
import AddNews from "./components/pages/admin/AddNews.jsx";
import EditNews from "./components/pages/admin/EditNews.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

function App() {
  const router = createBrowserRouter(createRoutesFromElements(

      <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsShow />} />

          {/* Guest-only routes */}
          <Route element={<GuestRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" action={RegisterAction} element={<Register />} />
          </Route>

          {/* Protected admin routes */}
          <Route path="/admin/*" element={<ProtectedRoute />}>
              <Route index loader={newsLoader} element={<Dashboard />} />
              <Route path="news/add" element={<AddNews />} />
              <Route path="news/edit/:id" element={<EditNews />} />
          </Route>
      </Route>


  ));
  return (
      <AuthProvider>
     <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App
