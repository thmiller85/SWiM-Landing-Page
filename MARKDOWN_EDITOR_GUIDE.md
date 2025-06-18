# Markdown Editor Guide

## Overview
The CMS now includes a powerful markdown editor that supports your existing markdown workflow while providing enhanced editing features.

## Key Features

### 1. Paste Markdown Button
- Click "Paste Markdown" to paste your entire blog post from clipboard
- Automatically extracts:
  - First H1 as the post title
  - First paragraph as excerpt
  - Generates slug from title

### 2. Editor Modes
Toggle between two modes using the "Simple/Markdown" button:

#### Simple Mode (Default)
- Plain textarea for quick edits
- Markdown syntax still works
- Good for small changes

#### Markdown Mode
- Full-featured markdown editor
- Syntax highlighting
- Toolbar with formatting buttons
- Live preview option

### 3. Live Preview
When in Markdown mode:
- Click "Preview" to see split-screen view
- Left side: Editor with syntax highlighting
- Right side: Rendered preview

## Markdown Syntax Support

The editor supports GitHub Flavored Markdown (GFM):

```markdown
# Headers
## Sub-headers
### Level 3 headers

**Bold text**
*Italic text*
***Bold and italic***

- Unordered lists
- Like this

1. Numbered lists
2. Like this

[Links](https://example.com)
![Images](image-url.jpg)

> Blockquotes

`Inline code`

```code blocks```

| Tables | Are | Supported |
|--------|-----|-----------|
| Cell 1 | Cell 2 | Cell 3 |
```

## Workflow Example

1. Generate your blog post in markdown format
2. Copy the entire markdown content
3. In CMS, click "Create New Post"
4. Click "Paste Markdown" button
5. Title and excerpt are auto-filled
6. Review/edit in markdown mode with preview
7. Fill in SEO fields (meta description, keywords)
8. Add featured image
9. Publish!

## Tips

- Use the preview to check formatting before publishing
- The simple mode is faster for minor edits
- Markdown mode provides better visual feedback
- All existing markdown content is preserved
- Content is stored as markdown in the database