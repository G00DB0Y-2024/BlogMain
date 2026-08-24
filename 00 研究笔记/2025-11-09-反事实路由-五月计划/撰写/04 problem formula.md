###### A. Problem Formulation

Let $|\mathcal{P}|$ denote the total number of packets injected during the observation interval, where each packet is associated with a path $\text{PA}_i \in \mathcal{P}$. Considering a path $\text{PA}_i = \{v_{i_1}, v_{i_2},..., v_{i_n}\}$ with length $||\text{PA}_i||_L$, where $v_{i_k} \in \mathcal{V}, (i_k, i_{k'}) \in \mathcal{E}$, $S_{i_{k'}} \in \text{Ne}(s_{i_k}), \forall k, k' \le n$, the time slot corresponding to the node on the path is $t_k$, the E2E delay of the path $||\text{PA}_i||_T$ is given by:
$$
\begin{equation}
||\text{PA}_i||_T = \sum_{k=1}^{||\text{PA}_i||_L-1} D_{\text{prop}}(i_k, i_{k+1}) + D_{\text{tx}}(i_k, i_{k+1}; K) + D_{\text{queue}}(i_k, t_k) + U^{i_k}_\tau(t_k)
\end{equation}
$$
where if $v_{i_k} \in G$, the queuing delay $D_{\text{queue}}(i_k, t_k)=0$. During the observation period, traffic is injected from gateways and forward via multi-hop transmissions among multiple satellite nodes.

The control variable $\pi(a_t^i \mid s_t^i):\mathcal{S} \rightarrow \mathbb{P}^4$ represents a mapping of the global information observed at node $i$ at time $t$ to a four-dimensional probability distribution, which represents the next-hop forwarding port selection probability. $s_t^i = \Phi_t(s|x,y,S_t)$ can be viewed as a compression of the global state $S_t$ from a discrete memoryless channel $\Phi_t(s|S_t, x,y)$ at position $(x,y)$.

The joint optimization problem is formulated as follows: minimize the average end-to-end delay over the observation period, subject to node constraints. 
$$
\begin{align}
\min_{\pi} \quad 
& \frac{1}{|\mathcal{P}|} \sum_{k=1}^{|\mathcal{P}|}||\mathbf{P}_k||_T \\
\text{s.t.} \quad 
& \forall  i \le N_S; ~ \forall j \in \mathrm{Ne}(S_i); ~ \forall t \le W\;  \\
& a_t^i \in \mathcal{A}, s_t^i \in \mathcal{S}, \pi_i(a_t^i \mid s_t^i) \in \mathbb{P}^4,  \\
& 0 < d_{ij}, R(i,j) < \infty,  \\
& 1 \le ||\mathrm{PA}_k||_L\le \mathrm{TTL},  \\
& 0 \le \lambda_t^i \le \lambda_{\max},  \\
& 0 \le \rho_t^i < 1,  \\
& 0 \le Q_{t}^i \le Q_\text{max},  \\
& \ell^i_{t+1} \le 0
\end{align}
$$
where constraint (d) ensures link connectivity and that interference remains within an acceptable range; constraint (e) enforces that the number of hops does not exceed the time-to-live (TTL); constraints (f), (g), and (h) are queueing-theoretic constraints, representing the maximum traffic injection rate, the stability condition of the queueing system, and the buffer capacity limit, respectively.



Since the distance and reachability constraints are implicit in the trajectory delay, the non-decision variable constraints of injected traffic are generally given from the link attribute and system level. The feasible region constraint of the strategy does not explicitly introduce a multiplier, then the corresponding Lagrangian form of the optimization problem is:
$$
\begin{align}
\min_{\pi} \quad  \mathcal{L}(\pi) = 
& \frac{1}{|\mathcal{P}|} \sum_{k=1}^{|\mathcal{P}|}\left[  ||\mathbf{P}_k||_T + \delta_1(||\mathbf{P}_k||_L-\text{TTL})+ \delta_2 \sum_{t=1}^{W-1}(Q_t^k - Q_\text{max}) + \delta_3 \sum_{t=1}^{W-1}(\rho_t^k - 1) + \delta_4 \sum_{t=1}^{W-1} \ell_{t+1}^k  \right]  \\
\text{s.t.} \quad 
& \delta_m \ge 0, \forall m = 1,2,3,4\\
& a_t^i \in \mathcal{A}, s_t^i \in \mathcal{S}, \pi_i(a_t^i \mid s_t^i) \in \mathbb{P}^4,  \\
\end{align}
$$

$$
\begin{aligned}
\min_{\pi} \quad  \mathcal{L}(\pi) = 
& \frac{1}{|\mathcal{P}|} \sum_{k=1}^{|\mathcal{P}|} \left[ \delta_1(||\mathbf{P}_k||_L-\text{TTL}) +\sum_{t=1}^{||\mathbf{P}_k||_L-1} \left(  D_\mathcal{V}(i_t, i_{t+1}, t;K)   + \delta_2(Q_t^k - Q_\text{max}) + \delta_3(\rho_t^k - 1) + \delta_4 \ell_{t+1}^k  \right) \right]\\
\text{s.t.} \quad 
& \delta_m \ge 0, \forall m = 1,2,3,4\\
& a_t^i \in \mathcal{A}, s_t^i \in \mathcal{S}, \pi_i(a_t^i \mid s_t^i) \in \mathbb{P}^4,  \\
\end{aligned}
$$





