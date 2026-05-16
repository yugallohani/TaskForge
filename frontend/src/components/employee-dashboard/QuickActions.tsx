import { useState } from "react";
import { Clock, FileText, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { employeeAPI, getErrorMessage } from "@/lib/api";

interface QuickActionsProps {
  onClockIn?: () => void;
}

const QuickActions = ({ onClockIn }: QuickActionsProps) => {
  const { toast } = useToast();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    type: "sick",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    category: "travel",
    amount: "",
    description: "",
    date: "",
  });

  const [feedbackForm, setFeedbackForm] = useState({
    subject: "",
    message: "",
  });

  const handleRequestLeave = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await employeeAPI.submitLeaveRequest({
        leave_type: leaveForm.type,
        start_date: leaveForm.startDate,
        end_date: leaveForm.endDate,
        reason: leaveForm.reason,
      });

      toast({
        title: "Leave request submitted",
        description: "Your leave request has been sent to HR for approval",
      });

      setIsLeaveModalOpen(false);
      setLeaveForm({ type: "sick", startDate: "", endDate: "", reason: "" });
    } catch (error) {
      toast({
        title: "Failed to submit leave request",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleSubmitExpense = () => {
    if (!expenseForm.amount || !expenseForm.description || !expenseForm.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // TODO: Integrate with backend API when expense endpoint is ready
    toast({
      title: "Expense submitted",
      description: "Your expense report has been submitted for approval",
    });

    setIsExpenseModalOpen(false);
    setExpenseForm({ category: "travel", amount: "", description: "", date: "" });
  };

  const handleSendFeedback = () => {
    if (!feedbackForm.subject || !feedbackForm.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // TODO: Integrate with backend API when feedback endpoint is ready
    toast({
      title: "Feedback sent",
      description: "Thank you for your feedback!",
    });

    setIsFeedbackModalOpen(false);
    setFeedbackForm({ subject: "", message: "" });
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="hero"
              size="sm"
              className="gap-2"
              onClick={onClockIn}
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Clock In</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p>Clock In</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsLeaveModalOpen(true)}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Request Leave</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p>Request Leave</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsExpenseModalOpen(true)}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Submit Expense</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p>Submit Expense</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Send Feedback</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p>Send Feedback</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Request Leave Modal */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Submit a leave request for HR approval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select
                value={leaveForm.type}
                onValueChange={(value) =>
                  setLeaveForm({ ...leaveForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for your leave request"
                value={leaveForm.reason}
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, reason: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestLeave}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Expense Modal */}
      <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Expense</DialogTitle>
            <DialogDescription>
              Submit an expense report for reimbursement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <Select
                value={expenseForm.category}
                onValueChange={(value) =>
                  setExpenseForm({ ...expenseForm, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="meals">Meals</SelectItem>
                  <SelectItem value="supplies">Office Supplies</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-date">Date</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the expense"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExpenseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitExpense}>Submit Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Share your thoughts, suggestions, or concerns with management
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief subject line"
                value={feedbackForm.subject}
                onChange={(e) =>
                  setFeedbackForm({ ...feedbackForm, subject: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Your feedback..."
                value={feedbackForm.message}
                onChange={(e) =>
                  setFeedbackForm({ ...feedbackForm, message: e.target.value })
                }
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFeedbackModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSendFeedback}>Send Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
