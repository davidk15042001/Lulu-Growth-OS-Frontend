import { OfficeCommandCenter } from "./OfficeCommandCenter";
import "./virtual-office.css";

// Kept for the manual document component, which is intentionally independent
// from the AI-native Office surface.
export type CommercialDocumentKind = "invoices" | "quotes";

export default function VirtualOfficePage() {
  return <main className="lulu-office lulu-office--ai-native" aria-label="Lulu">
    <OfficeCommandCenter />
  </main>;
}
