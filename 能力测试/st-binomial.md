---
title: "二项分布：拖动 n 和 p"
category: "能力测试"
date: "2026-11-09"
tags: ["可视化", "统计"]
access: private
---

## 一次试验和二项分布

抛 $n$ 次硬币、正面概率 $p$，正面次数 $X$ 服从

$$
P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}
$$

公式很好背，但“$n$ 变大形状怎么变”“$p$ 靠近 0.5 为什么更对称”得看图。
拖动两个滑杆，柱子实时重排：

## 交互：调 n 和 p

```{=html}
<div class="bn">
  <style>
    .bn { padding: 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg-aside); }
    .bn svg { width: 100%; height: 220px; display: block; }
    .bn-controls { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; font-size: 13px; color: var(--fg); }
    .bn-controls label { display: flex; align-items: center; gap: 8px; }
    .bn-controls input[type=range] { width: 170px; accent-color: var(--accent); }
    .bn-controls b { font-variant-numeric: tabular-nums; min-width: 3em; }
    .bn-readout { margin-top: 8px; font-size: 13px; color: var(--fg-dim); font-variant-numeric: tabular-nums; }
    .bn-readout b { color: var(--fg); }
  </style>

  <svg viewBox="0 0 600 220" preserveAspectRatio="none"></svg>

  <div class="bn-controls">
    <label>试验次数 n <input type="range" data-k="n" min="1" max="30" step="1" value="10" /><b data-v="n">10</b></label>
    <label>正面概率 p <input type="range" data-k="p" min="0.02" max="0.98" step="0.01" value="0.5" /><b data-v="p">0.50</b></label>
  </div>

  <div class="bn-readout">
    期望 E[X] = np = <b class="bn-mean">5.00</b> · 方差 Var = np(1−p) = <b class="bn-var">2.50</b> · 标准差 ≈ <b class="bn-std">1.58</b>
  </div>
</div>

<script>
  (function () {
    var root = document.querySelector(".bn");
    if (!root || root.dataset.ready) return;
    root.dataset.ready = "1";

    var svg = root.querySelector("svg");
    var NS = "http://www.w3.org/2000/svg";
    var state = { n: 10, p: 0.5 };

    function comb(n, k) {
      var r = 1;
      for (var i = 1; i <= k; i += 1) r = (r * (n - k + i)) / i;
      return r;
    }

    function pmf(n, p, k) {
      return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    function draw() {
      var n = state.n;
      var p = state.p;
      var values = [];
      var max = 0;
      for (var k = 0; k <= n; k += 1) {
        var v = pmf(n, p, k);
        values.push(v);
        if (v > max) max = v;
      }

      var accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#5cc8ff";
      var dim = getComputedStyle(root).getPropertyValue("--fg-dim").trim() || "rgba(120,130,145,.9)";

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      var W = 600, H = 220, padX = 26, padY = 18;
      var slot = (W - padX * 2) / (n + 1);
      var barW = Math.max(2, slot * 0.72);

      values.forEach(function (v, k) {
        var h = (v / (max || 1)) * (H - padY * 2);
        var x = padX + k * slot + (slot - barW) / 2;
        var y = H - padY - h;

        var rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(barW));
        rect.setAttribute("height", String(Math.max(h, 0.5)));
        rect.setAttribute("rx", "2");
        rect.setAttribute("fill", v === max ? "#e5534b" : accent);
        rect.setAttribute("opacity", v === max ? "0.95" : "0.55");
        svg.appendChild(rect);

        if (n <= 16 && barW > 8) {
          var label = document.createElementNS(NS, "text");
          label.setAttribute("x", String(x + barW / 2));
          label.setAttribute("y", String(H - padY + 13));
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("font-size", "10");
          label.setAttribute("fill", dim);
          label.textContent = String(k);
          svg.appendChild(label);
        }
      });

      var axis = document.createElementNS(NS, "line");
      axis.setAttribute("x1", String(padX));
      axis.setAttribute("y1", String(H - padY));
      axis.setAttribute("x2", String(W - padX));
      axis.setAttribute("y2", String(H - padY));
      axis.setAttribute("stroke", "rgba(128,128,128,.4)");
      svg.appendChild(axis);
    }

    function sync() {
      var n = state.n;
      var p = state.p;
      var mean = n * p;
      var variance = n * p * (1 - p);
      root.querySelector(".bn-mean").textContent = mean.toFixed(2);
      root.querySelector(".bn-var").textContent = variance.toFixed(2);
      root.querySelector(".bn-std").textContent = Math.sqrt(variance).toFixed(2);
    }

    root.querySelectorAll("input[data-k]").forEach(function (input) {
      input.addEventListener("input", function () {
        state[input.dataset.k] = Number(input.value);
        var fmt = input.dataset.k === "n" ? String(state.n) : state.p.toFixed(2);
        root.querySelector('[data-v="' + input.dataset.k + '"]').textContent = fmt;
        sync();
        draw();
      });
    });

    sync();
    draw();
  })();
</script>
```

## 怎么玩

- **n 从 1 拉到 30**：柱子越来越尖，越来越像个钟形——中心极限定理的直观来源；
- **p = 0.5** 时分布对称；把 p 拉到 0.9，整团柱状图向左堆（绝大多数是正面），并明显左偏；
- 红色柱子是**众数所在位置**（概率最大的 k），它和期望 np 不一定重合——p 极端时尤为明显。

方差公式在这张图上是能"看见"的：n 越大柱子越窄，Var = np(1−p) 越大，但**相对**宽度（标准差/均值）在缩小。
