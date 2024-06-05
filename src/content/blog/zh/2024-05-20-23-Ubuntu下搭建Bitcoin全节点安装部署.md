---
title: Ubuntu下搭建Bitcoin全节点安装部署
tags:
  - Ubuntu
---


>需要准备大一点固态硬盘
>
>系统环境：Ubuntu 22.04.4 LTS



### 搭建Btcoin全节点

Btcoin Core：`https://bitcoincore.org/`

```shell
# 案例版本v27.0 最新版本去官网获取
wget https://bitcoincore.org/bin/bitcoin-core-27.0/bitcoin-27.0-x86_64-linux-gnu.tar.gz
tar -xzvf bitcoin-27.0-x86_64-linux-gnu.tar.gz
sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-27.0/bin/*

mkdir -p /data/bitcoin
```

添加配置文件

~~~shell
# 配置如下
#testnet=0 # 连接主网还是测试网: 0 - 主网 1 - 测试网
#regtest=0 # 是否以私有链模式运行: 0 - 否 1 - 是
#proxy=127.0.0.1:9050 # 是否使用socks5代理,默认关闭
#bind=<addr> # 本地监听地址,注释此行，表示使用默认监听地址
#whitebind=<addr> # 本地白名单监听地址,注释此行，表示使用默认监听地址
#addnode=69.164.218.197 # 添加种子节点,可添加多个
#addnode=10.0.0.2:8333
#connect=69.164.218.197 # 连接节点地址
#listen=1 # 是否进入监听模式，默认启用，除非使用了connect配置
#maxconnections=40 # 入站/出站最大连接数
#server=1 # 是否启动JSON-RPC接口,0 - 不启动 1 - 启动
#rpcbind=<addr> # rpc接口的监听地址，默认绑定到所有IP
#rpcport=8332 # rpc接口的监听端口
#rpcuser=alice  # rpc接口的访问用户名
#rpcpassword=DONT_USE_THIS_YOU_WILL_GET_ROBBED_OoDqBGMzPkxahm231434B2FRAxtl9m2 # rpc接口的访问密码
#rpcclienttimeout=30 # rpc客户端超时秒数
#rpcallowip=10.1.1.34/255.255.255.0 # rpc访问白名单
#rpcallowip=1.2.3.4/24 
#rpcallowip=2001:db8:85a3:0:0:8a2e:370:7334/96
#rpcconnect=127.0.0.1 # bitcoin-cli的默认连接地址
#txconfirmtarget=n # 交易最小确认数，默认值：6
#paytxfee=0.000x # 每次发送比特币时的交易费
#keypool=100 # 密钥池大小
#prune=550 # 剪枝留存数量，超过此数量的历史区块将从内存中删除
#min=1 # 是否启动后最小化
#minimizetotray=1 # 是否最小化到系统托盘

# 参考配置样例，其他参数使用默认值
echo 'server=1
daemon=1
# 如果您想作为一个全节点运行，不需要钱包功能，可以设置disablewallet=1
# disablewallet=1
#rpcuser=bitcoin_user
#rpcpassword=bitcoin2024ToTheMoon
# 可选：设置比特币核心与网络的连接数
maxconnections=40
txindex=1' >  ~/.bitcoin/bitcoin.conf
~~~

添加系统服务

```shell
vim /etc/systemd/system/bitcoind.service
```

执行完上个命令后，按英文字符 i 键进入编辑模式

把如下内容贴进去

```shell
[Unit]
Description=Bitcoin's distributed currency daemon
After=network.target

[Service]
User=root
Group=root
Type=forking
ExecStart=/usr/local/bin/bitcoin/bitcoind -conf=~/.bitcoin/bitcoin.conf -datadir=/data/bitcoin/data

i[Install]
WantedBy=multi-user.target
```

贴进去之后按键盘上的 Esc键退出编辑模式，然后再按 shift + : 进入最底部的命令行模式，输入小写wq 回车退出

