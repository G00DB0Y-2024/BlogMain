# [NL2026-0217] Response Letter

## Response to the Editor

#### ADDITIONAL COMMENTS:

> The revised manuscript has been substantially improved, and the authors have satisfactorily addressed most of the concerns raised in the previous round. In particular, the link model, CTDE architecture, communication and energy overhead analysis, non-uniform traffic evaluation, mega-constellation experiments, and long-range correlation study have been significantly strengthened. The motivation and research contribution are now sufficiently clear, and the experimental results generally support the proposed approach.
> Nevertheless, a few issues should still be addressed before the manuscript can be considered for publication. These mainly concern the moderation of some theoretical claims, consistency of numerical results and statistical units, and alignment between the CTDE description and Algorithm 1. In particular, the authors should carefully resolve the reported numerical inconsistencies (e.g., the MAPPO packet-loss value in the hotspot scenario), clarify the execution phase of the MH sampling procedure, and better specify the assumptions underlying the claimed mathematical guarantees for long-range correlation and global cooperation.

##### Reply:

Dear Editor,

We sincerely thank you and the reviewers for your continued guidance and positive feedback on the substantial improvements made in the revised manuscript. We greatly appreciate your constructive comments, which have helped us finalize the polish and rigor of our paper.  

In this minor revision, we have carefully addressed all the remaining issues highlighted in your summary. A brief overview of the final modifications is outlined below:  

- **Moderation of Theoretical Claims and Assumptions:** We have explicitly clarified that the classical Ising model yields strict mathematical guarantees only under stationary conditions and instantaneous updates. Consequently, we have moderated overly definitive language throughout the text. We now specify that, assuming a quasi-static topology and bounded propagation delays, the observed long-range correlation acts as an empirically supported macroscopic collaborative bias, rather than an absolute mathematical guarantee.  
- **Numerical Consistency and Statistical Units:** We have conducted a thorough proofreading to standardize all numerical results and units. Specifically, we corrected the typographical error regarding the MAPPO packet-loss value in the hotspot scenario from 0.88% to the true experimental value of 5.88%. We also clearly distinguished the gateway traffic injection rate from the per-satellite arrival rate to ensure logical consistency.  
- **CTDE Architecture and Algorithm 1 Alignment:** We have rectified the structural typographical error in Algorithm 1 to ensure absolute consistency with the text. The Metropolis-Hastings (MH) sampling procedure has been correctly moved to the end of Phase I (Execution phase) to reflect that it is performed independently on-board. Furthermore, Phase II has been explicitly renamed to "Centralized Training phase".  

Detailed point-by-point responses to the reviewers, alongside the exact manuscript modifications (highlighted in blue), are provided below. We hope these final refinements fully resolve the remaining concerns and make the manuscript suitable for publication in IEEE Networking Letters.  

Sincerely,

Jinhao Yang



## Response to the Reviewers

We thank the reviewers for their critical assessment of our work. In the following we address their concerns point by point.

All modifications in the **revised manuscript** have been highlighted in <span style="color:blue; ">blue</span> for clarity.

---

### Reviewer 1

#### Reviewer Point

> Comments to the Author
> The arguments in Chapter I are sufficiently strong, and the research contribution has been clearly established.

##### Reply:

We sincerely thank the reviewer for taking the time to review our revised manuscript and for the positive feedback regarding our arguments and research contributions. We greatly appreciate your kind support and constructive comments during the review process, which have significantly helped us improve the quality of this paper.

### Reviewer 2

#### Reviewer Point P 2.1

>Some statements regarding long-range correlation and global cooperation are overly definitive. The authors are advised to moderate these claims so that they are appropriately supported by the theoretical analysis and experimental results.

##### Reply:

We sincerely thank the reviewer for this important suggestion. We agree that several statements concerning long-range correlation and global cooperation were too definitive.

We have moderated the relevant claims throughout the manuscript. Specifically, we replaced expressions such as “mathematically guaranteeing long-range collaborative bias” and “mathematically confirms” with more precise descriptions based on statistical correlation and empirical evidence. We now clarify that the nearest-neighbor Ising interactions can promote multi-hop statistical correlations under approximately stationary coupling and field conditions. Because the coupling tensors, external fields, learned parameters, and neighbor states are time-varying in our routing system, the observed long-range effect is presented as an empirically supported macroscopic collaborative bias rather than as a universal guarantee.

The corresponding revisions have been made in the Introduction, Section III-C, Section IV-C, and the Conclusion, with all modified text highlighted in blue.

##### Action Taken:

- We have moderated the theoretical language throughout the manuscript by replacing overly definitive expressions such as “mathematically guaranteeing,” “mathematically confirms,” and “global cooperation” with more precise terms including “empirical evidence,” “macroscopic collaborative bias,” and “multi-hop statistical correlation.”

- We have revised the Introduction, Section III-C, Section IV-C, and the Conclusion to make clear that the observed long-range effect is a scenario-dependent empirical phenomenon supported by the correlation analysis, rather than a universal mathematical guarantee.
- We have added explicit qualifiers stating that the Gibbs-measure interpretation applies under approximately stationary coupling and external-field conditions, while the proposed routing system is time-varying and should therefore be interpreted in a quasi-stationary sense.



#### Reviewer Point P 2.2

