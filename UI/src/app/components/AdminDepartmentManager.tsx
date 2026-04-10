import { FormEvent, useMemo, useState } from "react";
import {
  BookOpen,
  Briefcase,
  Calculator,
  Cpu,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  LineChart,
  Palette,
  Plus,
  Scale,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";

import type { Department } from "../data/catalog";
import { departments as seedDepartments } from "../data/catalog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type DepartmentForm = {
  id: string;
  name: string;
  documents: string;
  iconKey: string;
  color: string;
};

const iconOptions = [
  { key: "cpu", label: "Computer Science", icon: Cpu },
  { key: "calculator", label: "Mathematics", icon: Calculator },
  { key: "trending-up", label: "Engineering", icon: TrendingUp },
  { key: "flask", label: "Chemistry", icon: FlaskConical },
  { key: "leaf", label: "Biology", icon: Leaf },
  { key: "briefcase", label: "Business", icon: Briefcase },
  { key: "line-chart", label: "Economics", icon: LineChart },
  { key: "heart-pulse", label: "Psychology", icon: HeartPulse },
  { key: "scale", label: "Law", icon: Scale },
  { key: "palette", label: "Arts & Design", icon: Palette },
  { key: "shield", label: "Cybersecurity", icon: Shield },
  { key: "landmark", label: "Political Science", icon: Landmark },
  { key: "graduation-cap", label: "Education", icon: GraduationCap },
] as const;

const colorOptions = [
  { value: "bg-blue-500", label: "Ocean Blue", swatch: "bg-blue-500" },
  { value: "bg-emerald-500", label: "Emerald", swatch: "bg-emerald-500" },
  { value: "bg-orange-500", label: "Amber Orange", swatch: "bg-orange-500" },
  { value: "bg-pink-500", label: "Rose Pink", swatch: "bg-pink-500" },
  { value: "bg-teal-500", label: "Teal", swatch: "bg-teal-500" },
  { value: "bg-indigo-500", label: "Indigo", swatch: "bg-indigo-500" },
  { value: "bg-red-500", label: "Red", swatch: "bg-red-500" },
  { value: "bg-slate-600", label: "Slate", swatch: "bg-slate-600" },
  { value: "bg-fuchsia-500", label: "Fuchsia", swatch: "bg-fuchsia-500" },
  { value: "bg-lime-600", label: "Lime", swatch: "bg-lime-600" },
  { value: "bg-sky-600", label: "Sky", swatch: "bg-sky-600" },
  { value: "bg-amber-600", label: "Gold", swatch: "bg-amber-600" },
  { value: "bg-cyan-600", label: "Cyan", swatch: "bg-cyan-600" },
] as const;

const iconKeyByIcon = new Map(iconOptions.map((option) => [option.icon, option.key]));

function makeDefaultForm(): DepartmentForm {
  return {
    id: "",
    name: "",
    documents: "0",
    iconKey: iconOptions[0].key,
    color: colorOptions[0].value,
  };
}

function slugifyDepartmentId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formFromDepartment(department: Department): DepartmentForm {
  return {
    id: department.id,
    name: department.name,
    documents: String(department.documents),
    iconKey: iconKeyByIcon.get(department.icon) ?? iconOptions[0].key,
    color: department.color,
  };
}

