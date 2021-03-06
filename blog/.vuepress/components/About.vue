<template>
  <Common class="about-wrapper">
    <div class="profile">
      <div class="profile__content">
        <div class="profile__basic col-md-4">
          <img class="avatar" :src="$withBase($page.frontmatter.avatar)" />
          <h3 class="title">{{ $page.frontmatter.name }}</h3>
          <p class="subname">{{ $page.frontmatter.subname }}</p>
          <div class="sns">
            <div
              v-for="(user, platform) in $themeConfig.personalInfo.sns"
              :key="`about-${platform}-${user}`"
              class="sns__item"
            >
              <a target="_blank" :href="snsLink(user, platform)">
                <v-icon :name="snsIcon(platform)" scale="1.82" />
              </a>
            </div>
            <div v-if="$page.frontmatter.cv" class="sns__item">
              <a :href="$page.frontmatter.cv">
                <v-icon name="ai-cv" scale="2.2" />
              </a>
            </div>
          </div>
        </div>
        <div class="profile__info col-md-8">
          <h3 class="title">Biography</h3>
          <div class="bio-info">
            Xiaohan is <del>a dragon lost in human world</del> now an incoming
            <a
              href="https://www.bu.edu/cs/"
              target="_blank"
            >
              Computer Science
            </a>
            master student at
            <a
              href="https://www.bu.edu/"
              target="_blank"
            >
              Boston University
            </a>
            and a research assistant at Peking University supervised by
            <a
              href="http://www.cis.pku.edu.cn/jzyg/szdw/lt.htm"
              target="_blank"
            >
              Prof. Tong Lin</a
            >.
            Before that, she got her bachelor's degree in
            <a href="http://sse.tongji.edu.cn" target="_blank">
              Software Engineering
            </a>
            at
            <a href="https://www.tongji.edu.cn" target="_blank">
              Tongji University</a
            >.
            She is currently focusing on topics related to exploring the
            capability of machines to be continual and efficient, like continual
            learning, meta-learning and few-shot learning.
          </div>
          <div class="personal-info">
            <div class="col-md-5 interests">
              <p class="subtitle">Interests</p>
              <ul>
                <li
                  v-for="(item, index) in $page.frontmatter.interests"
                  :key="`interests-${index}`"
                >
                  <p v-html="item" class="item">{{ item }}</p>
                </li>
              </ul>
            </div>
            <div class="col-md-7 education">
              <p class="subtitle">Education</p>
              <ul>
                <li
                  v-for="(item, index) in $page.frontmatter.education"
                  :key="`education-${index}`"
                >
                  <p class="degree">{{ item.degree }}, {{ item.year }}</p>
                  <p class="school">{{ item.school }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Content class="theme-content" />
  </Common>
</template>

<script>
import Common from "@theme/components/Common.vue";

const platform_links = {
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/in/",
  facebook: "https://www.facebook.com/",
  twitter: "https://www.twitter.com/",
  zhihu: "https://www.zhihu.com/people/",
  weibo: "http://weibo.com/",
  email: "mailto:"
};

const platform_icons = {
  github: "ri-github-fill",
  linkedin: "ri-linkedin-box-fill",
  facebook: "ri-facebook-box-fill",
  twitter: "ri-twitter-fill",
  zhihu: "ri-zhihu-line",
  weibo: "ri-weibo-fill",
  email: "hi-mail"
};

export default {
  components: { Common },
  methods: {
    snsLink(user, platform) {
      return platform_links[platform] + user;
    },
    snsIcon(platform) {
      return platform_icons[platform];
    }
  }
};
</script>

<style lang="stylus">
@require '../styles/mixins.styl'

.about-wrapper
  .col-md-4
    width 33%
    float left
  .col-md-8
    width: 65%
    float right
  .col-md-5
    width 40%
    float left
  .col-md-7
    width 58%
    float right

  .profile
    height 100vh
    position relative
    gungnir-font()
    .title
      font-weight 600
      font-size 2em
      line-height 1.4em
      margin-bottom 30px
      text-align center
    &__content
      position absolute
      width 98.5%
      max-width 1400px
      top 50%
      left 0
      right 0
      margin -255px auto 0
    &__basic
      position absolute
      top 50%
      margin-top -185px
      padding-left 1.5rem
      .avatar
        margin 0 auto
        display block
        width 150px
        height 150px
        cursor auto
        padding 5px
        border-radius 100%
        transition(transform 1s)
        box-shadow inset 0 0 10px rgba(179, 179, 179, 0.6)
        &:hover
          transform(rotate(360deg))
      .title
        margin-top 65px
      .subname
        font-weight 700
        color var(--text-color-sub)
        text-align center
        margin-top -30px
      .sns
        text-align center
        margin 50px 0
        &__item
          width 10%
          display inline-block
          vertical-align middle
          > a
            text-decoration none
            color var(--accent-color)
            .ov-icon
              transition(transform .1s)
            &:hover .ov-icon
              transform(scale(1.3))

    &__info
      .title
        max-width 750px
      .bio-info
        max-width 750px
        font-size 19px
        text-align left
        font-weight 400
        a:hover
          text-decoration underline
      .personal-info
        max-width 750px
        margin 20px 15px auto
        .subtitle
          margin 15px 0 -10px 0
          font-weight bold
          font-size 20px
          letter-spacing 1.14px
        ul
          padding-left 15px
        .interests li
          margin-bottom -17px
          .item
            font-size 16px
        .education
          .degree
            font-size 18px
            line-height 30px
          .school
            font-size 15px
            line-height 24px
            margin-top -15px
            color var(--text-color-sub)

  .theme-content
    min-height 80vh
    gungnir-font()
    h2, h3, h4, h5, h6
      font-weight 700
      text-align center
    p
      font-size 18px !important
      line-height 28px !important
    a.header-anchor
      display none

  @media (max-width: $MQLarge)
    .profile__basic .sns__item
      width 11%

  @media (max-width: $MQIpad)
    .profile
      height auto
      min-height 670px
      padding 0 1rem
      .col-md-4, .col-md-8, .col-md-5, .col-md-7
        width 100%
        position relative
      &__content
        margin-top 350px
        position relative
      &__basic
        padding-left 0
        .sns__item
          width 10%
      &__info
        .title, .bio-info
          max-width 100%
        .personal-info .education
          padding-bottom 50px
    .theme-content
      min-height auto
      padding-bottom 100px !important

  @media (max-width: $MQMobileNarrow)
    .profile
      padding 0 .8rem
      .sns__item
        min-width 13%
      .bio-info
        font-size 18px
      .education
        margin-top 20px
    .theme-content
      padding-bottom 50px !important
</style>

<style src="@theme/styles/theme.styl" lang="stylus"></style>
