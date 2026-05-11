# Runway Payload: {{PROJECT_NAME}}

## Payload Planning

- Mode:
- Scene source:
- Scene id:
- Generation order:
- Modality:
- Model route:
- Ratio:
- Duration:
- Input asset:
- Input asset status:
- Expected output:
- Continuity dependency:
- Client material anchors:
- Client memory anchors:
- Prior client rejection patterns:
- Reveal completion requirement:
- Lifelike realism watch:
- Failure watch:

## Prompt Rationale

- What the input image/video carries:
- What the prompt controls:
- One primary motion:
- One camera idea:
- Stability / preservation clauses:
- What was intentionally omitted:

## Payload JSON

```json
{
  "scene_id": "",
  "mode": "single_scene_payload",
  "modality": "image_to_video",
  "model": "gen4.5",
  "ratio": "9:16",
  "duration": "5s",
  "prompt_text": "",
  "prompt_image": "",
  "prompt_video": null,
  "references": [],
  "expected_output": "",
  "continuity_anchors": [],
  "client_material_anchors": [],
  "client_memory_anchors": [],
  "failure_watch": [],
  "fallback_asset": null,
  "status": "ready_for_runway"
}
```

## Continuity Contract

- Preserve:
- Change:
- Stable frame / reference:
- Next scene dependency:
- Final frame needed:

## Filing Recommendation

- Project payload note:
- Output log:
- Final frame reference:
- Public-safe:

## Telegram Delivery

- Generated clip paths:
- Evaluation PDF path:
- Attachment tags:
  - `MEDIA:"{{CLIP_PATH}}"`
