在本节中，首先在3.1节介绍低轨卫星星座的基本架构。随后在3.2节中对星座中同轨道和相邻轨道平面内的卫星通信过程进行建模, 并导出传播和传输时延的表达; 在3.3节介绍分布式路由决策规则以及排队论模型, 得到队列系统总体时延以及负载的表示; 最后，第3.4节分析路由活跃期间的能量消耗情况.



3.1 leo satellite constellation model

This paper considers a medium- to large‑scale satellite constellation consisting of several hundred to several thousand Low Earth Orbit (LEO) satellites. The fundamental configuration adopts a Walker‑delta constellation, denoted as $\alpha/N/M/F$, where $\alpha \in (0 ,  \frac{\pi}{2})$ is the orbital inclination, N is the number of orbital planes, and the difference in right ascension of ascending node (RAAN) between adjacent planes is $\Delta \theta = \frac{2\pi}{N}$. M is the number of satellites per orbit, with the phase difference between adjacent satellites within the same orbit being $\Delta \phi = \frac{2\pi}{M}$. $f=0,1,...,N-1$ is the phase factor, which indicates the offset between satellites in adjacent orbits as $\Delta \psi= \frac{2\pi f}{M N}$.

In terms of overall architecture, the Walker‑Delta constellation can establish permanent and stable intra‑orbit and inter‑orbit inter‑satellite links (ISLs). Each satellite establishes four ISLs with its neighboring satellites within the same orbit and in adjacent orbits, enabling mutual communication among satellites. The ground station forms uplink and downlink links with the satellites within its visible range, and these links are dynamically maintained over time. Consequently, the constellation forms a time-varying grid (+Grid topology) communication system over its coverage area.

Index $S_{m,n}$ is defined to denote an arbitrary satellite in the Walker-Delta constellation, where $m \leq M$, $n \leq N; m, n \in \mathbb{N}_+$. All $N_S = MN$ satellites constitute the satellite set $S = \{S_k \mid k \leq N_S, k \in \mathbb{N}_+\}$. The ground gateways, responsible for traffic injection and reception, are distributed across the Earth's surface and maintain links with visible satellites, with traffic exclusively uplinked and downlinked through these connections. The gateway set is denoted as $G = \{G_k \mid k \leq N_G, k \in \mathbb{N}_+\}$, and they are dispersed globally. 对于任意一个卫星节点 $S_i$ , 用 $\text{Ne}(S_i)$ 表示它的邻居节点.

The time-varying graph $\mathcal{G}<\mathcal{V},\mathcal{E}(t)> = \mathcal{G}<(S,G),L_t>$ is used to describe the land use network of the entire constellation, where the $\mathcal{V} = S \cup G$ are node element, and $\mathcal{E}(t) = L_t$ denotes the set of all the communication links, including inter-stellar links, uplinks and downlink links, defined as:
$$
L_t=\{L_{ij}(t) \mid i,j \le N_S, i\neq j \in \mathbb{N}_+\} \cup \{L_{i}(t) \mid i \le N_G , i\in \mathbb{N}_+\}
$$
For time-domain discretization, we partition the observation period $T$ into $W$ time slots, and each slot is denoted as $\tau_i, i=0,1,2,...,W$. Within each time slot, all the link states remain stable until the next slot.

The disruption of ISLs connection near the polar regions and the interference caused by solar eclipses are particularly notable. ISLs may randomly disconnect when either: (1) the laser pointing angle between satellites satisfies $\theta_l \leq \theta_l^*$, or (2) when a satellite faces the Sun with the cosine of the angle exceeding a threshold $\cos \theta_s \geq \cos \theta_s^*$. In our defined environment, no link maintains a constant connection.

For convenience, subsequent discussions will omit explicit time slot notation, as all definitions apply uniformly across all time slots.



3.2 communication model

