history:

> The proposed CFPB framework establishes an offline policy optimization paradigm grounded in SCM $\mathfrak{C}=(\mathcal{X}, \mathcal{U}, \mathcal{F})$. Its validity can be examined from its interpretation as a Model-based Reinforcement Learning and supervised learning leveraging structural priors. Meanwhile, CFPB, Importance Sampling (IS) and value-based offline RLs have a connection on Causal Inference, it is worth discussing their valid scope.
>
> The CFPB is formally equivalent to baseline methods in which CPTR1 serves as an unbiased estimator of $R_\theta(t) = -\mathbb{E}_{\mathfrak{C}}\!\left[ \hat{A}^{\pi_\theta}(s_t^i, a_t^i) \mid \hat{\mathcal{U}} \right] = \mathbb{E}_{\mathfrak{C}}\!\left[ G^*_t - G_t \mid \hat{\mathcal{U}} \right]$ thereby identifying a variance-reducing baseline~\cite{mesnard2021counterfactual}, with the baseline constructed via counterfactual queries to reduce the estimator’s deviation. From a supervised learning perspective, this approach mirrors optimal action cloning via imitation learning under the factual data distribution, reinforcing its theoretical validity. In the context of model-based reinforcement learning~\cite{gasse2021causal}, the SCM encodes domain-specific mechanisms that induce an objective, data-generating prior invariant to the empirical posterior from observational data; the dataset's role is thus limited to recovering exogenous latent variables. Once reconstructed, the SCM enables unbiased policy evaluation~\cite{bareinboim2024introduction} and, by incorporating structural priors beyond observed data, enhances sample efficiency and robustness.
>
> Offline RLs including CFPB, IS, and value-based methods all rely on counterfactual queries to obtain unbiased return estimates and must avoid out-of-distribution (OOD) situation. IS, based on the Rubin Causal Model (potential outcomes framework), assumes unobserved confounders $\mathcal{U}$ simultaneously influence actions $A_t$ and returns $G_t$, shown as $A_t \leftarrow \mathcal{U} \rightarrow G_t$. Inverse Probability Weighting (IPW)~\cite{sheikh2021new} blocks the backdoor path via reweighting, constructing a pseudo-population $A_t \not\leftarrow (\pi_\beta) \leftarrow \mathcal{U} \rightarrow G_t$~\cite{datta2022inverse}, but suffers from high variance when propensity scores $\pi_\beta$ are extreme. Value-based offline RL estimates counterfactuals through function approximation and bootstrapping~\cite{shao2023counterfactual}, using regularization~\cite{wu2019behavior} to mitigate OOD issues; both approaches require datasets with rich factual information. Similarly, CFPB performs counterfactual inference via a SCM prior, enabling optimization on low‑rank data by reconstructing noise while avoiding OOD actions. However, it too becomes vulnerable when the support set lacks sufficient factual information to identify $\mathcal{U}$ and $\mathcal{X}$; in such degenerate cases, most latent variables must be inferred purely through function approximation, causing CFPB to collapse into a Q‑Learning‑like bootstrapping regime $G_t^* \approx r_{t+1} + \gamma \max_{a'} Q_\phi(s_{t+1}, a')$, which reintroduces overestimation bias.

- 上述内容讨论关于路由的太少了, 而且基本是为了避开数学证明而进行了较多的空话内容
- 新版本需要对无偏性和方差上界进行推导, 然后讨论在路由中的好处



本节讨论引导CFPB方法进行学习的CPTR1指标的无偏性, 以及离线RL方法在路由优化上的因果联系, 并指出CFPB的有效性原因.

