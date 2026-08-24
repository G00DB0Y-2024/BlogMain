Decision letter (Initial Submission)

Ising-Heuristic Cooperative Routing with Long-Range Correlation for LEO Satellite Constellation

Subject

Decision on NL2026-0217- Minor Revision Required

Date sent

4 July 2026 at 14:27 GMT+8

From

[eicnetletters@gmail.com](mailto:eicnetletters@gmail.com)

To



Show 4 addresses

Dear Author(s):

The review of the referenced manuscript NL2026-0217, entitled Ising-Heuristic Cooperative Routing with Long-Range Correlation for LEO Satellite Constellation is now complete. The reviews of the manuscript are attached. Based on the reviews and my own reading of your manuscript,  I cannot accept your letter for publication in its current form. Your manuscript requires revisions, as outlined below before the paper can be published. If these revisions are satisfactorily made  (including meeting the length guidelines), the paper will be accepted for publication.

When you are ready to submit your revision, visit the following link:
https://ieee.atyponrex.com/submission/submissionBoard/REX-PROD-2-CE0573B0-1A65-4D37-9A30-5ABFB442C224-0DCA3ED6-31EC-47FA-97E6-CBC569C1022B-30073/current?idtype=external



EDITOR COMMENTS:
The manuscript addresses a relevant topic and proposes an interesting Ising-Heuristic Routing framework for LEO satellite constellations. The reviewers generally acknowledge the novelty of the idea, the clear structure of the paper, and the breadth of the simulation results. However, several technical aspects still require clarification before the paper can be accepted. In the revised version, the authors should carefully address the reviewers’ comments, with particular attention to the communication and synchronization overhead of the proposed scheme, the training/deployment architecture, the assumptions on traffic and link failures, and the consistency of the queueing and link-capacity models. The mathematical role of the Ising mechanism and the claimed long-range cooperation should also be better justified. Finally, notation, figures, and language should be revised for clarity and consistency.


​       
Your revision will be due within 21 days and is due on 25-Jul-2026. Please ensure that your revision is submitted in a timely manner as the web-based system will not allow a revision to enter the system after 21 days have elapsed.
​    
Thank you for considering IEEE Networking Letters as a means of publication. I look forward to receiving your revised manuscript.

Sincerely,

L-NET EiC
eicnetletters@gmail.com
Editor-in-Chief, IEEE Networking Letters   
    

Reviewer's Comments

Reviewer: 1

Comments to the Author
This paper proposes a distributed IHR framework for LEO satellite constellations, which integrates a Dueling Deep Q‑Network with the Ising model to achieve low‑latency and load‑balanced routing. By exchanging lightweight intention vectors and binary spin configurations among neighbouring satellites, the method constructs a coupling tensor to guide cooperative routing decisions and leverages the long‑range correlation property of the Ising model to mitigate the myopia of purely local decisions. Extensive simulation results demonstrate that the proposed method outperforms several baseline algorithms in terms of end‑to‑end delay, packet loss rate, and link utilisation. The overall paper is clearly structured, and the experimental evaluation covers a range of key QoS metrics.
Nevertheless, several aspects are identified that could benefit from further clarification or improvement. It is therefore suggested that a major revision be undertaken to address the following points.

1. Regarding the claim that MARL methods "exchange raw state tables or high‑dimensional neural network weights," it is noted that recent works (e.g., MAPPO in Ref. [5]) have already adopted parameter sharing and compressed local observation strategies. It would be helpful if the authors could provide a quantitative comparison of the communication overhead between IHR and these state‑of‑the‑art MARL approaches, so that the claimed advantage can be more convincingly demonstrated.



2. In Algorithm 1, Phase I and Phase II  are executed asynchronously. The paper states that "onboard routing inference is computationally lightweight," but it is not entirely clear whether the training process is also performed on‑board. If on‑board training is indeed employed, the O(DH^2) complexity may be challenging for resource‑constrained satellite platforms. On the other hand, if training is conducted centrally on the ground, the term "fully decentralized" might be somewhat misleading and would benefit from revision. It is recommended that the authors explicitly clarify the training deployment architecture.



3. Although the paper emphasises "communication overhead" as a key advantage of IHR, no concrete data are reported on this aspect. It would be valuable to include quantitative metrics, such as the number of control message bytes per node per time slot, a direct comparison of communication overhead with MADQN/MAPPO, and the proportion of available bandwidth consumed by the proposed signalling.



