import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import EmployeeSidebar from "@/components/employee-dashboard/EmployeeSidebar";
import DashboardHeader from "@/components/employee-dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Upload,
  FolderOpen,
  File,
  HardDrive,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { employeeAPI, getErrorMessage } from "@/lib/api";
import { PageLoader } from "@/components/common";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  file_name: string;
  category: string;
  file_size: number;
  uploaded_at: string;
}

const Documents = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "personal" as "personal" | "company" | "project",
    file: null as File | null,
  });

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAPI.getDocuments();
      setDocuments(response.data.documents || []);
    } catch (error) {
      toast({
        title: "Error loading documents",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadForm.title || !uploadForm.file) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('category', uploadForm.category);
      formData.append('file', uploadForm.file);

      await employeeAPI.uploadDocument(formData);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      setIsUploadModalOpen(false);
      setUploadForm({ title: "", category: "personal", file: null });
      fetchDocuments();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
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

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const personalDocs = filteredDocuments.filter((d) => d.category === "personal");
  const companyDocs = filteredDocuments.filter((d) => d.category === "company");
  const projectDocs = filteredDocuments.filter((d) => d.category === "project");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <div className="p-4 rounded-xl border bg-secondary/30 border-border/30 hover:border-primary/30 transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-background/50 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              {formatFileSize(doc.file_size)}
            </span>
            <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

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
                  My Documents
                </h1>
                <p className="text-muted-foreground mt-1">
                  Access and manage your documents
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-primary">
                        <FolderOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                        <p className="text-xs text-muted-foreground">Total Files</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-success">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{personalDocs.length}</p>
                        <p className="text-xs text-muted-foreground">Personal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-warning">
                        <File className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{companyDocs.length}</p>
                        <p className="text-xs text-muted-foreground">Company</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {formatFileSize(documents.reduce((sum, d) => sum + d.file_size, 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">Storage Used</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Upload */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border/50"
                  />
                </div>
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>

              {/* Documents Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="all">All ({filteredDocuments.length})</TabsTrigger>
                  <TabsTrigger value="personal">Personal ({personalDocs.length})</TabsTrigger>
                  <TabsTrigger value="company">Company ({companyDocs.length})</TabsTrigger>
                  <TabsTrigger value="project">Project ({projectDocs.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  {filteredDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDocuments.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No documents found</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="personal" className="mt-4">
                  {personalDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personalDocs.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No personal documents</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="company" className="mt-4">
                  {companyDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {companyDocs.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No company documents</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="project" className="mt-4">
                  {projectDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projectDocs.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No project documents</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Document Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to your collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value: any) =>
                  setUploadForm({ ...uploadForm, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) =>
                  setUploadForm({
                    ...uploadForm,
                    file: e.target.files?.[0] || null,
                  })
                }
              />
              {uploadForm.file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadForm.file.name} (
                  {(uploadForm.file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Documents;
