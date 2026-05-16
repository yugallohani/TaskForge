import { Bell, Shield, Users, Building2, Palette, Globe } from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    id: "company",
    title: "Company",
    description: "Manage your company details and preferences",
    icon: Building2,
  },
  {
    id: "team",
    title: "Team Members",
    description: "Manage team access and permissions",
    icon: Users,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Configure email and push notifications",
    icon: Bell,
  },
  {
    id: "security",
    title: "Security",
    description: "Manage security settings and authentication",
    icon: Shield,
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize the look and feel of your dashboard",
    icon: Palette,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect with third-party services",
    icon: Globe,
  },
];

const Settings = () => {
  return (
    <MainLayout
      title="Settings"
      description="Manage your application preferences and configurations."
    >
      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section, index) => (
          <button
            key={section.id}
            className="glass-card-hover p-6 text-left animate-fade-in group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <section.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 glass-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-foreground">HRMS Lite v1.0</h3>
            <p className="text-sm text-muted-foreground">
              A lightweight HR management solution for modern teams.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              View Documentation
            </Button>
            <Button variant="glass" size="sm">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
