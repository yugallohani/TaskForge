import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Users2,
  KanbanSquare,
  CheckCircle2,
  Activity,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/homepage/Logo";
import ParticleCanvas from "@/components/homepage/ParticleCanvas";
import { ROUTES } from "@/lib/constants";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api";

const Login = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, user, logout } = useUser();
  const { toast } = useToast();
  const isHR = role === "hr";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in with different role
  const userIsHR = user?.role === "HR Administrator";
  const showLogoutNotice = user && ((userIsHR && !isHR) || (!userIsHR && isHR));

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You can now login with different credentials",
    });
  };

  useEffect(() => {
    if (user) {
      const userIsHR = user.role === "HR Administrator";
      const tryingToAccessHR = isHR;
      if ((userIsHR && tryingToAccessHR) || (!userIsHR && !tryingToAccessHR)) {
        const dashboardRoute = userIsHR
          ? ROUTES.HR.DASHBOARD
          : ROUTES.EMPLOYEE.DASHBOARD;
        navigate(dashboardRoute, { replace: true });
      }
    }
  }, [user, navigate, isHR]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData.role === "HR Administrator") {
        navigate(ROUTES.HR.DASHBOARD);
      } else {
        navigate(ROUTES.EMPLOYEE.DASHBOARD);
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* ─── Full-page background (shared by both panels) ─── */}
      <div className="absolute inset-0 -z-20 tf-base" />
      <div className="absolute inset-0 -z-20 tf-vignette" />
      <div className="absolute inset-0 -z-20 tf-aurora opacity-60" />
      <div className="absolute inset-0 -z-10">
        <ParticleCanvas />
      </div>

      {/* ─── Left Panel — Form ─── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center tf-icon-illum ${
                isHR ? "bg-primary/15" : "bg-primary/10"
              }`}
            >
              {isHR ? (
                <ShieldCheck className="w-6 h-6 text-primary" />
              ) : (
                <Users2 className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isHR ? "Admin Login" : "Member Login"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isHR
                  ? "Access the Admin dashboard"
                  : "Access your team workspace"}
              </p>
            </div>
          </div>

          {/* Logout notice */}
          {showLogoutNotice && (
            <div className="mb-6 p-4 rounded-xl tf-glass border-warning/20">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Already logged in as{" "}
                    {userIsHR ? "Admin" : "Member"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're currently logged in as {user?.name}. Logout to
                    switch accounts.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="shrink-0 rounded-full"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-[hsl(220_30%_12%/0.4)] backdrop-blur-md border-[hsl(168_76%_70%/0.12)] placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-[hsl(220_30%_12%/0.55)] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-[hsl(220_30%_12%/0.4)] backdrop-blur-md border-[hsl(168_76%_70%/0.12)] placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-[hsl(220_30%_12%/0.55)] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  className="rounded border-border cursor-pointer accent-primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-12 rounded-xl text-base font-semibold shadow-[0_0_24px_-4px_hsl(168_76%_42%/0.5)] hover:shadow-[0_0_36px_-2px_hsl(168_76%_42%/0.65)] hover:scale-[1.02] transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Footer links */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isHR ? "Not Admin? " : "Don't have an account? "}
            <Link
              to={isHR ? "/login/employee" : "/signup"}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {isHR ? "Member Login" : "Create account"}
            </Link>
          </p>

          {!isHR && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Admin?{" "}
              <Link
                to="/login/hr"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Admin Login
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ─── Right Panel — Branding + Stats ─── */}
      <div className="hidden lg:flex lg:flex-1 relative z-10 items-center justify-center p-12">
        {/* Extra ambient glow for the right panel */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl float pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl float-delayed pointer-events-none" />

        <div className="relative flex flex-col items-center w-full max-w-md">
          {/* Logo */}
          <Logo size="lg" />

          {/* Heading */}
          <h2 className="text-3xl font-bold text-foreground mt-8 text-center">
            {isHR ? "Command Your Projects" : "Your Team Workspace"}
          </h2>
          <p className="text-muted-foreground mt-3 text-center max-w-sm leading-relaxed">
            {isHR
              ? "Manage projects, track team progress, and gain real-time insights from one powerful dashboard."
              : "Pick up tasks, collaborate with your team, and track your progress in a focused workspace."}
          </p>

          {/* Stats card — glassmorphism */}
          <div className="mt-10 tf-glass tf-glass-hover rounded-2xl p-6 w-full">
            <div className="space-y-5">
              {/* Stat rows */}
              {(isHR
                ? [
                    {
                      icon: KanbanSquare,
                      label: "Active Projects",
                      value: "24",
                      color: "bg-primary/15",
                    },
                    {
                      icon: CheckCircle2,
                      label: "Tasks Completed",
                      value: "1,280",
                      color: "bg-primary/15",
                    },
                    {
                      icon: Activity,
                      label: "Sprint Completion",
                      value: "94%",
                      color: "bg-primary/15",
                    },
                    {
                      icon: Zap,
                      label: "Real-time Sync",
                      value: "Active",
                      color: "bg-primary/15",
                    },
                  ]
                : [
                    {
                      icon: CheckCircle2,
                      label: "My Tasks Done",
                      value: "38",
                      color: "bg-primary/15",
                    },
                    {
                      icon: Users2,
                      label: "Team Members",
                      value: "12",
                      color: "bg-primary/15",
                    },
                    {
                      icon: Activity,
                      label: "Productivity Score",
                      value: "92%",
                      color: "bg-primary/15",
                    },
                    {
                      icon: Zap,
                      label: "Streak",
                      value: "7 days",
                      color: "bg-primary/15",
                    },
                  ]
              ).map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div
                    className={`tf-icon-illum w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle footer note */}
            <div className="mt-6 pt-4 border-t border-primary/10">
              <p className="text-[11px] text-muted-foreground/70 text-center italic leading-relaxed">
                Live metrics from your TaskForge workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