4. The current traffic model assumes independent Poisson arrivals with random destinations, which implicitly corresponds to a spatially uniform traffic distribution. In practice, LEO satellite networks often experience highly non‑uniform traffic patterns due to terrestrial population density and diurnal tidal effects—precisely the scenarios where load‑balancing routing is most valuable. Performance conclusions drawn solely under uniform traffic conditions may not fully reflect the method's effectiveness under actual load‑imbalanced scenarios. It is suggested that the authors either supplement experiments with non‑uniform traffic patterns or explicitly justify the applicability of the proposed method to asymmetric traffic conditions.



5. The method requires each satellite to exchange intention vectors and spin states with all its neighbours in every time slot. Given the high mobility of LEO satellites, the neighbour set changes frequently, which inevitably introduces signalling overhead and synchronisation costs. These dynamic overheads have not been quantitatively analysed in the current manuscript. It is recommended that the authors provide a quantitative assessment to demonstrate the feasibility of the proposed scheme in a rapidly changing topology.


Reviewer: 2

Comments to the Author
The constellation dynamics are modelled with a uniform, random link failure probability (Ρfailure=0.01). In practical LEO satellite networks, link disruptions are frequently highly organized or recurring (for example, due to air blockades, solar radiation, or severe pointing angles at polar locations), rather than simply independent and random.

The environment changes across discrete time intervals. Because thermodynamic coupling and MH sampling rely on surrounding states, differing propagation delays over vast distances may result in asynchronous update lags or out-of-sync spin states in practice, which the current methodology does not address.

While the research presents a theoretical Big-O analysis of onboard inference complexity (mathematical model), it does not include an empirical evaluation of power consumption. Given that LEO satellites must operate below stringent energy limits, measuring actual CPU/GPU execution energy would considerably improve the study.

The simulations were carried out just on a single Walker-Delta constellation architecture (16x 24 = 384 satellites). Validating the IHR framework against enormous mega-constellations (e.g., thousands of nodes) is required to ensure that the macro-level long-range alignment is stable and free of regional path oscillations.

Reviewer: 3

Comments to the Author
This paper proposes an Ising-Heuristic Routing framework for dynamic routing in LEO satellite constellations by combining Dueling DQN with an Ising-inspired cooperative mechanism. The topic is relevant to 6G non-terrestrial networks, and the idea of using intention vectors and binary spins to assist distributed routing is interesting. The simulations cover several QoS metrics. However, the manuscript still has issues in motivation, contribution positioning, modeling rigor, Ising formulation, simulation clarity, and notation.

Comment 1: The motivation is not sufficiently focused. The paper mentions limited observations and delayed information propagation in MARL routing, but it does not clearly justify why an Ising model is necessary. Its advantage over cooperative MARL, GNN-based routing, and load-aware routing remains unclear.

Comment 2: Some contributions appear overstated. The paper claims long-range correlation and global cooperation, while the information exchange is only between one-hop neighbors. The presented results show correlation induced by local coupling rather than a rigorous demonstration of long-range correlation.

Comment 3: The queue load definition is inconsistent. The paper defines `ρ_i = N_s^i(t) / N_a^i(t)`, i.e., service over arrivals, but uses `0 ≤ ρ_i < 1` as the stability condition. Normally, load is arrival rate over service rate. This affects the meaning of the state features, constraints, and reward function.

Comment 4: The relationship between link rate and capacity is unclear. The paper computes `R_ij` using the Shannon formula while also assigning each ISL to discrete capacity levels or outage. How these two models jointly determine the actual transmission rate, service rate, and queueing delay is not specified.

Comment 5: The mathematical logic of the Ising mechanism is not rigorous enough. The effective field `h_eff = J_ij σ_j + V(x_i→j)` uses the Dueling value term as an external field, while `V` is already included in the Q-value. The action score `Q - 2θσ_i h_eff` may double-count value information and has an unclear sign interpretation.

Comment 6: The simulation parameters and metric definitions are incomplete. It is unclear whether the traffic rate is network-wide, per gateway, or per node. Details such as time variation of random capacities, training-test separation, replay buffer, and network structure are also missing. The simultaneous reporting of high throughput, 100% ISL utilization, and very low maximum average system load needs clearer definitions.

Comment 7: The validation of long-range correlation is still weak. Fig. 4 mainly shows cosine similarity among intention vectors, which is insufficient to prove interpretable long-range cooperation. Correlation decay over topological distance, correlation length under different `θ`, or comparison without MH sampling would be more convincing.

Comment 8: There are several notation, figure, and language issues. For example, `Q_t(t+1)` and `Q_i(t+1)` are mixed, `D` is used for both batch size and replay buffer, and the description of `θ = 1.0` in Fig. 4 still refers to Fig. 4(a). Some sentences also contain grammatical or logical problems.Dr.