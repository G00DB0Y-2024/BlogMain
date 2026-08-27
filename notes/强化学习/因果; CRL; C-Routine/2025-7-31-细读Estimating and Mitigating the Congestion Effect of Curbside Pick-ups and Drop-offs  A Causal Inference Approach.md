# Estimating and Mitigating the Congestion Effect of Curbside Pick-ups and Drop-offs  A Causal Inference Approach

##### 文章要解决的问题

-  **研究重点** : 本研究探索利用交通流重路由策略，从拥堵严重区域转移到拥堵较轻区域，从而减少城市范围内的总出行时间。主要解决以下问题：

  1. 如何从观测到的交通数据中评估 **PUDO** 造成的拥堵影响？

     > 类似于卫星问题, 如何衡量路由拥堵的影响, 或是度量其指标

  2. 如何基于区域间异质拥堵效应的差异，管理 **PUDO** 以最小化城市范围内的总出行时间？



##### 例子1

> - 假设在时间间隔 $t$ ，一个区域新增了**100名旅客**。 
> - **其中20人选择乘坐网约车**，80人自驾前往，那么前者会在路边停车上下客，后者直接去车库停车。 
> - 由于出行需求增加，该区域平均速度降低2英里/小时( $mph$ )。 
> - 速度降低的原因包括两个方面：
>   1. 100辆车(网约车和私家车)在道路上造成的拥堵；
>   2. 20次PUDO行为造成的拥堵。 
> - 假设前者导致速度降低1.5 $mph$ ，后者导致速度降低0.5 $mph$ 。

- 因果作用便是要弄清混合后果中, **某个原因到底起多少成分的作用**

  - 正确的计算方式：PUDO的拥堵效应 = 0.5 $mph$ / 20 PUDO = 0.025 $mph$ /PUDO。 

  - 错误的计算方式：PUDO的拥堵效应 = 2 $mph$ / 20 PUDO = 0.1 $mph$ /PUDO (高估)。

- 因果学习 -> 学习有哪些协变量/其中的因果关联又是如何
- 因果推断 -> 给定因果DAG, 断定节点A对节点B的因果作用量ATE是多少



##### 文章方法

1. 利用双重分离机器学习DML, 基于因果图进行了理论分析, 用于**估计拥堵效应**
2. 提出了一个重路由方案，通过重新分配PUDO，以最小化全网络的总行程时间

###### 因果图的构建

- $y_t^v$ 表示 $t$ 时刻区域 $v$ 的交通状态量化指标 (如速度、流量)，而 $d_t^v$ 表示 $t$ 时刻区域 $v$ 的 NoPUDO

- 交通速度的影响因素：
  - 历史交通速度记录 $Y_{t-I:t-1}^v$ (从 $t-I$ 到 $t-1$ )
  - 周边区域 $N(v)$ 在过去时间窗口 $Y_{t-I:t-1}^{N(v)}$
  - 历史NoPUDO $D_{t-I:t-1}^v$ (从 $t-I$ 到 $t-1$ )反映了需求水平
  - 外部控制变量 $W_t^v$ ，如天气、节假日和高峰时段等

> 上述可以看出一个重要的规则：
>
> - 我们对于“拥堵”并不需要一个特别**抽象的**变量来描述，而更需要**直观**
>- 所谓**拥堵**程度，直观上就是**速度**变小，或是**流量**上升
> - 进一步地，才会抽象为其他指标，例如误码率、吞吐量等
> 
>> Consequently, one unit of the PUDO induces a more significant congestion effect in those busy regions, which further exacerbates the congestion. Taking the Manhattan area as an example, the  θv   in Midtown is typically higher than that in Upper West Side, and hence the congestion caused by PUDOs in Midtown is more severe
> >
>> - <span style="color:#FFFF00; font-size:1.1em;">文章最终将拥堵效应抽象为拥堵干预系数 $|\theta_v|$</span>



##### 文中所做的假设

###### 假设1: 瞬时性假设

**核心假设**：认为上下客数量**（网络需求）是瞬时的**，<u>即历史需求不对当前结果产生因果效应</u>

- 考虑历史的速度和临近的速度（时域和空域）对当前速度的**生成**
- 天气等混杂因素归位一个变量，也可以归为一个向量，也是**瞬时作用**
- 当前时刻的邻居因素和上下客需求都是生成的，不产生作用

