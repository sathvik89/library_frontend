import React from "react";
import styles from "@/Styles/DashboardShell.module.css";
import Logoutbutton from "@/components/common/Logoutbutton";
import NotificationBell from "@/components/notifications/NotificationBell";
import logo from "@/assets/images/books/RULOGO.png";

/**
 * Shared chrome for the Student, Librarian and Admin dashboards so all three
 * read as one product instead of three separate pages.
 */
export default function DashboardShell({
  eyebrow,
  title,
  subtitle,
  role,
  userName,
  actions,
  children,
  footer,
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <img className={styles.brandLogo} src={logo} alt="" />
          <div className={styles.brandText}>
            <span className={styles.brandName}>Library Space</span>
            <span className={styles.brandSub}>Rishihood University</span>
          </div>
        </div>

        <div className={styles.topbarSpacer} />

        <div className={styles.topbarActions}>
          {userName && <span className={styles.userName}>{userName}</span>}
          {actions}
          <NotificationBell />
          {role && <span className={styles.rolePill}>{role}</span>}
          <Logoutbutton variant="ghost" />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>

        {children}

        {footer && <div className={styles.footerActions}>{footer}</div>}
      </main>
    </div>
  );
}

/** A single headline number. Shows a shimmer while `value` is null. */
export function StatCard({ label, value, hint }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>
        {value === null || value === undefined ? (
          <span className={styles.statSkeleton} />
        ) : (
          value
        )}
      </div>
      {hint && <div className={styles.statHint}>{hint}</div>}
    </div>
  );
}

export function StatRow({ children }) {
  return <div className={styles.statRow}>{children}</div>;
}

export function Section({ title, description, actions, flush, children }) {
  return (
    <section className={styles.section}>
      {(title || actions) && (
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            {title && <h2 className={styles.sectionTitle}>{title}</h2>}
            {description && <p className={styles.sectionDesc}>{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={flush ? styles.sectionBodyFlush : styles.sectionBody}>
        {children}
      </div>
    </section>
  );
}
