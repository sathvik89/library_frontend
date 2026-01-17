import React, { useState } from "react";
import { Card } from "antd";
import Logoutbutton from "@/components/common/Logoutbutton";
import PreviousButton from "@/components/common/PreviousButton";
import BooksTable from "@/components/books/BooksTable";
import styles from "@/Styles/LibrarianDashboard.module.css";

export default function LibrarianDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Librarian Dashboard</h1>
      <p className={styles.subheading}>
        Welcome! Manage books, reservations, and daily library operations.
      </p>

      <div className={styles.cardsContainer}>
        <Card title="Book Management" className={styles.dashboardCard}>
          <p>Add, update, and manage library books and inventory.</p>
        </Card>

        <Card title="Reservations" className={styles.dashboardCard}>
          <p>View and manage book reservations and checkouts.</p>
        </Card>

        <Card title="Daily Operations" className={styles.dashboardCard}>
          <p>Handle daily tasks like returns, renewals, and member assistance.</p>
        </Card>
      </div>

      <BooksTable />

      <div className={styles.actionsContainer}>
        <PreviousButton />
        <Logoutbutton />
      </div>
    </div>
  );
}

