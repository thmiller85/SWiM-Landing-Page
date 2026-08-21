# Share card — /retail/planning-suite

`client/public/og-retail-planning-suite.jpg` (1200×630) is the link preview for
the Retail Planning Suite page. It is composed, not generated: the photographic
ground comes from `design/plates/share-card.png`, and the type is set in the
page's own faces so it stays crisp at any size and editable when the copy
changes.

Built by hand rather than by a build step — it changes about as often as the
brand does, and rendering it needs a browser, which is not a dependency this
project should carry for one image.

## To rebuild

1. `ground.jpg` is `design/plates/share-card.png` cropped from 1916×821 to
   1.9048:1 and resized to 1200×630, trimming 352px from the **left**: the
   plaster wall on that side is the type bed, and the window and street on the
   right are what make the room read as a shop rather than an empty room.

   ```
   sharp(share-card.png)
     .extract({ left: 252, top: 0, width: 1564, height: 821 })
     .resize(1200, 630)
   ```

2. Open `card.html` in a browser at exactly 1200×630 and screenshot it, or
   drive it with any headless browser at that viewport with deviceScaleFactor 1.

3. Save as JPEG, quality 86, 4:4:4 chroma — the wordmark is small dark type on
   a light ground and subsampling smears it.

## Checks before shipping a new one

- **Read it at 340px wide.** Link previews render small; if the eyebrow
  disappears at thumbnail size, the type is too light or too tight.
- Nothing on the card may claim a customer, a count, or an outcome — the same
  sixteen rules that govern the page.
