import { FormEvent, useMemo, useState } from "react";
import { Building2, Layers3, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AdminDepartmentManager } from "./AdminDepartmentManager";
import { API_BASE_URL } from "../lib/api";

type AdminUser = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

type AdminLoginResponse = {
  message: string;
  user: AdminUser;
};

export function AdminPortal() {
  const [email, setEmail] = useState("admin@studysphere.com");
  const [password, setPassword] = useState("test@123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const cardTitle = useMemo(() => (admin ? "Admin Portal" : "Admin Login"), [admin]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message ?? "Login failed");
        setAdmin(null);
        return;
      }

      const payload = (await response.json()) as AdminLoginResponse;
      setAdmin(payload.user);
    } catch {
      setError("Unable to connect to API.");
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-12">
        <div className="mx-auto w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.55)]">
          <h1 className="text-2xl font-semibold text-slate-900">{cardTitle}</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to manage StudySphere.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="admin-email">
                Email
              </label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="admin-password">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_22%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-6 text-white shadow-[0_40px_90px_-60px_rgba(15,23,42,0.75)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.32em] text-sky-200">StudySphere Admin</p>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                Departments should be managed in this portal, not on a separate page
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
                The public departments page is for browsing. Admin CRUD works better here as an in-place
                workspace with a listing table, create and edit modal, and protected delete confirmation.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#departments"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <Building2 className="size-4" />
                Departments
              </a>
              <Button type="button" variant="secondary" onClick={() => setAdmin(null)}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-sm text-slate-300">Admin</p>
              <p className="mt-2 font-medium">{admin.fullName}</p>
              <p className="text-sm text-slate-400">{admin.email}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-sm text-slate-300">Role</p>
              <p className="mt-2 font-medium">{admin.role}</p>
              <p className="text-sm text-slate-400">Authenticated via existing admin login endpoint.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-sm text-slate-300">Active module</p>
              <div className="mt-2 flex items-center gap-2 font-medium">
                <Layers3 className="size-4 text-sky-300" />
                Department CRUD
              </div>
              <p className="text-sm text-slate-400">Live CRUD using the departments API and database.</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <AdminDepartmentManager />
        </div>
      </div>
    </div>
  );
}
