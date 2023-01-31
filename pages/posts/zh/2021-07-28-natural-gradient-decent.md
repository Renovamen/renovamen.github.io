---
title: 自然梯度下降
tags:
  - machine learning
  - math
---

[[toc]]

自然梯度下降（Natural Gradient Decent）把参数看成一种概率分布，然后使用 KL 散度而不是欧氏距离来作为距离的度量，从而更好地描述更新后的分布和原分布有多大的不同。


## 基础

### 梯度下降

假设有 $\theta \in R^n$，$f(\theta)$ 是具有一阶连续偏导数的函数，现在要求解无约束最优化问题：

$$
\min_\theta f(\theta)
$$

**梯度下降法**（Gradient Decent）是一种迭代算法。它先取一个适当的初值，然后不断迭代，更新 $\theta$ 的值，极小化目标函数，直到收敛。第 $k+1$ 次迭代的公式为：

$$
\theta^{(k+1)} = \theta^{(k)} + \eta \vec{v}
$$

其中 $\eta$ 表示步长，$\vec{v}$ 表示更新方向。将损失函数 $L(\theta^{(k+1)})$ 在 $\theta^{(k)}$ 处泰勒展开：

$$
\begin{aligned}
  L(\theta^{(k+1)}) &= L(\theta^{(k)}) + \nabla L(\theta^{(k)}) \cdot (\theta^{(k+1)} - \theta^{(k)}) \textcolor{blue}{+ o(\theta^{(k)})} \quad \text{(泰勒展开)}\\
    &= L(\theta^{(k)}) + \eta \vec{v} \cdot \nabla L(\theta^{(k)}) \textcolor{blue}{+ o(\theta^{(k)})}\\
    &\approx L(\theta^{(k)}) + \eta \vec{v} \cdot \nabla L(\theta^{(k)}) \quad (\text{忽略掉二阶及以上高阶项} \: \textcolor{blue}{o(\theta^{(k)})})
\end{aligned}
$$

因为我们的目标是让损失函数的值不断变小，即：

$$
L(\theta^{(k+1)}) - L(\theta^{(k)}) = \eta \vec{v} \cdot \nabla L(\theta^{(k)}) < 0
$$

而 $\eta$ 是一个大于 0 的常量，所以要使上式成立，$\vec{v}$ 需要与 $\nabla L(\theta^{(k)})$ 的夹角 $\alpha$ 大于 $90^{\circ}$。又因为：

$$
\vec{v} \cdot \nabla L(\theta^{(k)}) = \| \vec{v} \| \cdot \| \nabla L(\theta^{(k)}) \| \cdot \cos(\alpha)
$$

显然当夹角 $\alpha = - \pi$，即 $\vec{v}$ 与 $\nabla L(\theta^{(k)})$ 的方向完全相反时，$\cos(\alpha) = -1$，两者乘积最小，损失值下降最快。所以梯度下降法会取**负梯度方向**为更新方向，所以它又叫**最速下降法**（Steepest Descent）。

所以方向向量 $\vec{v}$ 为：

$$
\vec{v} = - \frac{\nabla L(\theta^{(k)})}{\| \nabla L(\theta^{(k)}) \|}
$$

则更新公式为：

$$
\theta^{(k+1)} = \theta^{(k)} - \eta \cdot \frac{\nabla L(\theta^{(k)})}{\| \nabla L(\theta^{(k)}) \|}
$$

为了方便，直接把 $\frac{\eta}{\| \nabla L(\theta^{(k)}) \|}$ 整体表示为 $\eta$，最终有：

$$
\theta^{(k+1)} = \theta^{(k)} - \eta \cdot \nabla L(\theta^{(k)})
$$


### KL 散度

**KL 散度**（Kullback-Leibler Divergence）又叫**相对熵**，描述的是概率分布 p 与目标分布 q 之间的差异，计算公式为：

$$
KL (p \| q) = \int p(x) \log \frac{p(x)}{q(x)} dx
$$

