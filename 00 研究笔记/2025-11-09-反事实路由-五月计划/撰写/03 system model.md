In this section, the fundamental architecture of the LEO satellite constellation is first introduced in Section II-A. Subsequently, in Section II-B, we model the inter-satellite communication processes within the same orbital plane and between adjacent orbital planes, and derive analytical expressions for propagation and transmission delays. Section II-C introduces the distributed routing decision rules and a queueing-theoretic model, yielding formulations for the overall queuing delay and system load.



A. 低轨卫星星座模型

本文考虑由几百到几千颗低地球轨道（LEO）卫星组成的中大型卫星星座。星座设计基于Walker‑delta模式，用符号$\alpha/M/N/F$表示，其中$\alpha \in (0 ,  \frac{\pi}{2})$为轨道倾角，M为轨道面数，相邻面升交点赤经差为$\Delta \theta = \frac{2\pi}{M}$。N为每轨道的卫星数，同一轨道内相邻卫星的相位差为$\Delta \phi = \frac{2\pi}{N}$。$f=0,1,...,N-1$决定了面间相位，因此相邻轨道上卫星之间的相对相位偏移为$\Delta \psi= \frac{2\pi f}{M N}$。轨道高度用$h_\text{orbit}$表示，对应的轨道周期为$\tau_\text{orbit}$。

如Fig 1. 所示, 在整体架构上，Walker-Delta 星座能够建立永久且稳定的轨道内及轨道间星间链路（ISL）。每颗卫星分别与同一轨道及相邻轨道中的相邻卫星建立四条 ISL，使得卫星之间可相互通信, 地面站和可视卫星形成上下行链路, 并随卫星运动而动态维护。因此，该星座在其覆盖范围内构成了一种稳定的网格状通信系统.

上述+Grid topology用时变图 $\mathcal{G}<\mathcal{V},\mathcal{E}(t)> = \mathcal{G}<(S,G), \mathcal{E}(t)>$ 描述, 其中 $\mathcal{V} = S \cup G$ 表示通信节点集合, 包括地面Gateway和卫星节点,  $S = \{S_k \mid k \leq N_S, k \in \mathbb{N}_+\}$ 表示卫星节点集合, $N_S=M\times N$ 为卫星节点数量, 对于任意一个卫星节点 $S_i$ , 用 $\text{Ne}(S_i)$ 表示它的邻居节点. The gateway set is denoted as $G = \{G_k \mid k \leq N_G, k \in \mathbb{N}_+\}$, and they are dispersed globally, responsible for traffic injection and reception, are distributed across the Earth's surface and maintain links with visible satellites denoted as $\text{Ne}(G_i)$, with traffic exclusively uplinked and downlinked through these connections. $\mathcal{E}(t)$ denotes the set of all the communication links, including inter-stellar links, uplinks and downlink links, defined as:
$$
\mathcal{E}(t) = \{\mathcal{E}_{ij}(t) \mid i \le N_S, \mathcal{V}_j \in \text{Ne}(S_i)  \} \cup \{\mathcal{E}_{i}(t) \mid \mathcal{V}_i \in \text{Ne}(G_i) \}
$$
对于 $\mathcal{E}(t)$ 中的任意一个元素, 定义距离 $d_{ij} = |\mathcal{E}_{ij}|, i\neq j \le |\mathcal{V}|$, 若链路不可达, 则记作 $d_{ij}=\infty$



