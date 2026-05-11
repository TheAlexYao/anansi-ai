# MVP Agent Workflow

Primary agent prompt: `../anansi-hermes-agent-prompt.md`

## Inputs

- Project brief.
- Property type and location.
- Desired buyer or renter feeling.
- Reference images or mood board.
- Output format: vertical 9:16, 30 seconds, 3-4 scenes.

## Agent Stages

### 1. Brief Agent

Output a concise structured brief:

- project summary
- target audience
- emotional promise
- property highlights
- constraints
- must-show visual details

### 2. Mood / Style Agent

Output:

- cinematic direction
- color palette
- lighting rules
- texture/material rules
- visual references
- negative style constraints

### 3. Story / Scene Agent

Output 3-4 scenes:

- scene purpose
- shot size
- camera movement
- subject/environment motion
- transition intent
- desired duration

### 4. Prompt Agent

Output Runway-ready prompts.

For image-to-video, prompts should primarily describe motion, camera work, and temporal progression because the reference image already defines composition, subject matter, lighting, and style.

For text-to-video, prompts should describe the subject, environment, visual style, and motion in one clear paragraph.

### 5. Runway Agent

Submit generation tasks, poll task status, and save:

- prompt
- model
- ratio
- duration
- input image/reference frame
- output URL or local asset
- notes

### 6. Continuity Step

For each selected clip:

- extract or save the final frame
- use it as the prompt image/reference for the next scene
- keep visual rules and camera language consistent
- document which frame was reused

### 7. Editing / Output

Assemble selected clips into a vertical sequence. Audio is optional.
