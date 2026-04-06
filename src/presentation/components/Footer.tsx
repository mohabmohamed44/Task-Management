import { Link, useLocation } from "react-router";
import { Mail, Heart } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa6";
import { Button } from "./Button";

export default function Footer() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Navigation links
  const navLinks = [
    { path: "/statistics", label: "Dashboard" },
    { path: "/tasks", label: "Tasks" },
    { path: "/kanban", label: "Kanban" },
    { path: "/goals", label: "Goals" },
    { path: "/profile", label: "Profile" },
  ];

  // Social links
  const socialLinks = [
    { href: "https://github.com/mohabmohamed44", icon: FaGithub, label: "GitHub", color: "hover:bg-gray-800 hover:text-white" },
    { href: "https://facebook.com", icon: FaFacebook, label: "Facebook", color: "hover:bg-blue-600 hover:text-white" },
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn", color: "hover:bg-blue-700 hover:text-white" },
    { href: "https://twitter.com", icon: FaXTwitter, label: "Twitter", color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" },
  ];

  return (
    <footer 
      role="contentinfo" 
      className="bg-background/80 backdrop-blur text-gray-500 border-t shadow-sm  dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link 
                to="/" 
                aria-label="Prioritize home page"
                className="inline-flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 dark:text-gray-100 font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold text-foreground dark:text-gray-100">Prioritize</span>
              </Link>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                Organize, prioritize, and conquer your tasks with our intuitive platform designed for individuals and teams.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.label} page`}
                    className={`w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-transparent transition-all duration-300 ${social.color}`}
                  >
                    <social.icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links - Column 1 with Input */}
            <div>
              <h3 className="text-sm font-semibold text-foreground dark:text-gray-100 uppercase tracking-wider mb-4">
                Platform
              </h3>
              <ul className="space-y-3 mb-6">
                {navLinks.slice(0, 3).map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`text-sm transition-colors duration-200 ${
                        location.pathname === link.path
                          ? "text-foreground dark:text-gray-100 font-medium"
                          : "text-muted-foreground hover:text-foreground dark:hover:text-gray-200"
                      }`}
                      aria-current={location.pathname === link.path ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter Input */}
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative flex-1 min-w-0">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                    aria-hidden="true" 
                  />
                  <input
                    type="email"
                    placeholder="Subscribe to newsletter"
                    className="w-full pl-10 pr-4 py-2.5 bg-background dark:bg-gray-900 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    aria-label="Email address for newsletter"
                  />
                </div>
                <Button
                  type="submit"
                  role="button"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Navigation Links - Column 2 */}
            <div>
              <h3 className="text-sm font-semibold text-foreground dark:text-gray-100 uppercase tracking-wider mb-4">
                Account
              </h3>
              <ul className="space-y-3">
                {navLinks.slice(3).map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`text-sm transition-colors duration-200 ${
                        location.pathname === link.path
                          ? "text-foreground dark:text-gray-100 font-medium"
                          : "text-muted-foreground hover:text-foreground dark:hover:text-gray-200"
                      }`}
                      aria-current={location.pathname === link.path ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/settings"
                    className={`text-sm transition-colors duration-200 ${
                      location.pathname === "/settings"
                        ? "text-foreground dark:text-gray-100 font-medium"
                        : "text-muted-foreground hover:text-foreground dark:hover:text-gray-200"
                    }`}
                    aria-current={location.pathname === "/settings" ? "page" : undefined}
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>&copy; {currentYear} Prioritize. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-foreground dark:hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-700 dark:text-gray-600">•</span>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-foreground dark:hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-gray-700 dark:text-gray-600">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                Made with <Heart className="h-3 w-3 text-red-500 fill-current" aria-hidden="true" /> by Prioritize
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
