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
import "./ui/lulu-auth-entry.css";
import "./ui/lulu-confirm-dialog.css";
// Load the shared Nova presentation layer last so it can consistently polish
// legacy/generated workspace pages, the authenticated shell, and public entry
// surfaces without duplicating business UI in every page.
import "./ui/lulu-nova.css";

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
