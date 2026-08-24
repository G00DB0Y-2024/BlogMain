###### A. Offline reinforcement learning setup

Due to the optimization problem mentioned in Section III-A being a distributed, complex random programming problem with multiple constraints, minimizing the objective function is highly challenging. Therefore, Reinforcement Learning (RL) is adopted to address this problem.

We assume that the LEO satellite constellation routing problem satisfies the Markov Decision Process (MDP), where each satellite constitutes an agent in a multi-agent environment. The environmental state transition depends only on the current environmental state and the joint actions of all agents, and is independent of historical information. The policy is optimized by maximizing the accumulated reward, formulated as:
$$
\pi^* = \arg \max_\pi~ \mathbb{E}_{\tau \sim \mathbb{P}(\mathcal{P}_\pi)}[\sum_{t=0}^\infty \gamma^t r_t]
$$
where $\tau$ denotes the trajectory and $\mathbb{P}(\mathcal{P}_\pi)$ is the trajectory distribution induced by $\pi$.

According to the Lagrangian form of the optimization problem, the state, action, and reward Spaces are defined as follows:

- State Space: The state space for agent $i$ is defined as $s_t^i \in \mathcal{S}$, which includes: the longitude and latitude of satellite $i$, $\psi_{S_i}, \phi_{S_i} \in [-180^\circ, +180^\circ]$; the longitude and latitude of neighboring satellites $\psi_{S_j}, \phi_{S_j} \in [-180^\circ, +180^\circ], S_j \in \text{Ne}(S_i)$; the longitude and latitude of the destination gateway $\psi_{G}, \phi_{G} \in [-180^\circ, +180^\circ]$; the current queue length and load status of the local node $Q_t^i, \rho_t^i$; the queue length and load status of neighboring nodes $Q_t^j, \rho_t^j; S_j \in \text{Ne}(S_i)$; the link availability to neighbors $\delta_t^j \in \{0,1\}; S_j \in \text{Ne}(S_i)$; and the accumulated delay and hop count of the current packet $\tau_t^i, h_t^i$.
  $$
  \mathcal{S} \in \mathbb{R}^{28} = \{\psi_t, \phi_t , Q_t, \rho_t, \tau_t^i, h_t^i, \delta_t^j \}
  $$

- Action Space: The actions of the agent are defined as: $a_t^i \in \mathcal{A} = \{N,S,W,E\}$, which respectively represent the neighboring satellites on the same orbit before and after, and the neighboring satellites in the east-west direction on adjacent orbits. These satellites will be selected as the next hop.  Variable $\pi(a_t^i \mid s_t^i)$ represents the distribution of actions in a given state.

