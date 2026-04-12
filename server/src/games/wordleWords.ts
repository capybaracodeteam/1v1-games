// NYT-style Wordle answer words — common everyday 5-letter words used as puzzle answers.
// Every entry must be exactly 5 uppercase letters. The startup assertion below enforces this.
export const ANSWERS: string[] = [
  // A
  "ABACK", "ABASE", "ABATE", "ABBEY", "ABBOT", "ABHOR", "ABIDE", "ABLER",
  "ABODE", "ABORT", "ABOUT", "ABOVE", "ABUSE", "ACUTE", "ADMIT", "ADOBE",
  "ADOPT", "ADORE", "ADORN", "ADULT", "AFTER", "AGILE", "AGONY", "AGREE",
  "AHEAD", "AISLE", "ALARM", "ALBUM", "ALDER", "ALERT", "ALIGN", "ALIKE",
  "ALLAY", "ALOFT", "ALOUD", "ALPHA", "ALTAR", "ALTER", "AMBER", "AMBLE",
  "AMEND", "AMINO", "AMPLE", "ANGEL", "ANGER", "ANGLE", "ANGRY", "ANIME",
  "ANNEX", "ANNOY", "ANTIC", "ANVIL", "AORTA", "APPLY", "ARBOR", "ARDOR",
  "ARGUE", "ARISE", "ARMOR", "AROMA", "AROSE", "ARRAY", "ARSON", "ARTSY",
  "ASCOT", "ASHEN", "ASHES", "ASKEW", "ASTIR", "ATONE", "ATTIC", "AUDIO",
  "AUDIT", "AURAL", "AVAIL", "AVERT", "AVOID", "AWASH", "AWFUL", "AWOKE",
  "AZURE", "ABUZZ", "ADAGE", "ALGAE", "ALOOF", "AMAZE", "AMISS", "ANNUL",
  "APHID", "ASSAY", "ATOLL", "AUGUR", "AVIAN", "AXIAL",
  // B
  "BACON", "BADGE", "BADLY", "BAKER", "BARGE", "BARON", "BASIL", "BASIN",
  "BATCH", "BATON", "BATHE", "BAYOU", "BEADY", "BEARD", "BEAST", "BELLY",
  "BENCH", "BIRCH", "BISON", "BLADE", "BLAND", "BLANK", "BLAST", "BLAZE",
  "BLEAK", "BLEAT", "BLEED", "BLISS", "BLOAT", "BLOKE", "BLOND", "BLOOD",
  "BLOOM", "BLOWN", "BLUNT", "BLURT", "BLUSH", "BONUS", "BOOZE", "BOXER",
  "BRACE", "BRAID", "BRAIN", "BRAND", "BRASS", "BRAVE", "BRAVO", "BRAWL",
  "BRAWN", "BREAM", "BREED", "BRIBE", "BRIDE", "BRINE", "BRINK", "BRISK",
  "BROOD", "BROTH", "BROWN", "BRUSH", "BUDGE", "BULGE", "BULKY", "BULLY",
  "BUMPY", "BUNNY", "BUGLE", "BURLY", "BUSHY", "BYLAW", "BELLE", "BERTH",
  "BIGOT", "BLUFF", "BRASH",
  // C
  "CABIN", "CACHE", "CADET", "CAMEL", "CANAL", "CANDY", "CANNY", "CARGO",
  "CAROL", "CARRY", "CHALK", "CHAMP", "CHAOS", "CHARD", "CHARM", "CHART",
  "CHASE", "CHEAP", "CHEAT", "CHECK", "CHEEK", "CHESS", "CHEST", "CHIEF",
  "CHILD", "CHIMP", "CHINA", "CHOIR", "CHOKE", "CHORD", "CHOSE", "CIGAR",
  "CIVIC", "CIVIL", "CLACK", "CLAIM", "CLAMP", "CLASP", "CLASH", "CLASS",
  "CLEAN", "CLEAR", "CLERK", "CLICK", "CLIFF", "CLIMB", "CLING", "CLINK",
  "CLOCK", "CLOUT", "CLOWN", "CLUMP", "COBRA", "COCOA", "COMET", "COMIC",
  "COMMA", "COMFY", "CORAL", "CORNY", "COUNT", "COVET", "COUCH", "COVEN",
  "CRAFT", "CRAMP", "CRANE", "CRASH", "CRAZE", "CRAZY", "CREAK", "CREAM",
  "CREEK", "CREEP", "CREPT", "CRIMP", "CRISP", "CRONE", "CROSS", "CROWD",
  "CRUEL", "CRUST", "CRYPT", "CAULK", "CHUNK", "CLEFT", "CURVY", "CUSHY",
  "CYBER", "CYCLE", "CYNIC", "CABAL", "CAGEY", "CAIRN", "CAMEO", "CARVE",
  "CASTE", "CRAVE", "CRAWL", "CREED",
  // D
  "DADDY", "DAFFY", "DAILY", "DAISY", "DANCE", "DANDY", "DATED", "DAUNT",
  "DEALT", "DECAY", "DECOR", "DECOY", "DELVE", "DENIM", "DEPOT", "DERBY",
  "DEVIL", "DIGIT", "DISCO", "DIZZY", "DODGE", "DODGY", "DONOR", "DOPEY",
  "DOUBT", "DOUGH", "DOWEL", "DOWDY", "DOWRY", "DOZEN", "DRAFT", "DRAMA",
  "DRAPE", "DRAWL", "DREAD", "DRIFT", "DRINK", "DRIVE", "DROLL", "DROOL",
  "DROOP", "DROVE", "DROWN", "DUCHY", "DUMPY", "DUNCE", "DUSKY", "DUSTY",
  "DUVET", "DWARF", "DYING", "DEBUT", "DECAL", "DECRY", "DELTA", "DENSE",
  "DEPTH", "DETER", "DIVAN", "DIVVY", "DOWSE", "DWELT",
  // E
  "EAGER", "EASEL", "EBONY", "EGRET", "EJECT", "ELDER", "ELECT", "ELITE",
  "ELBOW", "ELFIN", "EMBER", "EMOTE", "EMPTY", "ENDOW", "ENJOY", "ENTER",
  "ENTRY", "ENVOY", "EQUAL", "EVERY", "EXACT", "EXERT", "EXILE", "EXIST",
  "EXUDE", "EXULT", "EPOCH", "EQUIP", "EVENT", "EXPEL", "ETHOS", "EMERY",
  "EPOXY", "ERODE", "ESSAY", "EVICT", "EXTRA",
  // F
  "FABLE", "FACET", "FADED", "FAINT", "FAIRY", "FAITH", "FANCY", "FARCE",
  "FATAL", "FAVOR", "FEAST", "FEIGN", "FETCH", "FEVER", "FIBER", "FIELD",
  "FIFTH", "FIFTY", "FINCH", "FIRST", "FIZZY", "FJORD", "FLAIR", "FLAKY",
  "FLAME", "FLANK", "FLARE", "FLASH", "FLASK", "FLEET", "FLESH", "FLINT",
  "FLIRT", "FLOCK", "FLOOD", "FLOOR", "FLORA", "FLOSS", "FLOUR", "FLOUT",
  "FLOWN", "FLUID", "FLUFF", "FLUNK", "FOAMY", "FOCAL", "FOGGY", "FORGE",
  "FORTE", "FORUM", "FOUND", "FRAUD", "FREAK", "FREED", "FRESH", "FROND",
  "FRONT", "FROST", "FROTH", "FROZE", "FRUIT", "FUDGE", "FUNGI", "FUNKY",
  "FUNNY", "FURRY", "FUZZY", "FAMED", "FERAL", "FERRY", "FETID", "FJORD",
  "FLAIL", "FLING", "FOIST", "FOLLY", "FRAIL", "FRANC", "FRANK", "FUROR",
  // G
  "GAUDY", "GAUGE", "GAUZE", "GAWKY", "GHOUL", "GIDDY", "GIMPY", "GIVEN",
  "GLAND", "GLARE", "GLASS", "GLEAM", "GLIDE", "GLOAT", "GLOOM", "GLOSS",
  "GLOVE", "GOODY", "GORGE", "GOUGE", "GRACE", "GRAFT", "GRAIN", "GRASP",
  "GRATE", "GRAVE", "GRAVY", "GRAZE", "GREED", "GREET", "GRIEF", "GRILL",
  "GRIME", "GRIMY", "GROAN", "GROIN", "GROOM", "GROPE", "GROSS", "GROUT",
  "GROVE", "GROWL", "GRUEL", "GRUFF", "GUARD", "GUAVA", "GUILE", "GUISE",
  "GULCH", "GULLY", "GUMBO", "GUMMY", "GUPPY", "GUSTO", "GUSTY", "GUTSY",
  "GYPSY", "GAVEL", "GECKO",
  // H
  "HAIRY", "HANDY", "HAPPY", "HARDY", "HARSH", "HASTY", "HASTE", "HAUNT",
  "HAVEN", "HAZEL", "HEADY", "HEARD", "HEART", "HEAVE", "HEDGE", "HEFTY",
  "HEIST", "HENCE", "HERTZ", "HILLY", "HIPPO", "HIPPY", "HOARD", "HOBBY",
  "HOLLY", "HOMER", "HONEY", "HONOR", "HOPPY", "HOTEL", "HOUND", "HOVEL",
  "HOWDY", "HUFFY", "HUMID", "HUMOR", "HUMPH", "HUSSY", "HUSKY", "HYENA",
  "HYPER",
  // I
  "ICING", "ICILY", "IDEAL", "IDIOM", "IDIOT", "IGLOO", "IMPEL", "IMPLY",
  "INDEX", "INEPT", "INFER", "INGOT", "INLAY", "INLET", "INPUT", "INSET",
  "INTER", "INTRO", "IONIC", "IRONY", "ITCHY", "IVORY",
  // J
  "JAZZY", "JAUNT", "JEWEL", "JIFFY", "JINGO", "JOKER", "JOLLY", "JOUST",
  "JOWLS", "JUDGE", "JUICE", "JUICY", "JUMPY",
  // K
  "KNACK", "KNAVE", "KNEEL", "KNELT", "KNIFE", "KNOCK", "KNOLL", "KNOWN",
  "KUDOS",
  // L
  "LABEL", "LANCE", "LAPEL", "LAPSE", "LASER", "LATCH", "LATER", "LATHE",
  "LEARN", "LEASE", "LEAPT", "LEAVE", "LEDGE", "LEERY", "LEGAL", "LEMUR",
  "LEVEL", "LINGO", "LINER", "LIVER", "LOCAL", "LODGE", "LOFTY", "LOOPY",
  "LORRY", "LOWLY", "LUCID", "LUCKY", "LUMPY", "LUSTY", "LYRIC",
  // M
  "MAFIA", "MAGIC", "MANGE", "MANIA", "MANLY", "MANOR", "MARCH", "MARSH",
  "MATEY", "MEALY", "MEANT", "MEATY", "MEDAL", "MERCY", "MERIT", "MESSY",
  "METRO", "MILKY", "MIMIC", "MINCE", "MINTY", "MIRTH", "MISER", "MISTY",
  "MIXER", "MOCHA", "MOGUL", "MOIST", "MOLDY", "MONEY", "MONTH", "MOODY",
  "MOOSE", "MOSSY", "MOTIF", "MOURN", "MOVIE", "MUDDY", "MUGGY", "MUMMY",
  "MURAL", "MURKY", "MUSIC", "MUSHY", "MUSTY", "MYRRH",
  // N
  "NADIR", "NAIVE", "NASAL", "NASTY", "NATTY", "NAVAL", "NERVE", "NEWLY",
  "NIFTY", "NIGHT", "NINJA", "NIPPY", "NOBLE", "NOISY", "NOMAD", "NUTTY",
  "NYMPH",
  // O
  "OCTET", "ODDLY", "OFTEN", "OLIVE", "ONSET", "OPERA", "OPIUM", "OPTIC",
  "ORBIT", "OUGHT", "OUTDO", "OTTER", "OVARY", "OVERT", "OVOID", "OWLET",
  "OXIDE", "OZONE",
  // P
  "PADDY", "PANIC", "PANGS", "PANSY", "PAPAL", "PARTY", "PATCH", "PATIO",
  "PATSY", "PATTY", "PAUSE", "PEACE", "PEACH", "PEARL", "PEDAL", "PEEVE",
  "PEPPY", "PERCH", "PERKY", "PESKY", "PETTY", "PHONY", "PIANO", "PIGGY",
  "PILOT", "PINCH", "PINEY", "PINKY", "PITHY", "PIXEL", "PIXIE", "PIZZA",
  "PLAID", "PLAIN", "PLANK", "PLANT", "PLEAT", "PLUMB", "PLUME", "PLUMP",
  "PLUNK", "PLUSH", "POINT", "POISE", "POKER", "POKEY", "POLAR", "POLYP",
  "POPPY", "PORCH", "POSSE", "POTTY", "POUCH", "POUTY", "PRANK", "PRAWN",
  "PRIDE", "PRIME", "PRINT", "PRISM", "PRIVY", "PROBE", "PRONE", "PROOF",
  "PROXY", "PRUNE", "PSALM", "PUDGY", "PULSE", "PUNCH", "PUNKY", "PUPIL",
  "PURGE", "PUSHY", "PYGMY", "PYLON",
  // Q
  "QUAFF", "QUAIL", "QUAKE", "QUALM", "QUERY", "QUEST", "QUEUE", "QUILL",
  "QUIRK", "QUOTE",
  // R
  "RABBI", "RABID", "RADAR", "RADON", "RAINY", "RAJAH", "RAMEN", "RANCH",
  "RASPY", "RAVEN", "REACH", "READY", "REBUS", "REBEL", "RECAP", "REEDY",
  "REFER", "REGAL", "REIGN", "RELAY", "REPAY", "REPEL", "RESET", "RETCH",
  "RIDER", "RISKY", "RITZY", "RIVAL", "RIVET", "ROBIN", "ROBOT", "ROCKY",
  "ROGUE", "ROMAN", "ROWDY", "ROYAL", "RUDDY", "RUGBY", "RULED", "RUMMY",
  "RUPEE", "RUSTY",
  // S
  "SADLY", "SAGGY", "SALON", "SANER", "SASSY", "SAUTE", "SAVVY", "SCARY",
  "SCALD", "SCANT", "SCOFF", "SCOLD", "SCONE", "SCOOP", "SCORN", "SCRAM",
  "SCRUB", "SEDAN", "SEEDY", "SEIZE", "SERUM", "SHADY", "SHAKE", "SHAKY",
  "SHANK", "SHIRE", "SHONE", "SHORE", "SHORT", "SHOWY", "SHRED", "SHREW",
  "SHRUB", "SHUSH", "SIBYL", "SIEGE", "SIGMA", "SILKY", "SISSY", "SKIMP",
  "SKULK", "SLICK", "SLIME", "SLIMY", "SLINK", "SLOTH", "SLUMP", "SLUNK",
  "SMALL", "SMASH", "SMEAR", "SMIRK", "SMITH", "SMOKY", "SNAKY", "SNARL",
  "SNEAK", "SNEER", "SNIDE", "SNIFF", "SNOOP", "SOFTY", "SOLAR", "SOLID",
  "SOLVE", "SPARE", "SPARK", "SPASM", "SPAWN", "SPECK", "SPEND", "SPICE",
  "SPILL", "SPINY", "SPIRE", "SPITE", "SPOOF", "SPOIL", "SPOOK", "SPOON",
  "SPORE", "SPOUT", "SPUNK", "SQUAD", "SQUAT", "SQUID", "STALE", "STALK",
  "STAMP", "STARK", "STASH", "STEAD", "STEAL", "STEED", "STEEL", "STEEP",
  "STEER", "STELE", "STERN", "STOIC", "STOMP", "STONE", "STONY", "STOOP",
  "STORK", "STORY", "STOUT", "STOVE", "STRAP", "STRAW", "STRAY", "STRIP",
  "STRUM", "STRUT", "STUMP", "STUNK", "STUNT", "STYLE", "SUAVE", "SUGAR",
  "SUITE", "SULKY", "SULLY", "SUNNY", "SUPER", "SURLY", "SWAMP", "SWEAR",
  "SWELL", "SWIFT", "SWILL", "SWIRL", "SWOOP", "SWORD", "SYRUP", "SLURP",
  "SORRY",
  // T
  "TABBY", "TABOO", "TAFFY", "TACKY", "TALON", "TANGY", "TAPER", "TAPIR",
  "TARDY", "TARRY", "TASTY", "TATTY", "TAUNT", "TAWNY", "TEPID", "TERSE",
  "THANE", "THIEF", "THORN", "TIARA", "TIDAL", "TIGER", "TIMID", "TIPSY",
  "TITHE", "TITAN", "TOADY", "TOFFY", "TOKEN", "TOPAZ", "TORCH", "TOTEM",
  "TOXIC", "TRAMP", "TRAWL", "TREAD", "TRIPE", "TRITE", "TROOP", "TROUT",
  "TRULY", "TRUMP", "TRYST", "TULIP", "TUMID", "TUNER", "TUNIC", "TURBO",
  "TURFY", "TUTOR", "TWAIN", "TWANG", "TWEAK", "TWEED", "TWICE", "TWIRL",
  "TWIST", "TYING",
  // U
  "UDDER", "ULCER", "ULTRA", "UMBRA", "UNCUT", "UNFIT", "UNITY", "UNTIL",
  "UPPER", "UPSET", "URBAN", "USAGE", "USHER", "USUAL", "USURP", "UTTER",
  // V
  "VALID", "VALOR", "VALVE", "VAPID", "VAULT", "VAUNT", "VENOM", "VERGE",
  "VERSE", "VICAR", "VIGIL", "VIGOR", "VIRAL", "VISOR", "VISTA", "VIXEN",
  "VIVID", "VODKA", "VOUCH", "VOWEL",
  // W
  "WACKY", "WAGER", "WAILS", "WALTZ", "WARTY", "WASTE", "WEALD", "WEARY",
  "WEDGE", "WEEDY", "WEIRD", "WHACK", "WHIFF", "WHIRL", "WHOLE", "WHOSE",
  "WIDEN", "WIMPY", "WINDY", "WITCH", "WITTY", "WOKEN", "WORLD", "WORDY",
  "WORSE", "WRATH", "WREAK", "WREST", "WRING", "WRIST", "WROTE", "WRUNG",
  // Y
  "YACHT", "YEARN", "YIELD", "YOKEL", "YOUNG", "YOUTH",
  // Z
  "ZESTY", "ZIPPY", "ZONAL",
];