卫星间通信链路的性能由传播损耗、热噪声及信道容量共同决定. 对于低轨卫星间的视距通信, 假设信号在自由空间中传播, 对于链路 $L_{ij}$, 其路径损耗（即信道衰落因子）$F_{ij}$ 表示如下:
$$
\begin{align*}
F_{i j}=\left\{\begin{array}{cc}
\left(\frac{4 \pi || L_{ij}|| f_c}{c}\right)^{2} &, || L_{ij}|| \leq L_{t h} \\
\infty &, \text { otherwise }
\end{array}\right.
\end{align*}
$$
其中, $f_c$ 表示载波频率, $c$ 为光速, $L_{th}$ 表示可接收信号的距离阈值, $||L_{ij}||=\infty$ 表示链路不可达.

设发射功率为 $P_t$, 发射节点与接收节点的线性天线增益为 $G_t$, $G_r$, 则节点 $i$ 发向节点 $j$ 的传输功率为:
$$
P_{ij} = \frac{P_t \cdot G_t \cdot G_r}{F_{ij}} = P_t G_t  G_r \cdot(\frac{\lambda_c}{4\pi  || L_{ij}||})^2
$$
星间链路的信噪比(Signal-to-Noise Ratio, SNR)可简化为一个随机过程，其最大值正比于传输功率
$$
\text{SNR}_{ij} = \frac{P_{ij}}{F_{ij} n_0 B_{ij}}
$$
其中, $B_{ij}$是传输带宽, $n_0$ 是噪声功率谱密度. 基于 SNR 的形式可以给出星间传输的码率 $R(i,j) $ 为:
$$
R(i,j) = B_{ij}\log(1 + \hat{\text{SNR}}_{ij})
$$
由于基于激光的星间链路(Inter-Satellite Links, ISL)易受指向误差、随机空间噪声、复杂电磁环境、卫星姿态变化以及电池太阳能损耗的影响。因此，链路质量波动较大是常见事件, 上述码率公式中使用 $\hat{\text{SNR}}_{ij}$ 表示时隙中对于链路信噪比的观测值, 为简化问题, 假设其服从 $\hat{\text{SNR}}_{ij} \sim (0, \text{SNR}_{ij}]$ 的均匀分布, 当如下条件满足时, 视作链路断开.
$$
\hat{\text{SNR}}_{ij} < \text{SNR}_{th}
$$
根据以上论述, 对于大小为 $K$ bit 的数据包, 所需要的传输时间(秒)为:
$$
D_{tx}(i,j; K) = \frac{K}{R(i,j) }
$$
物理层传播时延(秒)为:
$$
D_{prop}(i,j) = \frac{||L_{ij}||}{c}
$$
综上，考虑定长数据包, 则任意卫星对之间的端到端通信时延可表示为物理传播时延与数据传输时延之和:
$$
D_{total}(i,j) =D_{tx}(i,j)+D_{prop}(i,j)
$$

3.3 routing and queueing model

基于低地球轨道卫星星座的综合卫星-地面网络（ISTN）的通信流程起始于地面网关的流量注入, 在每一个时隙 $\tau_i$, 每个地面网关都随机地通过上行链路向可视卫星以泊松过程注入流量:
$$
P([N(t_{i+1}) - N(t_i)]=k) = \frac{(\lambda_i \tau)^k}{k!}e^{-\lambda_i \tau}
$$
其中, $\lambda_i$ 为时隙 $\tau_i$的泊松到达率, $\tau$ 是时隙长度.

In the distributed routing architecture, each satellite operates its own routing strategy program and awaits incoming messages. The ground gateway encapsulates relevant routing information into the protocol header based on user’s random requirements. Each satellite is equipped with a buffer queue with the maximum capacity N, and upon receiving a message, it enters the queue awaiting processing. For dequeued messages, the satellite parses the protocol header, computes the next-hop node according to the routing strategy, and transmits the message via the Inter-Satellite Link (ISL) laser link to the corresponding port for forwarding to the next adjacent satellite. Finally, the message undergoes multi-hop forwarding until it reaches the edge node of the destination gateway, where it is delivered via a downlink to the terrestrial network for subsequent service.

每颗卫星具有四个独立的转发端口, 共同使用同一个缓存队列, 在一个端口执行传输任务时, 在 $D_{tx}$ 的传输时间内它将被阻塞直到传输结束 , 而其它端口则不受影响, 因此假设每颗节点满足 $M/D/C/N$ 排队模型, 队列的更新根据 Lindley Update Process 表述为:
$$
Q_{t+1}=
\left \{
\begin{aligned}
&Q_t - N_s + N_a &, Q_t \ge N_s\\
&N_a &,  Q_t \lt N_s\\
\end{aligned}
\right.
$$
其中, $N_s = \mu_i \tau = \frac{C \cdot \tau}{D_{tx}}$ 表示时隙内节点可以处理的数据包数目, $\mu_i$ 为节点服务率. 到达的包数目服从 $N_a \sim [\text{Poisson}(\lambda_i \tau) + \Phi(\tau)]$, 

其中, $\Phi_i(\tau)$ 表示时隙中节点 $i$ 收到的来自邻居的数据包

当时隙 $\tau$ 较小时, 可在离散时域中对队列状态进行数值求解, 排队时延通过其在队列中等待被服务所经历的完整时隙数量来度量:
$$
D_{queue}(i) = \min \{ w \in \mathbb{N}_{+} \mid \sum_{k=1}^w N_s^{k} \ge q_0\} \cdot \tau
$$
上式表示在卫星节点 $S_i$ 中的排队时延, 其中, $q_0$ 为队列起始长度, $w$ 为等待时隙数. 

根据排队论, 定义时隙内节点负载为到达率和服务率的比值
$$
\rho_i = \frac{\lambda_i}{\mu_i} = \frac{N_a^i}{N_s^i}.
$$
当 $\rho_i \lt 1$ 时, 队列长度和时延具有稳态分布, 当 $\rho_i \ge 1$ 时, 则会发生因队列溢出而导致的丢包. 

综上, 考虑路径 $\text{PA}_i = \{v_{i_1}, v_{i_2},..., v_{i_n}\}, v_{i_k} \in \mathcal{V}; i_p \neq i_q; L_{i_p, i_q} \in \mathcal{E}$, 其表示的路径端到端时延为:
$$
\mathcal{T}[\text{PA}_n] = \sum_{k=1}^{n-1} D_{prop}(i_k, i_{k+1}) + D_{tx}(i_k, i_{k+1}) + D_{queue}(i_k)
$$
其中, 如果 $v_{i_k} \in G$, 则不考虑排队时延, 即 $D_{queue}(i_k)=0$



3.4 energy consumption model

卫星在路由活动期间, 消耗的能量源于通过激光链路向相邻卫星转发数据包, 或下传至目标地面站。设在时隙 $\tau_i$, 卫星 $S_i$ 总计发送 $n_i(\tau_i)$ 个长度为 $K$ 的数据包, 其发射功率为 $P_i(\tau_i)$, 则直到 $W$ 时隙的星座能量消耗为:
$$
E(t) = \sum_{k=1}^W \sum_{i \in S} n_i(\tau_i) \cdot K \cdot P_i(\tau_i)
$$
而每个轨道周期 $\tau_{orbit}$ 中, 由于卫星通过太阳能帆板获取能量，设其在一个轨道周期内可获得的最大能量补充为 $E_{s}$（由太阳照射时间、帆板面积与转换效率决定），则其累计能耗不应超过该可再生能量上限：
$$
E(t) \le \lfloor \frac{W \cdot \tau}{\tau_{orbit}} \rfloor \cdot E_s \cdot N_S
$$


##### history

Specifically, the integrated satellite‑terrestrial network (ISTN) based on the LEO satellite constellation operates through a detailed communication process, which can be decomposed into the following steps:

First, after network formation, each satellite runs its own routing‑strategy program and waits for messages to arrive. The ground gateways encapsulate the relevant routing information into protocol headers according to user communication demands and transmit the messages to edge nodes via uplinks subsequently. Each satellite possesses a finite‑capacity buffer, upon receiving a message, it enters a queue to await processing. For dequeued messages, the satellite parses the protocol header, computes the next‑hop node based on the routing strategy, and delivers the message to the corresponding port for transmission to the next‑hop neighboring satellite via the ISL laser link. Finally, the message is multi‑hop forwarded to the edge node of the destination gateway, reaches it through the downlink, and is handed over to the terrestrial network for subsequent services.

Under a distributed routing architecture, each satellite dynamically maps forwarding actions to one of its four communication ports connected to neighboring satellites, based on locally perceived network states and the routing information in the packet header. This approach avoids the large routing‑table storage overhead and long routing‑convergence delays associated with traditional routing methods. However, this architecture still faces the following key challenges in practical implementation.

Compared to centralized routing, distributed routing requires each satellite to independently make decisions to collectively form a routing solution, increasing the complexity of the approach and necessitating careful coordination to achieve optimal performance. Meanwhile, constrained by limited satellite buffer capacity, bursty traffic in specific areas or at edge nodes can easily lead to buffer congestion, resulting in increased latency and even significant packet loss. Therefore, the forwarding strategies must be managed carefully to ensure smooth communication. Furthermore, the instability of inter‑satellite links and channel interference in space—such as orbital maneuvers, polar region traversal, solar conjunction, or background radiation—may cause unpredictable link disruptions. This demands that routing strategies possess dynamic adaptation and adjustment capabilities to maintain reliable network operation.







##### laser修正 model

卫星间通信链路的性能由传播损耗、噪声及信道容量共同决定. 对于低轨卫星间的视距通信, 考虑激光链路, 假设信号在自由空间中传播, 对于链路 $L_{ij}$, 其路径损耗（即信道衰落因子）$F_{ij}$ 表示如下:
$$
\begin{align*}
F_{i j}=\left\{\begin{array}{cc}
\left(\frac{4 \pi || L_{ij}|| f_c}{c}\right)^{2} &, || L_{ij}|| \leq L_{t h} \\
\infty &, \text { otherwise }
\end{array}\right.
\end{align*}
$$
其中, $f_c$ 表示载波频率, $c$ 为光速, $L_{th}$ 表示可接收信号的距离阈值, $||L_{ij}||=\infty$ 表示链路不可达.

设发射功率为 $P_t$, 发射节点与接收节点的线性天线增益为 $G_t$, $G_r$, 则节点 $i$ 发向节点 $j$ 的传输功率为:
$$
P_{ij} = \frac{P_t \cdot G_t \cdot G_r}{F_{ij}} = P_t G_t  G_r \cdot(\frac{\lambda_c}{4\pi  || L_{ij}||})^2
$$
星间链路的信噪比(Signal-to-Noise Ratio, SNR)可简化为一个随机过程，其最大值正比于传输功率
$$
\text{SNR}_{ij} = \frac{P_{ij}}{F_{ij} n_0 B_{ij}}
$$
其中, $B_{ij}$是传输带宽, $n_0$ 是噪声功率谱密度. 基于 SNR 的形式可以给出星间传输的码率 $R(i,j) $ 为:
$$
R(i,j) = B_{ij}\log(1 + \hat{\text{SNR}}_{ij})
$$
由于基于激光的星间链路(Inter-Satellite Links, ISL)易受指向误差、随机空间噪声、复杂电磁环境、卫星姿态变化以及电池太阳能损耗的影响。因此，链路质量波动较大是常见事件, 上述码率公式中使用 $\hat{\text{SNR}}_{ij}$ 表示时隙中对于链路信噪比的观测值, 利用衰减比率 $\zeta_\text{0}$ 和 $\zeta_\text{1}$ 分别表示处于正常状态和满足 $\theta_b \leq \theta_\text{beam}^*$ 和  $\cos \theta_s \geq \cos \theta_\text{solar}^*$ 的强干扰条件的信噪比衰减, 且 $\zeta_\text{1} < \zeta_\text{0} \le \frac{\text{SNR}_{th}}{\text{SNR}_{ij}} < 1$, 设随机变量 $\Zeta \sim U(\zeta, 1)$, 则观测信噪比满足:
$$
\hat{\text{SNR}}_{ij} = \text{SNR}_{ij} \cdot \hat{\Zeta}
$$
当 $\hat{\text{SNR}}_{ij} < \text{SNR}_{th}$ 表示链路断开.

根据以上论述, 对于大小为 $K$ bit 的数据包, 所需要的传输时间(秒)为:
$$
D_{tx}(i,j; K) = \frac{K}{R(i,j) }
$$




