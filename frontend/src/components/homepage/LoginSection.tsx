import { Link } from "react-router-dom";
import { ArrowRight, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, DEMO_CREDENTIALS } from "@/lib/constants";

const LoginSection = () => {
  const loginOptions = [
    {
      type: "employee" as const,
      title: "Member Workspace",
      description:
        "Pick up your tasks, collaborate with your team, and track your progress in a focused, distraction-free workspace.",
      icon: User,
      features: ["My tasks & boards", "Team collaboration", "Real-time updates"],
      buttonText: "Member Login",
      path: ROUTES.LOGIN.EMPLOYEE,
    },
    {
      type: "hr" as const,
      title: "Admin Workspace",
      description:
        "Run your projects end to end. Manage members, configure boards, and monitor team performance from one dashboard.",
      icon: ShieldCheck,
      features: ["Manage projects & members", "Track team progress", "Analytics & insights"],
      buttonText: "Admin Login",
      path: ROUTES.LOGIN.HR,
      primary: true,
    },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Get Started
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Choose your
            <span className="text-gradient"> workspace</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Sign in to the workspace that matches your role on the team
          </p>
        </div>

        {/* Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {loginOptions.map((option) => (
            <div
              key={option.type}
              className={`group relative glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 ${
                option.primary ? "glow-primary-lg" : ""
              }`}
            >
              {option.primary && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  option.primary ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <option.icon className={`w-7 h-7 ${option.primary ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{option.title}</h3>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {option.description}
              </p>

              <ul className="space-y-3 mb-8">
                {option.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to={option.path}>
                <Button
                  variant={option.primary ? "hero" : "heroOutline"}
                  className="w-full group/btn"
                  size="lg"
                >
                  {option.buttonText}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Admin Demo Credentials or Member Account Creation */}
              {option.type === "hr" ? (
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Admin Demo Credentials:</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <code className="px-1.5 py-0.5 rounded bg-background/50 text-primary">
                        {DEMO_CREDENTIALS.HR.email}
                      </code>
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Password:</span>{" "}
                      <code className="px-1.5 py-0.5 rounded bg-background/50 text-primary">
                        {DEMO_CREDENTIALS.HR.password}
                      </code>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <p className="text-xs text-muted-foreground text-center">
                    Create an account to join your team workspace
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