The +Grid topology above is represented by a time-varying graph $\mathcal{G}<\mathcal{V},\mathcal{E}(t)> $, where $\mathcal{V} = S \cup G$ denotes the set of communication nodes, comprising gateways and satellite nodes. Specifically, $S = \{S_k \mid k \leq N_S, k \in \mathbb{N}_+\}$ represents the set of satellite nodes, with $N_S = M \times N$ being the total number of satellite nodes. For any satellite node $S_i$, its neighboring nodes are denoted by $\text{Ne}(S_i)$. The gateway set is denoted as $G = \{G_k \mid k \leq N_G, k \in \mathbb{N}_+\}$, and these gateways are globally dispersed across the Earth's surface, responsible for traffic injection and reception. Each gateway maintains communication links with its visible satellites, denoted as $\text{Ne}(G_i)$, and all traffic is exclusively uplinked and downlinked through these connections. $\mathcal{E}(t)$ denotes the set of all communication links at time $t$, including inter-satellite links, uplinks, and downlinks, formally defined as:
$$
\mathcal{E}(t) = \{\mathcal{E}_{ij}(t) \mid i \le N_S, \mathcal{V}_j \in \text{Ne}(S_i)  \} \cup \{\mathcal{E}_{i}(t) \mid \mathcal{V}_i \in \text{Ne}(G_i) \}.
$$
For any element in $\mathcal{E}(t)$, the distance is defined as $d_{ij} = |\mathcal{E}_{ij}|$, where $i \neq j \le |\mathcal{V}|$. If a link is unreachable, it is denoted as $d_{ij} = \infty$.

The time domain is discretized into time slots, we partition the observation period $T$ into $W$ time slots, and each slot is denoted as $\tau_i, i=0,1,2,...,W$, the slot length is denoted as $\tau = \frac{T}{W}$. Within each time slot, all the link states remain stable until the next slot.

The disruption of ISLs connection near the polar regions and the interference caused by solar eclipses are particularly notable. In this paper, the two main causes of ISLs outage are modeled as time-varying probability distributions:
$$
p_\text{fail}(t;i,j) = 1-(1-p_\text{beam}(t; i,j))\cdot(1-p_\text{solar}(t; i))
$$
where the prior forms are given for the simplified problem:

(1) beam pointing angle failure probability

Precise beam pointing, acquisition, and tracking (PAT) is critical for maintaining ISLs. Link quality degrades when the pointing error exceeds the system's tolerance threshold. 
$$
p_\text{beam}(t; i,j) = \frac{1}{Z_b} \cdot \frac{1}{1+ e^{-\xi_b(\cos 2\theta_b- \cos\theta_b^*)}}
$$
where $\theta_\text{b}(t)=<S_i, S_j> \in (-\pi, \pi]$ denote the instantaneous angle between the line-of-sight vector and the flight direction between satellites node. $\theta_\text{b}^*$ denote the pointing loss threshold. $\xi_b$ controls the effect rate, $Z_b$ is the normalization coefficient.

(2) solar interference failure probability

The interference caused by strong solar radiation on the receiver will lead to the degradation of the Signal-to-Noise ratio (SNR) or the saturation of the receiver, which will lead to the link failure.
$$
p_\text{solar}(t;i) =\frac{1}{Z_s} \cdot \frac{1}{1+ e^{-\xi_s(\cos \theta_s- \cos\theta_s^*)}}
$$
where $\theta_s \in (-\pi, \pi]$ is defined as the cosine of the cosine of the angle between the position vector of the sun and the satellite, with the center of the earth as the origin of the reference. $\theta_s^*$​ denotes the critical solar interference angle. $\xi_s$ controls the effect rate, $Z_s$ is the normalization coefficient.

因此, 在我们所定义的环境中, 任何链路都不是恒定连接的. 在每个时隙开始会重新根据干扰因素计算链路状态的改变. 为方便起见, 后续论述不再标注时隙, 所提到的定义对于所有时隙都是适用的. 

Therefore, in the environment we have defined, any link is not constant connected. At the beginning of each time slot, the change of the link state is re-calculated according to the interference factor. For convenience, time slots are not annotated in the following discussion, and the mentioned definitions are applicable to all time slots.





C. Routing and Queueing Model

> 这部分关于排队论的内容以及后续关于反事实推断的内容是数学集中的部分, 也是全文数学水平体现的部分



The communication process of the Integrated Satellite-Terrestrial Network (ISTN) based on LEO satellite constellations originates from traffic injection at terrestrial gateways. At each time slot, every ground gateway randomly injects $N_\text{in}^i$ packages toward visible satellites via uplink according to a Poisson process, for a certain visible satellite $i$, :

