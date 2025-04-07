import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import './App.css';
import About from "./components/pages/About.jsx";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton"; // Skeleton loader for lazy-loaded components
import AuthProvider from "./components/contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import { ThemeProvider } from "./components/contexts/ThemeContext";

// Lazy-loaded components
const Home = lazy(() => import('./components/pages/Home'));
const News = lazy(() => import("./components/pages/news/News.jsx"));
const NewsShow = lazy(() => import("./components/pages/news/NewsShow.jsx"));
const Login = lazy(() => import("./components/pages/auth/Login.jsx"));
const Register = lazy(() => import("./components/pages/auth/Register.jsx"));
const UserDashboard = lazy(() => import('./components/pages/user/Dashboard'));
const Dashboard = lazy(() => import("./components/pages/admin/Dashboard.jsx"));
const AddNews = lazy(() => import("./components/pages/admin/AddNews.jsx"));
const EditNews = lazy(() => import("./components/pages/admin/EditNews.jsx"));

// Set up React Query client
const queryClient = new QueryClient();

function App() {
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={
                <Suspense fallback={<Skeleton height={300} />}>
                    <Home />
                </Suspense>
            } />
            <Route path="about" element={<About />} />
            <Route path="news" element={
                <Suspense fallback={<Skeleton height={300} />}>
                    <News />
                </Suspense>
            } />
            <Route path="news/:id" element={
                <Suspense fallback={<Skeleton height={300} />}>
                    <NewsShow />
                </Suspense>
            } />

            {/* Guest-only routes */}
            <Route element={<GuestRoute />}>
                <Route path="login" element={
                    <Suspense fallback={<Skeleton height={300} />}>
                        <Login />
                    </Suspense>
                } />
                <Route path="register" element={
                    <Suspense fallback={<Skeleton height={300} />}>
                        <Register />
                    </Suspense>
                } />
            </Route>

            {/* Protected admin routes */}
            <Route path="/admin/*" element={<ProtectedRoute />}>
                <Route index element={
                    <Suspense fallback={<Skeleton height={300} />}>
                        <Dashboard />
                    </Suspense>
                } />
                <Route path="news/add" element={
                    <Suspense fallback={<Skeleton height={300} />}>
                        <AddNews />
                    </Suspense>
                } />
                <Route path="news/edit/:id" element={
                    <Suspense fallback={<Skeleton height={300} />}>
                        <EditNews />
                    </Suspense>
                } />
            </Route>

            {/* Protected user routes */}
            <Route path="/user/*" element={<ProtectedRoute />}>
                <Route index element={
                    <Suspense fallback={<Skeleton height={300} />}>
                        <UserDashboard />
                    </Suspense>
                } />
            </Route>
        </Route>
    ));

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
