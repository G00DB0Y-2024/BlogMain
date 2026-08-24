Problem Formulation and Proposed Algorithm



4.1 Problem Formulation

基于所提出的低轨卫星星座路由系统, 从观测时间起点开始注入流量, 直到观测时间 $T$ 结束, 总共经历 $W$ 个时隙. 在此期间, 流量在多个卫星节点之间进行多跳传递. 设观测期间总共注入 $|\mathcal{P}|$ 个包, 且每个包具有路径 $\text{PA}_i \in \mathcal{P}$

优化的主要目标是最小化平均端到端时延, 同时需要满足各个节点的负载和能量要求.  这通过联合优化如下控制变量实现: $\pi=\{\pi_i(a \mid x)\}$ 表示卫星对于信息 $x$ 时做出转发动作 $a$ 的概率分布; 传输功率分配 $\mathbf{p}(t)=\{p_k^i\}$ 表示卫星向邻居发射时的功率.

联合优化问题可表述为: 在满足负载约束, 能量约束, 链路可达性约束情况下, 最小化观测时间内的平均端到端时延.
$$
\begin{aligned}
\min_{\pi, \mathbf{p}(t)} \quad 
& \frac{1}{|\mathcal{P}|} \sum_{i=1}^{|\mathcal{P}|} \mathcal{T}[\mathrm{PA}_i] \\
\text{s.t.} \quad 
&  \forall i \in \mathcal{S}, ~ \forall j \in \mathrm{Ne}(S_i), ~ \forall k \in \{1, \dots, W\},~ \forall l \in \{1, \dots, |\mathcal{P}|\},   \\
& \sum_{a \in \mathcal{A}} \pi_i(a \mid x) = 1, ~ \pi_i(a \mid x) > 0,~\forall x \in \mathcal{X},  \\
& R(i,j)>R_{th}, \quad 0 < \|L_{ij}\| < L_{th}, \\
& |\mathrm{PA}_l| \le \mathrm{TTL}, \\
& 0 < \lambda_k^i \le \lambda_{\max},  \\
& \rho_k^i = \frac{N_a^i(k)}{N_s^i(k)} < 1,  \\
& Q_{k}^i \le N,  \\
\end{aligned}
$$
其中, 约束(c)表示链路可达以及干扰在可接受范围; 约束(d)表示跳数不能超过存活时间; 约束(e, f, g)为排队论参数约束, 表示注入流量的最大速率, 排队系统平稳性约束以及队列长度约束; 约束(h, i)表示功率约束和最大消耗能量约束. 



4.2 reinforcement learning algorithm

4.2.1 DQN-based Multi-Agent Routing Method

由于4.1中提到的优化问题是一个分布式的复杂非线性规划, 且具有多个包含随机变量的约束条件, 在满足全部约束条件的情况下最小化目标函数变得相当有挑战性. 因此, 采用强化学习 (RL, Reinforcement Learning)来解决这个问题。

我们假设低轨卫星星座路由问题满足部分可观察马尔可夫决策过程POMDP, 每颗卫星形成多智能体环境, 环境的状态转移只和当前阶段的环境状态以及多智能体的联合动作有关, 和过去信息无关. 其通过最大化奖励积累进行策略优化, 表述为:
$$
\pi^*(A \mid S) = \arg \max_\pi~ \mathbb{E}[\sum_{t=0}^\infty \gamma^t r_t \mid S_0]
$$
该策略 $\pi$ 下的奖励积累期望表述为 $Q^\pi$ 值函数
$$
Q^\pi(s_t, a_t) = \mathbb{E}[\sum_{i=t}^\infty \gamma^{i-t} r_{i} \mid S_t=s_t, A_t=a_t] = \mathbb{E}[R_t + \gamma V^\pi(S_{t+1})\mid S_t=s_t, A_t=a_t]
$$
利用神经网络对未来奖励期望进行参数化, 并直接学习最优值, 这被称为深度Q方法(Deep Q-Network, DQN), 表述为:
$$
Q_\theta(s_t, a_t) \larr  r_t + \gamma \max_{a_{t+1}\in \mathcal{A}} Q_\theta(s_{t+1}, a_{t+1})
$$
具体而言, 学习和优化过程分为三个阶段: 

