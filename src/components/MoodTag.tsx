import { cn } from "@/lib/utils";

type MoodType = "Angry" | "Fear" | "Joy" | "Interest" | "Neutrality" | "Cat-X5dd-Cat-cat-Happy-Sad-Angry-Surprised";

const moodColors: Record<MoodType, string> = {
  "Angry": "bg-red-100 text-red-800",
  "Fear": "bg-purple-100 text-purple-800",
  "Joy": "bg-yellow-100 text-yellow-800",
  "Interest": "bg-blue-100 text-blue-800",
  "Neutrality": "bg-gray-100 text-gray-800",
  "Cat-X5dd-Cat-cat-Happy-Sad-Angry-Surprised": "bg-gray-100 text-gray-800",
};

export function MoodTag({ mood }: { mood: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      moodColors[mood as MoodType] || "bg-gray-100 text-gray-800"
    )}>
      {mood}
      </span>
  );
}

