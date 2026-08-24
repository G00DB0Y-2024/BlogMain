% older version
Recent works address routing in satellite networks using reinforcement learning (RL): Yin et al.~\cite{yin2021reinforcement} cast it as a finite-state Markov decision process solved via Q-learning; Lyu et al.~\cite{lyu2024dynamic} proposed CMADR, a constrained multi-agent RL (MARL) method based on max-min optimization; distributed deep Q-networks leveraging neighbor knowledge were developed in~\cite{dqn2024a,dqn2025b,dqn2023c}; and graph neural networks integrated with MARL frameworks were adopted in~\cite{zhang2024grlr,ran2024fully,kang2025efficient} to embed topological features. However, these approaches predominantly rely on online RL, which demands dense rewards from trial-and-error exploration—posing significant risks in real satellite systems due to high computational overhead~\cite{ruuvzivcka2023fast,diana2024review}, potential service disruption, and poor generalization from idealized simulators to dynamic space environments~\cite{10.1016/j.adhoc.2025.103995,bhattacharyya2023machine}. To mitigate these issues, offline RL has emerged as a safer alternative: satellites collect operational data and transmit it to ground stations, where policies are optimized without environment interaction—treating RL as a supervised learning problem~\cite{agarwal2020optimistic,kumar2020conservative}. 

Yet offline methods face challenges like extrapolation error~\cite{rezaeifar2022offline}, distributional shift~\cite{ma2021conservative}, and reward collapse under low-rank or static historical data~\cite{fujimoto2021minimalist}. Recent advances aim to overcome these limitations: Lozano-Cuadra et al.~\cite{lozano2025continual} trained a global model offline and deployed it distributively; Yang et al.~\cite{yang2024offline} introduced a data-mixing strategy with theoretical generalization guarantees; and Xie et al.~\cite{xie2024computation} employed offline soft actor-critic on historical decisions to avoid deployment risks.

While existing offline learning approaches for LEO satellite routing lack systematic integration of domain knowledge, this study proposes a novel framework Counterfactual Policy Boosting (CFPB) and a counterfactual offline strategy evaluation metric: one-step counterfactual perturbed trajectory regret (CPTR1). They enable incremental optimization of existing routing policies using offline dataset. Specifically, the framework operates in two phases: 

\begin{itemize}
\item[(1)]\textbf{Reconstruction phase:} For each time slot, backdoor paths to the state variables are controlled by means of observation or noise estimation, thereby enabling the computation of the outcomes under action interventions. The action policy is imitated from an offline dataset to ensure unbiasedness in subsequent stages.

\item[(2)]\textbf{Optimization phase:} Trajectories are sampled from the dataset, and action interventions are applied at each decision step. Counterfactual outcomes of the state variables are computed through causal reasoning and mapped to CPTR1, thereby guiding the optimization of the offline agent and uncovering potentially optimal trajectories.
\end{itemize}

The proposed CFPB method restates the logical paradigm for implementing reinforcement learning in real satellite constellation environments from a relatively novel perspective. We argue that the iterative optimization of in‑orbit routing policies should adhere to the following principle: based on the currently deployed routing policy, learning and policy updates should be performed solely using the forwarding dataset collected during actual network operation over relatively long update cycles. This process should essentially be regarded as an offline reinforcement learning task, whose core lies in achieving safe, stable, and continual policy improvement while avoiding the risks of online interaction and remaining faithful to the actual data support.

The main contributions of this paper are summarized as follows:

\begin{itemize}
\item We propose a offline routing policy optimization framework for LEO constellations to reduce E2E delay and packet loss via load balancing, with each satellite acting as an independent agent and makes routing decisions based on its local network observations.

\item We derived the SCM of the satellite routing system and modeled it as an additive noise model and identify the noise effect pathways, reduce extrapolation error and distributional shift when optimizing policies from a static dataset.

\item We propose the CFPB framework and reformulate offline policy evaluation as a counterfactual inference problem through CPTR1, introducing a low-variance policy optimization paradigm that minimizes trajectory regret.

\item We analyze the unbiasedness of CFPB and its causal relationships with other offline methods from the perspective of factors that influence routing decisions, demonstrate the advantages and generalization capability of the CFPB framework through comprehensive experiments.

\end{itemize}

The rest of the paper is organized as follows. Section II introduces the communication system model. The problem formulation is presented in III, with the CFPB learning framework and CPTR1 described in Sections IV, respectively. The proposal is evaluated in Section V and concluding remarks are given in Section VI