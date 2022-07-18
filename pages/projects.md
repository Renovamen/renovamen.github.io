---
title: Projects - Xiaohan Zou
projects:
  Machine Learning:
    - name: Flint
      link: https://github.com/Renovamen/flint
      desc: A toy deep learning framework implemented in Numpy from scratch
      icon: i-heroicons-solid:fire
      repo: Renovamen/flint
    - name: Speech Emotion Recognition
      link: https://github.com/Renovamen/Speech-Emotion-Recognition
      desc: Speech emotion recognition implemented in Keras
      icon: i-ph:microphone-bold
      repo: Renovamen/Speech-Emotion-Recognition
    - name: torchmasked
      link: https://github.com/Renovamen/torchmasked
      desc: Masked tensor operations for PyTorch
      icon: i-iconoir:grid-remove
    - name: torchop
      link: https://github.com/Renovamen/torchop
      desc: Attention / convolution operators
      icon: i-uis:web-grid
    - name: Metallic
      link: https://github.com/Renovamen/metallic
      desc: A clean and lightweight PyTorch meta-learning library
      icon: i-lucide:hammer
    - name: Text Classification
      link: https://github.com/Renovamen/Text-Classification
      desc: Some text classification models implemented in PyTorch
      icon: i-gg:format-text
      repo: Renovamen/Text-Classification
    - name: pcalg-py
      link: https://github.com/Renovamen/pcalg-py
      desc: Implement PC algorithm in Python
      icon: i-ph:graph
      repo: Renovamen/pcalg-py
  JavaScript Libraries:
    - name: VuePress Theme Gungnir
      link: https://github.com/Renovamen/vuepress-theme-gungnir
      desc: A blog theme for VuePress 2
      icon: i-akar-icons:sword
      repo: Renovamen/vuepress-theme-gungnir
    - name: Oh, Vue Icons!
      link: https://github.com/Renovamen/oh-vue-icons
      desc: Import SVG icons from different popular icon packs in Vue easily
      icon: oh-vue-icons
      repo: Renovamen/oh-vue-icons
  Websites / Online Tools:
    - name: Portfolio
      link: https://portfolio.zxh.io
      desc: My portfolio website simulating macOS's GUI
      icon: i-ic:baseline-laptop-mac
      repo: Renovamen/playground-macos
    - name: Oh, CV!
      link: https://ohcv.zxh.io
      desc: Write your curriculum vitae / resume in Markdown online
      icon: i-academicons:cv-square
      repo: Renovamen/oh-cv
    - name: Wordle Helper
      link: https://wordle.zxh.io
      desc: Help you solve the Wordle puzzles when your vocabulary fails you
      icon: i-icon-park-outline:game-ps
    - name: Midgard
      link: https://resume.zxh.io
      desc: Hey adventurer! Why not help me with retrieving my resume fragments back!
      icon: i-et:compass
    - name: Cube Solver
      link: https://cube.zxh.io
      desc: A rubik's cube solver
      icon: i-fluent:cube-24-regular
      repo: Renovamen/Just-a-Cube
    - name: Fishmail
      link: https://fishmail.vercel.app
      desc: 装作在 Gmail 上查邮件的样子看知乎摸鱼
      icon: i-mdi:fishbowl-outline
      repo: Renovamen/fishmail
---

# Projects

I'm trying to find a balance between research and engineering.

<ProjectList :projects="frontmatter.projects"/>
