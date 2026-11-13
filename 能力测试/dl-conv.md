---
title: "一维卷积：核在信号上滑动"
category: "能力测试"
date: "2026-11-09"
tags: ["可视化", "深度学习"]
access: private
---

## 卷积在做什么

一维卷积就是在信号上**滑一个窗口，每停一下算一次加权和**：

$$
y[t] = \sum_{k=0}^{K-1} w[k] \cdot x[t+k]
$$

这句话用动画看最清楚：核 $w$ 从左往右滑，下面那排柱子就是逐步算出来的输出。
换个核，输出的“性格”完全变了——平滑、边缘、锐化都在这一行公式里。

## 交互：换核 + 播放

```{=html}
<div class="cv">
  <style>
    .cv { padding: 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg-aside); }
    .cv canvas { width: 100%; height: 300px; display: block; }
    .cv-controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 12px; font-size: 13px; color: var(--fg); }
    .cv-controls button {
      font: inherit; font-size: 13px; padding: 5px 14px; border-radius: 999px;
      border: 1px solid var(--line); background: var(--bg); color: var(--fg); cursor: pointer;
    }
    .cv-controls button:hover { border-color: var(--accent); color: var(--accent); }
    .cv-controls button.on { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }
    .cv-readout { margin-left: auto; font-size: 12.5px; color: var(--fg-dim); font-variant-numeric: tabular-nums; }
    .cv-readout b { color: var(--fg); }
  </style>

  <canvas></canvas>

  <div class="cv-controls">
    <button type="button" data-kernel="smooth" class="on">平滑 [1/3, 1/3, 1/3]</button>
    <button type="button" data-kernel="edge">边缘 [−1, 0, 1]</button>
    <button type="button" data-kernel="sharp">锐化 [−1, 2, −1]</button>
    <button type="button" class="cv-play">▶ 滑一遍</button>
    <span class="cv-readout">窗口位置 t = <b class="cv-t">0</b> / 9</span>
  </div>
</div>

<script>
  (function () {
    var root = document.querySelector(".cv");
    if (!root || root.dataset.ready) return;
    root.dataset.ready = "1";

    var canvas = root.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var playBtn = root.querySelector(".cv-play");
    var tOut = root.querySelector(".cv-t");

    var input = [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0];
    var kernels = {
      smooth: [1 / 3, 1 / 3, 1 / 3],
      edge: [-1, 0, 1],
      sharp: [-1, 2, -1]
    };
    var current = "smooth";
    var pos = 0;
    var timer = 0;

    function conv(arr, kernel, t) {
      var sum = 0;
      for (var k = 0; k < kernel.length; k += 1) sum += kernel[k] * arr[t + k];
      return sum;
    }

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      var kernel = kernels[current];
      var W = canvas.clientWidth;
      var H = canvas.clientHeight;
      var dim = getComputedStyle(root).getPropertyValue("--fg-dim").trim() || "rgba(120,130,145,.9)";
      var accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#5cc8ff";

      ctx.clearRect(0, 0, W, H);

      var slot = (W - 40) / input.length;
      var barW = slot * 0.7;

      // 输入信号
      ctx.fillStyle = "rgba(92,200,255,.45)";
      input.forEach(function (v, i) {
        var h = v * 60;
        var x = 20 + i * slot + (slot - barW) / 2;
        ctx.fillRect(x, 84 - h, barW, h);
      });

      // 核窗口
      ctx.strokeStyle = "#e5534b";
      ctx.lineWidth = 2;
      ctx.strokeRect(20 + pos * slot, 16, slot * kernel.length, 72);

      // 输出
      var outs = [];
      for (var t = 0; t <= pos; t += 1) outs.push(conv(input, kernel, t));
      var maxAbs = 1;
      outs.forEach(function (v) { maxAbs = Math.max(maxAbs, Math.abs(v)); });

      var base = 230;
      var scale = 60 / maxAbs;
      ctx.fillStyle = accent;
      outs.forEach(function (v, i) {
        var h = v * scale;
        var x = 20 + i * slot + (slot - barW) / 2;
        if (h >= 0) ctx.fillRect(x, base - h, barW, h);
        else { ctx.fillStyle = "#e5534b"; ctx.fillRect(x, base, barW, -h); ctx.fillStyle = accent; }
      });

      // 基线
      ctx.strokeStyle = "rgba(128,128,128,.45)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(20, base); ctx.lineTo(W - 20, base); ctx.stroke();

      // 标注
      ctx.fillStyle = dim;
      ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("输入 x", 20, 108);
      ctx.fillText("核 w（窗口 " + pos + "）", 20, 128);
      ctx.fillText("输出 y = w ∗ x", 20, base + 18);
      ctx.fillText("y[" + pos + "] = " + conv(input, kernel, pos).toFixed(2), W - 150, 128);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = 0;
      playBtn.textContent = "▶ 滑一遍";
    }

    playBtn.addEventListener("click", function () {
      if (timer) { stop(); return; }
      pos = 0;
      tOut.textContent = "0";
      draw();
      playBtn.textContent = "⏸ 暂停";
      timer = setInterval(function () {
        var maxPos = input.length - kernels[current].length;
        if (pos >= maxPos) { stop(); return; }
        pos += 1;
        tOut.textContent = String(pos);
        draw();
      }, 420);
    });

    root.querySelectorAll("button[data-kernel]").forEach(function (button) {
      button.addEventListener("click", function () {
        stop();
        current = button.dataset.kernel;
        pos = 0;
        tOut.textContent = "0";
        root.querySelectorAll("button[data-kernel]").forEach(function (b) { b.classList.toggle("on", b === button); });
        draw();
      });
    });

    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    requestAnimationFrame(resize);
    resize();
  })();
</script>
```

## 怎么读

| 核 | 输出特征 | 直觉 |
| --- | --- | --- |
| 平滑 `[1/3,1/3,1/3]` | 台阶变成斜坡，两侧多出中间值 | 平均 = 抹平突变 |
| 边缘 `[−1,0,1]` | 只在跳变处出现一正一负的尖峰，平坦区全为 0 | 差分 = 找变化 |
| 锐化 `[−1,2,−1]` | 台阶边缘出现强响应，且极性更强 | 二阶差分 = 强调拐点 |

**平坦区输出为 0** 这件事值得盯着看：卷积核在做的是"和局部模式做匹配"，
平滑核匹配"有变化"，边缘核匹配"陡变"，锐化核匹配"拐点"。CNN 里学到的核，本质上就是同一件事的二维版本。

## 和 CNN 的关系

- 这里是一维、单个核、手动选权重；
- CNN 是二维、多个核、权重由梯度下降学出来（正是上一篇那个东西）；
- 但前向计算就是这段 `conv()`：`sum += kernel[k] * input[t+k]`。
