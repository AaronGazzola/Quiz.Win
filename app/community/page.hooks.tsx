"use client";

import {
  useCommunityStats,
  usePopularQuizSets,
  useFeaturedCharacters,
  useRecentCompletions,
} from "@/app/layout.hooks";

export function useCommunityData() {
  const communityStats = useCommunityStats();
  const popularQuizSets = usePopularQuizSets(12);
  const featuredCharacters = useFeaturedCharacters(6);
  const recentCompletions = useRecentCompletions(20);

  return {
    communityStats,
    popularQuizSets,
    featuredCharacters,
    recentCompletions,
  };
}
