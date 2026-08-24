**Abstract**
本文提出一种基于反事实推断的离线优化方法，用于大规模低地球轨道卫星星座的去中心化路由决策。该方法结合离线强化学习，对既有路由策略进行扰动优化，在数据支撑稀疏的静态路由场景中表现出良好的优化能力与泛化性能。研究需应对以下挑战：一是卫星路由系统中随时间变化的不确定性来源，如动态流量、通信链路状态及缓冲区拥塞；二是离线强化学习常见的外推误差与分布偏移问题。

我们首先基于任意初始路由策略与环境交互收集路由数据集，随后停止环境交互，仅通过数据转发与有限反馈进行扰动优化。方案分为两个阶段：首先，通过模仿学习与反事实推断，使智能体学习数据集中针对特定拓扑结构的动作分布，并利用排队论对通信链路状态转移建模，提供状态基线, 通过残差预测建模状态查询中的加性噪声以实现反事实推断。随后，提出一阶扰动反事实轨迹遗憾指标，通过干预历史轨迹的单步动作探索潜在更优路径，并以最小化轨迹遗憾为目标驱动策略优化，其动作值评估完全由反事实推断模型提供。

仿真结果表明，所提方法显著降低了离线评估方差，较基于值函数的离线强化学习方法更有效缓解了Q值高估问题，在时延降低与负载均衡方面均取得较好性能。此外，所构建的反事实评估机制能够较为准确刻画静态路由策略的因果结构。星座规模扩展泛化实验与流量参数扰动实验进一步表明，该方法在一定范围内能够保持优化性能的良好外推。



This paper proposes an offline optimization method based on counterfactual inference and offline reinforcement learning for decentralized routing decisions in large-scale low Earth orbit satellite constellations. It perturbs and optimizes existing routing strategies, showing strong optimization capability and generalization, particularly in static routing scenarios with sparse data support. The method addresses time-varying uncertainties in satellite routing—such as dynamic traffic, link states, and buffer congestion—as well as challenges in offline reinforcement learning like extrapolation error and distributional shift. We first collect a routing dataset by interacting with the environment using an arbitrary initial routing policy, after which environmental interaction is halted and perturbation-based optimization proceeds solely through data forwarding and limited feedback. The approach consists of two phases. First, via imitation learning and counterfactual inference, the agent learns the action distribution corresponding to specific topological structures from the dataset. Concurrently, queuing theory is employed to model the state transitions of communication links, thereby establishing a state baseline, while residual prediction is used to model additive noise in state queries, enabling counterfactual inference. Subsequently, a first-order perturbed counterfactual trajectory regret metric is introduced to explore potentially better paths by intervening in single-step actions of historical trajectories. Policy optimization is driven by minimizing this trajectory regret, with action-value estimation provided entirely by the counterfactual inference model. Simulations demonstrate that the approach significantly reduces offline evaluation variance, mitigates Q-value overestimation more effectively than value-based offline RL methods, and improves latency and load balancing. The counterfactual evaluation also accurately captures the causal structure of static routing policies, while scaling and traffic perturbation experiments confirm its stable extrapolation within a reasonable range.





**Index Terms—**Routing, satellite communication, Offline Reinforcement Learning(Offline-RL), Counterfactual Inference(CI), low earth orbit satellite constellations (LSatCs), Decentralized Routing, Imitation Learning(IL)