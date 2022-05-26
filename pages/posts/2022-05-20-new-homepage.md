---
title: New Homepage
---

It seems that I always spend a lot of time on building my homepage. 

My first homepage (or blog) was built with [Jekyll](https://jekyllrb.com/) in 2018. I wrote a [theme](https://github.com/Renovamen/jekyll-theme-gungnir) named Gungnir for it, since I found out none of the existing Jekyll themes are good enough for me. At that time, I knew almost nothing about FE and struggled a lot with JavaScript, CSS and the [Liquid](https://shopify.github.io/liquid/) templating language, leading to messy code that is difficult to maintain. In 2020, I migrated [Gungnir](https://github.com/Renovamen/vuepress-theme-gungnir/tree/v0) to [VuePress](https://vuepress.vuejs.org), a more powerful static website generator. And last year, I rewrote the [theme](https://github.com/Renovamen/vuepress-theme-gungnir) in [VuePress 2](https://v2.vuepress.vuejs.org) to take advantage of Vue 3 and Vite, which is still actively maintained.

Yeah, it took me so much time to develop my own blog themes that I almost forgot about writing the blog lol.

These days, again, I turned to another new homepage, which I hope is the last one (before I begin to be fed up with it again in about 2-3 years).


## Style

I want my homepage to be more "research" and "serious". My [old homepage](https://blog.zxh.io) looks more like a blog with a bunch of fancy images rather than a "reacher's homepage". Meanwhile, I wearied of looking for cover images for posts and became obsessed with simple website designs.

I don't want to modify my blog theme directly since I still love its style and it already has a certain number of users. Thus I wrote a new one.


## Tech Stack

Gradually I found I got so caught up with atomic CSS frameworks like [Tailwind CSS](https://tailwindcss.com/), [Windi CSS](https://windicss.org/) and [UnoCSS](https://github.com/antfu/unocss). I'm using UnoCSS in almost all of my recent projects and I can say that I never want to write semantic class names and regular CSS anymore. Actually I was even thinking about applying UnoCSS on VuePress blog theme [Gungnir](https://github.com/Renovamen/vuepress-theme-gungnir), but it sounds a heavy work and I'm not sure if it is a right choice. But starting a new site with UnoCSS could be much eaiser - that's what I'm doing. 

I built my new homepage on top of [Vitesse](https://github.com/antfu/vitesse). With the power of [vite-ssg](https://github.com/antfu/vite-ssg) and several [Vite](https://github.com/vitejs/vite) plugins like [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages), [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) and [vite-plugin-md](https://github.com/antfu/vite-plugin-md), a personal website with a blog section can now be done in a really short time. For me, this solution is lightweight and fast, making the development experience smooth and sweet. If you just want a simple personal website or blog and don't care about maintaining a theme, I guess Vitesse could be a nice choice.

---

Anyway, this is site is still WIP, hoping to see what it will eventually become.
