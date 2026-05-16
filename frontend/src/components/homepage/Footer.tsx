import { Mail, MapPin } from "lucide-react";
import Logo from "@/components/homepage/Logo";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon! 🚀",
      description: `${feature} will be added as I scale up. Stay tuned for exciting updates!`,
    });
  };

  return (
    <footer id="contact" className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
              Modern team task management built for clarity and momentum. Plan projects, assign work, and track progress — all in one focused workspace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleComingSoon("About page")}
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleComingSoon("Contact page")}
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleComingSoon("Documentation")}
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Documentation
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@taskforge.app</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>K. R. Mangalam University, Gurugram</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaskForge. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button
              onClick={() => handleComingSoon("Privacy Policy")}
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleComingSoon("Terms of Service")}
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
