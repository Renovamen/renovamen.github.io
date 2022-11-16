---
socials:
  - icon: i-academicons:cv
    link: /files/cv/en.pdf
  - icon: "i-ion:mail-outline"
    link: "mailto:renovamenzxh@gmail.com"
  - icon: i-eva:github-outline
    link: https://github.com/Renovamen
  - icon: i-radix-icons:linkedin-logo
    link: https://www.linkedin.com/in/xiaohan-zou
  - icon: i-academicons:google-scholar
    link: https://scholar.google.com/citations?user=RuW6xgMAAAAJ
  - icon: i-ri:twitter-fill
    link: https://www.twitter.com/renovamen_zxh
  - icon: i-ant-design:zhihu-outlined
    link: https://www.zhihu.com/people/chao-neng-gui-su
  - icon: i-ri:game-line
    link: https://portfolio.zxh.io
    name: Portfolio
  - icon: i-system-uicons:paper-plane
    link: https://blog.zxh.io
    name: 中文博客
---

<div flex items-end justify-between>
  <div>
    <h1>Xiaohan Zou <span text="base c-light">邹笑寒</span></h1>
    <Links :links="frontmatter.socials" />
  </div>
  <div 
    class="p-1 mb-1 border border-c rounded-md hidden md:block"
    shadow="[inset_0_0_10px_#000000] slate-200 dark:slate-800"
  >
    <flip-image class="!w-24" src="img/avatar.jpg" alt="avatar" />
  </div>
</div>

