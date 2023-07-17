---
title: 论我的论文为什么写得那么烂
tags:
  - experience
---

## toc

论文 = 研究 + 写作。“研究”是另一个话题了，这里只讨论“写作”。

## 可以参考的资料

- [如何端到端地写科研论文？](https://xpqiu.github.io/slides/20181019-PaperWriting.pdf)（邱锡鹏，复旦大学，2018）
- [How to Read/Write an International Conference Paper](http://www.phontron.com/slides/neubig15paperwriting.pdf)（Graham Neubig，NAIST，2015）
- [How to write a good paper](https://drive.google.com/file/d/1sE4ZCHkU65J6ZFjOK4dWGIiuPygkM6ZW/view)（William T. Freeman，MIT，2020）
- [How to write the introduction](https://docs.google.com/presentation/d/1PZj0Sev2yjDu9NNr96S_wwjKCgIDhGmLjW1vtQpDhlk/view)（Kate Saenko，Boston University）
- [ICML 2022 Paper Writing Best Practices](https://icml.cc/Conferences/2022/BestPractices)
- [Carnegie Mellon University 10717: The Art of the Paper](https://github.com/acmi-lab/cmu-10717-the-art-of-the-paper)
- [Paper Writing Tips](https://github.com/MLNLP-World/Paper-Writing-Tips)

## 太长不看版

我们写论文是为了~毕业、找工作和升职加薪~把自己的研究尽可能通俗易懂的展示给读者，论文写得越容易被读者理解，就越容易被录用和产生更大的影响力，因此论文写作是以读者为中心的。

你可能会以为看你论文的人都是英语优秀、拥有大把时间且知识储备丰富的研究人员，但实际上其中不少人母语都不是英语、~经常摸鱼~工作繁重所以没有多少看论文的时间、对你做的方向并没有那么了解（比如我）。即使是审稿人，虽然一般会给两个多月的审稿时间，但人类拖延的本性很有可能会让他们把手上的论文都拖到里 ddl 只差几天的时候才开始审。并且在 AI 领域投稿论文爆发性增长、审稿人不够用的今天，一个并不熟悉你的方向的审稿人被抓来审你的论文也是经常发生的事。

因此，你的论文需要：

- 逻辑清晰、用词造句简单且书面（我收到过抱怨我的论文“长难句太多”的审稿意见）
- 把读这篇论文需要具备且不算“常识”的前置信息在论文里写清楚

做到了上述两点以后，尽可能 tell a good story。

:::tip
Your ideas and results won’t sell themselves
:::

## 阅读顺序

因为大家太忙、论文数量爆炸、价值低的研究太多，所以读者肯定不会全文看完每篇论文。我们看论文的顺序一般是：

![readership](/img/posts/zh/2023-06-08/readership.png) <!-- w=600 desc="图片来源：[How to write a good paper](https://drive.google.com/file/d/1sE4ZCHkU65J6ZFjOK4dWGIiuPygkM6ZW/view)" -->

这告诉我们，一篇论文中最先被看的部分往往是：

1. Title
2. Abstract
3. Figures

这三部分很大程度上决定了读者会不会细看剩下的内容，所以它们需要做到清晰、简单、易懂。

## Title

举个栗子：DenseCap: Fully Convolutional Localization Networks for Dense Captioning

- 一句话概括出本文用什么方法（Fully Convolutional Localization Networks）解决了什么问题（Dense Captioning）
- 给方法的起名尽量好记好读（DenseCap，而不是什么不好记也不好读的奇怪缩写，如 FCLN）

在满足上述基本条件的前提下，再考虑玩其他花样，比如：

- 玩梗：Do Embodied Agents Dream of Pixelated Sheep?: Embodied Decision Making using Language Guided World Modelling
- 加感叹号以吸引注意力：Distilling Step-by-Step! Outperforming Larger Language Models with Less Training Data and Smaller Model Sizes
- 提问以引起兴趣：Why Does ChatGPT Fall Short in Answering Questions Faithfully?

除非对自己的工作的质量和影响力非常有自信，否则不要轻易尝试这种类型的标题：

- [Attention is All you Need](https://arxiv.org/abs/1706.03762)
- [Segment Anything](https://arxiv.org/abs/2304.02643)

## Abstract

对论文全文进行精炼的概括，非常重要，决定了读者要不要继续看下去，也会左右审稿人的分配。在审稿流程开始之前，审稿人往往会在只能看到论文的 Title、Abstract、Keywords 的情况下给出自己的审稿偏好，而这些偏好会作为论文分配的参考。

表述应该尽量简单，让外行也能看懂。不要试图把所有细节都写清楚，更不要上公式和大量专业术语。

可以写成 Introduction 的简略版本。

## Introduction

陈述动机和整体介绍本文工作，一般由一下几点组成：

1. **研究任务**：介绍研究任务及其价值。well-defined 的任务的价值可以一笔带过，但如果是自己定义的一个新任务，就需要详细陈述它的价值
2. **现有方法（SoTA）**：介绍目前最新、最有代表性的方法。不要写得太多了，更详细的内容应该放到 Related Work 里面
3. **现有方法的不足**：陈述动机，承上启下，引出本文方法
4. **本文创新点**：介绍本文提出的新方法，以及它如何解决了现有方法的问题。这里只需要 high level 的介绍，更详细的内容应该放到 Proposed Method 里面

   在写第 3、4 点的时候可以配张图，画出本文方法和现有方法的对比

5. **实验结果**：简单提一下实验结果，证明本文提出的方法是有用的

还是举 DenseCap 的栗子：

![introduction](/img/posts/zh/2023-06-08/introduction.png) <!-- w=500 desc="图片来源：[How to write the introduction](https://docs.google.com/presentation/d/1PZj0Sev2yjDu9NNr96S_wwjKCgIDhGmLjW1vtQpDhlk/view)" -->

## Related Work

- 不要遗漏高度相关的工作，如果遗漏了，要么说明你文献调研没做好，要么说明你在刻意隐瞒，两者都算比较严重的问题，可以直接作为拒稿理由（我因为这条被拒过）
- 不要单纯的罗列和介绍相关工作，而要跟本文方法进行对比，强调本文的关注点跟别的论文有什么区别，或者本文方法解决了什么其他方法没解决的问题
- 不要攻击别人的工作，peace & love

## Figures

除非是过于理论的论文，否则一般会用示意图来解释提出的方法。很多读者甚至不看文字部分，他们只看图，因此示意图需要清晰易懂，不要有误导性，也不要出现过多的文字和公式，尽可能利用图案来解释清楚方法。同时示意图的 caption 需要是 self-explanatory 的，让读者即使完全不看论文主体，也能只靠 caption 的辅助理解图的意思。

我一般用 PPT 来画图。

## Proposed Method

先介绍理解你的方法所需要的前置知识（除非这个前置知识是公认的常识）。比如你的方法 follow 了某篇现有工作，那就需要把那篇工作简单的介绍一遍。某个知识是不是常识也是会随着时间而改变的，比如 18 年的时候 self-attention 就不是常识，而现在 self-attention 已经是跟 convolution 一样的不需要介绍的常识了。

然后，先从直觉（intuition）上解释一遍方法，然后再介绍方法的细节。如果读者都没法从直觉上理解清楚方法，他们是没法理解公式和专业名词成堆的细节的。

还是举 DenseCap 的栗子：

![method](/img/posts/zh/2023-06-08/method.png) <!-- w=500 -->

## Experiments

先介绍数据集、评测指标、对比方法（baseline）、具体实现细节（超参数、训练时用了哪些 trick、用了多少算力训练了多久，...）

实验部分需要证明两点：

- 你提出的方法比 baseline 效果好（主实验）：搞一张表格来罗列同数据集同设置下 baseline 的指标和你的方法的指标
- 你在 Introduction 里画的饼都是真的：比如你声称你提出的三个新模块都有效果，那就需要做消融实验（ablation study)；比如你声称你的方法提高了模型推理速度，那就需要把推理时间的量化指标对比拿出来；比如你声称你的方法提高了模型关注图像重点区域的能力，那就需要给出可视化对比

同样，实验表格的 caption 也需要是 self-explanatory 的，因为有的读者实验部分的文字也不看，他们只看表格。

## 修改

首先是最低级的语法、拼写错误，这些可以借助 [Grammarly](https://www.grammarly.com/)、[ChatGPT](https://chat.openai.com/) 等工具来修改。

然后改逻辑，最好不要有表述上的模糊不清甚至错误和矛盾。尽量多抓一些人（靠得住的、不会泄露你的论文的那种）来帮你改论文和提意见，包括但不限于：

- 导师 / mentor 和其他共同作者：他们往往经验丰富，且有和你一起改论文的义务
- 不是共同作者但跟你研究同一个方向的人：他们代表了你的论文的主要受众，如果他们理解不了你的论文在写啥，那就是个危险信号了
- 研究其他方向的人：让他们看 Title、Abstract、Figure

最后是润色，除了找人类帮忙以外，也可以试试 [ChatGPT](https://chat.openai.com/)。
