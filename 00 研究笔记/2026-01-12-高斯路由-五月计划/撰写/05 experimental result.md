本节通过综合仿真评估所提出的 IHCRL 路由优化方法, 仿真实验的各项参数如下表所示:

| symbol                                        | description                     | setting value      |
| --------------------------------------------- | ------------------------------- | ------------------ |
| $h_\text{orbit}$                              | orbit altitude                  | 570 km             |
| $\tau_\text{orbit}$                           | orbit period                    | 96 minutes         |
| $\alpha$                                      | orbit inclination               | 78°                |
| $N$                                           | number of orbital planes        | 32                 |
| $M$                                           | number of satellites per orbit  | 48                 |
| $N_\text{gate}$                               | number of gateways              | 12                 |
| $\theta_\text{laser}^*$                       | laser link angle threshold      | 10°                |
| $\theta_\text{solar}^*$                       | sun exclusion angle threshold   | 45°                |
| $K$                                           | size of each packet             | 1 MB               |
| $B$                                           | transmission bandwidth          | 100 MHz            |
| $P_t$                                         | transmit power                  | 5 W                |
| $G_t, G_r$                                    | transmit/receive antenna gains  | 120 dBi            |
| $f_c$                                         | carrier frequency               | 3 GHz              |
| $n_0$                                         | noise spectral density          | -180 dBmW          |
| $\lambda_\text{max}$                          | maximum arrival rate            | 100 Packets/s      |
| $Q_\text{max}$                                | satellite cache length          | 50 Packets         |
| $\text{TTL}$                                  | time to live                    | 128 hops           |
| $W$                                           | number of time slots            | 1000               |
| $\tau$                                        | slot length                     | 10 s               |
| $h_\text{max}$                                | maximum magnetic field strength | 100                |
| $\xi$                                         | diffusion rate                  | 0.6                |
| $\beta$                                       | temperature factor              | 0.85               |
| $\gamma$                                      | future discount factor          | 0.98               |
| $\eta_\theta$                                 | learning rate of $\theta$       | 0.001              |
| $\eta_\omega$                                 | learning rate of $\omega$       | 0.0005             |
| $r_\text{done}, r_\text{next}, r_\text{lost}$ | reward baseline                 | 10.0, -0.5, -5.0   |
| $\delta_1, \delta_2, \delta_3, \delta_4 $     | penalty coefficient             | 0.1, 0.1, 0.5, 1.0 |

实验所需的各种参数及其最佳实践值列于表 1 中。我们在配备 13 代英特尔酷睿 i9-14900K CPU 和英伟达 GeForce RTX 5080 GPU 的 Ubuntu 系统上使用 PyTorch 框架进行训练。为了验证所提出的多智能体强化学习方法的有效性, 将其同其它几种多智能体强化学习算法进行比较，包括VDN,  MAPPO, MADDPG; 另外, 使用Dijkstra作为作为路由性能的基线数值提供;

To validate the effectiveness of the proposed IHCRL approach, we compare it against several representative  multi-agent reinforcement learning algorithms, including QMIX, MAPPO and  MADDPG. Additionally, Dijkstra algorithm is employed as a baseline to provide a reference for routing performance.



5.1 收敛性实验

该部分实验用于评估所提出的IHCRL的强化学习性能以及收敛性. 通过和VDN, MAPPO 以及 MADDPG 多智能体强化学习方法在同一个环境中对比奖励收敛速度和最终收敛值. 沿用前述低轨卫星星座路由环境，以一次完整的观测时间作为一个评估周期；每个周期内执行若干次训练，并在周期结束时进行一次奖励评估，计算 episode 平均回报作为评估结果, 每项评估实验重复10次.

|                | VDN  | MAPPO | MADDPG | IHCRL |
| -------------- | ---- | ----- | ------ | ----- |
| Final Return   |      |       |        |       |
| Average Return |      |       |        |       |

实验表明, 所提出的IHCRL能够达到更高的回报值, 在学习到的策略在长期运行中能获得更优的累积奖励, 表明其在最终策略质量与整体训练表现上均展现出竞争力, 在处理LEO卫星星座路由这类多智能体任务时能更有效地优化智能体行为.

Experimental results demonstrate that the proposed IHCRL achieves higher returns, and the learned policy yields superior cumulative rewards over long-term operation. This indicates that IHCRL exhibits competitive performance in both final policy quality and overall training efficacy, effectively optimizing agent behavior in multi-agent tasks such as routing in LEO satellite constellations.



5.2 路由性能实验

该部分实验评估所提出IHCRL强化学习方法的路由优化性能. 通过和Dijkstra, VDN, MAPPO 以及 MADDPG 方法在同一个环境中对比, 以一次完整的观测时间作为一个周期；每个周期内执行若干次训练，执行10个周期并在最后进行路由评估. 分别搜集平均端到端时延, 平均丢包率, 平均跳数, 负载分布, 链路利用率四项指标作为对比项. 每项评估实验重复10次.

|                    | Dijkstra | VDN  | MAPPO | MADDPG | IHCRL |
| ------------------ | -------- | ---- | ----- | ------ | ----- |
| Average E2E Delay  |          |      |       |        |       |
| Average Lost Rate  |          |      |       |        |       |
| Average Hop        |          |      |       |        |       |
| Average Link Usage |          |      |       |        |       |
| Load Distribution  |          |      |       |        |       |