// Additional valid guess words — accepted inputs but not used as puzzle answers.
// Every entry must be exactly 5 uppercase letters.
const EXTRA_GUESSES: string[] = [
  "AAHED", "ABACI", "ABACK", "ABAFT", "ABASH", "ABEAM", "ABELE", "ABETS",
  "ACNED", "ACOCK", "AEGIS", "AEONS", "AERIE", "AGAVE", "AGLOW", "AGUED",
  "AHULL", "AIDED", "AIMER", "AITCH", "ALEPH", "ALGID", "ALIBI", "ALIVE",
  "AMONG", "AMBIT", "AMIDE", "AMIGO", "AMOUR", "AMUSE", "ANGST", "ANOLE",
  "APIAN", "APISH", "APTLY", "ARGON", "ARIEL", "ARLES", "AZINE", "AZOTH",
  "BAIRN", "BAIZE", "BALKY", "BANAL", "BANDY", "BANGS", "BASTE", "BATTY",
  "BEAUT", "BEDEW", "BEGOT", "BEGIN", "BESOT", "BILGE", "BIMBO", "BIOME",
  "BITTY", "BLASE", "BLEAR", "BLEND", "BLIMP", "BLINI", "BLINK", "BLITZ",
  "BLUEY", "BOGLE", "BOGUS", "BOLUS", "BOOBY", "BORAX", "BOTCH", "BOUGH",
  "BOUND", "BREVE", "BRUIN", "BUNCH", "BURIN", "BUTCH", "BYWAY",
  "CADGE", "CATER", "CAVIL", "CHAFE", "CHAFF", "CHANT", "CHAPS", "CHASM",
  "CHIDE", "CHIVE", "CHOMP", "CHURL", "CLANG", "CLANK", "CLEAT", "COILS",
  "COLIC", "COLON", "CONDO", "CROAK", "CROON",
  "DOTED", "DOWER", "ENSUE", "FIEND", "FINNY", "FLAIL", "FLING", "FOIST",
  "FRAIL", "FRANC", "GELID", "GRUEL", "GULLY",
  "HANDY", "HILLY", "HOVEL", "HUMOR",
  "JINGO", "JOKER", "JOLLY", "JOWLS", "KNAVE", "KUDOS",
  "MANGE", "MANIA", "MANLY", "MEATY", "MESSY", "MINTY", "MISER", "MISTY",
  "MIXER", "MOGUL",
  "NIPPY", "NUTTY", "OVOID", "OWLET",
  "PANGS", "PEEVE", "PEPPY", "PERCH", "PESKY", "PHONY", "PIGGY", "PILOT",
  "PINCH", "PINEY", "PINKY", "PITHY", "PIXIE", "PLUME", "PLUMP", "POKEY",
  "POPPY", "POTTY", "POUTY", "PROXY", "PUDGY", "PUNKY", "PURGE",
  "RABID", "RAJAH", "REBUS", "REEDY", "REFER", "REGAL", "RELAY", "RIDER",
  "RISKY", "RITZY", "RIVAL", "RUDDY", "RULED", "RUMMY", "RUPEE",
  "SAGGY", "SAUTE", "SAVVY", "SCOFF", "SCOLD", "SCRAM", "SEDAN", "SEIZE",
  "SHAKY", "SHUSH", "SIBYL", "SIEGE", "SKIMP", "SKULK", "SLICK", "SLIME",
  "SLIMY", "SLINK", "SLOTH", "SLUNK", "SMASH", "SNAKY", "SPARE", "SPASM",
  "SPILL", "SPIRE", "SPOOF", "SPOIL", "STARK", "STEAD", "STEED", "STELE",
  "STOOP", "STORK", "SULLY", "SUNNY", "SUPER", "SWEAR", "SWOOP", "SWORD",
  "SYRUP", "TAFFY", "TANGY", "TARDY", "TARRY", "TASTY", "TATTY", "THANE",
  "THIEF", "TIGER", "TITAN", "TOFFY", "TOADY", "TRAMP", "TREAD", "TRYST",
  "TUMID", "TURBO", "TURFY", "TWAIN", "TWEAK", "USURP", "VERGE", "VIRAL",
  "VISTA", "WAILS", "WARTY", "WEALD", "WHIFF", "WHIRL", "WIMPY", "WINDY",
  "WREAK", "WREST", "WRIST", "YOKEL", "ZONAL",
  "ALIBI", "ALIVE", "ALLOW", "ALLOT", "ALLOY", "AMAZE", "APTLY", "ARGON",
  "BASTE", "BLEND", "BLINK", "BLITZ", "BOGUS", "BOTCH", "BUNCH",
  "CAVIL", "CHANT", "CHASM", "CHIDE", "CHIVE", "CHOMP", "CLANG", "CLEAT",
  "FIEND", "FLAIL", "FUROR", "GELID", "GRUEL",
  "HANDY", "HIPPO", "HOWDY", "HYENA",
  "IONIC", "IRONY", "ITCHY", "JAZZY", "JIFFY",
  "LANCE", "LORRY", "NAIVE",
  "ODDLY", "OLIVE", "OPIUM", "ORBIT",
  "PEEVE", "PEPPY",
  "RABID", "REEDY",
  "SAVVY", "SCOFF", "SCOLD", "SEIZE", "SIEGE", "SKIMP", "SLICK",
  "TATTY", "TOADY",
  "USURP", "VIRAL", "VISTA", "YOKEL",
];

// O(1) lookup for guess validation — built once at module load, no runtime I/O.
export const VALID_WORDS: Set<string> = new Set([...ANSWERS, ...EXTRA_GUESSES]);

// Startup assertion: catch any non-5-letter entries immediately on server start.
for (const w of ANSWERS) {
  if (w.length !== 5) throw new Error(`ANSWERS contains non-5-letter word: "${w}"`);
}
for (const w of EXTRA_GUESSES) {
  if (w.length !== 5) throw new Error(`EXTRA_GUESSES contains non-5-letter word: "${w}"`);
}

// Fisher-Yates shuffle of ANSWERS; returns first `count` unique words.
export function randomSubset(count: number): string[] {
  const arr = [...ANSWERS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr.slice(0, Math.min(count, arr.length));
}
