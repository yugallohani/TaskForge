import { useState, useEffect } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceTable, AttendanceRecord } from "@/components/hr/attendance/AttendanceTable";
import { MarkAttendanceModal } from "@/components/hr/attendance/MarkAttendanceModal";
import { Employee } from "@/components/hr/employees/EmployeeTable";
import { toast } from "@/hooks/use-toast";
import { hrAPI, getErrorMessage } from "@/lib/api";
import { PageLoader } from "@/components/common";

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Get date from 30 days ago
  const getMonthAgoDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendance();
    }
  }, [dateFilter, employees.length, activeTab]);

  const fetchEmployees = async () => {
    try {
      const employeesResponse = await hrAPI.getEmployees({ page: 1, page_size: 100 });
      const transformedEmployees: Employee[] = employeesResponse.data.items.map((emp: any) => ({
        id: emp.employee_id,
        name: emp.name,
        email: emp.email,
        department: emp.department,
        status: emp.status === "active" ? "active" : "inactive",
      }));
      setEmployees(transformedEmployees);
    } catch (error) {
      toast({
        title: "Error loading employees",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      
      // Fetch attendance records with date filter
      const params: any = { page: 1, page_size: 100 };
      
      if (activeTab === "today") {
        // Show only today's attendance
        const today = getTodayDate();
        params.start_date = today;
        params.end_date = today;
      } else if (activeTab === "overall") {
        // Show last 30 days attendance
        params.start_date = getMonthAgoDate();
        params.end_date = getTodayDate();
      } else if (activeTab === "custom" && dateFilter) {
        // Show specific date attendance
        params.start_date = dateFilter;
        params.end_date = dateFilter;
      }
      
      const attendanceResponse = await hrAPI.getAttendance(params);
      const transformedRecords: AttendanceRecord[] = attendanceResponse.data.items.map((att: any) => ({
        id: att.id,
        employeeId: att.employee.id,
        employeeName: att.employee.name,
        date: att.date,
        status: att.status === "present" || att.status === "late" ? "present" : "absent",
      }));
      setRecords(transformedRecords);
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

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleMarkAttendance = async (
    employeeId: string,
    date: string,
    status: "present" | "absent"
  ) => {
    try {
      await hrAPI.markAttendance({
        employee_id: employeeId,
        date: date,
        status: status,
      });

      toast({
        title: "Attendance Marked",
        description: `Attendance marked as ${status} for ${date}.`,
      });

      // Refresh attendance data
      fetchAttendance();
    } catch (error) {
      toast({
        title: "Error marking attendance",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const presentCount = filteredRecords.filter((r) => r.status === "present").length;
  const absentCount = filteredRecords.filter((r) => r.status === "absent").length;

  return (
    <MainLayout
      title="Attendance"
      description="Track and manage daily employee attendance."
    >
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="overall">Overall Attendance</TabsTrigger>
          <TabsTrigger value="custom">Custom Date</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <AttendanceContent
            records={filteredRecords}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            showDatePicker={false}
            showMarkModal={showMarkModal}
            setShowMarkModal={setShowMarkModal}
            employees={employees}
            handleMarkAttendance={handleMarkAttendance}
            presentCount={presentCount}
            absentCount={absentCount}
          />
        </TabsContent>

        <TabsContent value="overall" className="mt-6">
          <AttendanceContent
            records={filteredRecords}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            showDatePicker={false}
            showMarkModal={showMarkModal}
            setShowMarkModal={setShowMarkModal}
            employees={employees}
            handleMarkAttendance={handleMarkAttendance}
            presentCount={presentCount}
            absentCount={absentCount}
          />
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <AttendanceContent
            records={filteredRecords}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            showDatePicker={true}
            showMarkModal={showMarkModal}
            setShowMarkModal={setShowMarkModal}
            employees={employees}
            handleMarkAttendance={handleMarkAttendance}
            presentCount={presentCount}
            absentCount={absentCount}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

// Extracted content component to avoid duplication
interface AttendanceContentProps {
  records: AttendanceRecord[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  showDatePicker: boolean;
  showMarkModal: boolean;
  setShowMarkModal: (show: boolean) => void;
  employees: Employee[];
  handleMarkAttendance: (employeeId: string, date: string, status: "present" | "absent") => void;
  presentCount: number;
  absentCount: number;
}

const AttendanceContent = ({
  records,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  showDatePicker,
  showMarkModal,
  setShowMarkModal,
  employees,
  handleMarkAttendance,
  presentCount,
  absentCount,
}: AttendanceContentProps) => {
  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search & Date Filter */}
        <div className="flex flex-1 gap-3 max-w-2xl flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50 focus:bg-secondary"
            />
          </div>
          {showDatePicker && (
            <div className="relative min-w-[180px]">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Select date"
                className="pl-10 bg-secondary/50 border-border/50 focus:bg-secondary [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <Button variant="hero" onClick={() => setShowMarkModal(true)}>
          <Plus className="h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Records:</span>
          <span className="text-sm font-semibold text-foreground">
            {records.length}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Present:</span>
          <span className="text-sm font-semibold text-success">{presentCount}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Absent:</span>
          <span className="text-sm font-semibold text-destructive">{absentCount}</span>
        </div>
        {dateFilter && (
          <>
            <div className="h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateFilter("")}
              className="h-7 px-2 text-xs"
            >
              Clear date filter
            </Button>
          </>
        )}
      </div>

      {/* Table */}
      <AttendanceTable
        records={records}
        onMarkAttendance={(employeeId, status) => {
          const today = new Date().toISOString().split("T")[0];
          handleMarkAttendance(employeeId, today, status);
        }}
      />

      {/* Mark Modal */}
      <MarkAttendanceModal
        open={showMarkModal}
        onOpenChange={setShowMarkModal}
        employees={employees}
        onMark={handleMarkAttendance}
      />
    </>
  );
};

export default Attendance;
