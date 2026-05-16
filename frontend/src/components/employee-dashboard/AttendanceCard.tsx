import { useState } from "react";
import { Clock, LogIn, LogOut, Coffee, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const AttendanceCard = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime] = useState<string | null>(null);
  
  // Mock data
  const hoursWorkedToday = 4.5;
  const targetHours = 8;
  const percentage = (hoursWorkedToday / targetHours) * 100;

  const weeklyStats = [
    { day: "Mon", hours: 8.2, status: "complete" },
    { day: "Tue", hours: 7.5, status: "complete" },
    { day: "Wed", hours: 8.0, status: "complete" },
    { day: "Thu", hours: 6.5, status: "complete" },
    { day: "Fri", hours: hoursWorkedToday, status: "current" },
  ];

  const handleClockAction = () => {
    setIsClockedIn(!isClockedIn);
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Clock In/Out Button */}
        <Button
          variant={isClockedIn ? "outline" : "hero"}
          size="lg"
          className="w-full gap-2"
          onClick={handleClockAction}
        >
          {isClockedIn ? (
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

        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Progress</span>
            <span className="font-medium text-foreground">
              {hoursWorkedToday}h / {targetHours}h
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Time Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Timer className="h-4 w-4" />
              <span className="text-xs">Clock In</span>
            </div>
            <p className="font-semibold text-foreground">
              {clockInTime || "9:00 AM"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Coffee className="h-4 w-4" />
              <span className="text-xs">Break Taken</span>
            </div>
            <p className="font-semibold text-foreground">45 min</p>
          </div>
        </div>

        {/* Weekly Overview */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">This Week</p>
          <div className="flex items-end justify-between gap-1">
            {weeklyStats.map((day) => {
              const heightPercentage = (day.hours / 10) * 100;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      day.status === "current"
                        ? "bg-primary"
                        : day.hours >= targetHours
                        ? "bg-success/50"
                        : "bg-muted-foreground/30"
                    )}
                    style={{ height: `${heightPercentage}px`, minHeight: "4px" }}
                  />
                  <span className="text-[10px] text-muted-foreground">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
