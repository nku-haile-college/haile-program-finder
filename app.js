// Haile Grad Program Finder: quiz flow, scoring and results.
// Content lives in questions.js.

const answers = new Array(QUESTIONS.length).fill(null);
let idx = 0;
const $ = id => document.getElementById(id);

function setProgress(i) {
  $("bar").style.width = (i / QUESTIONS.length * 100) + "%";
}
function show(id) {
  ["intro", "quiz", "results"].forEach(s => $(s).hidden = s !== id);
  window.scrollTo({ top: 0 });
}
function render() {
  const Q = QUESTIONS[idx];
  $("stepcount").textContent = `Question ${idx + 1} of ${QUESTIONS.length}`;
  $("qnum").textContent = String(idx + 1).padStart(2, "0") + " / " + QUESTIONS.length;
  $("qtext").textContent = Q.q;
  $("qhelp").textContent = "";
  $("qhelp").hidden = true;
  const box = $("opts");
  box.innerHTML = "";
  box.setAttribute("aria-label", Q.q);
  Q.opts.forEach((o, j) => {
    const id = `q${idx}o${j}`;
    const lab = document.createElement("label");
    lab.className = "opt" + (answers[idx] === j ? " sel" : "");
    lab.htmlFor = id;
    lab.innerHTML = `<input type="radio" name="q${idx}" id="${id}" ${answers[idx] === j ? "checked" : ""}><span class="mark"></span><span class="txt"><b></b>${o.d ? "<small></small>" : ""}</span>`;
    lab.querySelector("b").textContent = o.t;
    if (o.d) lab.querySelector("small").textContent = o.d;
    lab.querySelector("input").addEventListener("change", () => {
      answers[idx] = j;
      box.querySelectorAll(".opt").forEach(e => e.classList.remove("sel"));
      lab.classList.add("sel");
      $("next").disabled = false;
    });
    box.appendChild(lab);
  });
  $("next").disabled = answers[idx] === null;
  $("next").textContent = idx === QUESTIONS.length - 1 ? "See my results" : "Next";
  $("back").textContent = idx === 0 ? "Back to start" : "Back";
  setProgress(idx);
}

function score() {
  const s = { MBA: 0, MAcc: 0, MBLI: 0 };
  const reasons = { MBA: [], MAcc: [], MBLI: [] };
  const flags = new Set();
  answers.forEach((a, i) => {
    const o = QUESTIONS[i].opts[a];
    for (const k in o.s) s[k] += o.s[k];
    if (o.why) for (const k in o.why) reasons[k].push(o.why[k]);
    if (o.flag) flags.add(o.flag);
  });
  // MBLI requires 3+ years of professional leadership experience
  const mbliGate = flags.has("noexp");
  if (mbliGate) s.MBLI = Math.min(s.MBLI, Math.max(s.MBA, s.MAcc) - 1);
  for (const k in s) s[k] = Math.max(0, s[k]);
  const order = Object.keys(s).sort((a, b) => s[b] - s[a]);
  return { s, reasons, flags, order, mbliGate };
}

function maccTrack(flags) {
  if (flags.has("expedited")) return "Expedited Track: earn your BSBA and MAcc in five years (30 credit hours).";
  if (flags.has("acct")) return "Professional Track (30 credit hours), or the Data Analytics/Visualization Track if you like data work.";
  return "Accounting Practice & Reporting Track (APRT): 36 credit hours designed for people whose degree isn't in accounting.";
}

function esc(t) { const d = document.createElement("div"); d.textContent = t; return d.innerHTML; }