路由性能实验结果表明，IHCRL在平均端到端延迟和平均丢包率方面均表现出显著优势。IHCRL的平均跳数略高于基线, 表明其通过一定的绕路和备选链路切换行为进行负载均衡，且显著降低了平均负载, 提高了链路利用率, 表明其能更充分地利用网络带宽资源, 验证了其在复杂动态网络环境下的有效性。

The experimental results on routing performance demonstrate that the proposed IHCRL achieves significant advantages in terms of average end-to-end (E2E) delay and average packet loss rate. The slightly higher average hop count compared to the baseline indicates deliberate detouring and alternative link switching for load balancing, which substantially reduces the average load and enhances link usage. This confirms IHCRL’s ability to exploit the communication resources of LEO constellation efficiently, thereby validating its effectiveness in complex and dynamic network environments.



5.3 灵敏性分析

该部分实验对所提出IHCRL强化学习方法进行消融分析, 以及灵敏性分析, 分为如下部分:

- The Policy Interference Factor $\Theta$ is the exclusive determinant of LIF coupling strength to the routing policy. With $\Theta=0$ representing inactivation, the magnitude of this factor directly correlates with the intensity of policy interference. 

  This part of experiment perturbs the parameter $\Theta$ from $0$ to twice its nominal value $\Theta^*$ using a fixed step, while measuring the variations of average return. 

|                | $\Theta=0$ | $\Theta=5$ | $\Theta=10$ | $\Theta=15$ | $\Theta=20$ |
| -------------- | ---------- | ---------- | ----------- | ----------- | ----------- |
| Final Return   | -909.158   | -661.044   | -392.384    | -457.090    | -820.668    |
| Average Return | -1141.026  | -1156.602  | -698.321    | -969.926    | -1238.899   |
|                |            |            |             |             |             |



Policy Interference Factor Sensitivity Analysis 实验表明, 低于Setting Value的$\Theta$ 会降低LIF的作用, 其特殊值 $\Theta=0$ 完全消除了LIF, 等同于MADQN. 对于Setting Value附近的扰动, 其对奖励的收敛值影响并不大, 过大的 $\Theta$ 会使得LIF产生过量作用, 使得其和DQN Agent的耦合产生噪声, 并难以达到最优值收敛值.



- The maximum arrival rate $\lambda_\text{max}$ 表示全球注入流量的强度. 该部分实验将从实验标准值 $\lambda_\max^*$ 按照固定步长扰动至五倍大小 $5 \lambda_\max^*$, The average E2E delay, average packet loss rate, average hop count, average load, and average link usage are collected 用于分析通信系统对逐渐增加流量的承载能力..

  The maximum arrival rate $\lambda_\text{max}$ represents the intensity of the global injected traffic. In this experiment, $\lambda_\text{max}$ is varied from the baseline value $\lambda_\max^*$ to five times its magnitude ($5 \lambda_\max^*$) using a fixed step size. The average E2E delay, average packet loss rate, average hop count, average load, and average link usage are collected to analyze the communication system's capacity to sustain gradually increasing traffic loads.



|                        | $\lambda_\text{max}^*=100$ | $2\lambda_\text{max}^*$ | $3\lambda_\text{max}^*$ | $4\lambda_\text{max}^*$ | $5\lambda_\text{max}^*$ |
| ---------------------- | -------------------------- | ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| Average E2E Delay (ms) | 98.41                      | 101.25                  | 117.16                  | 125.18                  | 129.76                  |
| Average Lost Rate (%)  | 3.25                       | 3.07                    | 4.12                    | 4.72                    | 6.37                    |
| Average Hop Count      | 13.28                      | 14.16                   | 13.96                   | 16.73                   | 15.39                   |
| Average Load (%)       | 33.37                      | 35.78                   | 48.99                   | 69.49                   | 75.49                   |
| Average Link Usage (%) | 86.94                      | 87.95                   | 84.77                   | 86.69                   | 87.79                   |

该部分实验证明了所提出的IHCRL对于动态变化流量的应对能力, 随着流量注入速率上升至3倍于Setting Value, 边缘节点的漏斗效应使得平均负载开始逐步提升, 但平均E2E延迟和丢包率都没有显著上升. 直到5倍于Setting Value, 系统流量压力上升,   IHCRL求解的路由策略对时延和丢包率的上升有显著的抑制, 链路资源在不同负载下均处于高效利用状态，未出现明显链路瓶颈。

This set of experiments validates the proposed IHCRL's capability to handle dynamically changing traffic. As the traffic injection rate increases to 3 times the Setting Value, the funneling effect of edge nodes causes the average load to gradually rise, yet the average E2E delay and packet loss rate do not increase significantly. When the traffic injection rate reaches 5 times the Setting Value, the system faces escalated traffic pressure; however, the routing strategy optimized by IHCRL demonstrates a significant suppression effect on the rise of delay and packet loss rate. Additionally, link resources remain highly utilized across varying load conditions without evident link bottlenecks.
