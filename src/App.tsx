import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Safaris from "./pages/Safaris";
import DayTrips from "./pages/DayTrips";
import Combo from "./pages/Combo";
import Cultural from "./pages/Cultural";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import PackageDetail from "./pages/PackageDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import QuoteRequests from "./pages/admin/QuoteRequests";
import Packages from "./pages/admin/Packages";
import PackageEdit from "./pages/admin/PackageEdit";
import BlogPosts from "./pages/admin/BlogPosts";
import BlogEdit from "./pages/admin/BlogEdit";
import GalleryAdmin from "./pages/admin/Gallery";
import SiteImages from "./pages/admin/SiteImages";
import Leads from "./pages/admin/Leads";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/safaris", element: <Safaris /> },
      { path: "/day-trips", element: <DayTrips /> },
      { path: "/combo", element: <Combo /> },
      { path: "/cultural", element: <Cultural /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/quote", element: <Quote /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/packages/:slug", element: <PackageDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/admin/login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: <ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "quotes", element: <QuoteRequests /> },
      { path: "leads", element: <Leads /> },
      { path: "packages", element: <Packages /> },
      { path: "packages/:id", element: <PackageEdit /> },
      { path: "blog", element: <BlogPosts /> },
      { path: "blog/:id", element: <BlogEdit /> },
      { path: "gallery", element: <GalleryAdmin /> },
      { path: "site-images", element: <SiteImages /> },
    ],
  },
]);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
