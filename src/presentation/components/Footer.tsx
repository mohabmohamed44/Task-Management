import { Link } from "react-router";
import { Github, Facebook, Linkedin } from "lucide-react";
import { Button } from "./Button";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <Link to="/">
                <Button className="text-gray-100 text-3xl font-bold" variant="link"> Prioritize.</Button>
            </Link>
            <p className="mt-2 text-gray-300">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>

          <div className="flex justify-center">
            <nav className="flex flex-wrap justify-center gap-6 text-lg">
              <Link to="/statistics" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/tasks" className="text-gray-300 hover:text-white transition-colors">Tasks</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
              <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">Settings</Link>
            </nav>
          </div>

          <div className="flex justify-center md:justify-end gap-4">
            <a
              href="https://github.com/mohabmohamed44"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-white hover:text-gray-800 transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:bg-blue-700 hover:text-white transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}