export const GENRES = [
  "FICTION", "NON_FICTION", "MYSTERY", "THRILLER", "FANTASY", "SCIENCE_FICTION", "ROMANCE",
  "HISTORICAL", "HORROR", "BIOGRAPHY", "SELF_HELP", "POETRY", "DRAMA", "ADVENTURE", "CRIME",
  "YOUNG_ADULT", "CHILDREN", "CLASSICS",
];

export const COPY_STATUSES = ["AVAILABLE", "LOANED", "DAMAGED", "LOST"];

// User Roles
export const USER_ROLES = {
  ADMIN: "ADMIN",
  LIBRARIAN: "LIBRARIAN",
  STUDENT: "STUDENT",
};

export const ROLE_COLORS = {
  ADMIN: "red",
  LIBRARIAN: "blue",
  STUDENT: "green",
  DEFAULT: "default",
};

// Sort Options
export const USER_SORT_OPTIONS = {
  USERNAME_ASC: "username_asc",
  USERNAME_DESC: "username_desc",
  EMAIL_ASC: "email_asc",
  EMAIL_DESC: "email_desc",
  // ROLE_ASC: "role_asc",
  // ROLE_DESC: "role_desc",
};

export const BOOK_SORT_OPTIONS = {
  TITLE_ASC: "title_asc",
  TITLE_DESC: "title_desc",
  AVAILABLE_DESC: "available_desc",
  AVAILABLE_ASC: "available_asc",
};

// Availability Filter Options
export const AVAILABILITY_FILTERS = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ["10", "20", "40", "60", "80", "100"],
};

// Search Debounce Delay (in milliseconds)
export const SEARCH_DEBOUNCE_DELAY = 500;

// Search Placeholders
export const SEARCH_PLACEHOLDERS = {
  USERS: "Search users by username, email, or user ID...",
  BOOKS: "Search books by title or author...",
};

// Filter Placeholders
export const FILTER_PLACEHOLDERS = {
  ROLE: "Filter by Role",
  GENRE: "Filter by Genre",
  AVAILABILITY: "Filter by Availability",
  SORT_BY: "Sort By",
};

// Sort Option Labels
export const USER_SORT_LABELS = {
  [USER_SORT_OPTIONS.USERNAME_ASC]: "Username (A-Z)",
  [USER_SORT_OPTIONS.USERNAME_DESC]: "Username (Z-A)",
  [USER_SORT_OPTIONS.EMAIL_ASC]: "Email (A-Z)",
  [USER_SORT_OPTIONS.EMAIL_DESC]: "Email (Z-A)",
  // [USER_SORT_OPTIONS.ROLE_ASC]: "Role (A-Z)",
  // [USER_SORT_OPTIONS.ROLE_DESC]: "Role (Z-A)",
};

export const BOOK_SORT_LABELS = {
  [BOOK_SORT_OPTIONS.TITLE_ASC]: "Title (A-Z)",
  [BOOK_SORT_OPTIONS.TITLE_DESC]: "Title (Z-A)",
  [BOOK_SORT_OPTIONS.AVAILABLE_DESC]: "Most Available",
  [BOOK_SORT_OPTIONS.AVAILABLE_ASC]: "Least Available",
};

