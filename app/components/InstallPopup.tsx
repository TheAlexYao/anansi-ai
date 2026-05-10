"use client";

import { useEffect, useState } from "react";

const command = "npx anansi-ai connect";

export function InstallPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  async function copyCommand() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    }
  }

  return (
    <div className="install-popup" role="dialog" aria-modal="true" aria-label="Install Anansi" onClick={onClose}>
      <section className="install-popup__panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="install-popup__close" onClick={onClose}>Close</button>
        <span className="install-popup__eyebrow">Run Anansi locally</span>
        <h2>Install the orchestration layer.</h2>
        <p>Anansi installs the agent skills, local workbench, starter project, and Runway handoff flow.</p>
        <button type="button" className="install-popup__cmd" onClick={copyCommand}>
          <code>{command}</code>
          <em>{copied ? "copied" : "copy"}</em>
        </button>
        <div className="install-popup__grid">
          <div><b>Installs</b><span>Skills, workbench, starter project</span></div>
          <div><b>Runs with</b><span>Claude Code, Hermes, OpenClaw, Codex</span></div>
          <div><b>Generates through</b><span>Runway API, with your own key</span></div>
        </div>
      </section>
    </div>
  );
}
