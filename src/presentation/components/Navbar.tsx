import { Link, useLocation } from "react-router";
import { Button } from "@/presentation/components/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/presentation/components/ui/dropdown-menu";
import SearchInput from "@/presentation/components/SearchInput";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/presentation/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import logo from "@/assets/logo.png";

export interface NavLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  brand?: React.ReactNode;
  image?: React.ReactNode;
  links?: NavLink[];
  className?: string;
}

export default function Navbar({
  brand = (
    <span className="bg-gradient-to-b from-gray-600 to-gray-400 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
      Prioritize
    </span>
  ),
  image = (
    <img
      src={logo}
      alt="Prioritize logo"
      className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
    />
  ),
  links = [
    { href: "/tasks", label: "Tasks" },
    { href: "/statistics", label: "Statistics" },
    { href: "/goals", label: "Goals" },
    { href: "/kanban", label: "Kanban" },
    { href: "/milestones", label: "Milestones" },
  ],
  className = "",
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { isAuthenticated, logout, user: currentUser } = useAuth();
  const userImage = currentUser?.profile_image_url;
  const location = useLocation();

  const toggleMenu = () => {
    setIsMobileMenuOpen((isOpen) => !isOpen);
  };

  useEffect(() => {
    const closeMenuAfterNavigation = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(closeMenuAfterNavigation);
  }, [location.pathname]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-background/80 shadow-sm backdrop-blur ${className}`}
    >
      <nav aria-label="Main navigation" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Hamburger + Logo + Links */}
          <div className="flex shrink-0 items-center gap-3 xl:gap-6">
            {/* Mobile Menu Button */}
            <div className="flex shrink-0 items-center xl:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                onClick={toggleMenu}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Brand Logo & Name */}
            <Link
              to="/"
              aria-label="Prioritize home"
              className="flex shrink-0 items-center gap-2 whitespace-nowrap"
            >
              {image}
              {brand}
            </Link>

            {/* Desktop Links */}
            <div className="hidden shrink-0 items-center gap-1 xl:flex">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/60"
                  aria-current={location.pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Search Input */}
          <div className="hidden min-w-0 max-w-md flex-1 justify-center px-2 xl:flex">
            <SearchInput />
          </div>

          {/* Right: Theme Toggle & User Menu */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Desktop Auth */}
            <div className="hidden items-center gap-2 xl:flex">
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth/login">Sign in</Link>
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                    <Link to="/auth/register">Sign up</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label="User menu">
                    <Avatar>
                      <AvatarImage src={userImage} alt={currentUser?.name || "User avatar"} />
                      <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || "M"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Auth Avatar */}
            <div className="xl:hidden">
              {!isAuthenticated ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/auth/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label="User menu">
                    <Avatar>
                      <AvatarImage src={userImage} />
                      <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || "M"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="animate-in slide-in-from-top-2 space-y-2 border-t pb-4 pt-4 duration-200 xl:hidden">
            <div className="px-1 pb-2">
              <SearchInput />
            </div>
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/60"
                aria-current={location.pathname === l.href ? "page" : undefined}
                onClick={closeMenu}
              >
                {l.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={closeMenu} asChild>
                  <Link to="/auth/login">Sign in</Link>
                </Button>
                <Button className="flex-1" onClick={closeMenu} asChild>
                  <Link to="/auth/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}