策略 $\pi_\theta$ 在状态 $s_t^i$ 的策略梯度由重要性采样表示. 由于回报 $G_t$ 和动作 $A_t$ 存在噪声混淆, 因此逆概率加权\cite{datta2022inverse, sheikh2021new} $w_t$ 切断因果关联以识别干预作用, 这会导致极端倾向得分控制样本作用. 由于在 $\pi_\beta$ 的作用下, 后验噪声可以描述联合分布 $(S_t, A_t, S_{t+1}) \sim p(\hat{\mathcal{X}}, \hat{\mathcal{U}})$,  则在该分布下倾向得分等同于状态和动作的后验概率: 
$$
\begin{aligned}
\nabla_\theta V_{\pi_\theta}(s_t) &= \mathbb{E}_{A_t \sim \pi_\beta}[w_t \cdot \nabla_\theta \log \pi_{\theta}(A_t \mid s_t) \cdot G_t]\\
&= \int_{\hat{\mathcal{U}}} \mathbb{E}_{A_t \sim \pi_\theta}[ \nabla_\theta \log \pi_{\theta}(A_t \mid s_t) \cdot G_t]  \cdot p(s_t \mid u) \text{d}P(u) \\
&= \mathbb{E}_{\mathfrak{C}}\mathbb{E}_{A_t \sim \pi_\theta}[ \nabla_\theta \log \pi_{\theta}(A_t \mid s_t) \cdot G_t \mid \hat{\mathcal{U}}] 
\end{aligned}
$$
潜在结果 $Y^*(s_t^i)$ 的后续采样依赖 $\pi_\beta$ 模仿, 因此其和动作概率无关, 和策略参数无关, 有
$$
\nabla_\theta  \mathbb{E}_{A_t \sim \pi_\theta}[Y^*(s_t)] = Y^*(s_t)\nabla_\theta \sum_a \pi_\theta(a \mid s_t) = 0
$$
如下结果表明CPTR1引导的策略梯度是无偏估计器:
$$
\begin{aligned}
-\nabla_\theta V_{\pi_\theta}(s_t) &= -\mathbb{E}_{\mathfrak{C}}\mathbb{E}_{A_t \sim \pi_\theta}[ \nabla_\theta \log \pi_{\theta}(A_t \mid s_t) \cdot G_t \mid \hat{\mathcal{U}}]    \\
&= \nabla_\theta  \mathbb{E}_{A_t \sim \pi_\theta}[Y^*(s_t)]  - \mathbb{E}_{\mathfrak{C}}\mathbb{E}_{A_t \sim \pi_\theta}[ \nabla_\theta \log \pi_{\theta}(A_t \mid s_t) \cdot G_t \mid \hat{\mathcal{U}}] \\

&= \mathbb{E}_{\mathfrak{C}}\mathbb{E}_{A_t \sim \pi_\theta}[ \nabla_\theta \log \pi_{\theta}(A_t \mid s_t) \cdot (Y^*(s_t)-G_t)\mid \hat{\mathcal{U}}] \\
&\approx \frac{1}{|\mathcal{P}|} \sum_{i=1}^{|\mathcal{P}|} \sum_{t=0}^{|\mathbf{P} |-1} \gamma^{t} \nabla_{\theta} \log \pi_{\theta}(a_t \mid s_t) R_\theta(t) \mid \hat{\mathcal{X}}, \hat{\mathcal{U}}

\end{aligned}
$$
上式 $R_\theta(t) \mid \hat{\mathcal{X}}, \hat{\mathcal{U}}$ 表明在计算CPTR1时首先需要估计噪声, 随后利用 $\mathfrak{C}$ 查询状态并计算反事实回报和最优干预回报.

The proposed CFPB framework reduce the estimator’s deviation. From a supervised learning perspective, this approach mirrors optimal action cloning via imitation learning under the factual data distribution; in the context of model-based reinforcement learning~\cite{gasse2021causal}, the SCM encodes 星座路由过程中包括网络拓扑、流量模式、用户需求等变量的因果关联, 数据集的作用只是恢复观测时的外生噪声, 并推断出当时的路由状态, 以引导智能体进行学习.

路由决策的影响具有延迟和稀疏性: 终端奖励只在包到达或丢失后才会反馈, 而在此期间, 智能体基本上只能收到时延惩罚和跳数惩罚, 即使是在线智能体也难以有效学习. CFPB方法基于已有轨迹和噪声重建, 从终端状态开始倒序搜索, 探索每一步所有可能的动作干预, 并为当前策略提供最优标签以进行离线学习, 提升了其对于全局流量状态的建模能力.

However, CFPB performs counterfactual inference via a SCM prior, enabling optimization on low‑rank data by reconstructing noise while avoiding out-of-distribution (OOD) actions. It too becomes vulnerable when the support set lacks sufficient factual information to identify $\mathcal{U}$ and $\mathcal{X}$; in such degenerate cases, most latent variables must be inferred purely through function approximation, causing CFPB to collapse into a Q‑Learning‑like bootstrapping regime $G_t^* \approx r_{t+1} + \gamma \max_{a'} Q_\phi(s_{t+1}, a')$, which reintroduces overestimation bias.

