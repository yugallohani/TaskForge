import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download } from "lucide-react";
import { MainLayout } from "@/components/hr/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeTable, Employee } from "@/components/hr/employees/EmployeeTable";
import { AddEmployeeModal } from "@/components/hr/employees/AddEmployeeModal";
import { toast } from "@/hooks/use-toast";
import { hrAPI, getErrorMessage } from "@/lib/api";
import { PageLoader } from "@/components/common";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await hrAPI.getEmployees({ page: 1, page_size: 100 });
      
      // Transform API data to match Employee interface
      const transformedEmployees: Employee[] = response.data.items.map((emp: any) => ({
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
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEmployee = async (data: Omit<Employee, "status">) => {
    try {
      await hrAPI.addEmployee({
        email: data.email,
        name: data.name,
        department: data.department,
        position: "Employee",
        salary: 50000,
        password: "employee123", // Default password
      });
      
      toast({
        title: "Employee Added",
        description: `${data.name} has been added successfully.`,
      });
      
      // Refresh employee list
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error adding employee",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const employee = employees.find((e) => e.id === id);
    
    try {
      await hrAPI.deleteEmployee(id);
      
      toast({
        title: "Employee Removed",
        description: `${employee?.name} has been removed from the system.`,
        variant: "destructive",
      });
      
      // Refresh employee list
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error removing employee",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <MainLayout
      title="Employees"
      description="Manage your team members and their information."
    >
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:bg-secondary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({
              title: "Coming Soon",
              description: "Filter functionality will be added in a future update",
            })}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({
              title: "Coming Soon",
              description: "Export functionality will be added in a future update",
            })}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="glow" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-sm font-semibold text-foreground">
            {employees.length} employees
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active:</span>
          <span className="text-sm font-semibold text-success">
            {employees.filter((e) => e.status === "active").length}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Inactive:</span>
          <span className="text-sm font-semibold text-muted-foreground">
            {employees.filter((e) => e.status === "inactive").length}
          </span>
        </div>
      </div>

      {/* Table */}
      <EmployeeTable
        employees={filteredEmployees}
        onDelete={handleDeleteEmployee}
      />

      {/* Add Modal */}
      <AddEmployeeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddEmployee}
      />
    </MainLayout>
  );
};

export default Employees;
