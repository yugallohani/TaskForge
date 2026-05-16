import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Logo from "./Logo";

/**
 * Navbar — Dynamic Island
 * -----------------------
 * A centered, floating glass capsule inspired by Apple's Dynamic Island
 * and visionOS. Preserves all existing nav items (Features / About /
 * Contact) and CTAs (Member Login / Admin Login) while delivering a
 * premium, minimal, futuristic feel that integrates with the particle
 * background.
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon! 🚀",
      description: `${feature} will be added as I scale up. Stay tuned for exciting updates!`,
    });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Features", href: "#features", isExternal: false },
    { label: "About", href: "#about", isExternal: true },
    { label: "Contact", href: "#contact", isExternal: true },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
    >
      {/* Wrapper centers everything; pointer-events re-enabled on the island itself */}
      <div className="relative pointer-events-auto">
        {/* Ambient glow behind the island */}
        <div
          aria-hidden="true"
          className="island-ambient-glow absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto pointer-events-none"
        />

        {/* The capsule */}
        <div
          className={`island-shell flex items-center ${
            isScrolled
              ? "island-shell--compact px-2 py-1.5 sm:px-3 sm:py-1.5"
              : "px-2 py-2 sm:px-3 sm:py-2"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="island-logo flex items-center"
            aria-label="TaskForge home"
          >
            <Logo size="sm" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            <span className="island-divider" aria-hidden="true" />
            {navLinks.map((link) =>
              link.isExternal ? (
                <button
                  key={link.label}
                  onClick={() => handleComingSoon(link.label)}
                  className="island-nav-item"
                >
                  {link.label}
                </button>
              ) : (
                <a key={link.label} href={link.href} className="island-nav-item">
                  {link.label}
                </a>
              )
            )}
            <span className="island-divider" aria-hidden="true" />
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-1.5 pl-1">
            <Link to="/login/employee">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-xs px-3.5 h-8 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all"
              >
                Member Login
              </Button>
            </Link>
            <Link to="/login/hr">
              <Button
                variant="hero"
                size="sm"
                className="rounded-full text-xs px-4 h-8 shadow-[0_0_18px_-4px_hsl(168_76%_42%/0.55)] hover:shadow-[0_0_24px_-2px_hsl(168_76%_42%/0.7)] hover:scale-[1.03] transition-all"
              >
                Admin Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="island-menu-btn md:hidden ml-1"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile panel — morphs out from beneath the island */}
        {isMobileMenuOpen && (
          <div className="md:hidden island-mobile-panel mt-3 p-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) =>
                link.isExternal ? (
                  <button
                    key={link.label}
                    onClick={() => handleComingSoon(link.label)}
                    className="island-nav-item text-left w-full"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="island-nav-item w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-primary/15">
                <Link
                  to="/login/employee"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full rounded-full">
                    Member Login
                  </Button>
                </Link>
                <Link
                  to="/login/hr"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="hero" className="w-full rounded-full">
                    Admin Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
