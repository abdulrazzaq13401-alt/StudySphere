import { FormEvent, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:5001";

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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{cardTitle}</h1>
        {!admin && <p className="mt-1 text-sm text-slate-600">Sign in to manage StudySphere.</p>}

        {!admin && (
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
        )}

        {admin && (
          <div className="mt-6 space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <p className="font-medium text-emerald-800">Logged in as {admin.fullName}</p>
            <p className="text-emerald-700">Email: {admin.email}</p>
            <p className="text-emerald-700">Role: {admin.role}</p>
            <p className="text-emerald-700">Next step: add courses, subjects, and portal operations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
