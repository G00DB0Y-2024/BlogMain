#### Introduction

Multi-Objective Reinforcement Learning (MORL) provides a mathematically principled framework for discovering a set of Pareto-optimal policies that address complex trade-offs in real-world scenarios, such as navigation and robot control. However, despite the successful developments in RL theory and a high demand for multi-objective control applications, MORL is still a relatively young and unexplored research topic compared to its single-objective counterpart. In particular, the theoretical foundations and algorithmic implementations of the native multi-objective Bellman operator based on non-dominated filtering have yet to be systematically established. Moreover, advanced and highly successful deep reinforcement learning paradigms, such as Actor-Critic, have not been fully integrated into a unified set-based multi-objective framework, severely limiting the applicability of MORL in complex multi-objective control tasks.

Single-policy and multi-policy MORL algorithms are employed to address multi-objective problems. Among these, multi-policy methods aim to solve the entire Pareto Front (PF) in a single run. A representative class of such methods is linear scalarization (LS), which transforms the multi-dimensional objective into a scalar by statically assigning preference weights, thereby enabling the use of standard single-objective reinforcement learning algorithms. While LS methods perform reasonably well in optimizing convex PFs and strictly aligning with specific user preferences, they inherently fail to discover non-convex PFs and suffer from significant computational inefficiency due to the the regional bias and forgetfulness characteristics that are encountered in the repeated weight sampling process. The other category of non-LS methods redefines the learning algorithm to obtain multiple policies, yet they have not formed a mature and systematic framework. These multi-policy approaches often face critical bottlenecks: difficulty in defining differentiable evaluation metrics (e.g., non-differentiable hypervolume), which impedes effective gradient-based optimization; severe training instability; and notable scalability challenges when applied to continuous or high-dimensional state-action spaces.

Pareto Q-learning (PQL) introduced by Van Moffaert and Nowé fundamentally advances Multi-Objective Reinforcement Learning (MORL) by explicitly maintaining non-dominated Q-vector sets to extract Pareto-optimal policies without relying on predefined scalarization weights, thereby successfully overcoming the limitations of non-convex PFs. However, its tabular nature restricts its scalability: For MORL problems with discrete action spaces and continuous state spaces, PQL requires maintaining infinitely many (state-action) cells, each of which stores a set of infinitely many Q-vectors. Even for problems with discrete state spaces, the total number of Q-vectors that need to be maintained grows exponentially with the dimension. Furthermore, there is no strict convergence proof for PQL. Although it demonstrates favorable convergence speed in experiments and outperforms baselines in terms of the hypervolume (HV) indicator, it remains difficult to guarantee its theoretical applicability to problems of arbitrary scale.

To overcome these fundamental limitations, this paper proposes Deep Pareto Q-Learning (DeepPQL), a generative neural approximation of the classic value-based Pareto Q-Learning (PQL) algorithm, designed to extend its capabilities to continuous and large-scale state spaces. Theoretically, We have rigorously demonstrated the compressibility and convergence of the $ND(\cdot)$ operator proposed in PQL. Methodologically, DeepPQL elegantly transforms the mathematically intractable challenges of discrete set distance metrics and element correspondence into a differentiable, continuous generative distribution matching process. We systematically instantiate and investigate DeepPQL across three classical generative models (adversarial, variational, and diffusion-based paradigms). Experimental results demonstrate that DeepPQL can integrate generative models to leverage the multiple advantages of set parameterization, not only efficiently covering complex Pareto manifolds but also inherently preserving profound extensibility for offline MORL scenarios and modern Actor-Critic paradigms, thereby paving the way for a scalable and unified multi-objective reinforcement learning framework.



#### Preliminaries

MORL is formulated upon the framework of Multi-Objective Markov Decision Processes (MOMDPs), with the primary goal of discovering a set of mutually non-dominated policies whose corresponding trajectory returns achieve Pareto optimality. Formally, an MOMDP is defined by a tuple $\langle \mathcal{S}, \mathcal{A}, \mathcal{P}, \mathbf{R}, \gamma, \mathcal{D} \rangle$, where $\mathcal{S} \subseteq \mathbb{R}^{|\mathcal{S}|}$ is the state space, $\mathcal{A} \subseteq \mathbb{R}^{|\mathcal{A}|}$ is the action space, $\mathcal{P}$ represents the Markovian transition model, with $\mathcal{P}(s'\vert{}s, a)$ denoting the transition density from state $s$ to $s'$ under action $a$, $\mathbf{R} = [R_1, \dots, R_d]^T$ are $d$-dimensional column vectors representing the feedback obtained from a single transfer on $d$-dim objectives, and discount factors $ \gamma \in [0, 1)$, respectively.

In MORL, 对于每个策略, 其期望回报对应着目标空间 $\mathbb{R}^d$ 中的一个点:
$$
\mathbf{J}(\pi)= [J_1(\pi), J_2(\pi),...,J_d(\pi)]^T = \mathbb{E}_\pi[\sum_ {t=0}^T \gamma^t  \boldsymbol{r}_t \mid S_0] \in \mathbb{R}^d
$$
由于向量不具有全序关系, 因此期望回报之间无法简单比较大小, 引入支配关系来衡量不同目标之间的权衡. 当 $J_i(\pi_A) \ge J_i(\pi_B), \forall i=1,2,...,d$, 且满足 $J_i(\pi_A) > J_i(\pi_B), \exist i=1,2,...,d$, 则表明目标回报 $\mathbf{J}(\pi_A)$ 支配 $\mathbf{J}(\pi_B)$, 记作 $\mathbf{J}(\pi_A) > \mathbf{J}(\pi_B)$. 非支配关系意味着无法在不损害其他指标的情况下优化某些指标, 定义策略空间 $\Pi$ 中存在一组策略 $\Pi_\text{PF} \sub \Pi$, 其回报 $\mathbf{J}(\pi_i) \in \text{PF}, \pi_i \in \Pi_\text{PF}$ 它们相互之间为非支配关系, 且这些向量又支配目标空间的其他向量, 这组目标称为MORL的**帕累托前沿**