###### B. Structural Causal Model

> 这一章先对因果关系进行建模, 随后再Section IV中阐述反事实推断, 因此, 本章不提反事实推断相关问题
>
> 主要先清除这一段:
>
> Counterfactual Inference is the highest-level task of Causal Inference. In the proposed offline reinforcement learning setting, trajectory information $\mathbf{P}_i \in \mathcal{P}$ presented in the dataset is referred as \textbf{support-set information}, whereas any trajectory information not contained in the dataset, denoted as $\mathbf{P}^\text{CF} \notin \mathcal{P}$, is termed \textbf{counterfactual information}. Any approach that evaluates counterfactual information without accounting for causal relationships inevitably introduces bias. For instance, value-based methods (e.g., Deep Q-Learning) address counterfactual queries through bootstrapping and function approximation, yet suffer from Q-value overestimation; policy-based methods mitigate policy deviation from the support set via importance sampling or gradient clipping, but still incur substantial evaluation variance, as discussed in Scetion IV-A.

The Structural Causal Model (SCM) formalizes the entire system as a set of structural equations $\mathfrak{C}$ and its corresponding directed acyclic graph (DAG), denoted by $\mathcal{G}$, based on the causal generative relationships among variables, thereby enabling the identification of interventions and the evaluation of counterfactual queries from observed data. Specifically, the variables that describe the system state and are observable in the dataset are referred to as endogenous variables $\mathcal{X}$, while the unobserved variables—often interpreted as exogenous noise—are denoted by $\mathcal{U}$. The generative mechanisms of the variables are represented by a set of structural functions $\mathcal{F}$. The tuple $<\mathfrak{C},\mathcal{G}>=  (\mathcal{X}, \mathcal{U}, \mathcal{F})$ constitutes a complete SCM.

The causal framework employed in this paper for counterfactual inference relies on the following axioms:

- Causal Markov Assumption: In $<\mathfrak{C},\mathcal{G}>=  (\mathcal{X}, \mathcal{U}, \mathcal{F})$,  $\forall X \subseteq \mathcal{X}$ with parent set $\text{PA}_X$ and the remaining variables denoted as $Y=\mathcal{X} \setminus (X \cup \text{PA}_X)$, it holds that $X \perp\!\!\!\perp Y \mid \text{PA}_X$, and the joint distribution factorizes as $p(X) = \prod_{x_i \in X} p(x_i \mid \text{PA}_{x_i})$.
- Causal Minimality Assumption: $\not \exist ~<\tilde{\mathfrak{C}},\tilde{\mathcal{G}}>=  (\mathcal{X}, \mathcal{U}, \tilde{\mathcal{F}})$, such that $\tilde{\mathcal{G}} \subset \mathcal{G}$, $|\tilde{\mathcal{F}}|< |\mathcal{F}|$, and the joint distribution satisfies $p^{\tilde{\mathfrak{C}}}(\mathcal{X}, \mathcal{U})=p^{\mathfrak{C}}(\mathcal{X}, \mathcal{U})$.

Based on the system model described in Section II, let the set of endogenous variables be $\mathcal{X}=\{\lambda_t^i, \rho_t^i, Q_t^i, Q_{t+1}^i, \tau_{t+1}^i, \ell_{t+1}^i\}$, where variables indexed by $t$ are observable and obtained through the observation channel $s_t^i = \Phi(s \mid x,y,S_t)$ as introduced in Section III-A. Variables indexed by $t+1$ are measurable, representing measurements derived from the Markov decision process. The exogenous variables $\{U_\lambda^i(t), U_a^i(t), U_\rho^i(t), U_q^i(t), U_r^i(t), U_{\rho, r}^i(t)\}$ capture uncertainties inherent in the observation and measurement process from $\Phi(\cdot)$. According to the relationships delineated in Section II-C, the causally minimal set of exogenous variables is $\mathcal{U} = \{U_\lambda^i(t), U_a^i(t), U_q^i(t), U_r^i(t)) \}$, which are mutually independent and exert independent effects during measurement, while the influence of the remaining exogenous variables can be recovered through statistical inference.



Consequently, based on the above definitions and integrating the model relationships outlined in Section II, the Structural Causal Model (SCM) is formulated as follows:
$$
\left \{
\begin{aligned}
\lambda_t^i &= U_\lambda^i(t) \\
\rho_t^i &= f_\rho(\lambda_t^i) + \phi_a^i U_a^i(t) \\
Q_t^i  &= U_q^i(t) \\
Q_{t+1}^i &= f_q(Q_t^i, \rho_t^i, U_a^i(t)) \\
\tau_{t+1}^i &= f_\tau(Q_{t+1}^i) +  \phi_\rho^i \phi_a^i U_a^i(t) +  \phi_r^i U_r^i(t) \\
\ell_{t+1}^i &= f_\ell(\lambda_t^i, Q_t^i,  U_a^i(t)) 
\end{aligned}
\right.
$$
where the mappings $\mathcal{F} = \{f_\rho, f_q, f_\tau, f_\ell\}$ denote causal mechanisms, which describe the generative relationships among causal variables; structural equations (a), (b), (c), (e) are described as Additive Noise Model (ANM). The tuple $\mathcal{G} =  (\mathcal{X}, \mathcal{U}, \mathcal{F})$ constitutes a complete SCM, whose corresponding Directed Acyclic Graph (DAG) $\mathcal{G}$ is illustrated in Fig. 1. 









