import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  CircuitBoard,
  CornerDownRight,
  ExternalLink,
  GitBranch,
  KeyRound,
  Package,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";

import "./docs.css";

const installCommand = "npx anansi-ai connect";

const navItems = [
  { href: "#install", label: "Install" },
  { href: "#whats-installed", label: "What ships" },
  { href: "#runtimes", label: "Runtimes" },
  { href: "#commands", label: "Commands" },
  { href: "#boundary", label: "Boundary" },
  { href: "#troubleshooting", label: "Troubleshooting" },
];

export default function DocsPage() {
  return (
    <main className="docs-shell">
      <div className="docs-aurora" aria-hidden="true" />
      <div className="docs-grid" aria-hidden="true" />

      <header className="docs-topbar">
        <Link href="/" className="docs-brand">
          <Image
            src="/anansi-spider-mark.png"
            alt=""
            width={28}
            height={28}
            className="docs-brand-mark"
            priority
          />
          <span>Anansi</span>
        </Link>
        <nav className="docs-nav" aria-label="Sections">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className="docs-topbar-actions">
          <a className="docs-pill" href="https://www.npmjs.com/package/anansi-ai" target="_blank" rel="noreferrer">
            <Package size={13} aria-hidden="true" />
            v0.1.0 on npm
          </a>
          <a className="docs-icon-link" href="https://github.com/TheAlexYao/anansi-ai" target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitBranch size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <article className="docs-article">
        <section className="docs-hero">
          <p className="docs-eyebrow">
            <Sparkles size={11} aria-hidden="true" />
            Anansi docs · runtime guide
          </p>
          <h1 className="docs-headline">
            Install the Anansi <span className="docs-headline-accent">agent runtime</span>.
          </h1>
          <p className="docs-lede">
            A local visual-storytelling agent for cinematic video workflows. The public package installs the runtime, portable skills, and connector templates. Your projects, keys, and private creative system stay on your machine.
          </p>
          <div className="docs-hero-meta">
            <span className="docs-hero-meta-item">
              <CircuitBoard size={13} aria-hidden="true" /> Local-first
            </span>
            <span className="docs-hero-meta-item">
              <KeyRound size={13} aria-hidden="true" /> BYOK
            </span>
            <span className="docs-hero-meta-item">
              <ShieldCheck size={13} aria-hidden="true" /> No accounts
            </span>
          </div>
        </section>

        <section id="install" className="docs-install">
          <div className="docs-install-label">
            <span className="docs-install-eyebrow">
              <Terminal size={12} aria-hidden="true" /> Quick install
            </span>
            <span className="docs-install-hint">One line. Runs locally. No signup.</span>
          </div>
          <pre className="docs-install-block">
            <span className="docs-install-prompt" aria-hidden="true">$</span>
            <code>{installCommand}</code>
            <span className="docs-install-copy" aria-hidden="true">Copy</span>
          </pre>
          <p className="docs-install-note">
            Generation uses your local tools and bring-your-own API keys where needed. After install, run
            {" "}<code>anansi-ai doctor</code> to verify, or
            {" "}<code>anansi-ai config set vault /path/to/vault</code> to point Anansi at an existing Obsidian vault.
          </p>
        </section>

        <section id="whats-installed" className="docs-grid-section">
          <SectionHeader number="01" title="What connect installs" />
          <div className="docs-cards">
            <DocCard icon={<Box size={16} />} title="Skills">
              Portable Anansi skills land in <code>~/.agents/skills</code>, ready for any agent runtime that reads markdown skills.
            </DocCard>
            <DocCard icon={<Wrench size={16} />} title="Agent files">
              Local agent files and scripts in <code>~/anansi/agent</code> — bash and Python helpers for brief, mood, scene, render, and final-cut stages.
            </DocCard>
            <DocCard icon={<CornerDownRight size={16} />} title="Workspace">
              A project workspace at <code>~/anansi/projects</code> and a config at <code>~/.anansi/config.json</code>.
            </DocCard>
            <DocCard icon={<Sparkles size={16} />} title="Optional Hermes">
              A Hermes profile at <code>~/.hermes/profiles/anansi</code> if you use Hermes as your runtime.
            </DocCard>
          </div>
        </section>

        <section id="runtimes" className="docs-grid-section">
          <SectionHeader number="02" title="Supported runtimes" />
          <div className="docs-runtime-row">
            {["Hermes", "OpenClaw", "Claude Code", "Codex", "Any markdown-skill agent"].map((rt) => (
              <span key={rt} className="docs-runtime-chip">{rt}</span>
            ))}
          </div>
        </section>

        <section id="commands" className="docs-grid-section">
          <SectionHeader number="03" title="Useful commands" />
          <div className="docs-cmd-list">
            <CommandRow cmd="anansi-ai doctor" desc="Check install health and report missing pieces." />
            <CommandRow cmd="anansi-ai open site" desc="Open the public Anansi site in your browser." />
            <CommandRow cmd="anansi-ai open docs" desc="Open this docs page." />
            <CommandRow cmd="anansi-ai config get" desc="Print the local config JSON." />
            <CommandRow cmd="anansi-ai config set vault /path" desc="Point Anansi at an existing local Obsidian vault." />
            <CommandRow cmd="anansi-ai config set runway_key <key>" desc="Store a Runway API key in macOS Keychain (Mac only)." />
          </div>
        </section>

        <section id="boundary" className="docs-feature-section">
          <div className="docs-feature-glow" aria-hidden="true" />
          <SectionHeader number="04" title="Public package boundary" />
          <div className="docs-feature-grid">
            <div>
              <h3 className="docs-feature-h">What ships publicly</h3>
              <ul className="docs-feature-list">
                <li>Runtime CLI and connector templates</li>
                <li>Portable agent skills and stage scripts</li>
                <li>Sanitized example payloads and demo schemas</li>
                <li>BYOK setup helpers (Runway, OpenAI, FAL)</li>
              </ul>
            </div>
            <div>
              <h3 className="docs-feature-h docs-feature-h-warn">Not in the public package</h3>
              <ul className="docs-feature-list docs-feature-list-warn">
                <li>Private creative-system notes or vault content</li>
                <li>Client briefs, prompt experiments, generated history</li>
                <li>API keys, tokens, or session transcripts</li>
                <li>Internal rubrics and retrieval maps</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="troubleshooting" className="docs-grid-section">
          <SectionHeader number="05" title="Troubleshooting" />
          <div className="docs-trouble-list">
            <TroubleRow
              symptom="Skills don't appear"
              fix={<>Restart your agent runtime after installing. Most runtimes scan <code>~/.agents/skills</code> at startup.</>}
            />
            <TroubleRow
              symptom="Generation fails"
              fix={<>Run <code>anansi-ai doctor</code> to verify install, then confirm your BYOK setup with the matching <code>setup-*.sh</code> helper.</>}
            />
            <TroubleRow
              symptom="Wrong or missing vault"
              fix={<>Update with <code>anansi-ai config set vault /absolute/path</code>. Auto-detect only covers iCloud Obsidian and <code>~/Documents/Anansi</code>.</>}
            />
            <TroubleRow
              symptom="Want a clean test"
              fix={<>Run the install with a temporary <code>HOME</code> before touching your real machine: <code>HOME=$(mktemp -d) npx anansi-ai connect</code>.</>}
            />
          </div>
        </section>

        <section className="docs-cta">
          <h2 className="docs-cta-h">Ready to weave a film.</h2>
          <p className="docs-cta-sub">Anansi is local-first and bring-your-own-key. Generate, approve, refine — your machine, your keys, your taste.</p>
          <div className="docs-cta-actions">
            <Link href="/" className="docs-cta-primary">
              Open the workbench <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <a className="docs-cta-secondary" href="https://www.npmjs.com/package/anansi-ai" target="_blank" rel="noreferrer">
              npm <ExternalLink size={13} aria-hidden="true" />
            </a>
            <a className="docs-cta-secondary" href="https://github.com/TheAlexYao/anansi-ai" target="_blank" rel="noreferrer">
              GitHub <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </section>
      </article>

      <footer className="docs-footer">
        <span>Anansi · agent-first visual storytelling</span>
        <span>v0.1.0 · MIT licensed</span>
      </footer>
    </main>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="docs-section-header">
      <span className="docs-section-number">{number}</span>
      <h2 className="docs-section-title">{title}</h2>
    </div>
  );
}

function DocCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <article className="docs-card">
      <span className="docs-card-icon" aria-hidden="true">{icon}</span>
      <h3 className="docs-card-title">{title}</h3>
      <p className="docs-card-body">{children}</p>
    </article>
  );
}

function CommandRow({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <div className="docs-cmd-row">
      <code className="docs-cmd-code">{cmd}</code>
      <span className="docs-cmd-desc">{desc}</span>
    </div>
  );
}

function TroubleRow({ symptom, fix }: { symptom: string; fix: ReactNode }) {
  return (
    <div className="docs-trouble-row">
      <span className="docs-trouble-symptom">{symptom}</span>
      <span className="docs-trouble-fix">{fix}</span>
    </div>
  );
}
