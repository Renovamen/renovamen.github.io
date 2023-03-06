---
title: Self-Attention / Convolution 大锅烩
tags:
  - deep learning
---

长期记录和实现看过的各种论文里的自注意力和卷积机制，咕咕咕，实现地址在：[<span i-gg:link /> Github](https://github.com/Renovamen/torchop)

提前定义，$F \in \Reals^{N \times d}$ 是一个特征，在文本任务里，$N$ 是文本长度，$d$ 是词向量维度；在视觉任务里，$N$ 是特征图的 $W \times H$，$d$ 是通道数量。

## toc

## Attention

### Self-Attenion

**Attention Is All You Need.** _Ashish Vaswani, et al._ NIPS 2017. [[Paper]](https://arxiv.org/abs/1706.03762) [[Code]](https://github.com/tensorflow/tensor2tensor/blob/master/tensor2tensor/models/transformer.py)

![self-attention](/img/posts/zh/2021-08-31/self-attention.png) <!-- w=300 desc="图片来源：论文 [Beyond Self-attention: External Attention using Two Linear Layers for Visual Tasks](https://arxiv.org/pdf/2105.02358.pdf)" -->

$Q, V, K$ 由同一个值 $F \in \Reals^{N \times d}$ 经过线性变换得到，然后 attention map 和 context 的计算公式为：

$$
\begin{gathered}
  A = \text{softmax}(\frac{QK^T}{\sqrt{d_k}}) \\
  F_{\text{out}} = A V
\end{gathered}
$$

其中 $d_k = d / h$ 是一个注意力头的维度，$h$ 是注意力头的数量。除以 $\sqrt{d_k}$ 是因为，$d_k$ 越大 $QK^T$ 就会越大，可能就会将 softmax 函数推入梯度极小的区域，导致更新缓慢，所以要用 $\sqrt{d_k}$ 对 $QK^T$ 进行缩放。

最后 $F_{\text{out}}$ 会经过线性层、残差连接和 Layer Normalization。

一个简化版本是，把线性变换扔掉，直接用 $F$ 计算 attention，即 $Q = K = V = F$，从而省掉那三个线性层的计算量：

![simplified self-attention](/img/posts/zh/2021-08-31/simplified-self-attention.png) <!-- w=300 desc="图片来源：论文 [Beyond Self-attention: External Attention using Two Linear Layers for Visual Tasks](https://arxiv.org/pdf/2105.02358.pdf)" -->

$$
\begin{gathered}
  A = \text{softmax}(\frac{FF^T}{\sqrt{d_k}}) \\
  F_{\text{out}} = A F
\end{gathered}
$$

Self Attention 是在计算任意两个位置之间的相关性，得到一个 $N \times N$ 的 attention map，所以计算复杂度是 $O(d N^2)$（“简化版本”也是这样），这是一个很高的计算开销。所以 Bert 的最大长度只有 $N = 512$。而对于视觉任务来说，$N = W \times H$，所以特征图也不能太大，一般 $W$ 和 $H$ 都需要先被降到 10+ 的数量级。

### SAGAN

**Self-Attention Generative Adversarial Networks.** _Han Zhang, et al._ ICML 2019. [[Paper]](https://arxiv.org/abs/1805.08318) [[Code]](https://github.com/brain-research/self-attention-gan)

SAGAN 是一个用 self-attention 来替代了卷积层的 GAN，它的 self-attention 跟原始 transformer 的 self-attention 的不同在于：

- 在将 $F$ 通过线性变换得到 $Q$ 和 $K$ 时，进行了降维（$d \to d / 8$）
- 在残差连接之前，对 $F_{\text{out}}$ 进行了缩放：$\gamma F_{\text{out}}$，其中 $\gamma$ 是一个可学习的参数

### External Attention

**Beyond Self-attention: External Attention using Two Linear Layers for Visual Tasks.** _Han Zhang, et al._ arXiv 2021. [[Paper]](https://arxiv.org/abs/2105.02358) [[Code]](https://github.com/MenghaoGuo/EANet)

![external-attention](/img/posts/zh/2021-08-31/external-attention.png) <!-- desc="图片来源：论文 [Beyond Self-attention: External Attention using Two Linear Layers for Visual Tasks](https://arxiv.org/pdf/2105.02358.pdf)" -->

External Attention 主要考虑了以下问题：

- 原始 self attention 会计算任意两个位置（pixel）之间的相关性，计算量太大。但实际上，attention map 是很稀疏的，只有很少量的 pixel 之间有关联，所以没有必要用 $N \times N$ 的 attention map
- 原始 self attention 只考虑了同一个样本中不同 pixel 之间的关系，但没有考虑不同样本间的关联

因此 External Attention 提出用 external memory unit $M_k$ 和 $M_v$（都是可学习的参数）来代替 $K$ 和 $V$：

$$
\begin{gathered}
  A = \text{Norm}(Q M_k^T) \\
  F_{\text{out}} = A M_v
\end{gathered}
$$

其中 $M \in \Reals^{S \times d}$，$S$ 是一个超参。

对于第一个问题，$O(d N^2)$ 的复杂度来源于 $Q, K, V$ 的矩阵相乘，而这里 $K, V$ 的维度从 $N \times d$ 变成了 $S \times d$，因此复杂度变为了 $O(d S N)$，与 $N$ 线性相关。因为 $S$ 可以取得远远小于 $N$（在论文的实验中，$S = 64$ 的时候效果就已经很好了），所以计算复杂度可以降低很多。

对于第二个问题，可以认为 external memory unit 学习到了整个数据集的信息，因此考虑了不同样本间的关联。

式 $(1)$ 中的 $\text{Norm}(\cdot)$ 是 double-normalization 操作。Softmax 只会对一个维度进行归一化，但 attention map 对于输入特征的 scale 比较敏感，所以 double-normalization 在 softmax 之后对另一个维度也进行了归一化：

$$
\begin{gathered}
  \tilde{a} = Q M_k^T \\
  \hat{a}_{ij} = \underbrace{\frac{\text{exp} (\tilde{a}_{ij})}{\sum_k \text{exp} (\tilde{a}_{\textcolor{red}{k}j})}}_{\text{Softmax}} \\
  a_{ij} = \frac{\hat{a}_{ij}}{\sum_k \hat{a}_{i\textcolor{red}{k}}}
\end{gathered}
$$

### Fastformer

**Fastformer: Additive Attention Can Be All You Need.** _Chuhan Wu, et al._ arXiv 2021. [[Paper]](https://arxiv.org/abs/2108.09084) [[Code]](https://github.com/wuch15/Fastformer)

又是『XXX is all you need』系列的题目，让人审美疲劳。虽然这个题目包含了它应该包含的信息：“比原始 Transformer 快，因为我们用了 additive attention”，但还是让人审美疲劳。

![fastformer](/img/posts/zh/2021-08-31/fastformer.png) <!-- w=500 desc="图片来源：论文 [Fastformer: Additive Attention Can Be All You Need](https://arxiv.org/pdf/2108.09084.pdf)" -->

同样是想解决 $N \times N$ 的稀疏 attention map 带来的高计算量的问题。它的处理方式是先用 additive attention 把 $Q$ 融合成了一个 global query vector $Q_\text{global} \in \Reals^d$：

$$
\begin{gathered}
  A_q = \text{softmax}(\frac{Q W_q^T}{\sqrt{d_k}}) \\
  Q_\text{global} = A_q Q
\end{gathered}
$$

其中 $W_q^T \in \Reals^d$（这里直接把 $N$ 维降到了 1 维）。然后用 $K$ 和 $Q_\text{global}$ 矩阵 **element-wise 相乘**，乘完之后再用和上面一样的 additive attention 得到一个向量 $K_\text{global} \in \Reals^d$：

$$
\begin{gathered}
  \overline{K} = K \odot Q_\text{global} \\
  A_k = \text{softmax}(\frac{(\overline{K} W_k^T}{\sqrt{d_k}}) \\
  K_\text{global} = A_q \overline{K}
\end{gathered}
$$

最后用 $K_\text{global}$ 和 $V$ 矩阵相乘，得到最终的输出：

$$
F_{\text{out}} = K_\text{global} V
$$

因为有 additive attention 这个降维操作，所以上面每一个矩阵乘法的复杂度都是 $Q(Nd)$，element-wise 乘法的复杂度也是 $Q(Nd)$，所以总的时间复杂度是线性的 $O(Nd)$。

### HaloNets

**Scaling Local Self-Attention for Parameter Efficient Visual Backbones.** _Ashish Vaswani, et al._ CVPR 2019. [[Paper]](https://arxiv.org/abs/2103.12731)

![halo](/img/posts/zh/2021-08-31/halo.png) <!-- desc="图片来源：论文 [Scaling Local Self-Attention for Parameter Efficient Visual Backbones](https://arxiv.org/pdf/2103.12731.pdf)" -->

用 self-attention 来做类似于卷积的操作，心路历程是：

- 如果用全局 self-attention，计算量太大；如果用卷积中的滑动窗口，在每个窗口里做 local self-attention，由于每个窗口的结果都要一直存在显存里没法释放，容易造成显存溢出
- 但卷积中，两个相邻的滑动窗口中的大部分元素都是一样的，为了减少这部分重复的计算量，论文直接将输入的特征图分成了不重复的一些 block（上图中的 blocked image），然后在每个 block 里做 local self-attention，所以论文管这个操作叫 blocked local self-attention
- 但只在 block 里做 self-attention 也是不合适的，周边共享的元素多少也要考虑一些，因此论文在每个窗口边上都 pad 了一圈（上图中的 neighborhood windows 周边那圈五颜六色的东西），以增加感受野。因为 pad 的这一圈看上去很像光环，所以论文管这个操作叫 haloing

### Linformer

**Linformer: Self-Attention with Linear Complexity.** _Sinong Wang, et al._ arXiv 2020. [[Paper]](https://arxiv.org/abs/2006.04768)

![linformer](/img/posts/zh/2021-08-31/linformer.png) <!-- w=250 desc="图片来源：论文 [Linformer: Self-Attention with Linear Complexity](https://arxiv.org/pdf/2006.04768.pdf)" -->

从实现上来看，和原始 Transformer 的区别就是，对 $K, V$ 用 $E, F \in \Reals^{N \times k}$ 进行了降维（上图中的 Projection），即：

$$
F_{\text{out}} = \underbrace{\text{softmax} \left ( \frac{Q (E K)^T}{\sqrt{d_k}} \right)}_{\overline{P}: N \times k} \cdot \underbrace{F V}_{k \times d}
$$

$k$ 是一个超参常数，所以时间复杂度降到 $Q(Nkd)$。同时它还使用了一些参数共享的 trick 来进一步降低计算量。

但论文还证明了为什么可以用 $\overline{P}$ 来近似原始的 attention map $P$（虽然我觉得略显强行）。原文的 Theorem 2 先证明了当 $k = 5 \log(nd) / (\epsilon^2 - \epsilon^3)$ 时，一定存在 $E, F$ 使得 $\overline{P}$ 可以近似 $P$。这里 $k$ 的取值与 $n$ 有关，复杂度还不是线性。但如果考虑到 $\text{rank}(A) = d$ 这一点（我还没搞明白这一点是怎么来的），$k$ 的选择就可以独立于 $n$，从而变为线性复杂度。

## Convolution

### Selective Kernel

**Selective Kernel Networks.** _Xiang Li, et al._ CVPR 2019. [[Paper]](https://arxiv.org/abs/1903.06586) [[Code]](https://github.com/implus/SKNet)

希望能够自适应地调整感受野的大小，为了做到这一点，论文采取的方式是用多个大小不同的卷积核生成特征图，然后把这些特征图融合在一起。

![selective kernel](/img/posts/zh/2021-08-31/sk.png) <!-- desc="图片来源：论文 [Selective Kernel Networks](https://arxiv.org/pdf/1903.06586.pdf)" -->

- Split：用 $M$ 个大小不同的卷积核生成特征图，上图中举的是 $3 \times 3$ 和 $5 \times 5$ 两个卷积核的例子
- Fuse：把不同卷积核生成的特征图相加，然后经过平均池化 $\to$ 全连接 $\to$ Batch Norm $\to$ ReLU，得到一个特征向量 $z \in \Reals^d$，其中 $d = \max (C / r, L)$，$r, L$ 都是超参，用于控制通道维度
- Select：用 $z$ 来计算一个 attention map，然后把 $M$ 个特征图加权求和，得到最终的输出

### Squeeze-and-Excitation

**Squeeze-and-Excitation Networks.** _Jie Hu, et al._ CVPR 2018. [[Paper]](https://arxiv.org/abs/1709.01507) [[Code]](https://github.com/hujie-frank/SENet)

赋予不同通道不同的权重，这样就可以加强重要的通道特征。

![squeeze and excitation](/img/posts/zh/2021-08-31/se.png) <!-- desc="图片来源：论文 [Squeeze-and-Excitation Networks](https://arxiv.org/pdf/1709.01507.pdf)" -->

通道权重的计算方式是：

- Squeeze：先把卷积出的特征图 $u \in \Reals^{H \times W \times C}$ 平均池化成一个向量 $z \in \Reals^C$，这一步抽离了空间上的信息，这样后面就可以只关注通道之间的关系
- Excitation：$z$ 只能体现在当前 batch 上计算出来的通道关系，所以论文加了两个全连接层来利用整个数据集的信息：

  $$
  s = \sigma (W_2 \delta(W_1 z))
  $$

  其中 $\delta$ 是 ReLU 激活函数，$W_2$ 和 $W_1$ 是两个全连接层，$s \in \Reals^C$ 是最终各个通道的权重

最后把特征图 $u$ 跟权重 $s$ 相乘就行。

### Involution

**Involution: Inverting the Inherence of Convolution for Visual Recognition.** _Duo Li, et al._ CVPR 2021. [[Paper]](https://arxiv.org/abs/2103.06255) [[Code]](https://github.com/d-li14/involution)

普通的卷积有两个特点：空间不变（spatial-agnostic）（不同空间位置共享同一个卷积核）和通道特异（channel-specific）（不同通道对应不同的卷积核）。参数数量为 $C_i \times C_o \times K \times K$，其中 $C_i, C_o , K$ 分别为输入和输出通道数量，以及卷积核大小。

而这篇论文认为：

- 由于通道数量 $C_i, C_o$ 往往成百上千，所以为了限制参数量和计算量，$K$ 的取值往往较小，从而限制了感受野大小
- 空间不变的特征可能会剥夺卷积核适应不同空间位置的能力
- 卷积核在通道维度往往存在冗余，即很多卷积核是近似线性相关的。也就是说，如果把每个输出通道对应的卷积核铺成一个 $C_i \times K^2$ 大小的矩阵，那么矩阵的秩不会超过 $K^2$。所以缩减卷积核的通道维度可能并不会明显影响效果

因此论文提出了一种跟卷积相反的 involution 操作：空间特异（不同空间位置对应不同的卷积核）和通道不变（不同通道共享同一个卷积核），参数数量为 $H \times W \times K \times K \times G$，$G$ 表示 $C_i$ 个输入通道分成 $G$ 组（每组 $C_i / G$ 个通道），每组通道共享同一个卷积核。

![involution](/img/posts/zh/2021-08-31/involution.png) <!-- w=500 desc="图片来源：论文 [Involution: Inverting the Inherence of Convolution for Visual Recognition](https://arxiv.org/pdf/2103.06255.pdf)" -->

和卷积不一样的是，involution 的核是根据输入的特征图自动生成的，一个通用的形式是：

$$
\mathcal{H}_{ij} = \phi(X_{\Psi_{ij}})
$$

其中 $\Psi_{ij}$ 表示坐标 $(i, j)$ 的某个邻域上的坐标集合，$X_{\Psi_{ij}}$ 表示 $\Psi_{ij}$ 对应的特征。在实例化这个形式时，论文用了比较简单的方式，即令 $\Psi_{ij} = \{(i, j)\}$ 这个单点，然后：

$$
\mathcal{H}_{ij} = \phi(X_{\{(i, j)\}}) = W_1 \sigma (W_0 X_{\{(i, j)\}})
$$

论文另一个挺有意思的地方是，它指出 self-attention 公式也可以用这个式子来表示，即：

$$
\begin{gathered}
  \Psi_{ij} = \Omega \\
  \mathcal{H}_{ij} = \phi(X_\Omega) = (X W^Q)(X W^K)^T
\end{gathered}
$$

其中 $\Omega$ 是 query 对应的 key 的范围。
