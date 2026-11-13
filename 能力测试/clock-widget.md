---
title: "24 小时交互时钟"
category: "能力测试"
date: "2026-11-09"
tags: ["交互", "示例"]
access: private
---

## 这是个什么

一个纯 SVG + 原生 JavaScript 的模拟时钟。滑杆的取值范围是一天中的**秒**（`0` – `86399`），
指针实时跟随：时针、分针、秒针按真实比例旋转，最外圈的圆环表示这一天已经走过的比例。

整个控件写在 `{=html}` 原始 HTML 块里，不依赖任何外部库，也不需要 R / Python 内核 ——
`quarto render` 直接产出单文件 HTML。

## 时钟

```{=html}
<div class="cg-clock" id="cg-clock-24h" data-phase="night">
  <style>
    .cg-clock {
      --cg-ink: #eaf0ff;
      --cg-dim: #8b97b8;
      --cg-line: rgba(255, 255, 255, 0.10);
      max-width: 880px;
      margin: 1.6rem auto;
      padding: 30px 32px;
      display: flex;
      flex-wrap: wrap;
      gap: 32px;
      align-items: center;
      justify-content: center;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.09);
      box-shadow: 0 26px 70px rgba(2, 6, 18, 0.55);
      color: var(--cg-ink);
      font-family: ui-sans-serif, system-ui, "Segoe UI", "Microsoft YaHei", sans-serif;
      background: radial-gradient(120% 120% at 28% 12%, #12203d 0%, #0a1124 52%, #05070f 100%);
      transition: background 900ms ease;
    }
    .cg-clock[data-phase="dawn"] {
      background: radial-gradient(120% 120% at 28% 12%, #4b3358 0%, #262340 52%, #0d1020 100%);
    }
    .cg-clock[data-phase="day"] {
      background: radial-gradient(120% 120% at 28% 12%, #2c4270 0%, #16233f 52%, #0b1120 100%);
    }
    .cg-clock[data-phase="dusk"] {
      background: radial-gradient(120% 120% at 28% 12%, #5b3141 0%, #2b2140 52%, #0d1020 100%);
    }

    .cg-clock__dial {
      width: 340px;
      max-width: 78vw;
      height: auto;
      display: block;
      filter: drop-shadow(0 10px 26px rgba(0, 0, 0, 0.35));
    }
    .cg-clock__hand line { transition: none; }

    .cg-clock__panel {
      flex: 1 1 320px;
      min-width: 280px;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .cg-clock__readout {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .cg-clock__hms {
      font: 600 44px/1 ui-monospace, "Cascadia Mono", "SFMono-Regular", Consolas, monospace;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.02em;
    }
    .cg-clock__badge {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.14em;
      padding: 5px 10px;
      border-radius: 999px;
      color: #0b1122;
      background: linear-gradient(120deg, #8ef0c8, #5cc8ff);
    }
    .cg-clock__sub {
      font-size: 13.5px;
      color: var(--cg-dim);
      font-variant-numeric: tabular-nums;
    }
    .cg-clock__sub b { color: var(--cg-ink); font-weight: 600; }

    .cg-clock__range {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 8px;
      margin: 4px 0 0;
      border-radius: 999px;
      outline: none;
      cursor: pointer;
      background: linear-gradient(90deg, #3aa0ff 0%, #8ef0c8 45%, #ffb454 70%, #ff6b6b 100%);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    }
    .cg-clock__range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid #0b1122;
      box-shadow: 0 0 0 2px #5cc8ff, 0 6px 16px rgba(0, 0, 0, 0.55);
      cursor: grab;
    }
    .cg-clock__range::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid #0b1122;
      box-shadow: 0 0 0 2px #5cc8ff;
      cursor: grab;
    }
    .cg-clock__range:focus-visible {
      box-shadow: 0 0 0 3px rgba(92, 200, 255, 0.45);
    }

    .cg-clock__scale {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      letter-spacing: 0.06em;
      color: var(--cg-dim);
      font-variant-numeric: tabular-nums;
    }

    .cg-clock__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 2px;
    }
    .cg-clock__chips button {
      font: inherit;
      font-size: 13px;
      padding: 7px 13px;
      border-radius: 999px;
      color: var(--cg-ink);
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      cursor: pointer;
      transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
    }
    .cg-clock__chips button:hover {
      background: rgba(92, 200, 255, 0.16);
      border-color: rgba(92, 200, 255, 0.55);
      transform: translateY(-1px);
    }
    .cg-clock__chips button:active { transform: translateY(0); }
    .cg-clock__chips button[data-primary] {
      background: linear-gradient(120deg, rgba(92, 200, 255, 0.28), rgba(142, 240, 200, 0.24));
      border-color: rgba(142, 240, 200, 0.45);
    }
    .cg-clock__hint {
      font-size: 12px;
      color: var(--cg-dim);
      line-height: 1.6;
    }
    .cg-clock__hint kbd {
      font: 600 11px/1 ui-monospace, Consolas, monospace;
      padding: 2px 5px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.10);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: var(--cg-ink);
    }
  </style>

  <svg class="cg-clock__dial" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="cgDialGrad" cx="50%" cy="42%" r="62%">
        <stop offset="0%" stop-color="#1a2444" />
        <stop offset="100%" stop-color="#0b1122" />
      </radialGradient>
      <linearGradient id="cgRingGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#5cc8ff" />
        <stop offset="55%" stop-color="#8ef0c8" />
        <stop offset="100%" stop-color="#ffb454" />
      </linearGradient>
      <filter id="cgGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

    <circle cx="200" cy="200" r="176" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="8" />
    <circle class="cg-ring-prog" cx="200" cy="200" r="176" fill="none"
            stroke="url(#cgRingGrad)" stroke-width="8" stroke-linecap="round"
            transform="rotate(-90 200 200)" stroke-dasharray="0 1106" />
    <circle class="cg-ring-dot" cx="200" cy="24" r="6" fill="#ffffff" filter="url(#cgGlow)" />

    <circle cx="200" cy="200" r="160" fill="url(#cgDialGrad)" stroke="rgba(255,255,255,0.14)" stroke-width="2" />
    <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

    <g class="cg-ticks"></g>
    <g class="cg-numerals"></g>

    <g class="cg-hand cg-hand--hour">
      <line x1="200" y1="212" x2="200" y2="112" stroke="#eaf0ff" stroke-width="7" stroke-linecap="round" />
    </g>
    <g class="cg-hand cg-hand--min">
      <line x1="200" y1="216" x2="200" y2="82" stroke="#cfe2ff" stroke-width="4.5" stroke-linecap="round" />
    </g>
    <g class="cg-hand cg-hand--sec">
      <line x1="200" y1="232" x2="200" y2="66" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" />
    </g>

    <circle cx="200" cy="200" r="7.5" fill="#eaf0ff" />
    <circle cx="200" cy="200" r="2.8" fill="#0b1122" />
  </svg>

  <div class="cg-clock__panel">
    <div class="cg-clock__readout">
      <span class="cg-clock__hms">00:00:00</span>
      <span class="cg-clock__badge">AM</span>
    </div>

    <div class="cg-clock__sub">第 <b class="cg-clock__sec">0</b> 秒 · 共 86400 秒</div>

    <input class="cg-clock__range" type="range" min="0" max="86399" step="1" value="0"
           aria-label="一天中的秒数，0 到 86399" />

    <div class="cg-clock__scale">
      <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
    </div>

    <div class="cg-clock__chips">
      <button type="button" data-cg-t="now" data-primary>此刻</button>
      <button type="button" data-cg-t="0">00:00</button>
      <button type="button" data-cg-t="21600">06:00</button>
      <button type="button" data-cg-t="43200">12:00</button>
      <button type="button" data-cg-t="64800">18:00</button>
      <button type="button" class="cg-play">▶ 播放</button>
    </div>

    <div class="cg-clock__hint">
      <kbd>←</kbd> <kbd>→</kbd> 逐秒微调，<kbd>PgUp</kbd> <kbd>PgDn</kbd> 一次跳 10%（约 2.4 小时），
      <kbd>Home</kbd> <kbd>End</kbd> 直达两端。播放时 1 秒 ≈ 1 分钟。
    </div>
  </div>
</div>

<script>
(function () {
  var root = document.getElementById("cg-clock-24h");
  if (!root || root.dataset.cgReady) return;
  root.dataset.cgReady = "1";

  var NS = "http://www.w3.org/2000/svg";
  var CX = 200, CY = 200;
  var DAY = 86400;
  var RING_R = 176;
  var RING_C = 2 * Math.PI * RING_R;

  function mk(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var key in attrs) node.setAttribute(key, attrs[key]);
    return node;
  }

  var svg = root.querySelector(".cg-clock__dial");
  var gTicks = svg.querySelector(".cg-ticks");
  var gNums = svg.querySelector(".cg-numerals");
  var ringProg = svg.querySelector(".cg-ring-prog");
  var ringDot = svg.querySelector(".cg-ring-dot");
  var handHour = svg.querySelector(".cg-hand--hour");
  var handMin = svg.querySelector(".cg-hand--min");
  var handSec = svg.querySelector(".cg-hand--sec");

  var slider = root.querySelector(".cg-clock__range");
  var outHms = root.querySelector(".cg-clock__hms");
  var outBadge = root.querySelector(".cg-clock__badge");
  var outSec = root.querySelector(".cg-clock__sec");
  var playBtn = root.querySelector(".cg-play");

  for (var i = 0; i < 60; i++) {
    var major = i % 5 === 0;
    var a = (i * 6) * Math.PI / 180;
    var r1 = major ? 131 : 142;
    var r2 = 150;
    gTicks.appendChild(mk("line", {
      x1: (CX + r1 * Math.sin(a)).toFixed(2),
      y1: (CY - r1 * Math.cos(a)).toFixed(2),
      x2: (CX + r2 * Math.sin(a)).toFixed(2),
      y2: (CY - r2 * Math.cos(a)).toFixed(2),
      stroke: major ? "#dfe8ff" : "rgba(223,232,255,0.34)",
      "stroke-width": major ? 3 : 1.3,
      "stroke-linecap": "round"
    }));
  }

  for (var h = 1; h <= 12; h++) {
    var ang = (h * 30) * Math.PI / 180;
    var label = mk("text", {
      x: (CX + 110 * Math.sin(ang)).toFixed(2),
      y: (CY - 110 * Math.cos(ang)).toFixed(2),
      "text-anchor": "middle",
      "dominant-baseline": "central",
      "font-size": "24",
      "font-weight": "600",
      "font-family": "ui-monospace, Consolas, monospace",
      fill: "#eaf0ff"
    });
    label.textContent = String(h);
    gNums.appendChild(label);
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function phaseOf(sec) {
    var hour = sec / 3600;
    if (hour < 5) return "night";
    if (hour < 8) return "dawn";
    if (hour < 17) return "day";
    if (hour < 20) return "dusk";
    return "night";
  }

  function nowSeconds() {
    var d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  }

  var t = nowSeconds();
  var playing = false;
  var rafId = 0;
  var lastFrame = 0;

  function apply() {
    t = ((t % DAY) + DAY) % DAY;

    var hh = Math.floor(t / 3600);
    var mm = Math.floor((t % 3600) / 60);
    var ss = Math.floor(t % 60);

    outHms.textContent = pad(hh) + ":" + pad(mm) + ":" + pad(ss);
    outBadge.textContent = hh < 12 ? "AM" : "PM";
    outSec.textContent = String(Math.round(t));
    slider.value = String(Math.round(t));

    handHour.setAttribute("transform", "rotate(" + ((t / 3600 % 12) * 30).toFixed(3) + " 200 200)");
    handMin.setAttribute("transform", "rotate(" + ((t / 60 % 60) * 6).toFixed(3) + " 200 200)");
    handSec.setAttribute("transform", "rotate(" + ((t % 60) * 6).toFixed(3) + " 200 200)");

    var frac = t / DAY;
    ringProg.setAttribute("stroke-dasharray", (RING_C * frac).toFixed(2) + " " + RING_C.toFixed(2));

    var dotAng = frac * 2 * Math.PI - Math.PI / 2;
    ringDot.setAttribute("cx", (CX + RING_R * Math.cos(dotAng)).toFixed(2));
    ringDot.setAttribute("cy", (CY + RING_R * Math.sin(dotAng)).toFixed(2));

    root.setAttribute("data-phase", phaseOf(t));
  }

  function stop() {
    playing = false;
    lastFrame = 0;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    playBtn.textContent = "▶ 播放";
  }

  function frame(now) {
    if (!playing) return;
    if (!lastFrame) lastFrame = now;
    var dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;
    t = (t + dt * 60) % DAY;
    apply();
    rafId = requestAnimationFrame(frame);
  }

  function play() {
    playing = true;
    lastFrame = 0;
    playBtn.textContent = "⏸ 暂停";
    rafId = requestAnimationFrame(frame);
  }

  slider.addEventListener("input", function () {
    stop();
    t = Number(slider.value);
    apply();
  });

  playBtn.addEventListener("click", function () {
    if (playing) stop(); else play();
  });

  var presets = root.querySelectorAll("[data-cg-t]");
  for (var p = 0; p < presets.length; p++) {
    presets[p].addEventListener("click", function () {
      stop();
      var v = this.getAttribute("data-cg-t");
      t = v === "now" ? nowSeconds() : Number(v);
      apply();
    });
  }

  apply();
})();
</script>
```

