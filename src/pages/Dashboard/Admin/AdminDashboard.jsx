import React from "react";
import { Card } from "antd";
import Logoutbutton from "@/components/common/Logoutbutton";
import PreviousButton from "@/components/common/PreviousButton";
import UsersTable from "@/components/users/UsersTable";
import BooksTable from "@/components/books/BooksTable";
import styles from "@/Styles/AdminDashboard.module.css";

export default function AdminDashboard() {

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <p className={styles.subheading}>
        Welcome! Manage the library system from here.
      </p>

      <div className={styles.cardsContainer}>
        <Card title="System Overview" className={styles.dashboardCard}>
          <p>View and manage overall library statistics and system health.</p>
        </Card>

        <Card title="User Management" className={styles.dashboardCard}>
          <p>Manage users, roles, and permissions across the system.</p>
        </Card>

        <Card title="Library Settings" className={styles.dashboardCard}>
          <p>Configure library policies, timings, and system settings.</p>
        </Card>
      </div>

      <UsersTable />

      <BooksTable />

      <div className={styles.actionsContainer}>
        <PreviousButton navi="/login" />
        <Logoutbutton />
      </div>
    </div>
  );
}

