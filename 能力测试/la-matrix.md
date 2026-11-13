---
title: "矩阵变换：拖动参数看格子"
category: "能力测试"
date: "2026-11-09"
tags: ["可视化", "线性代数"]
access: private
---

## 为什么用控件看

矩阵作用在平面上，靠公式推“它把空间拉伸多少、旋转多少”很抽象。
下面把 $2\times2$ 矩阵 $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ 直接作用在单位正方形上：
拖动四个参数，看格子怎么被压扁、剪切、翻转。

## 交互：拖动 a、b、c、d

```{=html}
<div class="mx">
  <style>
    .mx { padding: 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg-aside); }
    .mx canvas { width: 100%; height: 300px; display: block; }
    .mx-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px 20px; margin-top: 12px; font-size: 13px; }
    .mx-controls label { display: flex; align-items: center; gap: 8px; color: var(--fg); }
    .mx-controls input[type=range] { flex: 1 1 auto; width: 100%; min-width: 0; accent-color: var(--accent); }
    .mx-controls b { font-variant-numeric: tabular-nums; min-width: 3.2em; text-align: right; }
    .mx-readout { margin-top: 10px; font-size: 13px; color: var(--fg-dim); font-variant-numeric: tabular-nums; }
    .mx-readout b { color: var(--fg); }
  </style>

  <canvas></canvas>

  <div class="mx-controls">
    <label>a<input type="range" data-k="a" min="-2" max="2" step="0.1" value="1" /><b data-v="a">1.0</b></label>
    <label>b<input type="range" data-k="b" min="-2" max="2" step="0.1" value="0.5" /><b data-v="b">0.5</b></label>
    <label>c<input type="range" data-k="c" min="-2" max="2" step="0.1" value="0.5" /><b data-v="c">0.5</b></label>
    <label>d<input type="range" data-k="d" min="-2" max="2" step="0.1" value="1" /><b data-v="d">1.0</b></label>
  </div>

  <div class="mx-readout">
    行列式 det = ad − bc = <b class="mx-det">0.75</b> · 面积缩放 <b class="mx-area">0.75×</b> · <span class="mx-note">行列式 &lt; 0 时发生翻转</span>
  </div>
</div>

<script>
  (function () {
    var root = document.querySelector(".mx");
    if (!root || root.dataset.ready) return;
    root.dataset.ready = "1";

    var canvas = root.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var state = { a: 1, b: 0.5, c: 0.5, d: 1 };
    var RANGE = 3.5;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function scale() {
      return Math.min(canvas.clientWidth, canvas.clientHeight) / (RANGE * 2);
    }
    function px(x) { return canvas.clientWidth / 2 + x * scale(); }
    function py(y) { return canvas.clientHeight / 2 - y * scale(); }

    function grid() {
      var s = scale();
      ctx.strokeStyle = "rgba(128,128,128,.18)";
      ctx.lineWidth = 1;
      for (var v = -Math.floor(RANGE); v <= Math.floor(RANGE); v += 1) {
        ctx.beginPath(); ctx.moveTo(px(v), 0); ctx.lineTo(px(v), canvas.clientHeight); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, py(v)); ctx.lineTo(canvas.clientWidth, py(v)); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(128,128,128,.45)";
      ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(canvas.clientWidth, py(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), canvas.clientHeight); ctx.stroke();
      void s;
    }

    function polygon(points, fill, stroke, dash) {
      ctx.beginPath();
      points.forEach(function (p, i) {
        if (i === 0) ctx.moveTo(px(p[0]), py(p[1])); else ctx.lineTo(px(p[0]), py(p[1]));
      });
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) {
        ctx.setLineDash(dash || []);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    function apply(x, y) {
      return [state.a * x + state.b * y, state.c * x + state.d * y];
    }

    function arrow(from, to, color) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.moveTo(px(from[0]), py(from[1]));
      ctx.lineTo(px(to[0]), py(to[1]));
      ctx.stroke();
      var angle = Math.atan2(py(to[1]) - py(from[1]), px(to[0]) - px(from[0]));
      ctx.beginPath();
      ctx.moveTo(px(to[0]), py(to[1]));
      ctx.lineTo(px(to[0]) - 9 * Math.cos(angle - 0.4), py(to[1]) - 9 * Math.sin(angle - 0.4));
      ctx.lineTo(px(to[0]) - 9 * Math.cos(angle + 0.4), py(to[1]) - 9 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      grid();

      var accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#5cc8ff";

      // 原正方形（虚线）
      polygon([[0, 0], [1, 0], [1, 1], [0, 1]], null, "rgba(128,128,128,.55)", [4, 4]);

      // 变换后的正方形
      var m = [apply(0, 0), apply(1, 0), apply(1, 1), apply(0, 1)];
      polygon(m, "rgba(92,200,255,.18)", accent);

      // 基向量
      arrow([0, 0], apply(1, 0), "#e5534b");
      arrow([0, 0], apply(0, 1), "#2ea043");
    }

    function sync() {
      var det = state.a * state.d - state.b * state.c;
      root.querySelector(".mx-det").textContent = det.toFixed(2);
      root.querySelector(".mx-area").textContent = Math.abs(det).toFixed(2) + "×";
      root.querySelector(".mx-note").textContent = det < 0 ? "行列式 < 0：发生了翻转（取向反了）" : "行列式 > 0：取向保持";
    }

    root.querySelectorAll("input[data-k]").forEach(function (input) {
      input.addEventListener("input", function () {
        state[input.dataset.k] = Number(input.value);
        root.querySelector('[data-v="' + input.dataset.k + '"]').textContent = Number(input.value).toFixed(1);
        sync();
        draw();
      });
    });

    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    requestAnimationFrame(resize);
    resize();
    sync();
  })();
</script>
```

## 怎么玩

| 参数 | 现象 |
| --- | --- |
| `a=2, d=2`，其余 0 | 整体放大 2 倍，det = 4，面积变 4 倍 |
| `b=1`，其余是单位矩阵 | 水平剪切：正方形变成平行四边形，面积不变（det=1） |
| `a=0, b=1, c=1, d=0` | 换位：把 (1,0) 送到 (0,1)，det = −1，翻转 |
| `a=d=0, b=−1, c=1` | 逆时针 90° 旋转，det = 1 |

行列式就是面积缩放因子，负号代表翻面——这两点在这张图上比任何公式都直观。