## 交互说明

- **滑杆**：`0` 到 `86399` 秒，即一天中的每一秒都有一格。拖动时指针立刻跟随，数字读数同步刷新。
- **外圈**：从 12 点位置顺时针走过的比例，就是一个整天已经流逝的进度；小圆点是当前时刻在 24 小时中的位置。
- **播放**：1 秒现实时间 ≈ 1 分钟表盘时间，秒针一圈一秒，看起来接近真表的节奏；一天走完约 24 分钟。
- **预设**：`此刻` / `00:00` / `06:00` / `12:00` / `18:00` 一键跳转。
- **键盘**：滑杆获得焦点后，`←` `→` 逐秒调整；`PgUp` / `PgDn` 一次跳 10%（约 2.4 小时）；`Home` / `End` 直达两端。
- **氛围**：卡片背景按 `night → dawn → day → dusk` 切换，用颜色区分你在一天里的哪一段。

## 指针角度的数学

设 $t \in [0,\,86400)$ 是午夜以来的秒数，三根指针相对 12 点方向顺时针的角度为

$$
\theta_h = 30^\circ\left(\frac{t}{3600} \bmod 12\right), \qquad
\theta_m = 6^\circ\left(\frac{t}{60} \bmod 60\right), \qquad
\theta_s = 6^\circ\left(t \bmod 60\right)
$$

