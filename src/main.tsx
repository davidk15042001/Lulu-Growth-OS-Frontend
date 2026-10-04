import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LuluAppProvider } from "./api/LuluAppContext";
import { LuluConfirmProvider } from "./components/LuluConfirmDialog";
import "./app.css";
import "./index.css";
import "./ui/auth-responsive.css";
import "./ui/lulu-visual-system.css";
import "./ui/executive-workspace.css";
import "./ui/lulu-nova.css";
import "./ui/lulu-confirm-dialog.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LuluAppProvider>
      <LuluConfirmProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LuluConfirmProvider>
    </LuluAppProvider>
  </StrictMode>,
);