<img src="./assets/image-20250731151933654.png" alt="image-20250731151933654" style="zoom:50%;" />



###### 假设2: 线性效应假设

**核心假设** : 假设2 (线性效应) 指出，对于特定区域 $v$ ，给定固定的历史交通速度 $Y_{t-I:t-1}^v$ 、相邻区域的历史交通速度 $Y_{t-I:t-1}^{N(v)}$ 和外部控制变量 $W_t^v$ ，拥堵效应 $θ_v$ 的定义如公式 (1) 所示： 
$$
y_t^v | do(d_t^v = d_1) - y_t^v | do(d_t^v = d_2) = θ_v (d_1 - d_2)
$$

- 线性假设的局限性:

  - 对于复杂的时空因果联系来说, 若单纯认为 d -> y 的因果作用就是线性的, 是不合理的

  - 例如：在交通高峰期增加一个 **上落客点(PUDO)** 的影响可能比在交通低谷期更显著

###### 文章所采用的非线性方案:

- <span style="color:#FFFF00; font-weight:bold;">将时间切片，在每个时间片内，按照静态的线性假设；不同的时间片内重新估计效应</span>
- **时间-空间同质性假设**：上下客需求在相同的区域、同一个时间片内造成的因果效应参数是恒定的

基于因果图和假设2，建立上下客对于速度和需求量的**结构方程模型**：

$$
y_t^v = \varphi^v (Y_{t-I:t-1}^v; Y_{t-I:t-1}^{N(v)}; W_t^v) + \theta^v \cdot d_t^v + e_t^v
$$

$$
d_t^v = \psi^v (D_{t-I:t-1}^v, Y_{t-I:t-1}^v, Y_{t-I:t-1}^{N(v)}; W_t^v) + \xi_t^v
$$

其中交通速度 $y_t^v$ 是结果变量， $d_t^v$ 是处理变量， $D_{t-I:t-1}^v$ 、 $Y_{t-I:t-1}^v$ 、 $Y_{t-I:t-1}^{N(v)}$ 、 $W_t^v$ 是控制变量。 **$\theta^v$ 是关键的处理效应**，反映了 上下客对交通速度的影响。

- 线性部分：$ \theta^v \cdot d_t^v $ 符合同质性假设

<span style="font-weight:bold; color:#FFFF00;">需要注意：上述两个方程仅仅是描述因果的结构方程，并非拟合关系，这对于理解下述公式极其必要</span>

下述真正的拟合关系，实际上是在学习这个未知的**因果生成机制**



###### 假设3: 零均值假设

**核心假设:** 上述的**噪声分布未知**, 但应当是**零均值**的，在给定观测变量情况下
$$
E[e_t^v | Y_{t-I:t-1}^v ; Y_{t-I:t-1}^{N(v)} ; d_t^v ; W_t^v] = 0
$$

$$
E[\xi_t^v | D_{t-I:t-1}^v ; Y_{t-I:t-1}^v ; Y_{t-I:t-1}^{N(v)} ; W_t^v ] = 0
$$

- 服从未知的零均值分布

- 可识别性：根据后门准则得到，基于当前的因果图，在控制变量给出时，因果 d -> y 时可识别的



##### 分离双重机器学习算法

文章提出了如接力赛一般的三模型机器学习算法

目的是：消除单个模型拟合过程中产生的偏差

核心用法: 使用机器学习对**因果生成机制**进行学习, 其**残差携带因果信息**

所需三个模型: Y, D, Z 分别为:
$$
\begin{aligned}
&\mathcal{Y}: 
\hat{y_t^v} = \hat{\phi_v}(Y_{t-I:t-1}^v; Y_{t-I:t-1}^{N(v)}; W_t^v) \\

&\mathcal{D}:
\hat{d}_t^v = \hat{\psi}_v(D_{t-I:t-1}^v, Y_{t-I:t-1}^v, Y_{t-I:t-1}^{N(v)}, W_t^v) \\

&\mathcal{Z}:
\hat{z}_t^v = \theta_v \hat{\xi}_t^v + \hat{e}_t^v

\end{aligned}
$$
训练方法: 

根据因果结构方程, 得到如下残差公式: 
$$
\begin{aligned}
&\mathcal{Y}: 
\hat{\epsilon_t^v} = y_t^v - \hat{y_t^v}
 = \theta_v d_t^v + [\phi_v(···) - \hat{\phi_v}(···)] + e_t^v \approx \theta_v d_t^v + e_t^v \\

