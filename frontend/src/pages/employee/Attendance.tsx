import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import EmployeeSidebar from "@/components/employee-dashboard/EmployeeSidebar";
import DashboardHeader from "@/components/employee-dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  LogIn,
  LogOut,
  Calendar as CalendarIcon,
  TrendingUp,
  Coffee,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { employeeAPI, getErrorMessage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/common";

const statusConfig = {
  present: { color: "bg-success/20 text-success", icon: CheckCircle, label: "Present" },
  absent: { color: "bg-destructive/20 text-destructive", icon: XCircle, label: "Absent" },
  "half-day": { color: "bg-warning/20 text-warning", icon: AlertCircle, label: "Half Day" },
  late: { color: "bg-warning/20 text-warning", icon: Clock, label: "Late" },
  on_leave: { color: "bg-primary/20 text-primary", icon: AlertCircle, label: "On Leave" },
};

const Attendance = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [isClockingIn, setIsClockingIn] = useState(false);

  // Fetch attendance data
  useEffect(() => {
    fetchAttendance();
  }, [toast]);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAPI.getAttendance();
      setAttendanceData(response.data);
    } catch (error) {
      toast({
        title: "Error loading attendance",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setIsClockingIn(true);
      await employeeAPI.checkIn();
      toast({
        title: "Clocked In Successfully",
        description: "Your attendance has been recorded",
      });
      // Refresh attendance data
      await fetchAttendance();
    } catch (error) {
      toast({
        title: "Clock In Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsClockingIn(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setIsClockingIn(true);
      await employeeAPI.checkOut();
      toast({
        title: "Clocked Out Successfully",
        description: "Have a great day!",
      });
      // Refresh attendance data
      await fetchAttendance();
    } catch (error) {
      toast({
        title: "Clock Out Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsClockingIn(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const currentUser = {
    name: user?.name || "User",
    role: user?.role || "Employee",
    avatar: user?.avatar || "",
    department: user?.department || "General",
  };

  const attendanceRecords = attendanceData?.records || [];
  const summary = attendanceData?.summary || {};
  
  // Find today's attendance from records
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find((record: any) => record.date === today) || {};
  
  const todayAttendance = {
    check_in: todayRecord.check_in || null,
    check_out: todayRecord.check_out || null,
    hours_worked: todayRecord.hours_worked ? `${todayRecord.hours_worked.toFixed(1)}h` : "0h",
    status: todayRecord.status || null
  };
  
  const stats = {
    days_present: summary.present || 0,
    days_absent: summary.absent || 0,
    avg_hours_per_day: summary.total_hours && summary.total_days 
      ? `${(summary.total_hours / summary.total_days).toFixed(1)}h` 
      : "0h",
    attendance_percentage: summary.attendance_rate ? `${summary.attendance_rate}%` : "0%"
  };
  
  const isClockedIn = todayAttendance.check_in && !todayAttendance.check_out;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EmployeeSidebar />
        
        <main className="flex-1 flex flex-col">
          <DashboardHeader user={currentUser} />
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  My Attendance
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track your attendance history and clock in/out
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-success">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.days_present || 0}</p>
                        <p className="text-xs text-muted-foreground">Days Present</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-destructive">
                        <XCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.days_absent || 0}</p>
                        <p className="text-xs text-muted-foreground">Days Absent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-primary">
                        <Timer className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.avg_hours_per_day || "0h"}</p>
                        <p className="text-xs text-muted-foreground">Avg Hours/Day</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-success">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stats.attendance_percentage || "0%"}</p>
                        <p className="text-xs text-muted-foreground">This Month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Clock In/Out & Calendar */}
                <div className="space-y-6">
                  {/* Clock In/Out Card */}
                  <Card className="glass border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Today's Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        variant={isClockedIn ? "outline" : "hero"}
                        size="lg"
                        className="w-full gap-2"
                        onClick={isClockedIn ? handleClockOut : handleClockIn}
                        disabled={isClockingIn}
                      >
                        {isClockingIn ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : isClockedIn ? (
                          <>
                            <LogOut className="h-5 w-5" />
                            Clock Out
                          </>
                        ) : (
                          <>
                            <LogIn className="h-5 w-5" />
                            Clock In
                          </>
                        )}
                      </Button>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <LogIn className="h-4 w-4" />
                            <span className="text-xs">Clock In</span>
                          </div>
                          <p className="font-semibold text-foreground">
                            {todayAttendance.check_in || "—"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Coffee className="h-4 w-4" />
                            <span className="text-xs">Hours</span>
                          </div>
                          <p className="font-semibold text-foreground">
                            {todayAttendance.hours_worked || "0h"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calendar Card */}
                  <Card className="glass border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        Calendar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Attendance History Table */}
                <div className="lg:col-span-2">
                  <Card className="glass border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-semibold">Attendance History</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary"
                        onClick={() => toast({
                          title: "Coming Soon",
                          description: "Export functionality will be added in a future update",
                        })}
                      >
                        Export
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50">
                            <TableHead>Date</TableHead>
                            <TableHead>Clock In</TableHead>
                            <TableHead>Clock Out</TableHead>
                            <TableHead>Break</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendanceRecords.map((record: any, index: number) => {
                            const StatusIcon = statusConfig[record.status as keyof typeof statusConfig]?.icon || CheckCircle;
                            const statusColor = statusConfig[record.status as keyof typeof statusConfig]?.color || "bg-muted text-muted-foreground";
                            const statusLabel = statusConfig[record.status as keyof typeof statusConfig]?.label || record.status;
                            
                            return (
                              <TableRow key={index} className="border-border/30">
                                <TableCell className="font-medium">{record.date}</TableCell>
                                <TableCell>{record.check_in || "—"}</TableCell>
                                <TableCell>{record.check_out || "—"}</TableCell>
                                <TableCell>—</TableCell>
                                <TableCell>{record.hours_worked ? `${record.hours_worked.toFixed(1)}h` : "0h"}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={cn("gap-1", statusColor)}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {statusLabel}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {attendanceRecords.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No attendance records found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Attendance;
