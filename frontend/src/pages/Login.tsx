import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/homepage/Logo";
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

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      const userIsHR = user.role === "HR Administrator";
      const tryingToAccessHR = isHR;
      
      // Only auto-redirect if user is accessing the correct login page for their role
      if ((userIsHR && tryingToAccessHR) || (!userIsHR && !tryingToAccessHR)) {
        // User is accessing the correct login page for their role
        const dashboardRoute = userIsHR ? ROUTES.HR.DASHBOARD : ROUTES.EMPLOYEE.DASHBOARD;
        navigate(dashboardRoute, { replace: true });
      }
      // If user is accessing wrong login page, let them see the form
      // They can logout from their current account and login with different credentials
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
      
      // Navigate to appropriate dashboard based on role
      // The user role is determined by the backend
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
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isHR ? "bg-primary/20" : "bg-secondary"
            }`}>
              {isHR ? (
                <Briefcase className="w-6 h-6 text-primary" />
              ) : (
                <Users className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isHR ? "HR Login" : "Employee Login"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isHR ? "Access the HR dashboard" : "Access your employee portal"}
              </p>
            </div>
          </div>

          {/* Show logout notice if user is logged in with different role */}
          {showLogoutNotice && (
            <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Already logged in as {userIsHR ? "HR Administrator" : "Employee"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're currently logged in as {user?.name}. Logout to switch accounts.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="shrink-0"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-secondary border-border focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-border cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
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

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isHR ? "Not HR? " : "Don't have an account? "}
            <Link 
              to={isHR ? "/login/employee" : "/signup"} 
              className="text-primary hover:underline font-medium"
            >
              {isHR ? "Employee Login" : "Create account"}
            </Link>
          </p>
          
          {!isHR && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              HR Admin?{" "}
              <Link 
                to="/login/hr" 
                className="text-primary hover:underline font-medium"
              >
                HR Login
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl float-delayed" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <Logo size="lg" />
          <h2 className="text-3xl font-bold text-foreground mt-8 text-center">
            {isHR ? "Manage Your Workforce" : "Stay Connected"}
          </h2>
          <p className="text-muted-foreground mt-4 text-center max-w-sm">
            {isHR 
              ? "Access powerful tools to manage employees, track attendance, and gain valuable insights."
              : "View your attendance records, stay updated with team activities, and manage your profile."
            }
          </p>

          <div className="mt-12 glass rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">156+ Employees</p>
                <p className="text-xs text-muted-foreground">Managed on platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-success font-bold text-sm">94%</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Attendance Rate</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground/80 text-center italic leading-relaxed">
                <span className="text-primary/80">*</span> These numbers are having their moment in the spotlight. 
                Once I scale this app, they'll get real jobs. Until then, bear with the dummy data! 😉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