&\mathcal{D}:
\hat{\xi}_t^v = d_t^v - \hat{d}_t^v
= \hat{\xi}_t^v = [\psi_v(\cdot \cdot \cdot) - \hat{\psi}_v(\cdot \cdot \cdot)] + \xi_t^v \approx \xi_t^v\\

&\mathcal{Z}:
\hat{\theta}_v = \arg \min_{\theta} E \left[ \sum_{t \in T} (\hat{\epsilon}_t^v - \theta \hat{\xi}_t^v)^2 \right]
  

\end{aligned}
$$

- 第一项, 模型Y学习结果变量的生成机制, 逼近真实结果 $y_t^v$ , 其残差由两部分组成, 上下客和噪声引起
- 第二项, 模型D学习上下客需求的生成机制, 逼近真实上下客数量, 残差仅和噪声有关
- 第三项, 模型Z学习Y和D残差间线性关系, 从而得到 $\theta_v$

$$
\begin{aligned}
&proof:~\hat{\theta}_v = \arg \min_{\theta} E \left[ \sum_{t \in T} (\hat{\epsilon}_t^v - \theta \hat{\xi}_t^v)^2 \right] \\

&for:\\
& \begin{aligned}

\hat{\epsilon}_t^v - \theta \hat{\xi}_t^v 
&= 

\theta_v d_t^v + [\phi_v(···) - \hat{\phi_v}(···)] + e_t^v- \theta[\psi_v(\cdot \cdot \cdot) - \hat{\psi}_v(\cdot \cdot \cdot)] - \theta \xi_t^v \\

&= \theta_v d_t^v - \theta \psi_v(\cdot \cdot \cdot) - \theta \xi_t^v + [\phi_v(···) - \hat{\phi_v}(···)] + \theta \hat{\psi}_v(\cdot \cdot \cdot) +  e_t^v \\
&=[\phi_v(···) - \hat{\phi_v}(···)] + \theta \hat{\psi}_v(\cdot \cdot \cdot) +  e_t^v ~~~~ (\theta \rarr \theta_v~~ \text{i.i.f})

\end{aligned}\\ \\

&using ~~ \mathbb{E}[\cdot |  D_{t-I:t-1}^v ; Y_{t-I:t-1}^v ; Y_{t-I:t-1}^{N(v)} ; W_t^v] = 0 \\

&\begin{aligned}
\mathbb{E}[\hat{\epsilon}_t^v - \theta \hat{\xi}_t^v ] &= \mathbb{E}[[\phi_v(···) - \hat{\phi_v}(···)] + \theta \hat{\psi}_v(\cdot \cdot \cdot) +  e_t^v ] \\
&= \mathbb{E}[[\phi_v(···) - \hat{\phi_v}(···)] + \theta \hat{\psi}_v(\cdot \cdot \cdot)  ] \\
&= \mathbb{E}[[\phi_v(···) - \hat{\phi_v}(···)] + \theta d_t^v  ] \\
&= \mathbb{E}[y_t^v - \hat{y_t^v} ] ~~~~ (\theta \rarr \theta_v~~ \text{i.i.f})\\
&= 0 
\end{aligned}\\ \\

&Q.E.D
\end{aligned}
$$

> 为什么 $d_t$ 的残差就是单纯的噪声, 这体现在结构方程和DAG中, D节点没有直接父节点
>
> 另外, 在单一时间片内, 文中仍采用线性假设, 故可以由如下得到上面线性拟合的推论
> $$
> \begin{aligned}
> &y_t^v|_{do(d_t^v = d_1)} - y_t^v |_{do(d_t^v = d_2)} = θ_v (d_1 - d_2) \\
> & \Rarr [\phi_v(···) - \hat{\phi_v}(···)] = -\theta_v d_t  
> \end{aligned} \tag{E1}
> $$
>
> - 有疑惑的点在于: 上述式子E1是根据因果结构方程以及机器学习目标推出, 按理说还存在一个噪声 $-e_t$ 项
>   1. 理解1, 在机器学习中, 已经蕴含噪声分布
>   2. 理解2, 应当从期望的角度理解: $\mathbb{E}[[\phi_v(···) - \hat{\phi_v}(···)] ] = -\theta_v d_t$





