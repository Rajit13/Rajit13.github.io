# Star Charts 101: graph methodology and reviewer notes

This is an educational adaptation of [Dr. Yuan-Sen Ting’s Astro-ph Knowledge Graph Dashboard](https://tingyuansen.github.io/astro-ph_knowledge_graph_dashboard/). It uses the dashboard’s bidirectional reference-neighbourhood idea, strongest-neighbour union, logarithmic frequency sizing, and ForceAtlas2 layout. It does **not** reproduce the original paper corpus or its LLM concept extraction.

## Version and boundaries

Book snapshot: [`9abc854146accfbed5027a488569e1eb1b6254e4`](https://github.com/Rajit13/Star-Maps-101-and-Practices/tree/9abc854146accfbed5027a488569e1eb1b6254e4), dated 2026-09-16 for this graph release. `graph-data.json` records the exact source blob hashes and text SHA-256. PDF and source evidence links are pinned to that commit. The pre-existing book contents bar still reads the live book; its presentation and Sources links are unchanged. Rebuilding the graph is deliberate, not an unannounced change of denominator.

The current inventory contains **129 units: 34 teaching/worked-example sections and 95 Section 6 question units**. Nested question subparts remain attached to their root question. Worked exercises outside Section 6 remain grouped within their teaching/example sections. Therefore 95 is a count of our Section 6 extraction units, not a claim that the whole book has exactly 95 exercises.

Unnumbered sections are included. Commented-out LaTeX is excluded, including the inactive limiting-magnitude section. General observation instructions, marking advice, a promotional link and the humorous coconut-water item are excluded from the question inventory. IOAA 2016 prose planetarium questions, IOAA 2018 prose questions, and IOAA 2022 O5/O6/O8/O9 are included. The INAO 2018 reference resolves to the labelled exercise text rather than an arbitrary surrounding text window.

## Concept assignment and evidence

`vocabulary.json` and the explicit additions in `build-data.py` define the book vocabulary. Normalized phrase matches create **binary candidate assignments**: a unit either contains a matching phrase or does not. Shared question context is included and displayed. No TF-IDF confidence score, fallback top-three assignment, or minimum relationship score is used.

This release has **47 active concepts**, from **51 vocabulary entries**. Four exam-relevant entries have no detected book evidence. Seven of the 95 practice units have no automatic match; they remain selectable. A missing lexical match does not establish absence from every equation or image. A present match does not establish adequate teaching or necessity for solving the question. Reviewers can inspect the matched phrases, excerpts, exact source lines and PDF.

An explicit disambiguation prevents the lunar crater **Kepler** from being treated as instruction in Kepler’s period–axis law. Generic planetary **shadow** mentions are not evidence for ring reconstruction. Further semantic annotation remains open to author review; this release does not claim a complete expert-validated ontology.

## Reference-neighbourhood calculation

For each document d, S(d) contains d itself plus its distinct resolved textual cross-reference targets. Figures and tables are not represented as separate semantic documents, so references to their labels are excluded from this calculation; unresolved references do not create edges. Four directed inter-unit references resolve in this snapshot. This is a much sparser structure than the scientific citation corpus.

For a concept A appearing in fA documents:

    p(A → B) = (1/fA) Σ over documents d containing A:
                 [number of B-containing documents in S(d)] / |S(d)|
    w(A,B) = sqrt[p(A → B) × p(B → A)]

Every starting document contributes equally to its directional average. Neighbourhood members are counted once. The exact small-corpus calculation is performed without sampling in `relations.js`.

**Scale: 0 to 1.** A directional value of 0 means no B evidence in those neighbourhoods; 1 means every member of every relevant neighbourhood contains B. Symmetric strength reaches 1 only when both directions reach 1. A one-way citation alone need not create a symmetric relationship. The geometric mean can be zero even if one direction is positive.

This is an association measure, **not Pearson correlation, statistical confidence, or percentage exam preparedness**. If no cross-references exist, it reduces to the Ochiai form C(A,B)/sqrt(fA fB), where C counts directly shared units.

Illustration: if four A documents have B fractions 1/2, 1, 0, 0, then p(A → B)=0.375. With p(B → A)=0.600, w=sqrt(0.375×0.600)=0.474. The edge panel shows actual per-document numerators/denominators and contributing source units, not only the final number.

## Every displayed quantity

| Quantity | Denominator / scale | Meaning and limit |
|---|---|---|
| Concept frequency | f out of 129 indexed units | Number of distinct units with phrase evidence; corpus occurrence, not mastery |
| Directional relationship | 0–1 | Average neighbourhood prevalence as defined above |
| Symmetric relationship | 0–1 | Geometric mean of two directional values; neither marks coverage nor confidence |
| Concept node area | π[30 + 130 ln(1+f)/ln(1+fmax)] graph units² | Logarithmic frequency encoding with a minimum readable size; fmax is displayed at runtime |
| Neighbour setting k | 3, 6, 10 or 20 nominations per node | Union of nominations is shown, so a node can receive more than k links |
| Displayed concept links | 196 of 738 positive pairs at k=6 | Sparsification of this snapshot, not a change in underlying strengths |
| Practice mapping | Binary, no numeric score | Candidate phrase evidence in a question or its context |
| Exam skill count | Matched listed skills / all editorially listed skills for that task | Vocabulary presence only; unequal skill difficulty and teaching depth are not measured |
| Exam inventory | 25 / 25 labelled scored subquestions | Inclusion of every OM/OT/OP subquestion, not adequate preparation for all of them |
| Additional-training / direct / transferable | Qualitative categories, no numeric scale | Editorial interpretation of the official question’s demands; not examiner approval |
| Prerequisite link | No score | Directional editorial explanation; excluded from calculated weights and physics |
| Position / distance | No calibrated unit of similarity | Qualitative force layout; inspect the edge strength for the defined numerical relationship |

## Layout and overlays

The browser bundles Graphology and `graphology-layout-forceatlas2` 0.10.1. Settings: LinLog attraction, outbound attraction distribution, edge weight influence 1, scaling ratio 2, gravity 0.5, slowdown 3, and exact pairwise repulsion for this small graph. Nodes start from a deterministic spiral, not domain anchors. Initial layout uses 450 iterations. Live physics runs in small batches; pause, reset, fit, zoom, drag and keyboard selection are supported.

Concept nodes alone constrain the base layout. Practice/exam nodes are placed around their associated concepts and do not exert forces on the book network. Changing k recomputes the layout; changing exam filters does not. Exam text and skill mappings are absent from the book calculation. Dashed prerequisite links do not affect positions or weights.

The 25 IOAA mappings are explicit editorial interpretations in `exam-data.json`, with a reason, required concepts, preparation category, further-practice note and official paper link for every task. Lensing-delay analysis, orbital period–size reasoning and ring reconstruction are explicitly identified as additional training rather than being concealed behind generic keyword matches.

## Rebuild and validation

From this directory, with Python 3 and Node installed:

    npm ci
    npm run build
    npm test

The Python builder downloads missing inputs from the pinned book commit and verifies their Git blob hashes. To use a new book version, update the pin, expected hashes and provenance together, review extraction changes, rebuild, and rerun tests. Edit exam interpretations in `make-exams.py`; edit graph/UI logic in `engine.js`. `graph-engine-v8.js` is the generated browser bundle.

Tests check the no-reference/Ochiai identity, directionality, duplicate-reference handling, parser regressions, all task identifiers, concept disambiguation and independence from exam mappings. Browser checks additionally exercised the unchanged Sources accordion, OM-specific evidence panels, unmatched practice nodes, neighbour/prerequisite controls, live physics and desktop/mobile rendering. Source-level checks verified unchanged header/footer markup, original CSS, and contents-rendering functions.

The former v5/v7 layers are no longer loaded. `graph.html` retains its existing header/footer and contents bootstrap and loads one graph engine. Historical engine files remain in the repository for traceability.

## References

- [Astro-ph Knowledge Graph Dashboard and its methodology](https://tingyuansen.github.io/astro-ph_knowledge_graph_dashboard/)
- [AstroMLab 5: Structured Summaries and Concept Extraction for 400,000 Astrophysics Papers](https://aclanthology.org/2025.wasp-main.19/) — related concept-extraction work; not a claim that our lexical extractor reproduces it.
- [Graphology ForceAtlas2 implementation](https://graphology.github.io/standard-library/layout-forceatlas2.html)
- [Official OM questions](https://ioaa2025.in/wp-content/uploads/2025/09/Observation-SkyMap-Questions.pdf)
- [Official OT questions](https://ioaa2025.in/wp-content/uploads/2025/09/Observation-Telescope-Questions.pdf)
- [Official OP questions](https://ioaa2025.in/wp-content/uploads/2025/09/Observation-Planetarium-Questions.pdf)
