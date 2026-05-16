import { useState, useEffect } from "react";
import { Megaphone, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { employeeAPI } from "@/lib/api";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "high";
  created_at: string;
}

const priorityConfig = {
  normal: { color: "bg-primary/20 text-primary", label: "Normal" },
  high: { color: "bg-destructive/20 text-destructive", label: "High Priority" },
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await employeeAPI.getAnnouncements();
        // Show only the 3 most recent announcements
        setAnnouncements(response.data.announcements.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (isLoading) {
    return (
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Company Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading announcements...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Company Announcements
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No announcements at this time</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer",
                  "bg-secondary/30 border-border/30 hover:border-primary/30 hover:bg-secondary/50",
                  announcement.priority === "high" && "ring-1 ring-destructive/30"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", priorityConfig[announcement.priority].color)}
                  >
                    {priorityConfig[announcement.priority].label}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {announcement.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {announcement.content}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Announcements;