~~~shell
# 重新加载
systemctl daemon-reload
~~~

设置开机启动

```shell
systemctl enable bitcoind
```

启动服务

```shell
systemctl start bitcoind
```

查看bic同步区块的日志

```shell
tail -f /data/bitcoin/data/debug.log
```



**添加环境变量使用bitcoin-cli命令**

编辑环境变量配置文件`vim /etc/profile`，追加如下配置

~~~shell
# bitcoin环境变量
export PATH=/usr/local/bin/bitcoin/:$PATH
~~~

让配置生效`source /etc/profile`



**一些常见的 Bitcoin Core 命令：**

获取节点信息：（注意注意！！如果你需要查看同步进度使用以下命令则需要开启rpcuser=bitcoin_user
rpcpassword=bitcoin2024ToTheMoon这两项配置，如果你同步完区块后要装runes节点，则 要注释掉这两项配置并重启服务来生成.cookie文件）

```shell
# 获取区块链信息
bitcoin-cli getblockchaininfo 

# 获得比特币核心客户端状态的信息
bitcoin-cli getinfo

# 命令将显示钱包当前的所有地址的余额总和
bitcoin-cli getbalance

# 查看我们钱包中所有剩余的从之前交易中已确认的支出；
bitcoin-cli listunspent

# 该命令用来创建交易，可以根据 listunspent 获取它的 txid ，amount 的数值不能太大，否则会提示昂贵的交易费。执行完成之后会生成一个 hexString，用来验证交易时使用。
bitcoin-cli createrawtransaction '[{"txid":"myid","vout":0}]' '{"address":0.01}'

# sighashtype该命令用来签名交易，注意：amount 应该是 listunspent 反应的 amount 的值，scriptPubKey 也是 listunspent 中的 scriptPubKey ，sighashtype 的默认值是 all，可以不写，redeemScript 是多重签名验证，没有特殊要求可以不写。执行完成之后会生成一个 signedhex 的签名验证码。
bitcoin-cli signrawtransaction "hexstring" ‘[{"txid":"id","vout":n, "amount":value,"scriptPubKey":"hex","redeemScript":"hex"},...]’ ‘["privatekey1",...]’ 

# 该命令用来发送交易。
bitcoin-cli sendrawtransaction "signedhex"

# 密码 时间 walletpassphrase命令需要两个参数——密码，和多久钱包会再次被自动锁定的秒数数字（计时器）。该命令是用来解锁钱包的，执行完成什么也不会输出，代表解锁完成。
bitcoin-cli walletpassphrase

# 该命令用来获取 privateKey，在第五步中会需要。
bitcoin-cli dumpprivkey "address" 
```



### 安装runes节点

ordinals节点安装包

`https://github.com/ordinals/ord/releases`

~~~shell
# 最新节点安装包
wget https://github.com/ordinals/ord/releases/download/0.18.5/ord-0.18.5-x86_64-unknown-linux-gnu.tar.gz

# 解压文件
tar -zxvf ord-0.18.5-x86_64-unknown-linux-gnu.tar.gz

# 复制到指定目录
cp ./ord-0.18.5-x86_64-unknown-linux-gnu /data/btcoin/ord

~~~



btcoin全节点配置文件需要配置`txindex=1`，如果已经配置过了可忽略此步骤

~~~shell
echo 'txindex=1' >> /root/.bitcoin/bitcoin.conf
~~~

更新配置之后需要重启服务`systemctl restart bitcoind`

ord 更新索引要快的话，可以去这个网站下载`https://ordstuff.info/indexes/0.18/`





**新增ord系统服务**

~~~shell
echo '[Unit]
Description=ORD Service
After=network.target

[Service]
User=root
ExecStart=/usr/local/bin/ord-0.18.2/ord --bitcoin-data-dir=/data/bitcoin/data --cookie-file=/data/bitcoin/data/.cookie server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target' > /etc/systemd/system/ord.service
~~~