export function AdminDepartmentManager() {
  const [departmentItems, setDepartmentItems] = useState<Department[]>(seedDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [form, setForm] = useState<DepartmentForm>(makeDefaultForm);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return departmentItems;

    return departmentItems.filter((department) => {
      return (
        department.name.toLowerCase().includes(query) ||
        department.id.toLowerCase().includes(query)
      );
    });
  }, [departmentItems, searchQuery]);

  const totalCourses = useMemo(
    () => departmentItems.reduce((sum, department) => sum + department.courses.length, 0),
    [departmentItems],
  );

  const totalDocuments = useMemo(
    () => departmentItems.reduce((sum, department) => sum + department.documents, 0),
    [departmentItems],
  );

  const formPreviewIcon =
    iconOptions.find((option) => option.key === form.iconKey)?.icon ?? BookOpen;

  const openCreateDialog = () => {
    setEditorMode("create");
    setEditingDepartmentId(null);
    setForm(makeDefaultForm());
    setFormError(null);
    setIsEditorOpen(true);
  };

  const openEditDialog = (department: Department) => {
    setEditorMode("edit");
    setEditingDepartmentId(department.id);
    setForm(formFromDepartment(department));
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleNameChange = (value: string) => {
    setForm((current) => {
      const shouldUpdateId =
        editorMode === "create" ||
        current.id.length === 0 ||
        current.id === slugifyDepartmentId(current.name);

      return {
        ...current,
        name: value,
        id: shouldUpdateId ? slugifyDepartmentId(value) : current.id,
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const normalizedId = slugifyDepartmentId(form.id || form.name);
    const documents = Number(form.documents);
    const icon = iconOptions.find((option) => option.key === form.iconKey)?.icon ?? BookOpen;

    if (!trimmedName) {
      setFormError("Department name is required.");
      return;
    }

    if (!normalizedId) {
      setFormError("Department slug is required.");
      return;
    }

    if (!Number.isFinite(documents) || documents < 0) {
      setFormError("Documents must be a valid positive number.");
      return;
    }

    const duplicate = departmentItems.find(
      (department) =>
        department.id === normalizedId &&
        (editorMode === "create" || department.id !== editingDepartmentId),
    );

    if (duplicate) {
      setFormError("Department slug must be unique.");
      return;
    }

    const nextDepartment: Department = {
      id: normalizedId,
      name: trimmedName,
      documents,
      icon,
      color: form.color,
      courses:
        editorMode === "edit"
          ? departmentItems.find((department) => department.id === editingDepartmentId)?.courses ?? []
          : [],
    };

    setDepartmentItems((current) => {
      if (editorMode === "create") {
        return [nextDepartment, ...current];
      }

      return current.map((department) =>
        department.id === editingDepartmentId ? nextDepartment : department,
      );
    });

    setIsEditorOpen(false);
    setForm(makeDefaultForm());
    setFormError(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    setDepartmentItems((current) =>
      current.filter((department) => department.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  };

  return (
    <section
      id="departments"
      className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.65)] backdrop-blur md:p-8"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
            Department Administration
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            Keep department management in the same admin workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This layout works better than a separate page right now: admins can scan the full list,
            create new entries, edit existing ones, and delete safely without leaving the portal.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or slug"
              className="pl-9"
            />
          </div>
          <Button type="button" onClick={openCreateDialog}>
            <Plus />
            Add Department
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Departments</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{departmentItems.length}</p>
          <p className="mt-1 text-sm text-slate-600">All academic spaces currently visible.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Courses mapped</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalCourses}</p>
          <p className="mt-1 text-sm text-slate-600">Useful before you decide whether delete is safe.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Document count</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalDocuments}</p>
          <p className="mt-1 text-sm text-slate-600">Seeded from the current mock catalog data.</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4">Department</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.map((department) => {
              const Icon = department.icon;

              return (
                <TableRow key={department.id}>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-2xl ${department.color} text-white`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{department.name}</p>
                        <p className="text-xs text-slate-500">Visible in the public catalog</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{department.id}</TableCell>
                  <TableCell>{department.courses.length}</TableCell>
                  <TableCell>{department.documents}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-2 border-slate-300 text-slate-700">
                      <span className={`size-2.5 rounded-full ${department.color}`} />
                      {colorOptions.find((option) => option.value === department.color)?.label ?? "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(department)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(department)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {filteredDepartments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No departments match your search. Try a different keyword or create a new department.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editorMode === "create" ? "Create department" : "Update department"}
            </DialogTitle>
            <DialogDescription>
              This is UI-only for now. The form updates local state so you can validate the admin flow
              before we connect the CRUD endpoints.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="department-name" className="text-sm font-medium text-slate-700">
                    Department name
                  </label>
                  <Input
                    id="department-name"
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder="Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="department-slug" className="text-sm font-medium text-slate-700">
                    Slug
                  </label>
                  <Input
                    id="department-slug"
                    value={form.id}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        id: slugifyDepartmentId(event.target.value),
                      }))
                    }
                    placeholder="computer-science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="department-documents" className="text-sm font-medium text-slate-700">
                    Documents
                  </label>
                  <Input
                    id="department-documents"
                    type="number"
                    min="0"
                    value={form.documents}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        documents: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Icon</label>
                    <Select
                      value={form.iconKey}
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          iconKey: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => {
                          const Icon = option.icon;

                          return (
                            <SelectItem key={option.key} value={option.key}>
                              <Icon className="size-4" />
                              {option.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Color theme</label>
                    <Select
                      value={form.color}
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          color: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className={`size-3 rounded-full ${option.swatch}`} />
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Preview</p>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={`flex size-14 items-center justify-center rounded-3xl ${form.color} text-white`}
                  >
                    {<formPreviewIcon className="size-7" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{form.name || "Department Name"}</p>
                    <p className="text-sm text-slate-500">{form.id || "department-slug"}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Documents</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{form.documents || "0"}</p>
                </div>
              </div>
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editorMode === "create" ? "Create Department" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete department</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Delete ${deleteTarget.name}? This mock action removes the department from the current UI session.`
                : "Delete this department?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
