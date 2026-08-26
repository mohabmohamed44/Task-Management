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
import React, { useState } from "react";
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
  brand = <span className="bg-linear-to-b from-gray-600 to-gray-400 bg-clip-text text-transparent text-2xl font-extrabold">Prioritize</span>,
  image = <img src={logo} alt="Prioritize logo" className="h-12 w-12 object-contain" />,
  links = [
    { href: "/tasks", label: "Tasks" },
    { href: "/statistics", label: "Statistics" },
    { href: "/goals", label: "Goals"},
    { href: "/kanban", label: "Kanban"},
    { href: "/milestones", label: "Milestones"},
  ],
  className = "",
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Destructing some Props from useAuth hook
  const { isAuthenticated, logout, user: currentUser } = useAuth();
  const userImage = currentUser?.profile_image_url;
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  // Auto-close Function
  const closeMenu = () => {
    setIsOpen(false);
  }

  // Auto-close mobile menu on route change
  const [prevLocation, setPrevLocation] = useState(location.pathname);
  if (location.pathname !== prevLocation) {
    setPrevLocation(location.pathname);
    setIsOpen(false);
  }

  return (
    <header
      className={`w-full bg-background/80 backdrop-blur sticky border-b shadow-sm top-0 z-40 ${className}`}
    >
      <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={toggleMenu}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            <Link to="/" className="flex items-center gap-2">
              {image}
              {brand}
            </Link>

            <div className="hidden md:flex md:items-center md:gap-1 md:ml-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="px-3 py-2 rounded-md text-md font-medium hover:bg-muted/60"
                  aria-current={location.pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>


          {/* Search - md and up */}
          <div className="hidden md:flex flex-1 justify-center px-4 max-w-xl">
            <SearchInput />
          </div>
          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Desktop Auth */}
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" aria-label="Sign in" aria-required="true" aria-invalid={!isAuthenticated} aria-describedby="sign-in-error" aria-pressed={!isAuthenticated} name="sign-in" id="sign-in">
                    <Link to="/auth/login">Sign in</Link>
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground" aria-label="Sign up" aria-required="true" aria-invalid={!isAuthenticated} aria-describedby="sign-up-error" aria-pressed={!isAuthenticated} name="sign-up" id="sign-up">
                    <Link to="/auth/register">Sign up</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label="User menu" onClick={() => setIsOpen(!isOpen)} aria-haspopup="true" aria-expanded={isOpen}>
                    <Avatar>
                      <AvatarImage src={userImage} alt={currentUser?.name ? `${currentUser.name}'s avatar` : "User avatar"} />
                      <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || "M"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Avatar */}
            <div className="sm:hidden">
              {!isAuthenticated ? (
                <Button variant="ghost" size="icon" aria-label="Sign in" aria-required="true" aria-invalid={!isAuthenticated} aria-describedby="sign-in-error" aria-pressed={!isAuthenticated} name="sign-in" id="sign-in">
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
                    <DropdownMenuItem>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden mt-2 pb-4 border-t pt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="px-3 pb-2">
              <SearchInput />
            </div>

            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="block px-3 py-2 rounded-md hover:bg-muted/60"
                aria-current={location.pathname === l.href ? "page" : undefined}
                onClick={closeMenu}
              >
                {l.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="px-3 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={closeMenu} aria-label="Sign in" aria-required="true" aria-invalid={!isAuthenticated} aria-describedby="sign-in-error" aria-pressed={!isAuthenticated} name="sign-in" id="sign-in">
                  <Link to="/auth/login" className="w-full">Sign in</Link>
                </Button>
                <Button className="flex-1" onClick={closeMenu} aria-label="Sign up" aria-required="true" aria-invalid={!isAuthenticated} aria-describedby="sign-up-error" aria-pressed={!isAuthenticated} name="sign-up" id="sign-up">
                  <Link to="/auth/register" className="w-full">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
