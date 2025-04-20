-> hub

// Declare external functions with fallbacks
EXTERNAL hasEquipment(slot, itemName)
=== function hasEquipment(slot, itemName) ===
    ~ return false

EXTERNAL checkSkill(skillName)
=== function checkSkill(skillName) ===
    ~ return 0

EXTERNAL getAbilityScore(ability)
=== function getAbilityScore(ability) ===
    ~ return 0

EXTERNAL getEquipmentName(slot)
=== function getEquipmentName(slot) ===
    ~ return "None"

// === Start of main story content ===
VAR player_name = ""
VAR current_location = "the_bench"
VAR has_visited_trading_post = false
VAR has_visited_mission_board = false




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
You review your gear carefully...

~ temp hasSuit = hasEquipment("suit", "any")
~ temp suitName = getEquipmentName("suit")
{not hasSuit:
    SUIT: Empty
- else:
    SUIT: {suitName}
}

~ temp hasHeadgear = hasEquipment("headgear", "any")
~ temp headgearName = getEquipmentName("headgear")
{not hasHeadgear:
    No headgear equipped.
- else:
    HEADGEAR: {headgearName}
}

~ temp hasAccessory = hasEquipment("accessory", "any")
~ temp accessoryName = getEquipmentName("accessory")
{not hasAccessory:
    No accessories equipped.
- else:
    ACCESSORY: {accessoryName}
}

~ temp hasBackpack = hasEquipment("backpack", "any")
~ temp backpackName = getEquipmentName("backpack")
{not hasBackpack:
    No backpack equipped.
- else:
    BACKPACK: {backpackName}
}

~ temp hasGraphic = hasEquipment("graphic", "any")
~ temp graphicName = getEquipmentName("graphic")
{not hasGraphic:
    No graphic equipped.
- else:
    GRAPHIC: {graphicName}
}

+ [Return to Hub]
    -> hub

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