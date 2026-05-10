# Hackathon Workbench Flow

This is the end-to-end demo path for the local Anansi workbench.

## Demo Goal

Show a creative producer moving from a brief to approved cinematic media with human judgment preserved.

The public product is Anansi. Hermes is the local workflow layer. Runway is the generation engine.

## User Flow

1. **Brief intake**
   - Producer enters product, audience, location, tone, references, constraints, and desired output.
   - The workbench sends a run request to Hermes.

2. **Hermes activity stream**
   - The workbench listens to Hermes API server events.
   - Expected endpoint: `GET /v1/runs/{run_id}/events`.
   - Events render as live work: `message.delta`, `tool.started`, `tool.completed`, `run.completed`, `run.failed`.

3. **Creative directions**
   - Hermes writes three direction artifacts into the Anansi project.
   - The UI renders them as visual cards, not chat messages.
   - Producer selects one route.

4. **Storyboard / shot list**
   - Hermes writes scenes, shot options, camera motion, timing, and prompt structure.
   - The UI shows selectable scene options.

5. **Human approval**
   - Producer approves, refines, regenerates, or rejects before render.
   - Approval is the unlock for Runway tasks.

6. **Runway render queue**
   - Hermes prepares Runway-ready prompts and tasks.
   - Runway generation state appears in the queue.
   - The UI shows task progress and generated thumbnails.

7. **Final review**
   - Generated media, review notes, and the final direction summary land back in Anansi.
   - Producer can inspect clips and export state.

## Implementation Contract

The workbench has two separate data layers:

1. **Hermes events**
   - Purpose: live activity and progress.
   - Source today: simulated event batches in `app/components/AnansiWorkbench.tsx`.
   - Source for integration: Hermes API server SSE.

2. **Anansi artifacts**
   - Purpose: durable creative output shown as UI cards and media.
   - Source today: `data/examples/hinter-pitch-film/project.json`.
   - Source for integration: local project files written by Anansi skills.

Do not parse streamed prose to build the UI. Hermes should write structured artifacts, and the frontend should render those artifacts.

## Hermes API Shape

Start a run:

```ts
const run = await fetch("http://127.0.0.1:8642/v1/runs", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    input: instruction,
    session_id: projectId,
  }),
});
```

Listen for events:

```ts
const { run_id } = await run.json();
const events = new EventSource(`http://127.0.0.1:8642/v1/runs/${run_id}/events`);

events.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  applyHermesEvent(payload);
};
```

## Next Build Step

Replace the simulated event batches with a `useHermesRun` hook:

- `startRun(input, projectId)`
- `events`
- `status`
- `stopRun(runId)`
- fallback to simulation when Hermes API server is not reachable

Then add a lightweight project refresh path so the UI reloads local artifacts after `tool.completed` and `run.completed`.
