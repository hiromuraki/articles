---
category: "能力测试"
title: "代码片段"
date: "2026-11-07"
tags: ["代码", "工具链"]
access: private
---

# 代码片段

用来验证代码高亮、复制按钮和 qmd 的 raw html 块。

## 取一天里的秒

```js
function nowSeconds(d = new Date()) {
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}
```

```python
from datetime import datetime

def now_seconds():
    t = datetime.now()
    return t.hour * 3600 + t.minute * 60 + t.second
```

```bash
quarto render clock24.qmd
```

## raw html 块

下面是 qmd 的 `{=html}` 原始块，里面是一张带进度条的卡片 —— 如果渲染管线不特殊处理，它会原样显示成代码：

```{=html}
<div style="padding:14px 16px;border:1px solid #8ef0c8;border-radius:10px;background:rgba(142,240,200,.12)">
  <strong>raw html 生效了</strong>：这段样式来自 qmd 里的 <code>{=html}</code> 块。
  <div style="margin-top:12px;height:8px;border-radius:999px;background:rgba(94,166,150,.22);overflow:hidden">
    <div style="width:62%;height:100%;border-radius:999px;background:linear-gradient(90deg,#8ef0c8,#5cc8ff)"></div>
  </div>
  <div style="margin-top:7px;font-size:12.5px;color:#5f7d76">管线完成度 62%</div>
</div>
```

## 待办

- [x] 确认代码高亮
- [x] 确认复制按钮
- [ ] 确认 raw html 块