两个分布越接近，KL 散度越小，当 $p=q$ 时，$KL (p \| q) = 0$。


### Fisher 信息矩阵

具体的细节可以看我的[这篇博客](/posts/zh/2021-07-27-fisher-information-matrix)。简单来说，**Fisher 信息矩阵**（Fisher Information Matrix）是：

- 对数似然函数的一阶导的二阶矩（基本定义）：

  $$
  F = \mathbb{E}_{p(x \mid \theta)} \Big [ \nabla \log p(x \mid \theta) \nabla \log p(x \mid \theta)^T \Big ]
  $$

- 对数似然函数的二阶导（海森矩阵）的期望取负（[证明过程](https://wiseodd.github.io/techblog/2018/03/11/fisher-information/)）

  $$
  F = - \mathbb{E}_{p(x \mid \theta)} \left [ \frac{\partial^2}{\partial_{\theta} \partial_{\theta^T}} \log p(x \mid \theta) \right ]
  $$



### KL 散度和 Fisher 信息

一个结论是：令 $d \to 0$，有：

$$
KL \Big ( p(x \mid \theta) \| p(x \mid \theta + d) \Big ) \approx \frac{1}{2} d^T F d
$$

::: details 证明过程
为了方便，用 $p(\theta)$ 来表示 $p(x \mid \theta)$，用 $p(\theta + d)$ 来表示 $p(x \mid \theta + d)$。

$$
\begin{aligned}
  KL \Big ( p(\theta) \| p(\theta + d) \Big ) &= \int p(\theta) \log \frac{p(\theta)}{p(\theta + d)} dx = \mathbb{E}_{p(\theta)} \left [ \log \frac{p(\theta)}{p(\theta + d)} \right ] \\
    &= \mathbb{E}_{p(\theta)} [ \log p(\theta) ] - \textcolor{blue}{\mathbb{E}_{p(\theta)} [ \log p(\theta + d) ]}  \\
    &\approx \mathbb{E}_{p(\theta)} [ \log p(\theta) ] - \textcolor{blue}{\underbrace{\mathbb{E}_{p(\theta)} \left [ \log p(\theta) + \nabla \log p(\theta) d + \frac{1}{2} d^T \nabla^2 \log p(\theta) d \right ]}_{\text{二阶泰勒展开}}}  \\
    & = - \mathbb{E}_{p(\theta)} [ \nabla \log p(\theta) d ] - \mathbb{E}_{p(\theta)} \left [ \frac{1}{2} d^T \nabla^2 \log p(\theta) d \right ] \\
    &= - \left [ \int_{\theta} p(\theta) \frac{1}{p(\theta)} \nabla p(\theta) d \theta \right ] d - \frac{1}{2} d^T \mathbb{E}_{p(\theta)} [ \nabla^2 \log p(\theta) ] d \\
    &= - \underbrace{\left [ \nabla \int_{\theta}  p(\theta) d \theta \right ]}_{\text{积分求导互换}} d - \frac{1}{2} d^T \mathbb{E}_{p(\theta)} [ \nabla^2 \log p(\theta) ] d \\
    & = - \frac{1}{2} d^T \underbrace{\mathbb{E}_{p(\theta)} [ \nabla^2 \log p(\theta) ]}_{= - F} d \\
    & = \frac{1}{2} d^T F d
\end{aligned}
$$
:::

即 Fisher 信息矩阵 $F$ 是 KL 散度的局部二阶近似。KL 散度定义了两个概率分布之间的差异，而 Fisher 信息矩阵定义了用 KL 散度做度量时，概率分布空间上局部曲率。



### 黎曼流形

#### 流形

**流形**（Manifold）是局部具有欧氏空间（Euclidean space）性质的拓扑空间。可以把流形看做一个平滑的面，在流形上的每一个点上都可以做一个切面，也就是说每个点的周围都有一个可以看做平面的非常小的邻域，因此这个邻域是遵循欧氏度量的。举个栗子，人在地球上会感觉周围的平面都是平坦的，而感受不到地球的曲率。所以流形中的每一个点周围都有一个曲率为 0 的小型邻域和欧氏度量。

更数学一点的表述是：假设 $M$ 是一个拓扑空间，如果 $M$ 上的任意一点 $p$，都有一个和欧氏空间 $\Reals^n$ 上的某个开集同胚的邻域，则称 $M$ 是一个 $n$ 维流形。这个欧氏空间上的开集被称为**切空间**（tangent space），记为 $T_p \mathcal{X}$。


#### 黎曼度量

欧氏空间上两点之间的距离可以直接用向量的模长来算。但流形不是线性空间，因此要用别的方法来算流形上的长度。假设 $\gamma: [a, b] \to M$ 是流形上一段连续可微分的弧线，那么一个可以想到的方法是算弧线 $\gamma$ 中所有点上的距离微分的积分：

$$
L(\gamma) = \int_a^b \| \gamma'(x) \| dx
$$

相当于对每个点 $\gamma(x)$，给出在它的切空间中计算距离的方法，通过这个方法算出 $x$ 的切向量（tangent vector）$\gamma'(x) = \frac{\partial}{\partial x} \gamma(x)$ 的模长 $\| \gamma'(x) \|$。最后把所有的 $\| \gamma'(x) \|$ 加起来，就是弧线的长度。

那么计算 $\| \gamma'(x) \|$ 的公式是：

$$
\| \gamma'(x) \|^2 = ⟨ \gamma'(x), \gamma'(x) ⟩ = g_{\gamma(x)} (\gamma'(x), \gamma'(x))
$$

模长的平方就是 $\ell_2$ 范数，而 $\ell_2$ 范数就是向量自己跟自己的内积（inner product）。因此，$g_p: T_p \mathcal{X} \times T_p \mathcal{X} \to \Reals$ 就是一个定义了切空间上的内积的度量（metrics）。如果这个度量的值随点 $p$ **平滑**地改变，那么这个度量就叫**黎曼度量**（Riemannian Metrics），具有黎曼度量的流形就叫**黎曼流形**（Riemannian Manifold）。

引用[这里](https://www.math.fsu.edu/~whuang2/pdf/ECNU_slides.pdf)的解释：

> Roughly, a Riemannian manifold $M$ is a smooth set with a smoothly-varying inner product on the tangent spaces.

更数学一点，对于任意 $p \in M$，黎曼度量 $g = g_p$ 需要满足：

- 对于任意 $u, v \in T_p \mathcal{X}$，有 $g(u, v) = g(v, u)$
- 对于任意 $u \in T_p \mathcal{X}$，有 $g(u, u) > 0$
- 当且仅当 $u = 0$ 时，$g(u, u) = 0$


## 自然梯度下降

### 约束优化角度

在梯度下降中，我们要优化的问题是：

$$
\begin{gathered}
  \min_{d} L(\theta + d) \\
  \text{s.t.} \enspace \| d \| \leq \epsilon
\end{gathered}
$$

其中 $\epsilon$ 相当于最大步长，参数更新的距离可以用欧氏距离来计算。

如[之前](#梯度下降)所述，损失值 $L$ 下降最快的方向是负梯度方向：

$$
- \frac{\nabla L(\theta)}{\| \nabla L(\theta) \|} = \lim_{\epsilon \to 0} \frac{1}{\epsilon} \arg \min_{d \text{ s.t.} \| d \| \leq \epsilon} L(\theta + d)
$$

但是如果直接用梯度下降，参数发生改变后，参数的分布也会发生改变。所以分布的改变量也需要约束，而且这个改变量无法用欧氏距离来度量。因此自然梯度优化的是参数的概率分布 $p(x \mid \theta)$，而分布之间的距离一般可以用 [KL 散度](#kl-散度)来衡量，所以现在优化问题变成了：

$$
\begin{gathered}
  \min_{d} L(\theta + d) \\
  \text{s.t.} \enspace KL \Big ( p(x \mid \theta) \| p(x \mid \theta + d) \Big ) \leq \epsilon
\end{gathered}
$$

用拉格朗日乘子法把约束条件写进优化问题里：

$$
\begin{aligned}
  d^* &= \arg \min_{d} L(\theta + d) + \lambda \Big ( KL \big ( p(x \mid \theta) \| p(x \mid \theta + d) \big ) - \epsilon \Big )  \\
    &\approx \arg \min_{d} \underbrace{L(\theta) + \nabla L(\theta)^T d}_{\text{一阶泰勒展开近似}} + \underbrace{\frac{1}{2} \lambda d^T F d}_{\text{二阶泰勒展开近似}} - \lambda \epsilon
\end{aligned}
$$

因为目标是函数取极小值，所以其导数应该为 0：

$$
\begin{aligned}
  0 &= \frac{\partial}{\partial d} \left [ L(\theta) + \nabla L(\theta)^T d + \frac{1}{2} \lambda d^T F d  - \lambda \epsilon \right ] \\
    &= \nabla L(\theta) + \lambda F d \\
  \lambda F d &= -\nabla L(\theta) \\
  d &= - \frac{1}{\lambda} F^{-1} \nabla L(\theta)
\end{aligned}
$$

也就是说最后的梯度为 $\tilde{\nabla} L(\theta) = F^{-1} \nabla L(\theta)$（常数项可以和学习率合并），称为**自然梯度**。


### 流形角度

可以看到，梯度下降的方向取决于范数 $\|d\|$ 该怎么求。如果把这个优化问题看成流形上的优化，“$\|d\|$ 怎么求”就相当于“流形上的度量是什么”。

原始梯度下降是在欧氏空间上的优化，所以度量就是欧氏范数。而自然梯度下降中是在概率分布空间上的优化，黎曼流形上的点 $p(x \mid \theta)$ 是一个参数化的概率分布。当参数从 $\theta$ 变成 $\theta + d$ 时，$p(x \mid \theta)$ 和 $p(x \mid \theta + d)$ 之间的距离就是 $\frac{1}{2} d^T F d$。可以看到 Fisher 信息矩阵 $F$ 正好就是这个黎曼流形上的黎曼度量。

因为 Fisher 信息反映了似然概率分布空间上的局部曲率，因此用 $F$ 作为度量求出来的梯度下降方向考虑了似然概率分布空间上的曲率信息。曲率越大，说明为了维持这个似然，参数能够变化的量就越小。



## 参考

- [[知乎] 如何理解 Natural Gradient Descent？](https://www.zhihu.com/question/266846405)
- [[知乎] 多角度理解自然梯度](https://zhuanlan.zhihu.com/p/82934100)
- [[知乎] 什么是一般梯度、相对梯度、自然梯度和随机梯度？](https://www.zhihu.com/question/21923317/answer/205008255)
- [[博客] Natural Gradient Descent](https://wiseodd.github.io/techblog/2018/03/14/natural-gradient/)
- [[博客] 从勾股定理到黎曼度量](https://kexue.fm/archives/3969)
- [[课件] Differential Geometry.](https://maths-people.anu.edu.au/~andrews/DG/) *Ben Andrews.* Australian National University.
- [[课件] Differential Geometry.](http://people.maths.ox.ac.uk/~joyce/Nairobi2019/Hitchin-DifferentiableManifolds.pdf) *Nigel Hitchin.* Oxford University.
- [[课件] Riemannian Metrics.](https://www.ime.usp.br/~gorodski) *Claudio Gorodski.* University of São Paulo.
- [[论文] Geometric Deep Learning: Going beyond Euclidean Data.](https://maths-people.anu.edu.au/~andrews/DG/) IEEE Signal Processing Magazine 2017. *Michael M. Bronstein, et al.*
