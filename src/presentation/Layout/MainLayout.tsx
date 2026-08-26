import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full min-w-0 flex flex-col overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 min-w-0 w-full container mx-auto py-4 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}