function panel(key, isTop, r) {
  const P = PROGRAMS[key];
  const reasons = r.reasons[key].slice(0, 4);
  let extra = "";
  if (key === "MAcc") extra = `<p class="note"><strong>Suggested track:</strong> ${esc(maccTrack(r.flags))}</p>`;
  if (key === "MBLI" && r.mbliGate) extra = `<p class="note">MBLI asks for at least 3 years of professional leadership experience. If it appeals to you, keep it on your list for a future fall cohort.</p>`;
  return `<article class="panel${isTop ? " top" : ""}">
    <div class="eyebrow">${isTop ? "Your best fit" : "Also worth a look"}</div>
    <h3>${esc(P.name)}</h3>
    <p>${esc(P.pitch)}</p>
    ${reasons.length ? `<div><strong>Why it fits you</strong><ul>${reasons.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
    ${extra}
    <dl class="facts">${P.facts.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>
    <div class="actions"><a href="${P.link}" target="_blank" rel="noopener">Explore the ${P.short} →</a></div>
    <p class="contact">Questions? <span>${esc(P.contact)}</span></p>
  </article>`;
}

function results() {
  const r = score();
  const top = r.order[0];
  const max = Math.max(1, r.s[top]);
  const close = r.s[r.order[1]] >= r.s[top] - 2;
  $("stepcount").textContent = "Your results";
  $("bar").style.width = "100%";
  $("results").innerHTML = `
    <div class="verdict">
      <div class="eyebrow">Your best fit</div>
      <h1>${PROGRAMS[top].short}</h1>
      <p>${esc(PROGRAMS[top].name)}${close ? ` · with the ${PROGRAMS[r.order[1]].short} a close second` : ""}</p>
    </div>
    <div class="scores" aria-label="Fit by program">
      ${r.order.map((k, i) => `<div class="score${i === 0 ? " top" : ""}"><b>${PROGRAMS[k].short}</b><div class="bar"><span style="width:${Math.round(r.s[k] / max * 100)}%"></span></div><em>${Math.round(r.s[k] / max * 100)}%</em></div>`).join("")}
    </div>
    <p class="small">Percentages compare each program to your top match. They aren't an admission decision; an advisor can help you weigh the details.</p>
    ${panel(top, true, r)}
    ${close ? panel(r.order[1], false, r) : ""}
    ${emailForm(top)}
    <div class="actions">
      <button class="btn ghost" id="restart" type="button">Retake the quiz</button>
    </div>`;
  $("restart").addEventListener("click", () => { answers.fill(null); idx = 0; $("stepcount").textContent = "Graduate programs"; setProgress(0); show("intro"); });
  wireEmail(r, top, close);
  show("results");
}

// ---------- Email my results ----------
// Leave EMAIL_ENDPOINT empty for demo mode: nothing is sent, and the page shows a preview.
// To go live, set it to a URL that accepts a JSON POST (a Google Apps Script web app,
// a CRM form endpoint, etc.). The payload is { email, optIn, topProgram, secondProgram, scores, answers }.
const EMAIL_ENDPOINT = "";
const PRIVACY_URL = "https://inside.nku.edu/it/aboutus/governance/data-and-web-privacy.html";

function emailForm(top) {
  return `<form class="emailbox" id="emailForm" novalidate>
    <div class="eyebrow">Keep your results</div>
    <h3>Email me my results</h3>
    <p>Get your match, the reasons behind it and next steps in your inbox.</p>
    <div class="field">
      <label for="em">Email address</label>
      <div class="row">
        <input id="em" type="email" autocomplete="email" placeholder="you@example.com" aria-describedby="emErr">
        <button class="btn" type="submit" id="emSend">Email my results</button>
      </div>
      <p class="err" id="emErr" hidden></p>
    </div>
    <label class="consent" for="optin"><input type="checkbox" id="optin"> Also send me information about the ${PROGRAMS[top].short} program.</label>
    <p class="small">We'll only use your email for what you choose above. <a href="${PRIVACY_URL}" target="_blank" rel="noopener">Privacy policy</a></p>
  </form>
  <div id="emailDone" hidden></div>`;
}

function emailPreview(r, top, close, email) {
  const P = PROGRAMS[top];
  const second = close ? PROGRAMS[r.order[1]] : null;
  const reasons = r.reasons[top].slice(0, 4);
  return `<div class="mail" aria-label="Email preview">
    <div class="mailhead">
      <div><span>From</span>Haile College of Business Graduate Programs</div>
      <div><span>To</span>${esc(email)}</div>
      <div><span>Subject</span>Your Haile program match: ${P.short}</div>
    </div>
    <div class="mailbody">
      <div class="mailbrand"><b>NKU</b>Haile College of Business</div>
      <p>Hi there,</p>
      <p>Thanks for taking the Haile Grad Program Finder. Based on your answers, your best fit is the <strong>${esc(P.name)} (${P.short})</strong>.</p>
      ${reasons.length ? `<p><strong>Why it fits you</strong></p><ul>${reasons.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${top === "MAcc" ? `<p><strong>Suggested track:</strong> ${esc(maccTrack(r.flags))}</p>` : ""}
      <p><strong>At a glance</strong></p>
      <ul>${P.facts.slice(0, 4).map(([a, b]) => `<li>${esc(a)}: ${esc(b)}</li>`).join("")}</ul>
      ${second ? `<p>The ${esc(second.name)} (${second.short}) was a close second, so it may be worth a look too.</p>` : ""}
      <p><a class="mailcta" href="${P.link}" target="_blank" rel="noopener">Explore the ${P.short}</a></p>
      <p>Questions? ${esc(P.contact)}</p>
      <p class="mailfoot">Haile College of Business · Northern Kentucky University · Nunn Drive, Highland Heights, KY 41099</p>
    </div>
  </div>`;
}

function wireEmail(r, top, close) {
  const form = $("emailForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("em").value.trim();
    const err = $("emErr");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = "Enter a valid email address, like name@example.com.";
      err.hidden = false; $("em").setAttribute("aria-invalid", "true"); $("em").focus();
      return;
    }
    err.hidden = true; $("em").removeAttribute("aria-invalid");
    const done = $("emailDone");
    if (EMAIL_ENDPOINT) {
      $("emSend").disabled = true; $("emSend").textContent = "Sending…";
      try {
        const res = await fetch(EMAIL_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ email, optIn: $("optin").checked, topProgram: top, secondProgram: close ? r.order[1] : null, scores: r.s,
            answers: answers.map((a, i) => ({ question: QUESTIONS[i].id, answer: QUESTIONS[i].opts[a].t })) }) });
        if (!res.ok) throw new Error(res.status);
        form.hidden = true;
        done.innerHTML = `<div class="sent"><h3>Check your inbox</h3><p>We sent your results to <strong>${esc(email)}</strong>. If you don't see it in a few minutes, check your spam folder.</p></div>`;
        done.hidden = false;
      } catch (_) {
        $("emSend").disabled = false; $("emSend").textContent = "Email my results";
        err.textContent = "We couldn't send your results just now. Please try again in a moment.";
        err.hidden = false;
      }
      return;
    }
    form.hidden = true;
    done.innerHTML = `<div class="sent">
      <div class="demo">Demo mode</div>
      <h3>Here's the email you'd receive</h3>
      <p>In this demo nothing is actually sent. Once email is connected, <strong>${esc(email)}</strong> would get this message${$("optin").checked ? `, plus follow-up information about the ${PROGRAMS[top].short}` : ""}.</p>
      ${emailPreview(r, top, close, email)}
      <div class="actions"><button class="btn ghost" type="button" id="emAgain">Use a different email</button></div>
    </div>`;
    done.hidden = false;
    $("emAgain").addEventListener("click", () => { done.hidden = true; form.hidden = false; $("em").focus(); });
  });
}

$("start").addEventListener("click", () => { idx = 0; render(); show("quiz"); });
$("next").addEventListener("click", () => {
  if (answers[idx] === null) return;
  if (idx < QUESTIONS.length - 1) { idx++; render(); window.scrollTo({ top: 0 }); }
  else results();
});
$("back").addEventListener("click", () => {
  if (idx === 0) { setProgress(0); $("stepcount").textContent = "Graduate programs"; show("intro"); }
  else { idx--; render(); }
});
