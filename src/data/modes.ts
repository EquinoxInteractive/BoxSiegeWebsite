import { ShoppingBag, Swords, Trophy, Users } from "lucide-react";
import { CHARACTERS } from "./game";

export const MODES = [
  {
    id: "campaign", icon: Trophy, color: "#ff8a3a", title: "Campaign", tag: "Solo · 1 player",
    text: "Fight through 250 levels across 5 chapters and 10 worlds. Every level is a series of enemy waves; every world ends with a boss. Clear levels for stars, pick a perk after each win, and earn coins for the shop.",
    bullets: ["250 levels · 5 chapters · 50 bosses", "Perks, lives, combos and a 3-star rating", "Earn coins to spend in the shop"],
    art: [CHARACTERS[13], CHARACTERS[22], CHARACTERS[14]],
  },
  {
    id: "versus", icon: Swords, color: "#ff4040", title: "Versus", tag: "Local · 2–4 players",
    text: "The classic couch brawl. Everyone picks a fighter and a weapon, you choose the arena, and the first player to win enough rounds takes the match. No internet needed - one screen, one keyboard or a pile of controllers.",
    bullets: ["Free-for-all on 10 arenas (or Random)", "First to 1-5 round wins", "Every setting is adjustable before the match"],
    art: [CHARACTERS[0], CHARACTERS[4], CHARACTERS[8], CHARACTERS[12]],
  },
  {
    id: "teams", icon: Users, color: "#4fd8ff", title: "Team Battles", tag: "Versus · 3–4 players",
    text: "With 3 or 4 players you get the SELECT YOUR TEAMS screen. Slide your token into any of four team lanes: 1v1v1v1, 2v1v1, 2v2, 3v1... Bullets and knives never hurt teammates, and a bigger team gets a small handicap to keep things fair.",
    bullets: ["Four team lanes, up to 3 per team", "No friendly fire", "Automatic handicap for the larger team"],
    art: [CHARACTERS[1], CHARACTERS[5], CHARACTERS[9], CHARACTERS[13]],
  },
  {
    id: "shop", icon: ShoppingBag, color: "#be5aff", title: "Shop & Inventory", tag: "Cosmetics",
    text: "Spend campaign coins on 240 character skins, 30 weapon skins and 31 accessories. Equip them per character and per skin, preview them live, and show them off in Versus and Campaign.",
    bullets: ["Four rarities: Common → Legendary", "4 accessory slots: head, face, neck, back", "Saved separately from campaign progress"],
    art: [CHARACTERS[16], CHARACTERS[18], CHARACTERS[20]],
  },
] as const;
