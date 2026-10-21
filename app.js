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
    <div class="actions">
      <button class="btn ghost" id="restart" type="button">Retake the quiz</button>
    </div>`;
  $("restart").addEventListener("click", () => { answers.fill(null); idx = 0; $("stepcount").textContent = "Graduate programs"; setProgress(0); show("intro"); });
  show("results");
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
