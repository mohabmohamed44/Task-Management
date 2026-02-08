import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 container mx-auto py-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Scroll to top button */}
      <ScrollToTop/>
    </div>
  );
}
