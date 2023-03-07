---
title: PyTorch 能有什么坏心思呢
tags:
  - deep learning
---

记录一些 PyTorch 的细节。

## toc

## 名不符实的损失函数

### NLL Loss

`nn.NLLLoss`，自称实现的是 Negative Log Likelihood Loss，理论上应该是：

$$
\ell (x, y) = \{ \ell_1, \dots, \ell_N \}, \text{ where } \ell_n = - \log x_{n, y_n}
$$

但[文档](https://pytorch.org/docs/stable/generated/torch.nn.NLLLoss.html)上同样也自称了，它实现的其实是：

$$
\ell_n = - x_{n, y_n}
$$

是的 log 仅仅只存在于函数名里 (╯‵□′)╯︵╧═╧

### Cross Entropy Loss

`nn.CrossEntropyLoss`，理论上的交叉熵应该是：

$$
L = - \sum_{i}^C y_i \log p_i
$$

其中 $y$ 是实际类别，$p$ 是预测类别。但[文档](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)上同样也说了，它实现的其实是 `nn.LogSoftmax()` + `nn.NLLLoss()`，即：

$$
L = - \sum_{i}^C y_i \cdot \text{LogSoftmax} (p_i)
$$

所以不能在用 `nn.CrossEntropyLoss` 前再手动 softmax 一次，不然就是两次 softmax 了，要出大问题。

## 不明觉厉的优化器实现

### Momentum

Momentum 的介绍可以参考[这里](/posts/zh/2020-07-10-messy-notes#一阶动量)。首先，PyTorch 的 [momentum 实现](https://github.com/pytorch/pytorch/blob/7a8c64da4d93fef5986aee5ada59289b5387cf8e/torch/optim/functional.py#L143)是：

$$
v_t = \rho v_{t-1} + \nabla L(\theta_t)
$$

$$
\theta_{t+1} = \theta_t - r \cdot v_t
$$

而不是：

$$
v_t = \rho v_{t-1} + r \cdot \nabla L(\theta_t)
$$

$$
\theta_{t+1} = \theta_t - v_t
$$

学习率是要跟整个动量相乘，而不是只乘梯度，Polyak's Momentum 和 Nesterov's Momentum 都是如此。

---

然后，Nesterov's Momentum 的公式是：

$$
v_t = \rho v_{t-1} + \nabla L(\theta_t - r \rho v_{t-1})
$$

$$
\theta_{t+1} = \theta_t - r \cdot v_t
$$

它的思想是，先假设当前参数点 0 按上一次的动量多更新一步到点 1（下图的棕色箭头），然后在更新后的参数 $\theta'_t = \theta_t - r \rho v_{t-1}$ 上算梯度 $\nabla L(\theta'_t)$（红色箭头），用这个梯度来算这一次的动量 $v_t$（绿色箭头），最后用这个动量来真正的更新当前参数点 0 到点 2。

![Hinton's example](/img/posts/zh/2021-01-28/nesterov-momentum-hinton.png) <!-- desc="图片来源：[What's the difference between momentum based gradient descent and Nesterov's accelerated gradient descent?](https://stats.stackexchange.com/questions/179915/whats-the-difference-between-momentum-based-gradient-descent-and-nesterovs-acc)" -->

可以看到，$\theta$ 和 $\nabla L(\theta)$ 是不需要关注的，我们没有必要 $0 \rarr 1 \rarr 0 \rarr 2 \rarr 3$，我们可以直接把 $\theta'$ 和 $\nabla L(\theta')$ 作为目标，即直接 $1 \rarr 2 \rarr 3$，$1 \rarr 2$ 是在更新参数，$2 \rarr 3$ 相当于是每一步都多更新一步，就不用再假设和回退了。

那么令 $\theta_t' = \theta_t - r \rho v_{t-1}$，则有：

$$
v_t = \rho v_{t-1} + \nabla L(\theta_t') \tag{1}
$$

$$
\begin{aligned}
   \theta_{t+1}' &= \theta_{t+1} - r \rho v_t \\
    &= \theta_t - r \cdot v_t - r \rho v_t \\
    &= \theta_t' + r \rho v_{t-1} - r \cdot v_t - r \rho v_t \\
    &= \theta_t' - r \nabla L(\theta_t') - r \rho v_t \\
    &= \theta_t' - r \cdot \Big (\nabla L(\theta_t') + \rho v_t \Big )
\end{aligned}  \tag{2}
$$

