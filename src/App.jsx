
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"

import Layout from "./components/Layout.jsx";
import Home from './components/pages/Home';
import { fetchCryptosAPI } from '../api';

import './App.css'
import About from "./components/pages/About.jsx";
import News from "./components/pages/news/News.jsx";
import NewsShow from "./components/pages/news/NewsShow.jsx";
import Login from "./components/pages/auth/Login.jsx";
import Register from "./components/pages/auth/Register.jsx";


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path = "/" element= {<Layout />}>
        <Route index element={<Home />}  />
        <Route path="about" element={<About />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsShow />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

    </Route>
  ));
  return (
     <RouterProvider router={router} />
  )
}

export default App
