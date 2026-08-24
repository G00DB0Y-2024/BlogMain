本章阐述利用Ising启发方法促进智能体的全局涌现协作. 尽管4.2.1节中已经将负载和时延作为显式约束建模在奖励函数中, 然而, 分布式的多智能体方法, 每个智能体的策略都将会改变环境状态本身, 因此在每个智能体的视角下，环境是非稳态的: 即对于一个智能体而言，即使在相同的状态下采取相同的动作，得到的状态转移和奖励信号的分布可能在不断改变. 这将导致难以收敛, 或是陷入局部极值, 难以达到最优解. 需要一种机制通过完全去中心化的方式在全局传递信息, 通过可控扰动的方式来调整其他智能体的行为, 进而促使全体智能体的合作协同.

二维Ising模型是一个简化的被用于描述磁性相变的统计热力学模型, 也是一种特殊的马尔科夫随机场, 其构建在一个任意的拓扑上(大多数是晶格), 每个格点上的随机变量 $\sigma_i$ 仅和邻居 $\sigma_j \in \text{Ne}(\sigma_i)$ 进行交互, 且每个随机变量的取值只能为 $\sigma_i \in \{-1, +1\}$, 称为自旋态. Ising模型的自旋态在外加磁场 $h(t)$ 的激励下发生翻转, 并最终达到热平衡.

对于给定构型 $\sigma = (\sigma_1, \sigma_2, ...\sigma_n)$, 其哈密顿量 $H(\sigma)$ 为:
$$
H(\sigma) = -(\sum_{i,j \in \text{Ne}(i)} J_{ij}\sigma_i\sigma_j + \sum_{i} h_i \sigma_i )
$$
其中, $J=[J_{ij}]$ 为耦合张量, 表示格点的交互强度, $h$ 为外加磁场强度. 设构型空间 $\sigma \in \mathcal{C}$ , 对于给定哈密顿量 $H(\sigma)$ 的出现的概率由玻尔兹曼分布描述:
$$
P(\sigma) = \frac{1}{\sum_{\sigma_i \in \mathcal{C}} e^{-\beta H(\sigma_i)}} \cdot e^{-\beta H(\sigma)}
$$
因此, 出现概率最高的构型等价于最小化哈密顿量, 即 $\sigma^* = \arg \min_\sigma H(\sigma)$. 当温度因子 $\beta$ 处于特定范围时, 晶体发生相变, 即全局会涌现出具有某种规则的排布. 由于这种相变的传导是去中心化且迅速的, 我们将利用这种机制以哈密顿量的形式在智能体之间传递信息.

本文提出一种基于意图向量(Intent Vector)的可学习 Ising 场模型, 对系统的相变行为进行主动引导和目标导向控制, 以实现可控的信息传递, 每个智能体将状态观测 $x_t^i$ 映射到一个高维意图向量 $u_t^i = f_\omega(x_t^i)$, 映射网络为 $f_\omega:\mathbb{R}^\mathcal{X} \rightarrow \mathbb{R}^U$, 由此计算耦合张量分量:
$$
J_{ij} =  \cos <u_i, u_j> = \frac{u_i^Tu_j}{||u_i||\cdot ||u_j||}
$$
在LEO卫星星座网格拓扑  $\mathcal{G}<\mathcal{V},\mathcal{E}(t)> = \mathcal{G}<(S,G),L_t>$ 中, 每个节点 $v \in \mathcal{V}$ 为一个智能体, 且维护一个自旋态, 初始取值均为 $\sigma_i = -1$. 在网关节点处通过统计流量注入率, 得到单点冲激磁场分布:
$$
h(v)= \left \{
\begin{aligned}
&\frac{\lambda_t^v}{\lambda_\max}h_\max  &&, v \in G; \lambda_t^v \ge\lambda_{\text{th}} \\
&0  &&, \text{other}\\
\end{aligned}
\right.
$$
在一个时隙中, 对邻居进行一次带衰减的高斯扩散过程, 描述如下:
$$
h_{t+1}(v_i) = (1 - \alpha)\cdot h_t(v_i) + \frac{1}{4} \sum_{v_j \in \text{Ne}(v_i)} \alpha \cdot h_t(v_j)
$$
随后, 根据Metropolis–Hastings法则对Ising模型进行演算, 计算局部能量场
$$
H^\text{eff}_i(u_i, \sigma_i) = \sum_{\sigma_j \in \text{Ne}(\sigma_i)} J_{ij}\sigma_j + h_i 
$$
根据如下概率将自旋态进行翻转
$$
P(\uarr\darr \sigma_{i}) = \min\left(1, e^{-2\beta   \sigma_i  H^\text{eff}_i(u_i, \sigma_i) }\right)
$$
通过计算局部能量并对4.2.1中提到的DQN智能体的Q函数输出进行修正, 得到新的玻尔兹曼策略分布, 以此采样得到闭环控制动作. 若在Q函数的四个维度中, $<a, j>$ 表示动作以及对应的被选择邻居的下标, 则修正后的概率分布为
$$
a_t^i \sim \pi^i_\omega(A_t^i \mid x_t^i, u, \sigma) = \frac{ e^{ \frac{1}{T}[Q(x_t^i, A_t^i) - \beta (J_{ij;_\omega}\sigma_i\sigma_j + h_i \sigma_i)] } }{\sum_{<a,k> \in \mathcal{A}}  e^{ \frac{1}{T}[Q(x_t^i, a) - \beta (J_{ik;_\omega}\sigma_i\sigma_k + h_i \sigma_i)] } }
$$
 这种影响在DQN决策阶段中, 以常量的形式存在, 交替训练将在4.2.3中详细阐述. 



\subsection{Energy Consumption Model}
During routing operations, a satellite consumes energy primarily through forwarding data packets to adjacent satellites via laser inter-satellite links or downlinking them to target ground stations. Let $n_i(\tau_i)$ denote the number of packets, each of length $K$, transmitted by satellite $S_i$ during time slot $\tau_i$, with transmit power $P_i(\tau_i)$. The total energy consumption of the constellation up to time slot $W$ is then given by:

$$
E(W) = \sum_{k=1}^W \sum_{i \in S} n_i(\tau_k) \cdot K \cdot P_i(\tau_k) \cdot \tau
$$

Within each orbital period $\tau_{orbit}$, the satellite harvests energy via its solar panels. Let $E_s$ denote the maximum amount of energy that can be replenished per orbital period (determined by solar illumination duration, panel area, and conversion efficiency). Consequently, the cumulative energy consumption must not exceed the available renewable energy budget:

$$
E(W) \le \lfloor \frac{W \cdot \tau}{\tau_{\text{orbit}}} \rfloor \cdot E_s \cdot N_S
$$




