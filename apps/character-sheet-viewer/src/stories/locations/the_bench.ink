VAR bench_reputation = 0
VAR has_talked_to_bartender = false

-> the_bench_start

=== the_bench_start ===
# location: the_bench
The familiar smell of recycled air and machine oil fills your nostrils (new story). The Bench bustles with activity as drifters from across the sector gather to trade, rest, and find work.
-> bench_choices

=== the_bench ===
# location: the_bench
-> bench_choices

=== bench_choices ===
+ [Talk to the Bartender]
    {has_talked_to_bartender:
        "Back again?" The bartender nods in recognition.
    - else:
        The bartender eyes you carefully. "New around here?"
        ~ has_talked_to_bartender = true
        ~ bench_reputation++
    }
    -> bench_choices

+ [Watch the Crowd]
    Various drifters mill about, some looking for work, others just passing time.
    ~ bench_reputation++
    -> bench_choices

+ [Check the Notice Board]
    Several handwritten notes and digital displays show various job postings.
    -> bench_choices

+ [Return to Main Hub]
    # transition_to_main
    You decide to head back to the main hub.
    -> END
