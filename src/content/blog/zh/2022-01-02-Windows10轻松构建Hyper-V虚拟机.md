---
title: Windows 10轻松构建Hyper-V虚拟机
tags:
  - Hyper-V
---

> 作为开发人员与服务器打交道的机会比较多，不管是练习Liunx基础实操，还是构建开发或者环境，又或是构建分布式的压力测试环境，利用开发人员的开发电脑来临时充当服务器来使用是一个非常经济实惠的方案。



## 使用Hyper-V安装LIUNX系统



### 前言

之前我是从来没用过这个虚拟化产品来进行安装的，也是听同事说有这么个虚拟机软件，可以安装LINUX，于是就试了一下。Hyper-V是微软的一款虚拟化产品是微软第一个采用类似VMware和Citrix开源Xen一样的给予hypervisor的技术，由于Hyper-V是直接集成在Windows系统中，直接使用起来可能会快点，但是中间也会有一些小插曲之类，类似开启虚拟化功能，如果是使用VMwar workstation的话它就会自动帮你开启了 ，稍后我会为大家介绍中间遇到的问题。

小窍门：因为笔记本屏幕太小无显示全屏，导致在选择下一步的时候无法继续安装，可以通过外接显示器来进行安装配置。



### Hyper-V环境启用

使用工具：Hyper-V

LINUX版本：`CentOS7 64_Mini`

Windows版本：Win10专业版

首先需要开启Hyper-V管理器服务，打开：**控制面板 → 程序**

![](/img/posts/zh/2022-01-02/1.png)

启用或关闭Windows功能

![](/img/posts/zh/2022-01-02/20180408140619958.png)

启用Hyper-V管理器功能，需要注意的是有的系统默认是不开启虚拟机监控功能的，所以需要开启。

![](/img/posts/zh/2022-01-02/20180408142617624.png)

开启虚拟机监控程序的话，需要先进入电脑的BIOS设置，在开机时，出现第一个品牌画面时，狂按F2（有的电脑不是按F2是F1 或者ESC键），即可进行BIOS设置界面。（我的主板是华硕主板）

![](/img/posts/zh/2022-01-02/20180408144447949.png)

按F10保存退出，开启成功。（切记）

打开任务管理器查（ALT+CTRL+. ）看是否开启CPU虚拟化。虚拟化：已启用

![](/img/posts/zh/2022-01-02/20211111174008.png)

再进入控制面板中，找到之前打开Windows功能列表，启用Hyper-V虚拟机监控程序

![](/img/posts/zh/2022-01-02/20180408145023742.png)



重启电脑，否则可能会出现启动不了虚拟机的情况。



### Hyper-V配置虚拟机

打开Hyper-V管理器，新建虚拟机

![](/img/posts/zh/2022-01-02/201804081455453.png)

输入虚拟机的名称，下方有设置虚拟机的存储位置，建议不要存储在C盘即可。一开始设置好后，它会默认存储

![](/img/posts/zh/2022-01-02/20180408145751888.png)

第一代和第二代的差别描述的很清楚，一个支持32和64位，一个只支持64位且功能强大些。

安装Liunx系统一般选择第一代即可。

![](/img/posts/zh/2022-01-02/20180408150014175.png)

下一步，为虚拟机分配内存。需要考虑到电脑本身的内存大小，只是用虚拟机来玩LINUX的话1024MB足够了

下一步，配置网络，选择默认开关即可，网络后面单独篇幅讲解。

![](/img/posts/zh/2022-01-02/20180408150219229.png)

连接虚拟硬盘，关键是设置好位置即可

![](/img/posts/zh/2022-01-02/20180408150338154.png)

安装选项，我是直接选择好了安装的LINUX系统。点击浏览，找到所要安装的LINUX系统（均为.iso文件）所在的文件夹

![](/img/posts/zh/2022-01-02/20180408150634596.png)

本文案例使用Centos 7.9，官网下载地址：https://www.centos.org/download/

其他系统镜像根据需求下载，Windows快捷配置中提供一些可选的镜像。

下一步，摘要也就是将之前设定的设置的概览图

![](/img/posts/zh/2022-01-02/20180408150719584.png)

点击完成，新建虚拟机就成功了。接下来就是启动虚拟机，进入虚拟机中安装LINUX系统了。





### 虚拟机启动和安装

右击启动，连接虚拟机，进入虚拟机操作界面。根据安装提示进行系统安装配置。

过程省略，不同系统的不同版本镜像安装所有不同，根据页面指引安装完成即可。



Centos 在完成前的最后一步，输入用户名和密码，就可以启动登录进入系统了，见下图。

![](/img/posts/zh/2022-01-02/20211111175812.png)

此时，虚拟机已经完成安装和启动，但是，还未配置网络。



### 关于开机自动运行hyper v里的虚拟机问题

