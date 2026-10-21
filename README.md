# Haile Grad Program Finder

A 10-question quiz that helps prospective students see whether the **Haile MBA**, **Master of Accountancy (MAcc)** or **Master of Business Leadership & Innovation (MBLI)** at Northern Kentucky University fits them best. It is a static site with no build step, server, or database. It runs on GitHub Pages or any web host.

## What's in the folder

| File | What it does |
|---|---|
| `index.html` | The page itself |
| `questions.js` | All quiz content: questions, answer options, point values and program facts. **Edit this file to change wording or scoring.** |
| `app.js` | Quiz flow, scoring logic and the results page |
| `styles.css` | Layout and NKU brand styling (gold, black, white; light and dark mode) |
| `SCORING.md` | The full scoring table, for rebuilding the quiz in Qualtrics or Google Forms |

## Publish with GitHub Pages

1. Create a new repository on GitHub (for example, `haile-program-finder`).
2. Upload every file in this folder to the root of the repository (**Add file → Upload files**), then commit.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.
4. After a minute or two the quiz is live at `https://<your-username>.github.io/haile-program-finder/`.

To embed it on an NKU web page, link to that URL, or place it in an iframe if the CMS allows:

```html
<iframe src="https://<your-username>.github.io/haile-program-finder/" title="Haile Grad Program Finder" style="width:100%;height:900px;border:0"></iframe>
```

## Preview locally

Open `index.html` in any browser. No install needed.

## Editing the quiz

Everything content-related is in `questions.js`.

- **Change wording:** edit the `t` (answer) or `d` (helper text) values.
- **Change scoring:** edit the `s` values, such as `s: {MBA: 3, MAcc: 1}`.
- **Change the "why it fits you" reasons:** edit the `why` values.
- **Update program facts, links or contacts:** edit the `PROGRAMS` block at the top.

Two rules are built into `app.js`:

- **MBLI experience rule:** if someone reports under 3 years of experience, MBLI can't be their top result, and they see a note about a future fall cohort.
- **MAcc track suggestion:** based on the undergraduate background question, results suggest the Expedited, Professional/Data Analytics, or APRT track.

## Email my results

The results page has an **Email my results** form with an email field and an optional "send me program information" checkbox.

**Right now it runs in demo mode.** Nothing is sent. After someone submits, the page shows a preview of the email they would receive, labeled "Demo mode."

To make it send real email, open `app.js` and set `EMAIL_ENDPOINT` to a URL that accepts a POST, such as a Google Apps Script web app or an admissions CRM form endpoint:

```js
const EMAIL_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
```

The quiz sends this JSON to that URL:

```json
{
  "email": "name@example.com",
  "optIn": true,
  "topProgram": "MBA",
  "secondProgram": "MBLI",
  "scores": { "MBA": 22, "MAcc": 6, "MBLI": 20 },
  "answers": [{ "question": "goal", "answer": "Move up with a broader business skill set" }]
}
```

The receiving service sends the email (the demo preview in `emailPreview()` is a ready-made template) and can log the lead. Once `EMAIL_ENDPOINT` is set, the demo preview is replaced by a "Check your inbox" confirmation.

Before going live, confirm with NKU IT and MarComm which service may handle prospective students' email addresses, and check that the privacy link (`PRIVACY_URL` in `app.js`) points where they want.

## Analytics (optional)

To track completions, add your Google Analytics or Tag Manager snippet to the `<head>` of `index.html`, and fire an event inside the `results()` function in `app.js` with the top program, for example:

```js
gtag('event', 'quiz_complete', { program: top });
```

## Before launch

- Program facts were taken from NKU program pages on October 21, 2026. Have each program office confirm them.
- Tuition is intentionally not shown, since it changes.
- Check with NKU MarComm before hosting university-branded content outside nku.edu.
