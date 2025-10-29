export const NORMALIZED_TAGS = [
    "Cumpleaños ",
    "Deporte",
    "Concierto",
    "Casual",
    "Social",
    "Fiesta",
    "Otro"
] as const

export type NormalizedTag = (typeof NORMALIZED_TAGS)[number]