$$
\begin{equation}
P([N_\text{in}^i(t+\tau) - N_\text{in}^i(t)]=n) = \frac{(\lambda_t^i \tau)^n}{n!}e^{-\lambda_t^i \tau},
\end{equation}
$$
where $\lambda_t^i$ denotes the Poisson arrival rate of the node $i$ during given time slot.

In the distributed routing architecture, each satellite runs its own routing strategy program and awaits incoming messages. The ground gateway encapsulates relevant routing information into the protocol header based on users’ stochastic service requirements. Each satellite is equipped with a buffer queue of maximum capacity $N=Q_\text{max}$. Upon receiving a message, it is enqueued and awaits processing. For dequeued messages, the satellite parses the protocol header, computes the next-hop node according to its routing strategy, and transmits the message through an ISL to the corresponding port for forwarding to the adjacent satellite. Ultimately, the message undergoes multi-hop forwarding until it reaches the edge node associated with the destination gateway, where it is delivered via a downlink to the terrestrial network for subsequent service.

Each satellite features four independent forwarding ports ($C=4$) that share a common buffer queue. While one port is engaged in a transmission task, it remains blocked for the transmission duration $D_{tx}$ until the transmission completes. 因此, 在每个时隙, 卫星除了会收到gateway的泊松流量注入, 还会收到一个不确定的来自邻居的转发流量, 因此, 每个节点可以近似为加性噪声影响下的 $M/D/C/N$ 排队系统.

设随机变量 $N_a^i(t)$ 为节点 $i$ 在时隙 $t$ 内到达包的数量, 其服从加性噪声 $U^i_\text{a}(t)$ 影响下的泊松分布:
$$
\begin{equation}
N_a^i(t) = N_\text{in}^i(t) + \sum_{j \in \text{Ne}(S_i)}N_s^j(t-1) = N_\text{in}^i(t) + U^i_a(t), \quad  N_\text{in}^i(t) \sim \text{Poisson}(\lambda_t^i \tau)
\end{equation}
$$
 The queue length of node $i$ denoted as $Q_t^i$ is iterated following the Lindley Process, expressed as:
$$
\begin{equation}
\begin{aligned}
Q_{t+1}^i &= 
\begin{cases}
Q_t^i - N_s^i(t) + N_a^i(t), & \text{if } Q_t^i \ge N_s^i(t), \\
N_a^i(t),                  & \text{if } Q_t^i < N_s^i(t),
\end{cases} \\
Q_{t+1}^i &\le Q_\text{max}.
\end{aligned}
\end{equation}
$$
where $N_s^i(t) = \mu_t^i \tau = \frac{C \cdot \tau}{D_{tx}}$ represents the number of packets the node $i$ can process within given time slot, $\mu_t^i$ being is the service rate. According to queuing theory, the node load within a time slot is defined as the ratio of the average arrival rate to the service rate, which corresponds to the ratio of the expected number of arriving packets to the number of packets that can be served:
$$
\begin{equation}
\rho_t^i = \frac{\lambda_t^i}{\mu_t^i} = \frac{N_a^i(t)}{N_s^i(t)}.
\end{equation}
$$
When $\rho_i < 1$, the queue length and delay admit a steady-state distribution. However, if $\rho_i \ge 1$, packet loss occurs due to queue overflow.