1. 在要运行的虚拟主机上右击，设置；
2. 在“管理”选项中单击“自动启动操作”，设置相关信息即可。

![img](/img/posts/zh/2022-01-02/a09be449-c35b-4fb3-98bf-454c2bdd3616.png)

![img](/img/posts/zh/2022-01-02/4d2dc9b7-4e00-4c26-b430-83b3028d095d.png)



### 为Hyper-V 虚拟机器建立虚拟交换器

虚拟交换器可让在Hyper-v 主机上建立的虚拟机器与其他电脑通讯。当您第一次在Windows 伺服器上安装hyper-v 角色时，可以建立虚拟交换器。

#### 使用Hyper-v 管理员建立虚拟交换器

1. 开启[Hyper-v 管理员]，选取Hyper-v 主电脑名称称。

2. 选取[**虚拟交换器管理员**

   ![显示功能表选项[动作虚拟交换器管理员] 的萤幕撷取画面](/img/posts/zh/2022-01-02/hyper-v-action-vswitchmanager.png)

3. 选择您想要的虚拟交换器类型。

   | 连线类型 | Description                                                  |
   | :------- | :----------------------------------------------------------- |
   | 外部     | 让虚拟机器存取实体网路，以便与外部网路上的伺服器和用户端进行通讯。允许同一部Hyper-v 伺服器上的虚拟机器彼此通讯。 |
   | 内部     | 允许在相同Hyper-v 伺服器上的虚拟机器之间，以及虚拟机器与管理主机作业系统之间进行通讯。 |
   | 私人     | 只允许在相同Hyper-v 伺服器上的虚拟机器之间进行通讯。私人网路会与Hyper-v 伺服器上的所有外部网路流量隔离。当您必须建立隔离的网路环境（例如隔离的测试网域）时，这种类型的网路会很有用。 |

4. 选取[

5. 新增虚拟交换器的名称。

6. 如果您选取[外部]，请选择您要使用的网路介面卡(NIC) 和下表所述的任何其他选项。

   ![显示[外部网路] 选项的萤幕撷取画面](/img/posts/zh/2022-01-02/hyper-v-newvswitch-externaloptions.png)

   | 设定名称                         | 说明                                                         |
   | :------------------------------- | :----------------------------------------------------------- |
   | 允许管理作业系统共用此网路介面卡 | 如果您想要允许Hyper-v 主机与虚拟机器共用虚拟交换器和NIC 或NIC 小组的使用，请选取此选项。启用此功能时，主机可以使用您为虚拟交换器设定的任何设定，例如服务品质(QoS) 设定、安全性设定，或Hyper-v 虚拟交换器的其他功能。 |
   | 启用单一根目录I/O 虚拟化(SR-IOV) | 只有当您想要允许虚拟机器流量略过虚拟机器交换器，并直接移至实体NIC 时，才选取此选项。如需详细资讯，请参阅海报附属参考资料中的 |

7. 如果您想要隔离来自管理Hyper-v 主机作业系统或其他共用相同虚拟交换器之虚拟机器的网路流量，请选取[ 您可以将VLAN 识别码变更为任何数位，或保留预设值。这是管理作业系统将用来透过此虚拟交换器进行所有网路通讯的虚拟LAN 识别码。

   ![](/img/posts/zh/2022-01-02/hyper-v-newswitch-vlan.png)

8. 按一下[确定]。

9. 按一下[是] 。

   ![](/img/posts/zh/2022-01-02/hyper-v-newvswitch-disruptnetwork.png)

#### 使用Windows PowerShell 建立虚拟交换器

1. 在Windows 桌面上，按一下[开始] 按钮，然后输入

2. 以滑鼠右键按一下Windows PowerShell，然后选取[以

3. 藉由执行 记下您要用于虚拟交换器的网路介面卡名称。

   PowerShell复制

   ```PowerShell
   Get-NetAdapter
   ```

4. 使用 例如，若要建立名为ExternalSwitch 的外部虚拟交换器，并使用ethernet 网路介面卡，并开启[

   PowerShell复制

   ```PowerShell
   New-VMSwitch -name ExternalSwitch  -NetAdapterName Ethernet -AllowManagementOS $true
   ```

   若要建立内部交换器，请执行下列命令。

   PowerShell复制

   ```PowerShell
   New-VMSwitch -name InternalSwitch -SwitchType Internal
   ```

   若要建立私用参数，请执行下列命令。

   PowerShell复制

   ```PowerShell
   New-VMSwitch -name PrivateSwitch -SwitchType Private
   ```





### Hyper-V虚拟机配置固定IP共享连接外网

win10下使用hyper-v在本机安装linux虚拟机后，网络访问上有如下两点需求：

（1）无论物理机的网络环境怎么变化，都需要保持虚拟机的IP地址不变，保证我本机使用xshell等终端访问始终用同一个IP地址，或者在安装了其他软件后，访问虚拟机的IP地址保持不变。

（2）物理机可访问虚拟机，虚拟机是否可访问网络都行。重点保证本机可访问虚拟机，以及虚拟机之间能互相访问。

1、为了实现第一点，需给虚拟机设置一个固定的网段以及静态IP，这里使用`192.168.118.X`的网段，如下以centos7操作系统为例子，实现静态IP的设置：

~~~shell
cd /etc/sysconfig/network-scripts
vi ifcfg-eth0
~~~

主要修改如下信息，这里我设置静态IP地址为`192.168.x.x`

~~~shell
BOOTPROTO=static
DEVICE=eth0
ONBOOT=yes
IPADDR=192.168.x.x
GATEWAY=192.168.x.1
DNS1=114.114.114.114   # DNS可以是自建，配置不对会导致虚拟机访问不了外网
DNS1=8.8.8.8
NETMASK=255.255.255.0
~~~

重启网络服务，使设置生效：

~~~shell
systemctl restart network
~~~

2、Hyper-V上面的虚拟网络设置

打开Hyper-V上的虚拟机交换机管理器：

![](/img/posts/zh/2022-01-02/20181028000906586.jpg)



新建虚拟网络交换机，输入名称，选择外部网络，点击确定：

![](/img/posts/zh/2022-01-02/20211111181447.png)



如果只需要本机测试，选择内部网络即可，如果路虚拟机需要对局域网甚至公网访问，选择外部网络。

同时，勾选：允许管理员操作系统共享此网络适配器

### Hyper-V网络测试

针对外网模式，需要验证虚拟机是否可以被网络访问。

#### 测试虚拟机是否是可以局域网访问

在局域网内找一台机器直接ping虚拟机的IP，如果能ping通则表示路虚拟机可以被访问。

![](/img/posts/zh/2022-01-02/20211112102237.png)

### 测试虚拟机是否可以访问网络资源

1、登录虚拟机，可以使用Shell工具连接虚拟主机。

![](/img/posts/zh/2022-01-02/20211112102413.png)

如果能ping通，则显示如下信息。

![](/img/posts/zh/2022-01-02/20211112102535.png)

如果ping不通，则需要根据实际情况排查。

有可能虚拟机的DNS配置错误也会导致虚拟机不能访问网络的提

也有可能是Hyper-V网络配置环境出现问题，例如配置内网访问，未共享宿主机网络

或者其他原因导致。



### 将Windows网络适配器共享网络的ip：192.168.x.1 改为其他IP

Hyper-V内网模式下，虚拟机需要共享宿主机网络来访问网络资源，会涉及到共享网路网段问题，Windows 10默认的网路IP是`192.168.x.1`，此值是可以更改的。

**方法1**：修改注册表

HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters

中的：

ScopeAddress
ScopeAddressBackup

![](/img/posts/zh/2022-01-02/1297862-20190502133553722-964861554.png)

**方法2**：脚本修改

管理员运行bat文件（我这里改为了192.168.100.1）

**注意：不要将共享IP设置为你要共享的网卡中的局域网内的IP，否则会发生冲突**

```
@echo off
set /p q=Pleasl input ShareIP [192.168.x.1]:
reg add "HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters" -v ScopeAddress -d %q% -f

reg add "HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters" -v ScopeAddressBackup -d %q% -f

timeout /t 10 /nobreak
```

 ![](/img/posts/zh/2022-01-02/1297862-20190502135432332-762153568.png)

然后，重新共享网络适配器 

 

**补充：**

**1.建立共享的方法：**

```
netsh wlan set hostednetwork mode=allow
netsh wlan set hostednetwork mode=allow ssid="你的共享的无线名" key=无线密码  keyUsage=persistent（永久）|temporary （临时）

//开启
netsh wlan start hostednetwork
//关闭
netsh wlan stop hostednetwork
```

如何在共享时出现问题：**无法启动承载网络。 组或资源的状态不是执行请求操作的正确状态。**



**注意：**

Windows10 为：

![](/img/posts/zh/2022-01-02/1297862-20190502140251175-243027232.png)

 **2.重命名适配器**

```
//展示适配器名
netsh in show in

//改变适配器名
netsh in set in name="上面展示的接口" newname="新的接口名"
```

 

### 查询LIUNX服务器信息

到这一步，基本已经完成了虚拟机构建的工作，虚拟机可以正式开始工作了。

~~~shell
# 1.查看Linux内核版本
cat /proc/version
# 或者
uname -a

#2.查看Linux发行版本
lsb_release -a
# 或者
cat /etc/issue
# 或者
cat /etc/redhat-release
# 或者
rpm -qi centos-release

# 3.查看是否联网
ping www.huawei.com

# 4.查看CPU信息
cat /proc/cpuinfo

# 5.查看Linux操作系统位数
getconf LONG_BIT
~~~





