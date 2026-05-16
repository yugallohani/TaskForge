import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Users2,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/homepage/Logo";
import ParticleCanvas from "@/components/homepage/ParticleCanvas";
import { ROUTES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { authAPI, getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const DESIGNATIONS = [
  "QR",
  "Annotator",
  "Eval Specialist",
  "RLHF Reviewer",
  "QA Specialist",
  "Research Analyst",
  "AI Trainer",
  "Project Reviewer",
  "Data Validator",
];

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.designation) {
      toast({
        title: "Designation required",
        description: "Please select your role/designation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.signup({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        department: formData.designation, // Store designation in department field
        password: formData.password,
      });

      const { user: userData, access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      setUser(userData);

      toast({
        title: "Welcome to TaskForge!",
        description: "Your account has been created. Redirecting to your workspace...",
      });

      setTimeout(() => {
        navigate(ROUTES.EMPLOYEE.DASHBOARD);
      }, 1000);
    } catch (error) {
      toast({
        title: "Signup failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "pl-10 h-12 rounded-xl bg-[hsl(220_30%_12%/0.4)] backdrop-blur-md border-[hsl(168_76%_70%/0.12)] placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-[hsl(220_30%_12%/0.55)] transition-all";

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Full-page background */}
      <div className="absolute inset-0 -z-20 tf-base" />
      <div className="absolute inset-0 -z-20 tf-vignette" />
      <div className="absolute inset-0 -z-20 tf-aurora opacity-60" />
      <div className="absolute inset-0 -z-10">
        <ParticleCanvas />
      </div>

      {/* ─── Left Panel — Form ─── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 lg:px-12 relative z-10 overflow-y-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center tf-icon-illum">
              <Users2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Join TaskForge
              </h1>
              <p className="text-muted-foreground text-sm">
                Create your member account to start contributing
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section: Account */}
            <div className="space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Account Setup
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs text-muted-foreground">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs text-muted-foreground">
                  Phone
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91-XXXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Professional */}
            <div className="space-y-3 pt-3 border-t border-[hsl(168_50%_40%/0.08)]">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Professional Details
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Designation / Role
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {DESIGNATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        setFormData((f) => ({ ...f, designation: d }))
                      }
                      className={cn(
                        "px-2 py-2 rounded-lg text-[11px] font-medium transition-all border text-center",
                        formData.designation === d
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-[hsl(168_50%_40%/0.08)] text-muted-foreground hover:text-foreground hover:border-[hsl(168_50%_40%/0.2)]"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Security */}
            <div className="space-y-3 pt-3 border-t border-[hsl(168_50%_40%/0.08)]">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Security
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-muted-foreground">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(inputClass, "pr-10")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={cn(inputClass, "pr-10")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-12 rounded-xl text-base font-semibold shadow-[0_0_24px_-4px_hsl(168_76%_42%/0.5)] hover:shadow-[0_0_36px_-2px_hsl(168_76%_42%/0.65)] hover:scale-[1.02] transition-all duration-300 mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login/employee"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ─── Right Panel — Branding ─── */}
      <div className="hidden lg:flex lg:flex-1 relative z-10 items-center justify-center p-12">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl float pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl float-delayed pointer-events-none" />

        <div className="relative flex flex-col items-center w-full max-w-md">
          <Logo size="lg" />

          <h2 className="text-3xl font-bold text-foreground mt-8 text-center">
            Join the Workforce
          </h2>
          <p className="text-muted-foreground mt-3 text-center max-w-sm leading-relaxed">
            Create your professional profile, apply to workspaces, and start
            contributing to AI evaluation projects.
          </p>

          {/* Benefits */}
          <div className="mt-10 tf-glass tf-glass-hover rounded-2xl p-6 w-full space-y-4">
            {[
              {
                icon: Sparkles,
                title: "Choose Your Designation",
                desc: "QR, Annotator, Eval Specialist, and more",
              },
              {
                icon: CheckCircle2,
                title: "Apply to Workspaces",
                desc: "Request access to Evals or Generalists",
              },
              {
                icon: Timer,
                title: "Track Your Work",
                desc: "Live sessions, submissions, and productivity",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
