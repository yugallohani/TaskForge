import { useState } from "react";
import { CalendarCheck, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "../employees/EmployeeTable";
import { cn } from "@/lib/utils";

interface MarkAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onMark: (employeeId: string, date: string, status: "present" | "absent") => void;
}

export const MarkAttendanceModal = ({ 
  open, 
  onOpenChange, 
  employees, 
  onMark 
}: MarkAttendanceModalProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"present" | "absent" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedEmployee) {
      newErrors.employee = "Please select an employee";
    }
    if (!date) {
      newErrors.date = "Please select a date";
    }
    if (!status) {
      newErrors.status = "Please select attendance status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && status) {
      onMark(selectedEmployee, date, status);
      setSelectedEmployee("");
      setDate(new Date().toISOString().split("T")[0]);
      setStatus(null);
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Mark Attendance</DialogTitle>
              <DialogDescription>
                Record attendance for an employee.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Employee Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Employee <span className="text-destructive">*</span>
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                if (errors.employee) setErrors(prev => ({ ...prev, employee: "" }));
              }}
              className="input-modern appearance-none cursor-pointer"
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id})
                </option>
              ))}
            </select>
            {errors.employee && (
              <p className="text-sm text-destructive">{errors.employee}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors(prev => ({ ...prev, date: "" }));
              }}
              className="input-modern"
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Attendance Status <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setStatus("present");
                  if (errors.status) setErrors(prev => ({ ...prev, status: "" }));
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200",
                  status === "present"
                    ? "border-success bg-success/10 text-success"
                    : "border-border bg-transparent text-muted-foreground hover:border-success/50 hover:text-foreground"
                )}
              >
                <Check className="h-5 w-5" />
                <span className="font-medium">Present</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus("absent");
                  if (errors.status) setErrors(prev => ({ ...prev, status: "" }));
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200",
                  status === "absent"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-transparent text-muted-foreground hover:border-destructive/50 hover:text-foreground"
                )}
              >
                <X className="h-5 w-5" />
                <span className="font-medium">Absent</span>
              </button>
            </div>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              <CalendarCheck className="h-4 w-4" />
              Mark Attendance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