- Reward Space: According to the temporal decomposition of Lagrangian form, rewards are divided into terminal rewards and step rewards as follows:
  $$
  r_{t}^i = \left \{
  \begin{aligned}
  &r_\text{done} - D_\mathcal{E}(i_t, i_{t+1}, t;K) \\
  &r_\text{next} - D_\mathcal{V}(i_t, i_{t+1}, t;K) - \delta_1(Q_t^k - Q_\text{max})- \delta_2(\rho_t^k - 1) - \delta_3 \ell_{t+1}^k   \\
  &r_\text{lost} \\
  \end{aligned}
  \right.
  $$
  where $r_\text{next}=R_1 >0$ denotes the step reward with weighted penalty term; $r_\text{done}=R_2, r_\text{lost}=R_3 - \delta_4(||\mathbf{P}_k||_L-\text{TTL})  $ denote the terminal rewards, with $R_2>R_1>0, R_3 <0$.

使用参数化策略 $\pi_\theta$ 进行学习, 则在给定数据集 $\mathcal{D}$ 上的策略梯度估计为:
$$
\nabla_\theta \mathcal{L}(\theta) = \mathbb{E}_{\mathbf{P} \sim \mathbb{P}(\mathcal{P}_\pi)}\left[\left(\prod_{t=0}^{|\mathcal{D}|-1} \frac{\pi_{\theta}\left(a_t^i \mid s_t^i\right)}{\pi_{\beta}\left(a_t^i \mid s_t^i\right)}\right) \nabla_\theta \Psi(s_t^i, a_t^i)  \right]
$$
其中, $\nabla_\theta \Psi(s_t^i, a_t^i)$ 表示策略梯度部分, 记 $\hat{G}_t = \sum_{t'=t}^{|\mathcal{D}|-1}\gamma^{t'-t}r_{t+1}$ 为 $t$ 时刻回报的蒙特卡洛采样近似
$$
\nabla_\theta \Psi(s_t^i, a_t^i) \approx \sum_{t=0}^{|\mathcal{D}|-1} \gamma^{t} \nabla_{\theta} \log \pi_{\theta}\left(a_t^i \mid s_t^i\right) \cdot \hat{G}_t
$$
在实际估计中, 期望通过有限样本近似为加权梯度, $w_i$表示轨迹 $\mathbf{P}_i$ 的重要性加权系数
$$
\nabla_\theta \mathcal{L}(\theta)  \approx \sum_{i=1}^{|\mathcal{P}|}w_i\sum_{t=0}^{|\mathcal{D}|-1} \gamma^{t} \nabla_{\theta} \log \pi_{\theta}\left(a_t^i \mid s_t^i\right) \sum_{t'=t}^{|\mathcal{D}|-1}\gamma^{t'-t}r_{t+1}
$$




###### B. Counterfactual Policy Boosting

Counterfactual Inference is the highest-level task of Causal Inference. In the proposed offline reinforcement learning setting, trajectory information $\mathbf{P}_i \in \mathcal{P}$ presented in the dataset is referred as \textbf{support-set information}, whereas any trajectory information not contained in the dataset, denoted as $\mathbf{P}^\text{CF} \notin \mathcal{P}$, is termed \textbf{counterfactual information}. Any approach that evaluates counterfactual information without accounting for causal relationships inevitably introduces bias, as discussed in Scetion IV-A.

考虑轨迹 $\mathbf{P}_i=\{v_{t_1}, v_{t_2},...,v_{t_n} \} \in \mathcal{P}(\pi_\beta)$ 是由SCM $\mathfrak{C}$ 生成的一条轨迹 , 包含已经被确定的噪声 $\mathcal{U}_\beta$ 以及内生变量 $\mathcal{X}_\beta$. 设联合分布 $p(\mathcal{X}, \mathcal{U})$ 对应的SCM为 $<\mathfrak{C},\mathcal{G}>=  (\mathcal{X}, \mathcal{U}, \mathcal{F})$, 则对于策略 $\pi$ 的评估可以写作
$$
J(\theta)= \mathbb{E}_{\mathbf{P}}[\sum_{t=0}^\infty \gamma^t r(S_t^i,A_t^i) \mid \text{do}(\pi=\pi_\theta), \mathcal{U}_\beta]
$$

其中, 随机变量 $A_t^i,S_t^i,G_t$ 服从后验分布 $p(\mathcal{X}_\beta, \mathcal{U}_\beta)=\mathbb{P}(\mathcal{P}(\pi_\beta))$, 由于 $\mathcal{X}_\beta$ 可在 $\mathfrak{C}$ 支配下通过 $\mathcal{U}_\beta$ 推断得到, 因此不显性表示在条件中.

最优策略 $\pi^*$ 在每一步都应当满足回报最大化
$$
\begin{aligned}
\pi^* &\Leftrightarrow  \max_{a \in \mathcal{A}} \mathbb{E}[\sum_{t'=t}^\infty \gamma^{t'-t} r(S_t,A_t) \mid \text{do}(A_t=a), S_t=s_t^i, \mathcal{U}_\beta] \\

 &\Leftrightarrow  \max_{a \in \mathcal{A}} \mathbb{E}[\sum_{t'=t}^\infty \gamma^{t'-t} r(S_t,A_t) \mid \text{do}(A_t=a), S_t=s_t^i, \mathcal{U}_\beta]- \mathbb{E}[\sum_{t'=t}^\infty \gamma^{t'-t} r_{t'+1}]\\
 
&= \mathbb{E}[G_t^* \mid \mathcal{U}_\beta] - \mathbb{E}[G_t \mid A_t=a_t^i, S_t=s_t^i]
\end{aligned}
$$
where $ \mathbb{E}[G_t^* \mid \mathcal{U}_\beta]$ denotes the optimal intervention return at time $t$ under the SCM $\mathfrak{C}$ and $\mathbb{E}[G_t \mid A_t=a_t^i, S_t=s_t^i]$ corresponds to the factual return observed under the behavior policy $\pi_\beta$. Their difference constitutes supervisory signal that eliminated the additive noise at the trajectory level because both terms are conditioned on the same realization of the exogenous variables $\mathcal{U}_\beta$. This cancellation is valid under the mild assumption that the local intervention induces only a bounded distributional shift, such that the conditional expectations of the shared noise remain equal.

This construction yields a principled optimization paradigm: rather than directly parameterizing and optimizing a policy $\pi_\theta$, at each time step, the action intervention that minimizes the difference between the optimal counterfactual return and the factual return. View reinforcement learning as a supervised learning with unbiased estimators as labels. 

定义One-step Counterfactual Perturbed Trajectory Regret (CPTR1):
$$
R_\theta(t) = \max_{a \in \mathcal{A}}\mathbb{E}[G_t \mid \text{do}(A_t=a), \mathcal{U}_\beta] - \mathbb{E}_{\pi_\theta}[G_t \mid A_t=a_t^i, S_t=s_t^i]
$$
where the optimal intervention return from model $\mathfrak{C}$ can be regarded as a constant supervisory signal given $S_t=s_t^i, \mathcal{U}_\beta$. According to the optimal principle of the Bellman equation, policy learning can be recast as minimizing the accumulation of CPTR1:
$$
\nabla_\theta \tilde{J}(\theta) = \frac{1}{|\mathcal{P}|} \sum_{i=1}^{|\mathcal{P}|}\sum_{t=0}^{|\mathcal{D}|-1} \gamma^{t} \nabla_{\theta} \log \pi_{\theta}(a_t^i \mid s_t^i)R_\theta(t)
$$
每步执行参数梯度下降的更新:
$$
\theta_{t+1} \leftarrow \theta_t - \eta_\theta \nabla_\theta \tilde{J}(\theta)
$$
上述提到的基于CPTR1的轨迹优化将使用以下的反事实推断过程进行, 首先, 针对噪声 $U_\lambda^i(t)$, 使用模型 $\hat{\lambda}_t^i= U_\lambda(x,y ; \psi_t)$ 表示在 $t$ 时刻, 位置 $(x,y)$ 处的注入流量先验分布, 并根据数据集 $\mathcal{D}$ 估计参数的后验; 因此, 可以计算在 $t$ 时刻, 位置 $(x,y)$ 处的负载信息为:
$$
\hat{\rho}_t^i = \rho(x,y,t) = f_\rho(U_\lambda(x,y ; \psi_t)) + \phi_a^i \hat{U}_a^i(t)
$$
其中, 到达数量的噪声 $\hat{U}_\rho^i(t)=\phi_a^i \hat{U}_a^i(t)$ 通过邻居信息进行噪声估计, 即

$$
\hat{U}_a^i(t) = \mathbb{E}[N_a^i(t) - \hat{N}_\text{in}^i(t)] = \mathbb{E}[N_a^i(t)]-\mathbb{E}[U_\lambda(x,y ; \psi_t)] \cdot \tau
$$
因此, 可以计算时延和丢包阈值的反事实推断
$$
\begin{aligned}
\hat{\tau}_{t+1}^i &= f_\tau(Q_{t+1}^i) +  \phi_\rho^i \phi_a^i \hat{U}_a^i(t) +  \phi_r^i \hat{U}_r^i(t) \\
\hat{\ell}_{t+1}^i &= f_\ell(U_\lambda(x,y ; \psi_t), Q_t^i,  \hat{U}_a^i(t)) \\
\end{aligned}
$$
其中, 队列转移使用Lindey Process进行演化 $f_q: Q_{t+1}^i = \min\left\{ \left[ Q_t^i - N_s^i(t) \right]^+ + N_a^i(t),\; Q_{\text{max}} \right\}$, 队列噪声 $ U_q^i(t)$ 通过观测得到, 服务数量 $N_s^i(t)=\mu_t^i \tau$ 对于给定数据集在一个时隙内为定值.

剩余时间的噪声分布 $\hat{U}_r^i(t)$ 使用混合高斯模型作为经验分布:
$$
\hat{U}_r^i(t) : z_t^i \sim \sum_{k=1}^M w_{i,k} \mathcal{N}(\mu_{i,k}, \sigma_{i,k}^2)
$$
其中, 设观测残差为 $\hat{u}_t^i =\tau_{t+1}^i-Q_{t+1}^iD_\text{tx} $, 参数似然估计为 $(w^*, \mu^*, \sigma^*)_t \mid \{\hat{u}_t^i\} = \arg \min_{w,\mu,\sigma}||  z_t^i -  \hat{u}_t^i ||_2$, 至此, 我们已经处理了除了 $U_\tau(\pi)$ 的所有外生变量  $\hat{\mathcal{U}}= \{U_\lambda^i(t), U_a^i(t), U_q^i(t), U_r^i(t))\}$, 以此可以推断出与之相关的 $\hat{\mathcal{X}}$.

通过最小化扰动和差分来避免 $U_\tau(\pi)$ 的作用, 这需要首先进行模仿学习, 训练一个模仿者模型 $\pi_{\theta_0}$ 来参数化 $\pi_\beta$, 这是为了给出符合后验分布的状态-动作对. 随后, 考虑已存在轨迹 $\mathbf{P}_i = \{v_{t_1}, v_{t_2}, \dots, v_{t_n}\} \in \mathcal{P}(\pi_\beta)$, 考察时刻 $t$, 具有状态-动作对 $S_t = s_t^i, A_t=a_t^i$, 执行反事实推断: 仅在 $t$ 对动作进行赋值, 而后使用 $\pi_{\theta_0}$ 对后续剩余轨迹进行采样, 得到最优回报估计
$$
\begin{aligned}
\mathbb{E}[G_t^* \mid \mathcal{U}_\beta] &= \max_{a \in \mathcal{A}} \mathbb{E}[G_t \mid \text{do}(A_t=a),\hat{\mathcal{U}}] \\
&= \max_{a \in \mathcal{A}}( r_t + \gamma \mathbb{E}_{\mathbf{P} \sim \pi_{\theta_0}}[G_{t+1} \mid \hat{\mathcal{U}}]) \\
&=  \max_{a \in \mathcal{A}}( r_t + \gamma \sum_{t'=t}^\infty r^\text{CF}(s_{t'}^\text{CF}, a_{t'}^\text{CF}))
\end{aligned}
$$
其中, $r^\text{CF}$ 表示反事实奖励, $s_{t'}^\text{CF} =\Phi(s \mid x,y,<\hat{\mathcal{X}}, \hat{\mathcal{U}}>)$ 表示利用噪声推断得到的反事实状态, $a_{t'}^\text{CF} \sim \pi_{\theta_0}$ 表示模仿学习到的后续反事实轨迹, 以此得到了CPTR1的表达:
$$
R_\theta(t) = \max_{a \in \mathcal{A}}( r_t + \gamma \sum_{t'=t}^\infty r^\text{CF}(s_{t'}^\text{CF}, a_{t'}^\text{CF})) - \mathbb{E}_{\pi_\theta}[G_t \mid A_t=a_t^i, S_t=s_t^i]
$$
在计算梯度 $\nabla_\theta \tilde{J}(\theta) $ 时, 可使用类似于 REINFORCE 的技巧, 从轨迹的最后一步开始, 列举干预动作和事实动作的回报(当处于最后一步时, 它是终端奖励), 并得到最大值 $G_{t}^*$, 随后时间倒序推进至 $t-1$, 对于当前步的事实动作, 有 $G_{t-1}=r_t + \gamma G_{t}^*$, 而对于干预动作, 则通过反事实轨迹的奖励累加得到对应的回报 $G_{t-1}^\text{CF}$, 并得到这些回报中的最大值 $G_{t-1}^*=\max \{G_{t-1}^\text{CF}, G_{t-1}\}$, 后续则以此类推, 得到轨迹遗憾序列 $R^i = \{G_t^*-G_t\}_{t=0}^{|\mathbf{P}_i|-1}$. 计算过程如图Fig. 2. 所示



###### C. discussion on validation

The proposed CFPB method provides an offline policy optimization framework based on Counterfactual Inference. We mainly discuss the validation of the method from two aspects: the Bellman equation form and model-based reinforcement learning.

首先, CFPB方法的优化目标不同于强化学习的最大化奖励积累, 它通过SCM提供一个最优回报, 并最小化轨迹遗憾积累从而实现策略优化. 这并不违反贝尔曼方程: 一方面, 它形式上等价于基线策略梯度方法, 即CPTR1给出了一种符号相反的优势函数等价表述, 然而它通过噪声恢复等反事实方法, 给出了最优基线并能够更多地降低方差; 另外, 从监督学习角度, CPTR1从形式上等价于在事实分布上进行最优动作克隆的模仿学习, 这也说明了其有效性

另外, 从有模型强化学习的角度分析, SCM实际上通过具体问题的机制构造了一个客观存在的先验分布, 它不以数据集的后验而改变, 因此数据集存在的意义只是恢复SCM中的外生变量, 当这些变量恢复后, 我们就可以从SCM中得到符合数据集分布的策略评估无偏估计. 同时, SCM作为先验知识引入了额外信息, 这也是CFPB更加有效的原因.

基于重要性采样的方法是一种较为粗略的因果方法, 它符合潜在因果模型框架, 假设混淆因子同时作用于策略以及评估结果, 通过逆概率加权方法试图切断混淆因子和策略分布间的因果流, 从而使得事实数据集可以用于评估新的策略分布, 然而, 这种方法会被少数具有较大权重的数据所影响(尤其是接近0或1的), 引发高方差问题.

另外, 逆概率加权方法没有引入新的信息, 这导致其严重依赖于支撑集. 过于低秩的支撑集同样会影响CFPB方法, 当数据集中有效信息数量不足以支撑噪声的恢复, 使得多数变量只能依赖于函数拟合时, CFPB方法将退化为类似DQN的模式, 其通过自举回答反事实推断问题, 仍然会产生回报高估或高方差问题.