$- r \cdot \nabla L(\theta_t')$ 是 $1 \rarr 2$，$- r \rho v_t$ 是 $2 \rarr 3$。

包括 PyTorch 在内的深度学习框架的实现基本就是按照公式 $(1)$ 和 $(2)$ 来的，我把源码复制过来：

```python {13,17,21}
for i, param in enumerate(params):
    d_p = d_p_list[i]
    # l2 正则化
    if weight_decay != 0:
        d_p = d_p.add(param, alpha=weight_decay)
    if momentum != 0:
        buf = momentum_buffer_list[i]
        if buf is None:
            buf = torch.clone(d_p).detach()
            momentum_buffer_list[i] = buf
        else:
            # v_t = rho * v_{t-1} + delta L(theta'_t)
            buf.mul_(momentum).add_(d_p, alpha=1 - dampening)
        # nesterov's momentum
        if nesterov:
            # delta L(theta'_{t+1}) = delta L(theta'_t) + rho * v_t
            d_p = d_p.add(buf, alpha=momentum)
        else:
            d_p = buf
    # theta'_{t+1} = theta'_t - lr * delta L(theta'_{t+1})
    param.add_(d_p, alpha=-lr)
```

`buf` 是 $v_t$，`d_p` 是 $\nabla L(\theta_t')$，`alpha` 是动量参数 $\rho$，`lr` 是学习率 $r$。

## 奇奇怪怪的初始化器

### Kaiming Init

PyTorch 中，linear 层和 conv 层的默认 init 是 kaiming init：

**Delving Deep into Rectifiers: Surpassing Human-level Performance on ImageNet Classification.** _Kaiming He, et al._ ICCV 2015. [[Paper]](https://arxiv.org/pdf/1502.01852.pdf)

但这两个地方都给了一个奇怪的参数：

[`nn/modules/linear.py`](https://github.com/pytorch/pytorch/blob/7a8c64da4d93fef5986aee5ada59289b5387cf8e/torch/nn/modules/linear.py#L86) / [`nn/modules/conv.py`](https://github.com/pytorch/pytorch/blob/7a8c64da4d93fef5986aee5ada59289b5387cf8e/torch/nn/modules/conv.py#L111)

```python {2}
def reset_parameters(self) -> None:
    init.kaiming_uniform_(self.weight, a=math.sqrt(5))
    if self.bias is not None:
        fan_in, _ = init._calculate_fan_in_and_fan_out(self.weight)
        bound = 1 / math.sqrt(fan_in)
        init.uniform_(self.bias, -bound, bound)
```

`a` 这个参数看上去非常的奇怪，因为 PyTorch 在[文档](https://pytorch.org/docs/stable/nn.init.html#torch.nn.init.kaiming_uniform_)里说参数 `a` “only used with leaky_relu”。

`a` 代表的是 Leaky ReLU 函数 $x < 0$ 部分的斜率 negative slop。在用 kaiming uniform init 时，PyTorch 会根据这个 negative slop 算一个放缩因子 `gain` 出来（[文档](https://pytorch.org/docs/stable/nn.init.html#torch.nn.init.calculate_gain)）：

$$
\text{gain} = \sqrt{\frac{2}{1 + \text{negative\_slop}^2}}
$$

然后 kaiming uniform 的边界为：

$$
\text{gain} \cdot \sqrt{\frac{3}{\text{fan\_in}}}
$$

如果用别的激活函数，就不该有 negative slop 这个参数，`gain` 也会用别的公式计算，但 PyTorch 就是给你搞了一个 `a = sqrt(5)` 的奇怪的默认值。

这个问题在这两个地方有解释：

- [Kaiming init of conv and linear layers, why gain = sqrt(5)](https://github.com/pytorch/pytorch/issues/15314)
- [Why the default negative_slope for kaiming_uniform initialization of Convolution and Linear layers is √5?](https://discuss.pytorch.org/t/why-the-default-negative-slope-for-kaiming-uniform-initialization-of-convolution-and-linear-layers-is-5/29290)

PyTorch 的 init 进行过一次重构（[pr #9038](https://github.com/pytorch/pytorch/pull/9038)），重构前 linear 和 conv 的默认 init 是：

```python
def reset_parameters(self):
    stdv = 1. / math.sqrt(self.weight.size(1))
    self.weight.data.uniform_(-stdv, stdv)
    if self.bias is not None:
        self.bias.data.uniform_(-stdv, stdv)
```

重构之后才开始用 kaiming init。但为了保证向后兼容，他们希望重构前后的默认 init 的输出是等价的。重构前的均匀分布边界是（`self.weight.size(1)` 就是 `fan_in`（输入节点数量））：

$$
\frac{1}{\sqrt{\text{fan\_in}}}
$$

因此为了让重构前后的边界等价：

$$
\begin{aligned}
   \frac{1}{\sqrt{\text{fan\_in}}} &= \text{gain} \cdot \sqrt{\frac{3}{\text{fan\_in}}} \\
    &= \sqrt{\frac{6}{\text{fan\_in} \cdot (1 + \text{negative\_slop}^2)}} \\
\end{aligned}
$$

$$
\rArr \text{negative\_slop} = \sqrt{5}
$$

所以这个 `a = sqrt(5)` 的奇怪的默认值就是这样来的，不是什么推荐值，只是为了保证向后兼容而强行设的而已...

为什么我写了那么大一段话来解释这个无聊的结论...