Xiaohan is a [Computer Science](https://www.bu.edu/cs/) master's student at [Boston University](https://www.bu.edu/) and working with Prof. [Bryan Plummer](https://bryanplummer.com/). Her current research interests lie primarily in exploring the capability of machines to be continual, generalizable and efficient, like continual learning, meta-learning, few-shot learning and parameter
sharing. She is also interested in vision-language learning and video understanding.

Previously, she received her bachelor's degree in [Software Engineering](http://sse.tongji.edu.cn/) at [Tongji University](https://www.tongji.edu.cn/), where she worked on image aesthetic captioning with Prof. [Qinpei Zhao](https://dblp.org/pid/22/6705.html). She was also fortunate to work with Prof. [Tong Lin](http://www.cis.pku.edu.cn/jzyg/szdw/lt.htm) (PKU) on continual learning and machine translation.

Check her [Curriculum Vitae](/files/cv/en.pdf) for more details.


## Education

|   |   |
|---|---|
| **M.S. in Computer Science**, Boston University | 2021-2023 |
| **B.Eng. in Software Engineering**, Tongji University <p>Thesis: *Food Image Aesthetic Assessment and Captioning*</p> | 2016-2020 |


## Publications

- **TokenFlow: Rethinking Fine-grained Cross-modal Alignment in Vision-Language Retrieval**

  <u>Xiaohan Zou</u>, Changqiao Wu, Lele Cheng, and Zhongyuan Wang

  Preprint, 2022

  [paper](http://arxiv.org/abs/2209.13822) / <nutshell text="abstract">Most existing methods in vision-language retrieval match two modalities by either comparing their global feature vectors which misses sufficient information and lacks interpretability, detecting objects in images or videos and aligning the text with fine-grained features which relies on complicated model designs, or modeling fine-grained interaction via cross-attention upon visual and textual tokens which suffers from inferior efficiency. To address these limitations, some recent works simply aggregate the token-wise similarities to achieve fine-grained alignment, but they lack intuitive explanations as well as neglect the relationships between token-level features and global representations with high-level semantics. In this work, we rethink fine-grained cross-modal alignment and devise a new model-agnostic formulation for it. We additionally demystify the recent popular works and subsume them into our scheme. Furthermore, inspired by optimal transport theory, we introduce <i>TokenFlow</i>, an instantiation of the proposed scheme. By modifying only the similarity function, the performance of our method is comparable to the SoTA algorithms with heavy model designs on major video-text retrieval benchmarks. The visualization further indicates that <i>TokenFlow</i> successfully leverages the fine-grained information and achieves better interpretability. <div h-0 my-3 border="t c-dark dashed" /><img src="/img/about/tokenflow-1.png" alt="tokenflow-overview" class="p-2 bg-white rounded-t" /><img src="/img/about/tokenflow-2.png" alt="tokenflow-diff" class="py-2 px-3 bg-white rounded-b" /></nutshell>

- **Efficient Meta-Learning for Continual Learning with Taylor Expansion Approximation**

  <u>Xiaohan Zou</u>, and Tong Lin

  International Joint Conference on Neural Networks (IJCNN), 2022

  **Oral Presentation**

  [paper](https://arxiv.org/abs/2210.00713) / [slide](/files/papers/ijcnn2022/slide.pdf) / <nutshell text="abstract">Continual learning aims to alleviate catastrophic forgetting when handling consecutive tasks under non-stationary distributions. Gradient-based meta-learning algorithms have shown the capability to implicitly solve the transfer-interference trade-off problem between different examples. However, they still suffer from the catastrophic forgetting problem in the setting of continual learning, since the past data of previous tasks are no longer available. In this work, we propose a novel efficient meta-learning algorithm for solving the online continual learning problem, where the regularization terms and learning rates are adapted to the Taylor approximation of the parameter’s importance to mitigate forgetting. The proposed method expresses the gradient of the meta-loss in closed-form and thus avoid computing second-order derivative which is computationally inhibitable. We also use Proximal Gradient Descent to further improve computational efficiency and accuracy. Experiments on diverse benchmarks show that our method achieves better or on-par performance and much higher efficiency compared to the state-of-the-art approaches.</nutshell>

- **To be an Artist: Automatic Generation on Food Image Aesthetic Captioning**

  <u>Xiaohan Zou</u>, Cheng Lin, Yinjia Zhang, and Qinpei Zhao

  International Conference on Tools with Artificial Intelligence (ICTAI), 2020 
  
  **Oral Presentation**

  [paper](https://ieeexplore.ieee.org/document/9288208) / [code](https://github.com/Renovamen/Food-IAC) / [slide](/files/papers/ictai2020/slide.pdf) / <nutshell text="abstract">Image aesthetic captioning is a multi-modal task that is to generate aesthetic critiques for images. In contrast to common image captioning tasks, where different captions aimed at providing factual descriptions of a same image are always similar, captions with respect to different aesthetic attributes of the same image can be totally different in an aesthetic captioning task. Such inter-aspect differences are always overlooked, which leads to the lack of diversity and coherence of the captions generated by most of the existing image aesthetic captioning systems. In this paper, we propose a novel model to generate aesthetic captions for food images. Our model redefines food image aesthetic captioning as a compositional task that consists of two separated modules, i.e., a single-aspect captioning and an unsupervised text compression. The first module is guaranteed to generate the captions and learn feature representations of each aesthetic attribute. Then, the second module is supposed to study the associations among all feature representations and automatically aggregate captions of all aesthetic attributes to a final sentence. We also collect a dataset which contains pair-wise image-comment data related to six aesthetic attributes. Two new evaluation criteria are introduced to comprehensively assess the quality of the generated captions. Experiments on the dataset demonstrate the effectiveness of the proposed model. <div h-0 my-3 border="t c-dark dashed" /><img src="/img/about/ictai2020.png" alt="ictai2020-model-arch" class="p-2 bg-white rounded" /></nutshell>

- **A Survey on Application of Knowledge Graph**

  <u>Xiaohan Zou</u>

  International Conference on Control Engineering and Artificial Intelligence (CCEAI), 2020

  [paper](https://iopscience.iop.org/article/10.1088/1742-6596/1487/1/012016/pdf) /  <nutshell text="abstract">Knowledge graphs, representation of information as a semantic graph, have caused
wide concern in both industrial and academic world. Their property of providing semantically
structured information has brought important possible solutions for many tasks including
question answering, recommendation and information retrieval, and is considered to offer great
promise for building more intelligent machines by many researchers. Although knowledge
graphs have already supported multiple “Big Data” applications in all sorts of commercial and
scientific domains since Google coined this term in 2012, there was no previous study give a
systemically review of the application of knowledge graphs. Therefore, unlike other related
work which focuses on the construction techniques of knowledge graphs, this present paper
aims at providing a first survey on these applications stemming from different domains. This
paper also points out that while important advancements of applying knowledge graphs' great
ability of providing semantically structured information into specific domains have been made
in recent years, several aspects still remain to be explored.</nutshell>


## Experience

|   |   |
|---|---|
| **Machine Learning Engineer Intern**, *[Kuaishou](https://www.kuaishou.com/en)*, Beijing | 2021–2022 |
| **Research Intern**, *[Peking University](https://english.pku.edu.cn/)*, Beijing (with [Prof. Tong Lin](http://www.cis.pku.edu.cn/jzyg/szdw/lt.htm)) | 2020–2022 |
| **Software Engineer Intern**, *China Electronics Technology Group Corporation* | 2020–2021 |
| **Game Engineer Intern**, *[Banana Interactive](https://banana.games/)*, Shanghai | 2019–2020 |
| **Research Intern**, *[Peking University](https://english.pku.edu.cn/)*, Beijing (with [Prof. Tong Lin](http://www.cis.pku.edu.cn/jzyg/szdw/lt.htm)) | 2018 |


## Talks

- [Meta / Few-shot Learning](/files/talks/2021-08-meta-learning.pdf), Kuaishou, 08/2021
- [Continual Learning: Meta Continual Learning & Task Free Settings](/files/talks/2020-08-continual-learning.pdf), Peking University, 08/2020


## Miscellaneous

- 🚀 This [personal website](https://github.com/Renovamen/renovamen.github.io) is built on [Vitesse](https://github.com/antfu/vitesse), with the power of [Vue 3](https://github.com/vuejs/vue-next), [Vite 2](https://github.com/vitejs/vite) and [UnoCSS](https://github.com/antfu/unocss)

- 🧐 Here are two "interesting" versions of my portfolio/cv: [portfolio.zxh.io](https://portfolio.zxh.io/), [resume.zxh.io](https://resume.zxh.io/)

- 🎃 *Renovamen* is a Latin word means *renewal*

- 🖥 Ex-OIer/ACMer

- 🛠 Like to contribute to open-source machine learning and frontend projects in spare time

- 🥎 Used to be a member of the softball team of Tongji University

- 🌭 My dream: `while(sleeping){money++;}`

- 🕹️ Currently interested in constructing buildings in Minecraft

- 📜 大概率更新不及时的[中文简历](/files/cv/cn.pdf)


<route lang="yaml">
meta: 
  layout: about
</route>
