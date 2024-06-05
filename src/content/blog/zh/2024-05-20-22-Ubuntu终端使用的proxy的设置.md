---
title: Ubuntu终端使用的proxy的设置
tags:
  - Ubuntu
---

> http/https代理实现



### 在当前用户下实现proxy

在你的当前用户下的配置文件，`vim ~/.bashrc`中添加几行：

~~~
export http_proxy=http://proxy.yourdomain.com:8081/
export https_proxy=http://proxy.yourdomain.com:8081/
export ftp_proxy=http://proxy.yourdomain.com:8081/
~~~



环境变量生效

~~~
source ~/.bashrc
~~~

然后通过wget下载文件



### 在全系统范围内实现proxy

如果想在全系统范围内使用，可以将上面的配置放在`/etc/environment`文件中，但是不要添加export

~~~
http_proxy=http://proxy.yourdomain.com:8081/
https_proxy=http://proxy.yourdomain.com:8081/
ftp_proxy=http://proxy.yourdomain.com:8081/
~~~



### 免费的proxy代理服务

陆续补充中

* 开源合集：https://github.com/cyubuchen/Free_Proxy_Website
* anokas：https://anokas.tech/vpn.html

