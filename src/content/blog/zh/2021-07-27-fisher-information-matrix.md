---
title: Fisher 信息矩阵
tags:
  - machine learning
  - math
---

## toc

Fisher 信息矩阵的数学意义和直观上的理解。

## 定义

假设有一个似然函数 $p(x \mid \theta)$，为了求能让这个似然最大的 $\hat{\theta}$（最大似然估计），需要让它的对数似然函数的一阶导为 0，即：

$$
s(\theta) = \nabla \log p(x \mid \theta) = 0
$$

这个一阶导 $s(\theta)$ 被称为 score function。**Fisher 信息矩阵**（Fisher Information Matrix）的定义，就是这个 score function 的二阶矩（second moment）：

$$
F = \mathbb{E}_{p(x \mid \theta)} \Big [ s(\theta)^2 \Big ] = \mathbb{E}_{p(x \mid \theta)} \Big [ \nabla \log p(x \mid \theta) \nabla \log p(x \mid \theta)^{\top} \Big ]
$$

考虑监督学习的场景，模型为 $p_{\theta}(y \mid x)$，真实数据分布为 $p_D(y \mid x)$，那么上式可以写为：

$$
F = \mathbb{E}_{p_{\theta}(y \mid x)} \Big [ \nabla \log p_{\theta}(y \mid x) \nabla \log p_{\theta}(y \mid x)^{\top} \Big ]
$$

因为 $p_{\theta}(y \mid x)$ 是 intractable 的，所以在算这个分布时会用蒙特卡洛采样来近似。需要注意的是，反向传播算出来梯度是 $\nabla p_D(y \mid x)$，而在 true Fisher 中，$y$ 是从模型 $p_{\theta}(y \mid x)$ 中采样的，这时的 $\nabla \log p_{\theta}(y \mid x)$ 并不是我们在反向传播时算出来的梯度，而是需要额外计算。

但在 empirical Fisher 中，上式变为了：

$$
F = \mathbb{E}_{p_D(y \mid x)} \Big [ \nabla \log p_D(y \mid x) \nabla \log p_D(y \mid x)^{\top} \Big ]
$$

即 $y$ 是从直接数据分布 $p_D(y \mid x)$ 中采样的，这时就可以直接使用反向传播算出来的梯度，从而减小计算量。当数据量足够大，模型已经可以很好地拟合数据分布时，empirical Fisher 和 true Fisher 的差距不会很大。

## 数学意义

### Score Function 的方差

:::info[断言]
Fisher 信息矩阵就是 score function 的方差
:::

:::tip[证明]
首先可以证明的是 score function 的期望为 0，即：

$$
\mathbb{E}_{p(x \mid \theta)} [ s(\theta) ]^2 = 0
$$

证明过程可以参考博客 [Fisher Information Matrix](https://wiseodd.github.io/techblog/2018/03/11/fisher-information/)。

所以有：

$$
\begin{aligned}
  Var[s(\theta)] &= \mathbb{E}_{p(x \mid \theta)} [ s(\theta)^2 ] - \textcolor{blue}{\underbrace{\mathbb{E}_{p(x \mid \theta)} [ s(\theta) ]^2}_{=0}} \\
    &= \mathbb{E}_{p(x \mid \theta)} [ s(\theta)^2 ] \\
    &= F
\end{aligned}
$$

:::

对这个方差的直观理解可以为：

对两组相互独立的随机变量 $X, Y$，有：

$$
Var(X + Y) = Var(X) + Var(Y)
$$

也就是说当收集到的数据越来越多，方差就会变得越来越大。所以 Fisher 信息矩阵越大，说明 score function 的方差越大，也就说明得到的信息越来越多。

这个理解来源于：[[知乎] 费雪信息的直观意义是什么？- Detian Deng 的回答](https://www.zhihu.com/question/26561604/answer/33275982)

### 海森矩阵的期望

:::info[断言]
Fisher 信息矩阵等于对数似然函数的海森矩阵（Hessian Metrix）的期望取负，即：

$$
F = - \mathbb{E}_{p(x \mid \theta)} \Big [H_{\log p(x \mid \theta)} \Big ]
$$

:::

:::tip[证明]
参考博客 [Fisher Information Matrix](https://wiseodd.github.io/techblog/2018/03/11/fisher-information/)
:::

也就是说，$F$ 反映了对数似然函数在参数真实值处的曲率。对于一个对数似然函数，它的曲率越小，说明它越平而宽，从而说明我们对于参数的估计越不确定（因为平而宽的对数似然函数意味着，观测值出现的概率并不比其他值出现的概率大多少）；曲率越大，说明它越高而窄，则说明对于参数的估计越确定。

换句话说，$F$ 反映了我们对于参数估计的不确定度。

## 参考

- [[博客] Fisher Information Matrix](https://wiseodd.github.io/techblog/2018/03/11/fisher-information/)
- [[知乎] 费雪信息 (Fisher information) 的直观意义是什么](https://www.zhihu.com/question/26561604)
