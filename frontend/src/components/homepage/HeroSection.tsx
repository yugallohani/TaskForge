import { Link } from "react-router-dom";
import { ArrowRight, KanbanSquare, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import FloatingCards from "./FloatingCards";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Hero-local accent glows (additive on top of the global immersive bg) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl float-delayed pointer-events-none" />

      {/* Floating Mac-style mini widgets */}
      <FloatingCards />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge — subtle floating motion */}
          <div className="fade-in-up mb-8 float-subtle">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Modern Team Task Management Platform
            </span>
          </div>

          {/* Breathing glow behind heading */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[600px] h-[200px] rounded-full bg-primary/8 blur-[100px] breathe-glow" />
            </div>

            {/* Main Heading */}
            <h1 className="fade-in-up-delayed text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 relative">
              Built for Teams
              <span className="block text-gradient mt-2">That Ship Fast.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="fade-in-up-delayed-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Organize projects, collaborate seamlessly, and keep your entire team
            moving forward — all in one modern workspace.
          </p>

          {/* CTA Buttons */}
          <div className="fade-in-up-delayed-2 flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            {/* Admin Login with Credentials */}
            <div className="flex flex-col items-center gap-3">
              <Link to="/login/hr">
                <Button variant="hero" size="xl" className="group">
                  Admin Login
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="glass rounded-lg px-4 py-2 text-xs">
                <p className="text-muted-foreground mb-1">Demo Credentials:</p>
                <p className="text-foreground">
                  <code className="text-primary">{DEMO_CREDENTIALS.HR.email}</code>
                </p>
                <p className="text-foreground">
                  <code className="text-primary">{DEMO_CREDENTIALS.HR.password}</code>
                </p>
              </div>
            </div>

            {/* Member Login with Account Creation Message */}
            <div className="flex flex-col items-center gap-3">
              <Link to="/login/employee">
                <Button variant="heroOutline" size="xl">
                  Member Login
                </Button>
              </Link>
              <div className="glass rounded-lg px-4 py-2 text-xs max-w-[200px]">
                <p className="text-muted-foreground text-center">
                  Create an account to join your team workspace
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards Preview — gentle ambient float */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: KanbanSquare, label: "Project Boards", value: "Organized" },
              { icon: Zap, label: "Real-time Tasks", value: "Always in sync" },
              { icon: BarChart3, label: "Progress Analytics", value: "Insightful" },
            ].map((feature, index) => (
              <div
                key={feature.label}
                className={`glass glass-hover card-hover-lift rounded-xl p-5 scale-in card-float-${index + 1}`}
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">{feature.label}</p>
                    <p className="font-semibold text-foreground">{feature.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
