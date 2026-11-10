# Keerthan Devera — Portfolio

Personal site for Keerthan Devera, software developer in Toronto. Plain HTML, CSS and JavaScript with no build step, so it deploys to Vercel, GitHub Pages or any static host as is.

## What it does

- Renders experience, projects, skills and education from one data file.
- Lists recently updated public repositories live from the GitHub API (cached for 30 minutes, with a friendly fallback if GitHub is unreachable).
- Lets visitors select a skill to dim everything on the page that doesn't use it.
- Filters projects by category.
- Follows the visitor's light or dark preference, with a toggle that remembers the choice.
- Respects reduced-motion settings, supports keyboard navigation, and works down to phone widths.

## Update the content

Everything lives in [`assets/js/profile.js`](assets/js/profile.js). Edit the text, save, and refresh. The file's header explains the conventions (bold with `**double asterisks**`, dates as `YYYY-MM`).

- **New job or project:** add an object to `experience` or `projects`. Tags that match a name in `skills` become clickable automatically.
- **Project links:** add `links: [{ label: "Source", href: "https://github.com/..." }]` to any project.
- **Resume:** replace the PDF in `assets/pdf/` and update `resume.href` in `profile.js` and the three `href`s in `index.html` that point to it.
- **Availability pill:** edit `availability`, or set it to `""` to hide it.
- **Hero text** (name, headline, short intro) is plain HTML at the top of `index.html`, so it appears instantly and is readable by search engines.

## Run locally

```bash
npm start        # serves http://localhost:3000
```

Or open `index.html` directly in a browser.

## Deploy

Import the repository into Vercel with the default static settings. There is no build command and no output directory.

## License

MIT. See [LICENSE](LICENSE).
