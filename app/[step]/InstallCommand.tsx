"use client";

import { useState } from "react";

const command = "npx anansi-ai connect";

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
  }

  return (
    <div className="install-command-wrap">
      <div className="install-command" aria-label="Install command">
        <code>{command}</code>
        <button type="button" onClick={copyCommand}>
          {copied ? "You're all set" : "Copy install command"}
        </button>
      </div>
      {copied ? (
        <p className="install-success">
          Run this locally to open Anansi. Hermes handles creative direction with GPT-5.5, and your Runway API key connects approved shots to video rendering.
        </p>
      ) : null}
    </div>
  );
}
