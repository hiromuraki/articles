---
title: "梯度下降：拖动学习率看轨迹"
category: "能力测试"
date: "2026-11-09"
tags: ["可视化", "优化", "深度学习"]
access: private
---

## 为什么需要“看见”它

梯度下降的公式谁都背得出：

$$
w_{t+1} = w_t - \eta \, \nabla f(w_t)
$$

但**为什么学习率大了会发散、小了要磨很久**，光看公式体会不到。下面这个小控件把 $f(w) = (w-2)^2 + 1$ 的下降过程画出来：
拖动学习率，看小球怎么走。

## 交互：拖动学习率

```{=html}
<div class="gd">
  <style>
    .gd { padding: 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg-aside); }
    .gd canvas { width: 100%; height: 260px; display: block; }
    .gd-controls { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-top: 12px; font-size: 13px; color: var(--fg-dim); }
    .gd-controls label { display: flex; align-items: center; gap: 8px; color: var(--fg); }
    .gd-controls input[type=range] { width: 150px; accent-color: var(--accent); }
    .gd-controls button {
      font: inherit; font-size: 13px; padding: 5px 14px; border-radius: 999px;
      border: 1px solid var(--line); background: var(--bg); color: var(--fg); cursor: pointer;
    }
    .gd-controls button:hover { border-color: var(--accent); color: var(--accent); }
    .gd-readout { margin-left: auto; font-variant-numeric: tabular-nums; color: var(--fg); }
    .gd-readout b { font-weight: 600; }
    .gd-warn { color: #e5534b; font-weight: 600; }
  </style>

  <canvas></canvas>

  <div class="gd-controls">
    <label>学习率 η <input type="range" min="0.01" max="1.2" step="0.01" value="0.1" /><b class="gd-lr">0.10</b></label>
    <button type="button" class="gd-play">▶ 开始下降</button>
    <button type="button" class="gd-reset">重置</button>
    <span class="gd-readout">w=<b class="gd-w">-3.00</b> · f(w)=<b class="gd-loss">26.00</b> · 步数 <b class="gd-step">0</b> <span class="gd-warn"></span></span>
  </div>
</div>

<script>
  (function () {
    var root = document.querySelector(".gd");
    if (!root || root.dataset.ready) return;
    root.dataset.ready = "1";

    var canvas = root.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var lrInput = root.querySelector("input[type=range]");
    var lrOut = root.querySelector(".gd-lr");
    var playBtn = root.querySelector(".gd-play");
    var resetBtn = root.querySelector(".gd-reset");
    var wOut = root.querySelector(".gd-w");
    var lossOut = root.querySelector(".gd-loss");
    var stepOut = root.querySelector(".gd-step");
    var warn = root.querySelector(".gd-warn");

    var W_MIN = -4, W_MAX = 9, F_MAX = 30;
    var w = -3, lr = 0.1, steps = 0, trail = [], timer = 0, running = false;

    function f(x) { return (x - 2) * (x - 2) + 1; }
    function df(x) { return 2 * (x - 2); }

    function pad() { return 40; }

    function toX(x) {
      var inner = canvas.clientWidth - pad() * 2;
      return pad() + ((x - W_MIN) / (W_MAX - W_MIN)) * inner;
    }
    function toY(y) {
      var inner = canvas.clientHeight - pad() * 2;
      return canvas.clientHeight - pad() - (Math.min(y, F_MAX) / F_MAX) * inner;
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
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      var dim = getComputedStyle(root).getPropertyValue("--fg-dim").trim() || "rgba(120,130,145,.9)";
      var accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#5cc8ff";

      ctx.clearRect(0, 0, width, height);

      // 坐标轴
      ctx.strokeStyle = "rgba(128,128,128,.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(toX(W_MIN), toY(0));
      ctx.lineTo(toX(W_MAX), toY(0));
      ctx.stroke();

      // 曲线 f(w)
      ctx.beginPath();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      for (var i = 0; i <= 200; i += 1) {
        var x = W_MIN + ((W_MAX - W_MIN) * i) / 200;
        var y = toY(f(x));
        if (i === 0) ctx.moveTo(toX(x), y); else ctx.lineTo(toX(x), y);
      }
      ctx.stroke();

      // 轨迹
      ctx.fillStyle = "rgba(229,83,75,.55)";
      trail.forEach(function (item) {
        ctx.beginPath();
        ctx.arc(toX(item.w), toY(f(item.w)), 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 当前点
      ctx.beginPath();
      ctx.fillStyle = "#e5534b";
      ctx.arc(toX(w), toY(f(w)), 6, 0, Math.PI * 2);
      ctx.fill();

      // 坐标标签
      ctx.fillStyle = dim;
      ctx.font = "12px ui-monospace, Consolas, monospace";
      ctx.fillText("w", toX(W_MAX) - 12, toY(0) + 16);
      ctx.fillText("f(w)", pad() - 6, pad() - 14);
      ctx.fillText("最小值 w=2", toX(2) - 26, toY(1) - 10);
    }

    function sync() {
      wOut.textContent = w.toFixed(2);
      lossOut.textContent = f(w).toFixed(2);
      stepOut.textContent = String(steps);
      lrOut.textContent = lr.toFixed(2);
    }

    function stop() {
      running = false;
      if (timer) clearInterval(timer);
      timer = 0;
      playBtn.textContent = "▶ 开始下降";
    }

    function tick() {
      w = w - lr * df(w);
      steps += 1;
      trail.push({ w: w });
      if (trail.length > 60) trail.shift();

      if (Math.abs(w) > 60) {
        warn.textContent = "（发散了：η 太大）";
        stop();
      }
      sync();
      draw();
    }

    playBtn.addEventListener("click", function () {
      if (running) { stop(); return; }
      running = true;
      warn.textContent = "";
      playBtn.textContent = "⏸ 暂停";
      timer = setInterval(tick, 110);
    });

    resetBtn.addEventListener("click", function () {
      stop();
      w = -3;
      steps = 0;
      trail = [];
      warn.textContent = "";
      sync();
      draw();
    });

    lrInput.addEventListener("input", function () {
      lr = Number(lrInput.value);
      sync();
    });

    window.addEventListener("resize", resize);
    resize();
    sync();
  })();
</script>
```

## 怎么读这张图

- **η = 0.1**：小球稳稳滑到谷底 $w=2$，约 30 步收敛——典型的好学习率。
- **η → 1.0 以上**：点开始后小球来回跨过谷底、越跳越远，最后标红「发散了：η 太大」。
- **η = 0.01**：轨迹对，但每步挪一点点，60 步还没到底——这就是"学习率太小"的手感。

## 公式与这段代码的对应

梯度是 $\nabla f(w) = 2(w-2)$，代码里就是 `df(x) { return 2 * (x - 2) }`；
更新式 $w \leftarrow w - \eta \nabla f(w)$ 就是 `w = w - lr * df(w)`。
一行公式、一行代码，中间没有抽象层——这正是这类笔记想要的效果。

## 依赖说明

整段控件只有 HTML + CSS + 60 行原生 JS，没有任何外部库，所以：

- 不用联网，不用构建；
- 想改曲线就改 `f` 和 `df` 两个函数（比如换成 $f(w) = w^4 - 3w^2$ 看双谷）；
- 想加动量就再记一个速度变量——教学用途的扩展到这里就够了。
