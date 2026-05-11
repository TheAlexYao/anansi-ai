# Runway API Notes

## Current API Path

Runway's getting-started guide shows image-to-video tasks created at:

```txt
POST https://api.dev.runwayml.com/v1/image_to_video
```

The request includes:

- `promptImage`
- `promptText`
- `model`
- `ratio`
- `duration`
- `Authorization: Bearer $RUNWAYML_API_SECRET`
- `X-Runway-Version: 2024-11-06`

The docs also show `text_to_image` with `referenceImages`, including tagged references that can be mentioned inside `promptText`.

## MVP Defaults

- Vertical video ratio: `720:1280` or the closest supported 9:16 ratio.
- Scene duration: 5-8 seconds.
- Model: start with `gen4.5` for video if available through the team's account/API access.
- Keep every task record, including failures.

## Key Prompting Notes

- Image-to-video: the image defines composition, subject, lighting, and style; the prompt should focus on motion, camera movement, and temporal progression.
- Text-to-video: include subject, environment, action, camera, and style because there is no starting image.
- Use consistent prompt structure so iterations are easy to compare.
- For continuity, reuse the selected final frame from one clip as the next clip's prompt image/reference.

## Sources

- [Runway API getting started](https://docs.dev.runwayml.com/guides/using-the-api/)
- [Runway API reference](https://docs.dev.runwayml.com/api/)
- [Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
- [Text to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/47313737321107-Text-to-Video-Prompting-Guide)
- [Camera Terms, Prompts, & Examples](https://help.runwayml.com/hc/en-us/articles/46749315925395-Camera-Terms-Prompts-Examples)

