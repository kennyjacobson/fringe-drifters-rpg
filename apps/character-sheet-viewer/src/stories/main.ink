VAR player_name = ""
VAR current_location = "the_bench"
VAR has_visited_trading_post = false
VAR has_visited_mission_board = false

-> hub

=== hub ===
# location: the_bench
{not has_visited_trading_post and not has_visited_mission_board: 
    Welcome to the Fringe, Drifter.
- else:
    Back at the central hub.
}

+ [Visit The Bench]
    # transition_to_bench
    You make your way to The Bench, the station's most popular gathering spot.
    -> END
+ [Check your equipment]
    -> check_equipment

=== check_equipment ===
# location: equipment
You review your gear.
// This will eventually integrate with our equipment system

+ [Return to Hub]
    Back to the central hub...
    -> hub_choices

=== hub_choices ===
+ [Visit The Bench]
    # transition_to_bench
    You make your way to The Bench, the station's most popular gathering spot.
    -> END
+ [Check your equipment]
    -> check_equipment

=== the_bench ===
# location: the_bench
The familiar smell of recycled air and machine oil fills your nostrils. The Bench bustles with activity as drifters from across the sector gather to trade, rest, and find work.

+ [Visit the Trading Post]
    -> trading_post
+ [Check Mission Board]
    -> mission_board
+ [Return to Hub]
    -> hub

=== trading_post ===
# location: trading_post
The Trading Post is a maze of makeshift stalls and permanent shops.

{has_visited_trading_post: 
    The merchants recognize you from your previous visit.
- else:
    This is your first time here. The merchants eye you with curiosity.
    ~ has_visited_trading_post = true
}

+ [Browse the stalls]
    -> browse_stalls
+ [Return to The Bench]
    -> the_bench

=== browse_stalls ===
# location: trading_post
You walk through the various stalls, each offering different wares.

+ [Return to Trading Post entrance]
    -> trading_post

=== mission_board ===
# location: mission_board
The Mission Board flickers with various job postings.

{has_visited_mission_board:
    Some of the postings have been updated since your last visit.
- else:
    You notice several new postings that weren't here before.
    ~ has_visited_mission_board = true
}

+ [Read the postings]
    -> read_postings
+ [Return to The Bench]
    -> the_bench

=== read_postings ===
# location: mission_board
You scan through the available missions.

+ [Return to Mission Board]
    -> mission_board