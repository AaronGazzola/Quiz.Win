"use client";

import {
  useCommunityStats,
  usePopularQuizSets,
  useFeaturedCharacters,
  useRecentCompletions,
} from "./layout.hooks";

export function useHomePageData() {
  const communityStats = useCommunityStats();
  const popularQuizSets = usePopularQuizSets(6);
  const featuredCharacters = useFeaturedCharacters(3);
  const recentCompletions = useRecentCompletions(5);

  return {
    communityStats,
    popularQuizSets,
    featuredCharacters,
    recentCompletions,
    isLoading:
      communityStats.isLoading ||
      popularQuizSets.isLoading ||
      featuredCharacters.isLoading ||
      recentCompletions.isLoading,
  };
}
