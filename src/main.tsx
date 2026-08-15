import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LuluAppProvider } from "./api/LuluAppContext";
import "./app.css";
import "./ui/auth-responsive.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LuluAppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LuluAppProvider>
  </StrictMode>,
);
