import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";
import SkipLink from "../ui/SkipLink.jsx";

export default function Layout({ children }) {
  return (
    <div className="app">
      <SkipLink />
      <Header />
      <main id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
