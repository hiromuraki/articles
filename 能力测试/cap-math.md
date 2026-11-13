---
title: "数学"
category: "能力测试"
date: "2026-11-09"
tags: ["能力测试", "渲染"]
access: private
---

# 数学

## 行内数学

````md
速度 $v = \frac{s}{t}$，角度 $30^\circ$。
````

---

速度 $v = \frac{s}{t}$，角度 $30^\circ$。

## 块级公式

````md
$$
\theta = 30^\circ\left(\frac{t}{3600} \bmod 12\right)
$$
````

---

$$
\theta = 30^\circ\left(\frac{t}{3600} \bmod 12\right)
$$

## 多行对齐（aligned）

````md
$$
\begin{aligned}
p &= \frac{t}{86400} \\
A(p) &= 2\pi r p
\end{aligned}
$$
````

---

$$
\begin{aligned}
p &= \frac{t}{86400} \\
A(p) &= 2\pi r p
\end{aligned}
$$

## 分段函数（cases）与矩阵（pmatrix）

````md
$$
f(t) =
\begin{cases}
0, & t < 0,\\
1, & t \ge 0,
\end{cases}
\qquad
M = \begin{pmatrix} a & b \\ c & d \end{pmatrix}
$$
````

---

$$
f(t) =
\begin{cases}
0, & t < 0,\\
1, & t \ge 0,
\end{cases}
\qquad
M = \begin{pmatrix} a & b \\ c & d \end{pmatrix}
$$

## 求和、积分、极限

````md
$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}, \quad
\int_0^1 x^2 \, dx = \frac{1}{3}, \quad
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$
````

---

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}, \quad
\int_0^1 x^2 \, dx = \frac{1}{3}, \quad
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

## `\text{}` 里的中文

````md
$$
\text{总时长} = 24 \times 3600 = 86400\ \text{秒}
$$
````

---

$$
\text{总时长} = 24 \times 3600 = 86400\ \text{秒}
$$

## 公式编号（不支持，见「仍不支持的部分」）

````md
$$
a^2 + b^2 = c^2
$$ {#eq-pythagoras}

见 @eq-pythagoras。
````

---

$$
a^2 + b^2 = c^2
$$ {#eq-pythagoras}

见 @eq-pythagoras。