>A few inconsistencies remain between the manuscript and the response letter regarding experimental data, traffic-rate scope, and statistical units. The authors should carefully verify and standardize the relevant content. For example, the MAPPO packet loss in the hotspot scenario is reported as both 0.88% and 5.88%.

##### Reply:

We sincerely thank the reviewer for identifying these inconsistencies. We have rechecked the original simulation logs, metric-export scripts, and response-letter tables, and have standardized the manuscript and response letter accordingly.

First, we have double-checked our raw experimental data and the supplementary table provided in our previous response letter. We confirm that the correct global packet loss for MAPPO in the hotspot scenario is indeed **5.88%**. The "0.88%" reported in the text of the previous manuscript was a typographical error. We have corrected this value in the revised manuscript (Section IV-B).

Second, we have explicitly distinguished between the per-satellite Poisson arrival rate $\lambda_i$ and the gateway traffic injection rate $\lambda$. Specifically, each ground gateway independently generates Poisson traffic at a configurable rate $\lambda$, which is then randomly injected into its visible satellites. From the perspective of each satellite node $i$, the aggregated traffic arrival rate stemming from both neighbor forwarding and gateway injections is denoted as $\lambda_i$, yielding the per-node Poisson arrival process $N_a^i(t) \sim \mathrm{Poisson}(\lambda_i \tau)$.

Third, we clarified the statistical unit of the signaling overhead. The reported $32.4$ kbits value is now explicitly identified as the aggregate constellation-level overhead per slot, and the bandwidth-consumption ratio is computed using the corresponding available ISL capacity.

Finally, we clarified that ISL spatial utilization measures the fraction of available links that forward at least one packet, rather than channel-capacity saturation. All numerical values, units, and metric definitions have been reviewed and standardized throughout the revised manuscript.

##### Action Taken:

- **Experimental Data:** Corrected the aforementioned typo and ensured all textual data perfectly matches the empirical results in Section IV-B.

- **Traffic-Rate Scope:** We distinguished the Poisson process arrival rate $\lambda_i$ received by each satellite itself and the network inbound traffic rate $\lambda$. We provided clear definitions in Section II-A and made a statement in Section IV-B.

- **Statistical Units:** We clarified the statistical unit of the signaling overhead that is now explicitly identified as the aggregate constellation-level overhead per slot.



#### Reviewer Point P 2.3

>The description of the CTDE architecture is not fully consistent with the phase division in Algorithm 1. The text states that MH sampling is performed on-board, whereas Algorithm 1 still groups it with centralized training in Phase II.

##### Reply:

We sincerely thank the reviewer for catching this structural inconsistency. You are absolutely correct.

As accurately described in the text of our manuscript, the Metropolis-Hastings (MH) sampling is an integral part of the decentralized execution and is independently performed on-board by individual LEO satellites. Its placement under "Phase II" in Algorithm 1 was a structural typographical error during the pseudocode formatting. We greatly appreciate your meticulousness, which has helped us eliminate this misleading flaw and align the pseudocode with our CTDE architecture.

##### Action Taken:

1. We have structurally updated **Algorithm 1** to ensure absolute consistency with the text. We moved the steps for computing the local average field and executing the asynchronous MH sampling to the end of **Phase I: Execution phase**.
2. We have explicitly renamed Phase II to **"Phase II: Centralized Training phase"** to prevent any further ambiguity.
3. All these structural corrections in Algorithm 1 have been highlighted in blue in the revised manuscript.



#### Reviewer Point P 2.4

>The added distance-based correlation analysis strengthens the manuscript, but the applicability of the theoretical conclusions under time-varying coupling, learned parameters, and delayed states remains unclear. Please briefly clarify the assumptions or moderate the claim of “mathematical guarantee”.

##### Reply:

We sincerely thank the reviewer for this profound and rigorous comment. Your observation perfectly captures the gap between idealized statistical mechanics theory and practical, dynamic LEO environments.

We completely agree that the classical Ising model yields strict mathematical guarantees only under stationary conditions and instantaneous updates. In our IHR framework, the couplings $J_{ij}$ are time-varying due to orbital mobility, the representations are dynamically learned via neural networks, and the state exchanges are subject to transmission and propagation delays. Therefore, claiming an absolute "mathematical guarantee" in such a heuristic, non-equilibrium system was indeed an overstatement.

The theoretical conclusions of Glauber dynamics hold approximately only under the assumptions that the network topology remains quasi-static during the short routing update interval, and that propagation delays are sufficiently bounded to be treated as acceptable thermal noise. In practical implementations, the observed macroscopic alignment should be rigorously interpreted as an empirically supported collaborative bias rather than an unconditional mathematical guarantee. We deeply appreciate your guidance in helping us clarify these theoretical boundaries.

##### Action Taken:

1. In **Section III-C**, we explicitly addressed the practical challenges by adding: "practical LEO networks involve time-varying couplings, learned neural parameters, and delayed states."
2. We moderated the claim and clarified the necessary assumptions in the same section: "This correlated field acts as an empirical heuristic collaborative bias that aligns multi-hop routing policies, assuming a quasi-static topology during short intervals and bounded delays."
3. We also conducted a thorough final check of the manuscript (**Section IV-B**) to replace other absolute terms (e.g., changing "guarantees" to "facilitates", and "optimal" to "lowest"). All corresponding modifications are highlighted in blue.

