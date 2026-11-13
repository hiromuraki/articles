---
title: "交互控件"
category: "能力测试"
date: "2026-11-09"
tags: ["能力测试", "渲染"]
access: private
---

# 交互控件

## 原始 HTML + 内联脚本

````md
```{=html}
<button type="button" class="chip" onclick="this.dataset.n = (Number(this.dataset.n) || 0) + 1; this.textContent = '点击次数 ' + this.dataset.n;">
  点我
</button>
```
````

---

```{=html}
<button type="button" class="chip" onclick="this.dataset.n = (Number(this.dataset.n) || 0) + 1; this.textContent = '点击次数 ' + this.dataset.n;">
  点我
</button>
```

按钮能点、计数在变，说明笔记里的脚本真的执行了——因为每篇笔记在 iframe 里是完整页面。

## 带样式与 SVG 的组件

````md
```{=html}
<div style="display:flex;gap:12px;align-items:center">
  <svg width="56" height="56" viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="24" fill="none" stroke="#8ef0c8" stroke-width="4"/>
    <circle cx="28" cy="28" r="12" fill="#5cc8ff"/>
  </svg>
  <span>内联 SVG 与自定义样式，全部写在 {=html} 块里。</span>
</div>
```
````

---

```{=html}
<div style="display:flex;gap:12px;align-items:center">
  <svg width="56" height="56" viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="24" fill="none" stroke="#8ef0c8" stroke-width="4"/>
    <circle cx="28" cy="28" r="12" fill="#5cc8ff"/>
  </svg>
  <span>内联 SVG 与自定义样式，全部写在 {=html} 块里。</span>
</div>
```

## 完整交互组件

库里的 **24 小时交互时钟**（`clock-widget`）就是同一个机制的完整例子：
滑杆、指针旋转、播放按钮、主题配色，全部是一段 `{=html}` 里的 SVG + JavaScript。