系数 $30^\circ$ 与 $6^\circ$ 分别来自 $360^\circ/12$ 和 $360^\circ/60$；取模让时针在一天里绕两圈、
分针每小时绕一圈 —— 这也正是表盘只画 12 小时、却要表达 24 小时的缘故。

外圈进度与外圈小圆点的位置（$c_x, c_y$ 是圆心、$r$ 是外圈半径）：

$$
p = \frac{t}{86400}, \qquad
x = c_x + r\cos\left(2\pi p - \frac{\pi}{2}\right), \qquad
y = c_y + r\sin\left(2\pi p - \frac{\pi}{2}\right)
$$

减去 $\frac{\pi}{2}$ 是把起点从 3 点方向扳回 12 点方向，与 SVG 里 `rotate(-90 200 200)` 的用意相同。

## 一点实现说明

- 表盘是 **12 小时制**，时针在 24 小时里转两圈，所以单看指针分不出上午和下午 —— 由 `AM` / `PM` 徽章和 24 小时外环补上这一信息。
- 指针角度不是离散量：分针和时针都带了秒的小数部分，所以滑动时是平滑旋转而不会一格一格跳。
- 只在 SVG 上用 `transform="rotate(a 200 200)"` 改三个 `<g>`，没有重排 DOM，滑动跟手。
- 上面的公式用 `html-math-method: mathml` 输出成原生 MathML：没有脚本、不取 CDN，`clock24.html` 离线打开也是排好版的公式。
