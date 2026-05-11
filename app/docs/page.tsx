const installCommand = "npx anansi-ai connect";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#070706] text-[#f5efe2]">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 md:px-10 md:py-24">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b59b6b]">Anansi docs</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Install the Anansi agent runtime.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[#d9cfbb]">
            Anansi is a local visual-storytelling agent for cinematic video workflows. The public package installs the runtime, skills, and connector templates. Your projects, keys, and private creative system stay on your machine.
          </p>
        </div>

        <div className="rounded-3xl border border-[#3a3328] bg-[#11100d] p-6 shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#b59b6b]">Quick install</p>
          <pre className="overflow-x-auto rounded-2xl bg-black px-5 py-4 text-base text-[#f6d58d]"><code>{installCommand}</code></pre>
          <p className="mt-4 text-sm leading-6 text-[#bdb19b]">
            No Anansi account is required. Generation uses your local tools and bring-your-own API keys where needed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DocCard title="What connect installs">
            <ul>
              <li>Portable Anansi skills in <code>~/.agents/skills</code>.</li>
              <li>Local agent files and scripts in <code>~/anansi/agent</code>.</li>
              <li>A project workspace in <code>~/anansi/projects</code>.</li>
              <li>An optional Hermes profile at <code>~/.hermes/profiles/anansi</code>.</li>
              <li>Local config in <code>~/.anansi/config.json</code>.</li>
            </ul>
          </DocCard>

          <DocCard title="Supported runtimes">
            <ul>
              <li>Hermes</li>
              <li>OpenClaw</li>
              <li>Claude Code</li>
              <li>Codex</li>
              <li>Any agent runtime that can read portable markdown skills</li>
            </ul>
          </DocCard>

          <DocCard title="Keys and privacy">
            <ul>
              <li>Anansi does not ship API keys.</li>
              <li>Runway and image-generation keys stay local.</li>
              <li>The package does not include client briefs, private notes, logs, or project history.</li>
              <li>You can point Anansi at a local vault with <code>anansi-ai config set vault /path</code>.</li>
            </ul>
          </DocCard>

          <DocCard title="Useful commands">
            <ul>
              <li><code>anansi-ai doctor</code> checks install health.</li>
              <li><code>anansi-ai open site</code> opens the public site.</li>
              <li><code>anansi-ai open docs</code> opens this page.</li>
              <li><code>anansi-ai config get</code> prints local config.</li>
            </ul>
          </DocCard>
        </div>

        <section className="space-y-4 rounded-3xl border border-[#3a3328] bg-[#0d0c0a] p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Public package boundary</h2>
          <p className="leading-7 text-[#d9cfbb]">
            The downloadable package is the public Anansi runtime: skills, scripts, schemas, connector templates, and local workflow helpers. The private creative system is not included. That private layer is where internal research, client memory, prompt experiments, and raw operating notes live.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-[#3a3328] bg-[#0d0c0a] p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Troubleshooting</h2>
          <ul className="space-y-3 leading-7 text-[#d9cfbb]">
            <li><strong>Skills do not appear:</strong> restart your agent runtime after install.</li>
            <li><strong>Generation fails:</strong> run <code>anansi-ai doctor</code> and confirm your BYOK setup.</li>
            <li><strong>Wrong vault:</strong> update it with <code>anansi-ai config set vault /absolute/path</code>.</li>
            <li><strong>Need a clean test:</strong> run with a temporary HOME before installing on your main machine.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}

function DocCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#3a3328] bg-[#0d0c0a] p-6">
      <h2 className="mb-4 text-xl font-semibold tracking-[-0.03em]">{title}</h2>
      <div className="docs-copy text-[#d9cfbb]">{children}</div>
    </section>
  );
}
