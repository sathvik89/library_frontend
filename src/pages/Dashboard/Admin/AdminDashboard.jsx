import React, { useEffect, useState } from "react";
import UsersTable from "@/components/users/UsersTable";
import BooksTable from "@/components/books/BooksTable";
import DashboardShell, {
  StatCard,
  StatRow,
} from "@/components/layout/DashboardShell";
import { getAllUsers } from "@/api/services/userService";
import { getAllBooks } from "@/api/services/bookService";
import { getCurrentUser } from "@/api/services/authService";

export default function AdminDashboard() {
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({
    users: null,
    students: null,
    staff: null,
    books: null,
    available: null,
    outOfStock: null,
  });

  useEffect(() => {
    let cancelled = false;

    // Each call asks for a single row -- we only want `pagination.total`.
    const total = async (fn, params) => {
      try {
        const res = await fn({ ...params, limit: 1 });
        return res.data?.pagination?.total ?? 0;
      } catch {
        return 0;
      }
    };

    (async () => {
      try {
        const meRes = await getCurrentUser();
        if (!cancelled) setMe(meRes.data);
      } catch {
        /* the shell just shows no name */
      }

      const [users, students, librarians, admins, books, available, outOfStock] =
        await Promise.all([
          total(getAllUsers),
          total(getAllUsers, { role: "STUDENT" }),
          total(getAllUsers, { role: "LIBRARIAN" }),
          total(getAllUsers, { role: "ADMIN" }),
          total(getAllBooks),
          total(getAllBooks, { availability: "available" }),
          total(getAllBooks, { availability: "unavailable" }),
        ]);

      if (!cancelled) {
        setStats({
          users,
          students,
          staff: librarians + admins,
          books,
          available,
          outOfStock,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardShell
      eyebrow="Administration"
      title="Admin Dashboard"
      subtitle="Members, catalogue and availability across the library at a glance."
      role={me?.role ?? "ADMIN"}
      userName={me?.userName}
    >
      <StatRow>
        <StatCard label="Total members" value={stats.users} />
        <StatCard label="Students" value={stats.students} />
        <StatCard label="Librarians & admins" value={stats.staff} />
        <StatCard label="Titles in catalogue" value={stats.books} />
        <StatCard
          label="Available now"
          value={stats.available}
          hint="titles with a free copy"
        />
        <StatCard
          label="All copies out"
          value={stats.outOfStock}
          hint="nothing on the shelf"
        />
      </StatRow>

      <UsersTable />
      <BooksTable />
    </DashboardShell>
  );
}
