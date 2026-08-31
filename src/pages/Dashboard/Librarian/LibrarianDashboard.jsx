import React, { useEffect, useState } from "react";
import BooksTable from "@/components/books/BooksTable";
import DashboardShell, {
  StatCard,
  StatRow,
} from "@/components/layout/DashboardShell";
import { getAllBooks } from "@/api/services/bookService";
import { getCurrentUser } from "@/api/services/authService";

export default function LibrarianDashboard() {
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({
    books: null,
    available: null,
    outOfStock: null,
  });

  useEffect(() => {
    let cancelled = false;

    const total = async (params) => {
      try {
        const res = await getAllBooks({ ...params, limit: 1 });
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

      const [books, available, outOfStock] = await Promise.all([
        total({}),
        total({ availability: "available" }),
        total({ availability: "unavailable" }),
      ]);

      if (!cancelled) setStats({ books, available, outOfStock });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardShell
      eyebrow="Circulation desk"
      title="Librarian Dashboard"
      subtitle="Add titles, manage copies and keep the catalogue accurate."
      role={me?.role ?? "LIBRARIAN"}
      userName={me?.userName}
    >
      <StatRow>
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

      <BooksTable />
    </DashboardShell>
  );
}