(1) 感知阶段: 所有智能体对自身以及邻居状态进行观测, 包括解析路由数据包协议头所得到的信息, 形成状态感知向量 $x_t^i$, 它被认为是当前阶段环境状态通过离散无记忆信道得到的代理状态 $x_t^i \sim \Phi(X_t \mid S_t)$, 所有的感知向量形成的集合被认为是环境状态的近似 $S_t = \{x_t^i\}$. 

(2) 决策阶段: 智能体根据得到的 $x_t^i$ 得到策略分布, 并采样得到动作 $A_t^i \sim \pi_i(A_t \mid x_t^i)$, 该动作可以根据被显性计算出的分布函数进行采样, 也可以根据价值函数, 按某种规则得到动作. 所有智能体的动作集合称为联合动作 $A_t = \{a_t^i \}$

(3) 转移阶段: 智能体联合动作 $A_t$ 作用于环境, 环境状态发生转移 $S_t \rarr S_{t+1}$, 并对每个智能体反馈奖励信号 $r_t^i = R(x_t^i, a_t^i, S_{t+1})$ 以评估对该步转移的优劣以及贡献值. 智能体根据奖励信号进行学习, 优化策略.

定义智能体的观测空间为 $x_t^i \in \mathcal{X}$, 其包含: 卫星 $i$ 的经纬度 $\psi_{S_i}, \phi_{S_i} \in [-180 \degree \sim +180 \degree]$; 邻居节点经纬度 $\psi_{S_j}, \phi_{S_j} \in [-180 \degree \sim +180 \degree], S_j \in \text{Ne}(S_i)$; 目的网关的经纬度 $\psi_{G}, \phi_{G} \in [-180 \degree \sim +180 \degree]$, 当前自身节点队列和负载情况 $Q_t^i, \rho_t^i$, 当前邻居节点队列和负载情况 $Q_t^j, \rho_t^j, S_j \in \text{Ne}(S_i)$, 邻居链路可达情况 $\delta_t^j \in \{0,1\}, S_j \in \text{Ne}(S_i)$, 当前包的积累时延和积累跳数 $\tau_t^i, h_t^i$.
$$
\mathcal{X} \in \mathbb{R}^{28} = \{\psi_{S_i}, \phi_{S_i} , \psi_{S_j}, \phi_{S_j}, \psi_{G}, \phi_{G}, Q_t^i, \rho_t^i, Q_t^j, \rho_t^j, \tau_t^i, h_t^i, \delta_t^j \mid \forall S_i \in S,  S_j \in \text{Ne}(S_i)\}
$$
定义智能体的动作为: $N,S,W,E$, 分别表示同轨道前后的邻居卫星以及相邻轨道东西方向的邻居卫星, 选择这些卫星作为下一跳.
$$
A_t^i \in \mathcal{A} = \{N,S,W,E\} \in \{0,1\}^4
$$
定义奖励函数, 根据动作以及状态转移进行反馈, 奖励空间为 $r_t^i \in \mathcal{R}$, 设卫星节点 $S_i$ 在时隙内转发数据包集合为 $\mathcal{P}_i=\{a_1, a_2, ..., a_{|\mathcal{P}_i|}\}$, 则奖励定义如下:

$$
r_t^i = \left \{
\begin{aligned}
&r_\text{done} - \delta_1 D_\text{prop}(i,j) - \delta_2 D_\text{tx}(i,j)  \\
&r_\text{next} - \delta_1 D_\text{prop}(i,j) - \delta_2 D_\text{tx}(i,j) - \delta_3 D_\text{queue}(j) - \delta_4 \max\{0, \rho^j-1 \}\\
&r_\text{lost} \\
\end{aligned}
\right.
$$
其中, 根据到达, 丢包以及正常下一跳将奖励分为三个常量基量. $\delta_k$ 为加权系数.

DQN智能体将逼近最优动作值, 在训练期间, 智能体搜集动作-反馈信息并放入缓冲 $\mathcal{D}_i=\{(x_t^i, a_t^i, r_t^i, x_{t+1}^i)\}$, 随后计算Q函数损失:
$$
\mathcal{L}(\theta) = \mathbb{E}_{(x_t, r_t, x_{t+1}) \sim \mathcal{D}}[Q_\theta(x_t, a_t) - (r_t + \gamma \max_{a \in \mathcal{A}} Q_\theta(x_{t+1}, a))^2]
$$
参数更新过程为:
$$
\theta_{t+1}^i \leftarrow \theta_t^i - \eta \nabla_\theta \mathcal{L}(\theta)
$$


4.2.2 Ising-Heuristic Collaboration Method

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

考虑到 $J_{ij} > 0$ 时, 物质表现出铁磁性, 构型服从磁场的激励; 当 $J_{ij} <0$ 时, 物质表现出相反的性质; $J_{ij} = 0$ 时, 物质不响应磁场以及邻居的作用. 因此, 本文提出基于意图指标(Intent Index)的可学习 Ising 场模型, 对系统的相变行为进行目标导向控制以实现可控的信息传递, 每个智能体将状态观测 $x_t^i$ 映射到一个具有三个状态的意图指标 $u_t^i = f_\omega(x_t^i) \in \{-1, 0 , +1 \}$, 由此计算耦合张量分量:
$$
J_{ij} = J_0 \cdot u_i u_j
$$
其中, $J_0$ 是初始设定的耦合基数, 智能体通过控制Intent Index来决定接受或拒绝邻居的信息传递.

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
a_t^i \sim \pi^i_\omega(A_t^i \mid x_t^i, u, \sigma) = \frac{ e^{ \frac{1}{T_t}[Q(x_t^i, A_t^i) -  \Theta J_{ij;_\omega}\sigma_i\sigma_j] } }{\sum_{ \in \mathcal{A}}  e^{ \frac{1}{T_t}[Q(x_t^i, a) - \Theta J_{ik;_\omega}\sigma_i\sigma_k] } }.
$$
 这种影响在DQN决策阶段中以常量的形式存在, 交替训练方法将在4.2.3中详细阐述. 



4.2.3 Joint Training Framework

在4.2.1和4.2.2中分别提出了用于路径选择的DQN智能体以及用于传递全局信息的可学习Ising场模型(LIF), 但是它们通过输出策略相互依赖. 本章将明确阐述Ising场的实现架构以及训练方法.

首先, 对于可学习的映射 $ f_\omega : \mathcal{X} \rightarrow  \{-1, 0 , +1 \}$, 通过一个Q函数指定 $Q_\omega: \mathcal{X} \rightarrow \mathbb{R}^3$, 形成LIF智能体, 它将和4.2.1中用于路由动作优化的DQN智能体形成联合动作, 然而Intent Index的改变总会影响环境, 因此不需要LIF智能体总是伴随DQN智能体进行动作输出, 而是在多个DQN智能体的训练周期中保持固定输出.

在训练层级上, 需要明确LIF对DQN智能体而言是上层, 属于环境的一部分, 而对于环境本身而言, LIF又是一种智能体, 它和DQN智能体共享奖励函数, 却进行异步更新.

因此, 将训练过程分为两个阶段:

(1) DQN训练阶段: 在该阶段, LIF的输出仅仅是用于修改DQN最终输出的策略分布, 使得原有的按照ε-greedy的方法变为了根据附加局部能量进行采样, 这同样提高了探索范围, 目的是让DQN智能体探索尽可能多的状态-动作空间. 该阶段, 首先由映射函数 $f_\omega$ 生成初始的意图向量并计算耦合张量 $J_{ij}$, 随后周期性地对Ising场进行演化并达到稳定, DQN智能体便在这个环境中进行学习.

这包含一个退火过程, 温度参数 $T, \beta$ 用于平衡Q值和Ising局部能量对策略的影响, 初期将采用较大的温度进行探索, 后期逐渐减小. 训练过程中, 将同时搜集数据 $\mathcal{D}_u=\{(x_t^i, u_t^i, r_t^i, x_{t+1}^i)\}$



(2) LIF训练过程: 在该阶段利用已经搜集的数据训练LIF智能体 $Q_\omega$. 计算损失为:
$$
J(\omega) = \mathbb{E}_{(x_t, u_t, r_t, x_{t+1}) \sim \mathcal{D}}[Q_\omega(x_t, t_t) - (r_t + \gamma \max_{u \in \mathcal{U}} Q_\omega(x_{t+1}, u))^2]
$$
参数更新过程为:
$$
\omega_{t+1}^i \leftarrow \omega_t^i - \eta \nabla_\omega J(\omega)
$$
上述过程交替进行, 并最终达到收敛.

