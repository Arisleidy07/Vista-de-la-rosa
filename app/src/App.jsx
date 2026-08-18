import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import "./config/firebase.js";

const HomePage = lazy(() => import("./components/pages/HomePage.jsx"));
const VillasPage = lazy(() => import("./components/pages/VillasPage.jsx"));
const ServicesPage = lazy(() => import("./components/pages/ServicesPage.jsx"));
const UbicacionPage = lazy(
  () => import("./components/pages/UbicacionPage.jsx"),
);
const ContactPage = lazy(() => import("./components/pages/ContactPage.jsx"));

function PageLoader() {
  return (
    <div className="page-loader" aria-live="polite">
      <div className="page-loader-spinner" />
      <span className="sr-only">Cargando página...</span>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/villas" element={<VillasPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/ubicacion" element={<UbicacionPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
