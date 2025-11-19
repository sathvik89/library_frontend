import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { Toaster } from 'react-hot-toast';
import "./utils/axiosConfig";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          fontFamily: 'inherit',
          borderRadius: '10px',
          background: '#fff', // Clean white background
          color: '#800000', // Maroon text
          boxShadow: '0 4px 18px rgba(128,0,0,0.10)',
          border: '1.5px solid #800000',
          padding: '16px 24px',
          fontWeight: 500,
          fontSize: '1rem',
          letterSpacing: '0.01em',
          minWidth: '260px',
        },
        success: {
          iconTheme: {
            primary: '#800000',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#800000',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>
);