Using the queue condition distribution $P(Q_{t+1}|Q_t)$ to construct an embedded Markov chain, define $p_t(n)=P(N_a^i(t)=n)$  as the transient distribution of the arrival packet, the transfer equation is given by:
$$
P(Q_{t+1} = j \mid Q_t = i) = 
\left \{
\begin{aligned}
&p_t(j-i+N_s(t) )&&,  i  \ge N_s, j \ge i-N_s(t) \\
&p_t(j) &&, i < N_s(t) \\
&0&&, \text{other}
\end{aligned}
\right.
$$
At the beginning of the time slot, the arriving batches of packets are arranged in random order, and the remaining time of the packet being served is also uncertain. For a given queue length, the queuing time can be viewed as a linear model about $ Q_{t+1}^i$ under additive noise $ U_q^i(t)$:
$$
T_{t+1}^i = Q_{t+1}^i \cdot D_\text{tx} + U_q^i(t)
$$
在给定队列长度 $ Q_{t}^i=q$ 条件下, 排队时间的期望为:
$$
\mathbb{E}[T_{t+1}^i \mid Q_{t}^i= q] = \sum_{j=0}^{Q_\text{max}}\mathbb{E}[T_{t+1}^i \mid Q_t^i = q, Q_{t+1}^i=j] \hat{P}(Q_{t+1}^i = j \mid Q_t^i = q)
$$
其中, $\hat{P}(Q_{t+1}^i = j \mid Q_t^i = q)$ 是分布列 $P(Q_{t+1}^i = j \mid Q_t^i = q), j \le Q_\text{max}$ 支撑集的归一化分布. 将概率转移分布带入, 并记 $\Delta_q^i(t)=Q_\text{max} - Q_t^i +N_s^i(t) $, 则可以得到排队时间关于到达数量分布的关系:
$$
\mathbb{E}[T_{t+1}^i \mid Q_{t}^i= q] = \rho_t^i \tau \cdot  \sum_{k=0}^{\Delta_q^i(t)-1} \hat{p}_t(k)   + [D_\text{tx}(Q_\max - \Delta_q^i(t)) + U_q^i(t)] \cdot \sum_{k=0}^{\Delta_q^i(t)} \hat{p}_t(k)
$$
对于给定队列长度条件下的排队时延为:
$$
D_\text{queue}(i;q) =\mathbb{E}[T_{t+1}^i \mid Q_{t}^i= q]
$$
Moreover, packet loss is declared whenever $\rho_t^i > 1$ or the cumulative distribution of the transition probabilities exceeds a prescribed threshold:  
$$
\sum_{j=Q_\text{max} +1}^{\infty}P(Q_{t+1}^i = j \mid Q_t^i = q) \ge p_\text{loss}^* \Leftrightarrow  1- \sum_{k=0}^{\Delta_q^i(t)} p_t(k) - p_\text{loss}^* \ge 0
$$




###### history

The integrated satellite-terrestrial network (ISTN), which leverages LEO satellite constellations, operates through a structured communication process that can be broken down into the following sequence of steps.

Initially, once the satellite network is established, each satellite executes its own routing‑strategy program and enters a listening state for incoming messages. In response to user communication demands, ground gateways encapsulate relevant routing information into protocol headers and subsequently transmit the messages to edge nodes via uplinks. Each satellite is equipped with a finite‑capacity buffer; upon receiving a message, the message is queued for processing. When a message is dequeued, the satellite parses its protocol header, computes the next‑hop node according to the implemented routing strategy, and forwards the message through the corresponding communication port to the next‑hop neighboring satellite via ISLs. Through multi‑hop forwarding, the message eventually arrives at the edge node of the destination gateway, is delivered via the downlink, and is then transferred to the terrestrial network for further service handling.

Under a distributed routing architecture, each satellite dynamically maps forwarding actions to one of its four communication ports—each connected to an adjacent satellite—based on locally perceived network states and the routing information carried in the packet header. This method circumvents the substantial routing‑table storage overhead and prolonged routing‑convergence delays characteristic of traditional routing protocols. Nevertheless, several key challenges remain in the practical deployment of this architecture.



在单个时隙内, the queue waiting time is based on the solutions of the roots of the following equation with $C$ servers and the system utilization $\rho_{t-1}^i$, from:
$$
z^C = e^{-C \rho_{t-1}^i (1-z)}
$$
该方程具有 $C-1$ 个根 $z_k$ 利用Lambert-W function表述为:
$$
z_k = -\frac{1}{\rho_{t-1}^i}W(-(-1)^{\frac{k}{2}}\rho_{t-1}^i e^{-\rho_{t-1}^i}), ~~k=1,2,3
$$
Applying Little’s Law, $\bar{\lambda}^i_t D_{\text{queue}} = Q^i_t$, where $\bar{\lambda}^i_t = \mu_t^i \rho_t^i$ denotes the effective arrival rate during time slot $t$, and $\bar{Q}^i_t$ represents the steady-state queue length. The mean queuing delay $D_{\text{queue}}$ is derived from the steady-state solution of the $M/D/C/N$ queueing system:
$$
D_\text{queue} = \frac{\bar{\lambda}^i_t D_\text{tx}^2}{2C(1-\rho_{t-1}^i)} \cdot \frac{(C \rho_{t-1}^i)^2- C(C-1) + 2C(1-\rho_{t-1}^i) \sum_{k=1}^{C-1}\frac{1}{1-z_k}}{(C\rho_{t-1}^i)^2}
$$
The number of packet losses under the steady-state distribution can be obtained from the above equation
$$
L_t^i = \max \{0, \bar{\lambda}^i_t D_{\text{queue}}  - \min \{Q_\text{max}, \bar{\lambda}^i_t D_{\text{queue}} \} \}
$$


###### workbench

The routing process of the Integrated Satellite-Terrestrial Network (ISTN) based on LEO  satellite constellations originates from traffic injection at terrestrial gateways. At each time slot, every ground gateway $i$ randomly injects $N_\text{in}^i$ packets toward visible satellites via the uplink according to a Poisson process. For a certain visible satellite $i$, the number of injected packets over an interval $\tau$ follows:

$$
\begin{equation}
P([N_\text{in}^i(t+\tau) - N_\text{in}^i(t)]=n) = \frac{(\lambda_t^i \tau)^n}{n!}e^{-\lambda_t^i \tau},
\end{equation}
$$
where $\lambda_t^i$ denotes the Poisson arrival rate of node $i$ during the given time slot.

In the distributed routing architecture, each satellite executes its own routing strategy program and awaits incoming messages. The ground gateway encapsulates relevant routing information into the protocol header based on users’ stochastic service requirements. Each satellite is equipped with a buffer queue of maximum capacity $N=Q_\text{max}$. Upon receiving a message, it is enqueued and awaits processing. For dequeued messages, the satellite parses the protocol header, computes the next-hop node according to its routing strategy, and transmits the message through an inter-satellite link (ISL) to the corresponding port for forwarding to the adjacent satellite. Ultimately, the message undergoes multi-hop forwarding until it reaches the edge node associated with the destination gateway, where it is delivered via a downlink to the terrestrial network for subsequent service.

Each satellite features four independent forwarding ports ($C=4$) that share a common buffer queue. While one port is engaged in a transmission task, it remains blocked for the transmission duration $D_{tx}$ until the transmission completes. Consequently, during each time slot, a satellite receives not only Poisson-distributed traffic injected from terrestrial gateways but also an uncertain amount of forwarded traffic from neighboring satellites. Therefore, each node can be approximated as an $M/D/C/N$ queuing system under additive noise.

Let the random variable $N_a^i(t)$ denote the total number of packets arriving at node $i$ during time slot $t$. It follows a Poisson distribution perturbed by additive noise $U^i_\text{a}(t)$:
$$
\begin{equation}
N_a^i(t) = N_\text{in}^i(t) + \sum_{j \in \text{Ne}(S_i)}N_s^j(t-1) = N_\text{in}^i(t) + U^i_a(t), \quad  N_\text{in}^i(t) \sim \text{Poisson}(\lambda_t^i \tau)
\end{equation}
$$

The queue length of node $i$, denoted as $Q_t^i$, evolves according to the Lindley process:
$$
\begin{equation}
\begin{aligned}
Q_{t+1}^i &= 
\begin{cases}
Q_t^i - N_s^i(t) + N_a^i(t), & \text{if } Q_t^i \ge N_s^i(t), \\
N_a^i(t),                  & \text{if } Q_t^i < N_s^i(t),
\end{cases} \\
Q_{t+1}^i &\le Q_\text{max}.
\end{aligned}
\end{equation}
$$
Here, $N_s^i(t) = \mu_t^i \tau = \frac{C \cdot \tau}{D_{tx}}$ represents the number of packets that node $i$ can serve within the given time slot, with $\mu_t^i$ being the service rate. According to queuing theory, the node load $\bar{\rho}_t^i$ within a time slot is defined as the ratio of arrival number to service number:
$$
\begin{equation}
 \bar{\rho}_t^i = \frac{N_a^i(t)}{N_s^i(t)} = \frac{N_\text{in}^i(t) + U^i_a(t)}{N_s^i(t)}=\frac{\lambda_t^i}{\mu_t^i}+U_\rho^i(t)
\end{equation}
$$
where $\rho_t^i = \frac{\lambda_t^i}{\mu_t^i}$ is the load of $M/D/C/N$ queueing system and $U_\rho^i(t)$ is the equivalent additive noise. When $\rho_i < 1$, the queue length and delay admit a steady-state distribution. However, if $\rho_i \ge 1$, packet loss occurs due to queue overflow.

Using the queue state transition distribution $P(Q_{t+1}|Q_t)$, an embedded Markov chain is constructed. Let $p_t(n)=P(N_a^i(t)=n)$ denote the transient distribution of the number of arriving packets. The transition probability is given by:
$$
P(Q_{t+1} = j \mid Q_t = i) = 
\left \{
\begin{aligned}
&p_t(j-i+N_s(t) )&&,  i  \ge N_s, j \ge i-N_s(t) \\
&p_t(j) &&, i < N_s(t) \\
&0&&, \text{otherwise}
\end{aligned}
\right.
$$

At the beginning of each time slot, arriving batches of packets are arranged in random order, and the residual service time of the packet currently being transmitted is also uncertain. For a given queue length, the queuing time can be modeled as a linear function of $ Q_{t+1}^i$ under additive noise $ U_q^i(t)$:
$$
T_{t+1}^i = Q_{t+1}^i \cdot D_\text{tx} + U_q^i(t)
$$

Conditioned on a fixed queue length $ Q_{t}^i=q$, the expected queuing time is:
$$
\mathbb{E}[T_{t+1}^i \mid Q_{t}^i= q] = \sum_{j=0}^{Q_\text{max}}\mathbb{E}[T_{t+1}^i \mid Q_t^i = q, Q_{t+1}^i=j] \hat{P}(Q_{t+1}^i = j \mid Q_t^i = q)
$$
where $\hat{P}(Q_{t+1}^i = j \mid Q_t^i = q)$ denotes the normalized version of the probability mass function $P(Q_{t+1}^i = j \mid Q_t^i = q)$ over its support $j \le Q_\text{max}$. Substituting the transition probabilities and defining $\Delta_q^i(t)=Q_\text{max} - Q_t^i +N_s^i(t) $, the expected queuing time can be expressed in terms of the arrival distribution as:
$$
\mathbb{E}[T_{t+1}^i \mid Q_{t}^i= q] = \bar{\rho}_t^i \tau \cdot  \sum_{k=0}^{\Delta_q^i(t)-1} \hat{p}_t(k)   + [D_\text{tx}(Q_\max - \Delta_q^i(t)) + U_q^i(t)] \cdot \sum_{k=0}^{\Delta_q^i(t)} \hat{p}_t(k) \\
$$

Expanding the equivalent term in, and equivalently equating the additive noise term to $U_d^i(t)$, we obtain the additive noise model of the conditional queuing delay for a given queue length $q$ at node $i$.
$$
D_\text{queue}(i;q) =\rho_t^i \tau \cdot  \sum_{k=0}^{\Delta_q^i(t)-1} \hat{p}_t(k) + D_\text{tx}(Q_\max - \Delta_q^i(t)) \cdot \sum_{k=0}^{\Delta_q^i(t)} \hat{p}_t(k) + U_d^i(t)
$$

Moreover, packet loss is declared whenever $\rho_t^i > 1$ or when the cumulative tail probability of the queue-length transition exceeds a prescribed threshold:
$$
\sum_{j=Q_\text{max} +1}^{\infty}P(Q_{t+1}^i = j \mid Q_t^i = q) \ge p_\text{loss}^* \Leftrightarrow  1- \sum_{k=0}^{\Delta_q^i(t)} p_t(k) - p_\text{loss}^* \ge 0
$$
end







