# App Directory

```txt
App Directory Structure:

└── app/
    ├── layout.tsx
    ├── layout.hooks.tsx
    ├── layout.stores.ts
    ├── layout.actions.ts
    ├── layout.types.ts
    ├── page.tsx
    ├── page.hooks.tsx
    ├── (auth)/
    │   ├── sign-in/
    │   │   └── page.tsx
    │   ├── sign-up/
    │   │   └── page.tsx
    │   ├── forgot-password/
    │   │   └── page.tsx
    │   └── reset-password/
    │       └── page.tsx
    ├── welcome/
    │   ├── page.tsx
    │   └── page.hooks.tsx
    ├── quizzes/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   └── create/
    │       ├── page.tsx
    │       └── page.hooks.tsx
    ├── characters/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   └── [characterId]/
    │       ├── page.tsx
    │       └── page.hooks.tsx
    ├── adventure/
    │   └── [characterId]/
    │       ├── page.tsx
    │       └── page.hooks.tsx
    ├── community/
    │   ├── page.tsx
    │   └── page.hooks.tsx
    ├── settings/
    │   ├── page.tsx
    │   └── page.hooks.tsx
    └── (admin)/
        └── admin/
            ├── page.tsx
            ├── page.hooks.tsx
            └── page.stores.ts

```

```txt
Route Map (Generated from App Structure):

├── /
├── /sign-in
├── /sign-up
├── /forgot-password
├── /reset-password
├── /welcome
├── /quizzes
    └── /quizzes/create
├── /characters
    └── /characters/[characterId]
├── /adventure/[characterId]
├── /community
├── /settings
└── /admin

```

## Feature and Function Map

### /app/layout.tsx
**Feature: Sign out user**
- Hook: `useSignOut` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `signOutAction` → `/app/layout.actions.ts`
- Type: `SignOutResult` → `/app/layout.types.ts`

**Feature: Toggle user profile menu**
- Hook: `useProfileMenu` → `/app/layout.hooks.tsx`
- Store: `useProfileMenuStore` → `/app/layout.stores.ts`
- Action: `toggleProfileMenuAction` → `/app/layout.actions.ts`
- Type: `ProfileMenuState` → `/app/layout.types.ts`

**Feature: Get community stats**
- Hook: `useCommunityStats` → `/app/layout.hooks.tsx`
- Store: `useCommunityStatsStore` → `/app/layout.stores.ts`
- Action: `getCommunityStatsAction` → `/app/layout.actions.ts`
- Type: `CommunityStats` → `/app/layout.types.ts`

**Feature: Get content queue metrics**
- Hook: `useQueueMetrics` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useQueueMetricsStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `getQueueMetricsAction` → `/app/layout.actions.ts`
- Type: `QueueMetrics` → `/app/layout.types.ts`

**Feature: Get moderation analytics**
- Hook: `useModerationAnalytics` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useModerationStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `getModerationAnalyticsAction` → `/app/layout.actions.ts`
- Type: `ModerationAnalytics` → `/app/layout.types.ts`

### /app/layout.hooks.tsx
- `useSignOut` (used by: `/app/layout.tsx` → Sign out user)
- `useProfileMenu` (used by: `/app/layout.tsx` → Toggle user profile menu)
- `useCommunityStats` (used by: `/app/layout.tsx` → Get community stats)

### /app/layout.stores.ts
- `useAuthStore` (used by: `/app/layout.tsx` → Sign out user)
- `useProfileMenuStore` (used by: `/app/layout.tsx` → Toggle user profile menu)
- `useCommunityStatsStore` (used by: `/app/layout.tsx` → Get community stats)

### /app/layout.actions.ts
- `signOutAction` (used by: `/app/layout.tsx` → Sign out user)
- `toggleProfileMenuAction` (used by: `/app/layout.tsx` → Toggle user profile menu)
- `getCommunityStatsAction` (used by: `/app/layout.tsx` → Get community stats)
- `getQueueMetricsAction` (used by: `/app/layout.tsx` → Get content queue metrics)
- `getModerationAnalyticsAction` (used by: `/app/layout.tsx` → Get moderation analytics)

### /app/layout.types.ts
- `SignOutResult` (used by: `/app/layout.tsx` → Sign out user)
- `ProfileMenuState` (used by: `/app/layout.tsx` → Toggle user profile menu)
- `CommunityStats` (used by: `/app/layout.tsx` → Get community stats)
- `QueueMetrics` (used by: `/app/layout.tsx` → Get content queue metrics)
- `ModerationAnalytics` (used by: `/app/layout.tsx` → Get moderation analytics)

### /app/page.tsx
**Feature: Get featured characters**
- Hook: `useFeaturedCharacters` → `/app/page.hooks.tsx`
- Store: `useFeaturedCharactersStore` → `/app/layout.stores.ts`
- Action: `getFeaturedCharactersAction` → `/app/layout.actions.ts`
- Type: `FeaturedCharacter` → `/app/layout.types.ts`

**Feature: Get popular quiz sets**
- Hook: `usePopularQuizSets` → `/app/page.hooks.tsx`
- Store: `useQuizSetsStore` → `/app/layout.stores.ts`
- Action: `getPopularQuizSetsAction` → `/app/layout.actions.ts`
- Type: `PopularQuizSet` → `/app/layout.types.ts`

**Feature: Get recent completions**
- Hook: `useRecentCompletions` → `/app/page.hooks.tsx`
- Store: `useCompletionsStore` → `/app/layout.stores.ts`
- Action: `getRecentCompletionsAction` → `/app/layout.actions.ts`
- Type: `RecentCompletion` → `/app/layout.types.ts`

### /app/page.hooks.tsx
- `useFeaturedCharacters` (used by: `/app/page.tsx` → Get featured characters)
- `usePopularQuizSets` (used by: `/app/page.tsx` → Get popular quiz sets)
- `useRecentCompletions` (used by: `/app/page.tsx` → Get recent completions)

### /app/(auth)/sign-in/page.tsx
**Feature: Sign in with email and password**
- Hook: `useSignIn` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `signInAction` → `/app/layout.actions.ts`
- Type: `SignInCredentials` → `/app/layout.types.ts`

### /app/(auth)/sign-up/page.tsx
**Feature: Create user account**
- Hook: `useSignUp` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `signUpAction` → `/app/layout.actions.ts`
- Type: `SignUpCredentials` → `/app/layout.types.ts`

### /app/(auth)/forgot-password/page.tsx
**Feature: Send password reset email**
- Hook: `usePasswordResetEmail` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `sendPasswordResetEmailAction` → `/app/layout.actions.ts`
- Type: `PasswordResetEmailInput` → `/app/layout.types.ts`

### /app/(auth)/reset-password/page.tsx
**Feature: Reset user password**
- Hook: `usePasswordReset` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `resetPasswordAction` → `/app/layout.actions.ts`
- Type: `PasswordResetInput` → `/app/layout.types.ts`

### /app/welcome/page.tsx
**Feature: Update user profile**
- Hook: `useUpdateProfile` → `/app/welcome/page.hooks.tsx`
- Store: `useProfileStore` → `/app/layout.stores.ts`
- Action: `updateProfileAction` → `/app/welcome/page.hooks.tsx`
- Type: `UpdateProfileInput` → `/app/layout.types.ts`

**Feature: Upload avatar image**
- Hook: `useAvatarUpload` → `/app/welcome/page.hooks.tsx`
- Store: `useAvatarStore` → `/app/layout.stores.ts`
- Action: `uploadAvatarAction` → `/app/welcome/page.hooks.tsx`
- Type: `AvatarUploadResult` → `/app/layout.types.ts`

**Feature: Set quiz preferences**
- Hook: `useQuizPreferences` → `/app/welcome/page.hooks.tsx`
- Store: `usePreferencesStore` → `/app/layout.stores.ts`
- Action: `setQuizPreferencesAction` → `/app/welcome/page.hooks.tsx`
- Type: `QuizPreferencesInput` → `/app/layout.types.ts`

### /app/welcome/page.hooks.tsx
- `useUpdateProfile` (used by: `/app/welcome/page.tsx` → Update user profile)
- `updateProfileAction` (used by: `/app/welcome/page.tsx` → Update user profile)
- `useAvatarUpload` (used by: `/app/welcome/page.tsx` → Upload avatar image)
- `uploadAvatarAction` (used by: `/app/welcome/page.tsx` → Upload avatar image)
- `useQuizPreferences` (used by: `/app/welcome/page.tsx` → Set quiz preferences)
- `setQuizPreferencesAction` (used by: `/app/welcome/page.tsx` → Set quiz preferences)

### /app/quizzes/page.tsx
**Feature: Get quiz sets**
- Hook: `useQuizSets` → `/app/quizzes/page.hooks.tsx`
- Store: `useQuizLibraryStore` → `/app/layout.stores.ts`
- Action: `getQuizSetsAction` → `/app/quizzes/page.hooks.tsx`
- Type: `QuizSetCollection` → `/app/layout.types.ts`

**Feature: Take quiz**
- Hook: `useQuizSession` → `/app/quizzes/page.hooks.tsx`
- Store: `useQuizSessionStore` → `/app/layout.stores.ts`
- Action: `startQuizSessionAction` → `/app/quizzes/page.hooks.tsx`
- Type: `QuizSessionState` → `/app/layout.types.ts`

**Feature: Edit quiz set**
- Hook: `useEditQuizSet` → `/app/quizzes/page.hooks.tsx`
- Store: `useQuizEditorStore` → `/app/layout.stores.ts`
- Action: `editQuizSetAction` → `/app/quizzes/page.hooks.tsx`
- Type: `EditQuizSetInput` → `/app/layout.types.ts`

**Feature: Get quiz analytics**
- Hook: `useQuizAnalytics` → `/app/quizzes/page.hooks.tsx`
- Store: `useAnalyticsStore` → `/app/layout.stores.ts`
- Action: `getQuizAnalyticsAction` → `/app/quizzes/page.hooks.tsx`
- Type: `QuizAnalyticsData` → `/app/layout.types.ts`

**Feature: Toggle quiz sharing**
- Hook: `useQuizSharing` → `/app/quizzes/page.hooks.tsx`
- Store: `useQuizSharingStore` → `/app/layout.stores.ts`
- Action: `toggleQuizSharingAction` → `/app/quizzes/page.hooks.tsx`
- Type: `QuizSharingState` → `/app/layout.types.ts`

**Feature: Delete quiz set**
- Hook: `useDeleteQuizSet` → `/app/quizzes/page.hooks.tsx`
- Store: `useQuizDeletionStore` → `/app/layout.stores.ts`
- Action: `deleteQuizSetAction` → `/app/quizzes/page.hooks.tsx`
- Type: `DeleteQuizSetResult` → `/app/layout.types.ts`

### /app/quizzes/page.hooks.tsx
- `useQuizSets` (used by: `/app/quizzes/page.tsx` → Get quiz sets)
- `getQuizSetsAction` (used by: `/app/quizzes/page.tsx` → Get quiz sets)
- `useQuizSession` (used by: `/app/quizzes/page.tsx` → Take quiz)
- `startQuizSessionAction` (used by: `/app/quizzes/page.tsx` → Take quiz)
- `useEditQuizSet` (used by: `/app/quizzes/page.tsx` → Edit quiz set)
- `editQuizSetAction` (used by: `/app/quizzes/page.tsx` → Edit quiz set)
- `useQuizAnalytics` (used by: `/app/quizzes/page.tsx` → Get quiz analytics)
- `getQuizAnalyticsAction` (used by: `/app/quizzes/page.tsx` → Get quiz analytics)
- `useQuizSharing` (used by: `/app/quizzes/page.tsx` → Toggle quiz sharing)
- `toggleQuizSharingAction` (used by: `/app/quizzes/page.tsx` → Toggle quiz sharing)
- `useDeleteQuizSet` (used by: `/app/quizzes/page.tsx` → Delete quiz set)
- `deleteQuizSetAction` (used by: `/app/quizzes/page.tsx` → Delete quiz set)

### /app/quizzes/create/page.tsx
**Feature: Upload quiz document**
- Hook: `useQuizDocumentUpload` → `/app/quizzes/create/page.hooks.tsx`
- Store: `useQuizDocumentStore` → `/app/quizzes/create/page.hooks.tsx`
- Action: `uploadQuizDocumentAction` → `/app/quizzes/create/page.hooks.tsx`
- Type: `QuizDocumentUpload` → `/app/quizzes/create/page.hooks.tsx`

**Feature: Generate AI quiz content**
- Hook: `useAIQuizGeneration` → `/app/quizzes/create/page.hooks.tsx`
- Store: `useAIQuizStore` → `/app/quizzes/create/page.hooks.tsx`
- Action: `generateAIQuizContentAction` → `/app/quizzes/create/page.hooks.tsx`
- Type: `AIGeneratedQuiz` → `/app/quizzes/create/page.hooks.tsx`

**Feature: Create quiz manually**
- Hook: `useManualQuizCreation` → `/app/quizzes/create/page.hooks.tsx`
- Store: `useManualQuizStore` → `/app/quizzes/create/page.hooks.tsx`
- Action: `createManualQuizAction` → `/app/quizzes/create/page.hooks.tsx`
- Type: `ManualQuizInput` → `/app/quizzes/create/page.hooks.tsx`

**Feature: Submit quiz for approval**
- Hook: `useQuizApprovalSubmission` → `/app/quizzes/create/page.hooks.tsx`
- Store: `useQuizApprovalStore` → `/app/quizzes/create/page.hooks.tsx`
- Action: `submitQuizForApprovalAction` → `/app/quizzes/create/page.hooks.tsx`
- Type: `QuizApprovalSubmission` → `/app/quizzes/create/page.hooks.tsx`

### /app/quizzes/create/page.hooks.tsx
- `useQuizDocumentUpload` (used by: `/app/quizzes/create/page.tsx` → Upload quiz document)
- `useQuizDocumentStore` (used by: `/app/quizzes/create/page.tsx` → Upload quiz document)
- `uploadQuizDocumentAction` (used by: `/app/quizzes/create/page.tsx` → Upload quiz document)
- `QuizDocumentUpload` (used by: `/app/quizzes/create/page.tsx` → Upload quiz document)
- `useAIQuizGeneration` (used by: `/app/quizzes/create/page.tsx` → Generate AI quiz content)
- `useAIQuizStore` (used by: `/app/quizzes/create/page.tsx` → Generate AI quiz content)
- `generateAIQuizContentAction` (used by: `/app/quizzes/create/page.tsx` → Generate AI quiz content)
- `AIGeneratedQuiz` (used by: `/app/quizzes/create/page.tsx` → Generate AI quiz content)
- `useManualQuizCreation` (used by: `/app/quizzes/create/page.tsx` → Create quiz manually)
- `useManualQuizStore` (used by: `/app/quizzes/create/page.tsx` → Create quiz manually)
- `createManualQuizAction` (used by: `/app/quizzes/create/page.tsx` → Create quiz manually)
- `ManualQuizInput` (used by: `/app/quizzes/create/page.tsx` → Create quiz manually)
- `useQuizApprovalSubmission` (used by: `/app/quizzes/create/page.tsx` → Submit quiz for approval)
- `useQuizApprovalStore` (used by: `/app/quizzes/create/page.tsx` → Submit quiz for approval)
- `submitQuizForApprovalAction` (used by: `/app/quizzes/create/page.tsx` → Submit quiz for approval)
- `QuizApprovalSubmission` (used by: `/app/quizzes/create/page.tsx` → Submit quiz for approval)

### /app/characters/page.tsx
**Feature: Get user characters**
- Hook: `useUserCharacters` → `/app/characters/page.hooks.tsx`
- Store: `useCharacterStore` → `/app/layout.stores.ts`
- Action: `getUserCharactersAction` → `/app/characters/page.hooks.tsx`
- Type: `UserCharacter` → `/app/layout.types.ts`

**Feature: Get character stats**
- Hook: `useCharacterStats` → `/app/characters/page.hooks.tsx`
- Store: `useCharacterStatsStore` → `/app/layout.stores.ts`
- Action: `getCharacterStatsAction` → `/app/characters/page.hooks.tsx`
- Type: `CharacterStats` → `/app/layout.types.ts`

**Feature: Get available quests**
- Hook: `useAvailableQuests` → `/app/characters/page.hooks.tsx`
- Store: `useQuestStore` → `/app/layout.stores.ts`
- Action: `getAvailableQuestsAction` → `/app/characters/page.hooks.tsx`
- Type: `AvailableQuest` → `/app/layout.types.ts`

**Feature: Customize character appearance**
- Hook: `useCharacterCustomization` → `/app/characters/page.hooks.tsx`
- Store: `useCharacterCustomizationStore` → `/app/characters/page.hooks.tsx`
- Action: `updateCharacterAppearanceAction` → `/app/characters/page.hooks.tsx`
- Type: `CharacterAppearanceData` → `/app/characters/page.hooks.tsx`

**Feature: Share character**
- Hook: `useShareCharacter` → `/app/characters/page.hooks.tsx`
- Store: `useCharacterSharingStore` → `/app/characters/page.hooks.tsx`
- Action: `generateCharacterShareLinkAction` → `/app/characters/page.hooks.tsx`
- Type: `CharacterShareData` → `/app/characters/page.hooks.tsx`

### /app/characters/page.hooks.tsx
- `useUserCharacters` (used by: `/app/characters/page.tsx` → Get user characters)
- `getUserCharactersAction` (used by: `/app/characters/page.tsx` → Get user characters)
- `useCharacterStats` (used by: `/app/characters/page.tsx` → Get character stats)
- `getCharacterStatsAction` (used by: `/app/characters/page.tsx` → Get character stats)
- `useAvailableQuests` (used by: `/app/characters/page.tsx` → Get available quests)
- `getAvailableQuestsAction` (used by: `/app/characters/page.tsx` → Get available quests)
- `useCharacterCustomization` (used by: `/app/characters/page.tsx` → Customize character appearance)
- `useCharacterCustomizationStore` (used by: `/app/characters/page.tsx` → Customize character appearance)
- `updateCharacterAppearanceAction` (used by: `/app/characters/page.tsx` → Customize character appearance)
- `CharacterAppearanceData` (used by: `/app/characters/page.tsx` → Customize character appearance)
- `useShareCharacter` (used by: `/app/characters/page.tsx` → Share character)
- `useCharacterSharingStore` (used by: `/app/characters/page.tsx` → Share character)
- `generateCharacterShareLinkAction` (used by: `/app/characters/page.tsx` → Share character)
- `CharacterShareData` (used by: `/app/characters/page.tsx` → Share character)

### /app/characters/[characterId]/page.tsx
**Feature: Get character details**
- Hook: `useCharacterDetails` → `/app/characters/[characterId]/page.hooks.tsx`
- Store: `useCharacterDetailsStore` → `/app/characters/[characterId]/page.hooks.tsx`
- Action: `getCharacterDetailsAction` → `/app/characters/[characterId]/page.hooks.tsx`
- Type: `CharacterDetails` → `/app/characters/[characterId]/page.hooks.tsx`

**Feature: Get achievement gallery**
- Hook: `useAchievementGallery` → `/app/characters/[characterId]/page.hooks.tsx`
- Store: `useAchievementStore` → `/app/layout.stores.ts`
- Action: `getAchievementGalleryAction` → `/app/characters/[characterId]/page.hooks.tsx`
- Type: `AchievementGallery` → `/app/layout.types.ts`

**Feature: Get inventory items**
- Hook: `useInventoryItems` → `/app/characters/[characterId]/page.hooks.tsx`
- Store: `useInventoryStore` → `/app/layout.stores.ts`
- Action: `getInventoryItemsAction` → `/app/characters/[characterId]/page.hooks.tsx`
- Type: `InventoryItem` → `/app/layout.types.ts`

**Feature: Vote on character**
- Hook: `useCharacterVoting` → `/app/characters/[characterId]/page.hooks.tsx`
- Store: `useVotingStore` → `/app/layout.stores.ts`
- Action: `submitCharacterVoteAction` → `/app/characters/[characterId]/page.hooks.tsx`
- Type: `CharacterVote` → `/app/layout.types.ts`

**Feature: Share character profile**
- Hook: `useCharacterProfileSharing` → `/app/characters/[characterId]/page.hooks.tsx`
- Store: `useProfileSharingStore` → `/app/layout.stores.ts`
- Action: `generateCharacterProfileLinkAction` → `/app/characters/[characterId]/page.hooks.tsx`
- Type: `CharacterProfileShare` → `/app/layout.types.ts`

### /app/characters/[characterId]/page.hooks.tsx
- `useCharacterDetails` (used by: `/app/characters/[characterId]/page.tsx` → Get character details)
- `useCharacterDetailsStore` (used by: `/app/characters/[characterId]/page.tsx` → Get character details)
- `getCharacterDetailsAction` (used by: `/app/characters/[characterId]/page.tsx` → Get character details)
- `CharacterDetails` (used by: `/app/characters/[characterId]/page.tsx` → Get character details)
- `useAchievementGallery` (used by: `/app/characters/[characterId]/page.tsx` → Get achievement gallery)
- `getAchievementGalleryAction` (used by: `/app/characters/[characterId]/page.tsx` → Get achievement gallery)
- `useInventoryItems` (used by: `/app/characters/[characterId]/page.tsx` → Get inventory items)
- `getInventoryItemsAction` (used by: `/app/characters/[characterId]/page.tsx` → Get inventory items)
- `useCharacterVoting` (used by: `/app/characters/[characterId]/page.tsx` → Vote on character)
- `submitCharacterVoteAction` (used by: `/app/characters/[characterId]/page.tsx` → Vote on character)
- `useCharacterProfileSharing` (used by: `/app/characters/[characterId]/page.tsx` → Share character profile)
- `generateCharacterProfileLinkAction` (used by: `/app/characters/[characterId]/page.tsx` → Share character profile)

### /app/adventure/[characterId]/page.tsx
**Feature: Get character stats**
- Hook: `useAdventureCharacterStats` → `/app/adventure/[characterId]/page.hooks.tsx`
- Store: `useAdventureStatsStore` → `/app/adventure/[characterId]/page.hooks.tsx`
- Action: `getAdventureCharacterStatsAction` → `/app/adventure/[characterId]/page.hooks.tsx`
- Type: `AdventureCharacterStats` → `/app/adventure/[characterId]/page.hooks.tsx`

**Feature: Generate story content**
- Hook: `useStoryGeneration` → `/app/adventure/[characterId]/page.hooks.tsx`
- Store: `useStoryContentStore` → `/app/adventure/[characterId]/page.hooks.tsx`
- Action: `generateStoryContentAction` → `/app/adventure/[characterId]/page.hooks.tsx`
- Type: `StoryContent` → `/app/adventure/[characterId]/page.hooks.tsx`

**Feature: Submit quiz answer**
- Hook: `useQuizSubmission` → `/app/adventure/[characterId]/page.hooks.tsx`
- Store: `useAdventureQuizStore` → `/app/adventure/[characterId]/page.hooks.tsx`
- Action: `submitAdventureAnswerAction` → `/app/adventure/[characterId]/page.hooks.tsx`
- Type: `AdventureQuizResponse` → `/app/adventure/[characterId]/page.hooks.tsx`

**Feature: Get progress status**
- Hook: `useAdventureProgress` → `/app/adventure/[characterId]/page.hooks.tsx`
- Store: `useProgressStore` → `/app/adventure/[characterId]/page.hooks.tsx`
- Action: `getAdventureProgressAction` → `/app/adventure/[characterId]/page.hooks.tsx`
- Type: `AdventureProgress` → `/app/adventure/[characterId]/page.hooks.tsx`

**Feature: Share adventure status**
- Hook: `useShareAdventure` → `/app/adventure/[characterId]/page.hooks.tsx`
- Store: `useAdventureSharingStore` → `/app/adventure/[characterId]/page.hooks.tsx`
- Action: `generateAdventureShareLinkAction` → `/app/adventure/[characterId]/page.hooks.tsx`
- Type: `AdventureShareData` → `/app/adventure/[characterId]/page.hooks.tsx`

### /app/adventure/[characterId]/page.hooks.tsx
- `useAdventureCharacterStats` (used by: `/app/adventure/[characterId]/page.tsx` → Get character stats)
- `useAdventureStatsStore` (used by: `/app/adventure/[characterId]/page.tsx` → Get character stats)
- `getAdventureCharacterStatsAction` (used by: `/app/adventure/[characterId]/page.tsx` → Get character stats)
- `AdventureCharacterStats` (used by: `/app/adventure/[characterId]/page.tsx` → Get character stats)
- `useStoryGeneration` (used by: `/app/adventure/[characterId]/page.tsx` → Generate story content)
- `useStoryContentStore` (used by: `/app/adventure/[characterId]/page.tsx` → Generate story content)
- `generateStoryContentAction` (used by: `/app/adventure/[characterId]/page.tsx` → Generate story content)
- `StoryContent` (used by: `/app/adventure/[characterId]/page.tsx` → Generate story content)
- `useQuizSubmission` (used by: `/app/adventure/[characterId]/page.tsx` → Submit quiz answer)
- `useAdventureQuizStore` (used by: `/app/adventure/[characterId]/page.tsx` → Submit quiz answer)
- `submitAdventureAnswerAction` (used by: `/app/adventure/[characterId]/page.tsx` → Submit quiz answer)
- `AdventureQuizResponse` (used by: `/app/adventure/[characterId]/page.tsx` → Submit quiz answer)
- `useAdventureProgress` (used by: `/app/adventure/[characterId]/page.tsx` → Get progress status)
- `useProgressStore` (used by: `/app/adventure/[characterId]/page.tsx` → Get progress status)
- `getAdventureProgressAction` (used by: `/app/adventure/[characterId]/page.tsx` → Get progress status)
- `AdventureProgress` (used by: `/app/adventure/[characterId]/page.tsx` → Get progress status)
- `useShareAdventure` (used by: `/app/adventure/[characterId]/page.tsx` → Share adventure status)
- `useAdventureSharingStore` (used by: `/app/adventure/[characterId]/page.tsx` → Share adventure status)
- `generateAdventureShareLinkAction` (used by: `/app/adventure/[characterId]/page.tsx` → Share adventure status)
- `AdventureShareData` (used by: `/app/adventure/[characterId]/page.tsx` → Share adventure status)

### /app/community/page.tsx
**Feature: Get trending content**
- Hook: `useTrendingContent` → `/app/community/page.hooks.tsx`
- Store: `useTrendingStore` → `/app/layout.stores.ts`
- Action: `getTrendingContentAction` → `/app/community/page.hooks.tsx`
- Type: `TrendingContent` → `/app/layout.types.ts`

**Feature: Get activity feed**
- Hook: `useActivityFeed` → `/app/community/page.hooks.tsx`
- Store: `useActivityStore` → `/app/layout.stores.ts`
- Action: `getActivityFeedAction` → `/app/community/page.hooks.tsx`
- Type: `ActivityFeed` → `/app/layout.types.ts`

**Feature: Get community statistics**
- Hook: `useCommunityMetrics` → `/app/community/page.hooks.tsx`
- Store: `useCommunityMetricsStore` → `/app/layout.stores.ts`
- Action: `getCommunityMetricsAction` → `/app/community/page.hooks.tsx`
- Type: `CommunityMetrics` → `/app/layout.types.ts`

**Feature: Get featured spotlight**
- Hook: `useFeaturedSpotlight` → `/app/community/page.hooks.tsx`
- Store: `useSpotlightStore` → `/app/layout.stores.ts`
- Action: `getFeaturedSpotlightAction` → `/app/community/page.hooks.tsx`
- Type: `FeaturedSpotlight` → `/app/layout.types.ts`

### /app/community/page.hooks.tsx
- `useTrendingContent` (used by: `/app/community/page.tsx` → Get trending content)
- `getTrendingContentAction` (used by: `/app/community/page.tsx` → Get trending content)
- `useActivityFeed` (used by: `/app/community/page.tsx` → Get activity feed)
- `getActivityFeedAction` (used by: `/app/community/page.tsx` → Get activity feed)
- `useCommunityMetrics` (used by: `/app/community/page.tsx` → Get community statistics)
- `getCommunityMetricsAction` (used by: `/app/community/page.tsx` → Get community statistics)
- `useFeaturedSpotlight` (used by: `/app/community/page.tsx` → Get featured spotlight)
- `getFeaturedSpotlightAction` (used by: `/app/community/page.tsx` → Get featured spotlight)

### /app/settings/page.tsx
**Feature: Update profile settings**
- Hook: `useProfileSettings` → `/app/settings/page.hooks.tsx`
- Store: `useSettingsStore` → `/app/layout.stores.ts`
- Action: `updateProfileSettingsAction` → `/app/settings/page.hooks.tsx`
- Type: `ProfileSettings` → `/app/layout.types.ts`

**Feature: Update quiz preferences**
- Hook: `useQuizSettings` → `/app/settings/page.hooks.tsx`
- Store: `useQuizSettingsStore` → `/app/layout.stores.ts`
- Action: `updateQuizSettingsAction` → `/app/settings/page.hooks.tsx`
- Type: `QuizSettings` → `/app/layout.types.ts`

**Feature: Update adventure preferences**
- Hook: `useAdventureSettings` → `/app/settings/page.hooks.tsx`
- Store: `useAdventureSettingsStore` → `/app/layout.stores.ts`
- Action: `updateAdventureSettingsAction` → `/app/settings/page.hooks.tsx`
- Type: `AdventureSettings` → `/app/layout.types.ts`

**Feature: Update privacy settings**
- Hook: `usePrivacySettings` → `/app/settings/page.hooks.tsx`
- Store: `usePrivacySettingsStore` → `/app/layout.stores.ts`
- Action: `updatePrivacySettingsAction` → `/app/settings/page.hooks.tsx`
- Type: `PrivacySettings` → `/app/layout.types.ts`

**Feature: Update notification settings**
- Hook: `useNotificationSettings` → `/app/settings/page.hooks.tsx`
- Store: `useNotificationSettingsStore` → `/app/settings/page.hooks.tsx`
- Action: `updateNotificationSettingsAction` → `/app/settings/page.hooks.tsx`
- Type: `NotificationSettings` → `/app/settings/page.hooks.tsx`

**Feature: Export user data**
- Hook: `useDataExport` → `/app/settings/page.hooks.tsx`
- Store: `useDataExportStore` → `/app/settings/page.hooks.tsx`
- Action: `exportUserDataAction` → `/app/settings/page.hooks.tsx`
- Type: `UserDataExport` → `/app/settings/page.hooks.tsx`

### /app/settings/page.hooks.tsx
- `useProfileSettings` (used by: `/app/settings/page.tsx` → Update profile settings)
- `updateProfileSettingsAction` (used by: `/app/settings/page.tsx` → Update profile settings)
- `useQuizSettings` (used by: `/app/settings/page.tsx` → Update quiz preferences)
- `updateQuizSettingsAction` (used by: `/app/settings/page.tsx` → Update quiz preferences)
- `useAdventureSettings` (used by: `/app/settings/page.tsx` → Update adventure preferences)
- `updateAdventureSettingsAction` (used by: `/app/settings/page.tsx` → Update adventure preferences)
- `usePrivacySettings` (used by: `/app/settings/page.tsx` → Update privacy settings)
- `updatePrivacySettingsAction` (used by: `/app/settings/page.tsx` → Update privacy settings)
- `useNotificationSettings` (used by: `/app/settings/page.tsx` → Update notification settings)
- `useNotificationSettingsStore` (used by: `/app/settings/page.tsx` → Update notification settings)
- `updateNotificationSettingsAction` (used by: `/app/settings/page.tsx` → Update notification settings)
- `NotificationSettings` (used by: `/app/settings/page.tsx` → Update notification settings)
- `useDataExport` (used by: `/app/settings/page.tsx` → Export user data)
- `useDataExportStore` (used by: `/app/settings/page.tsx` → Export user data)
- `exportUserDataAction` (used by: `/app/settings/page.tsx` → Export user data)
- `UserDataExport` (used by: `/app/settings/page.tsx` → Export user data)

### /app/(admin)/admin/page.tsx
**Feature: Get moderation queue**
- Hook: `useModerationQueue` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useModerationQueueStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `getModerationQueueAction` → `/app/(admin)/admin/page.hooks.tsx`
- Type: `ModerationQueueItem` → `/app/(admin)/admin/page.hooks.tsx`

**Feature: Get flagged content**
- Hook: `useFlaggedContent` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useFlaggedContentStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `getFlaggedContentAction` → `/app/(admin)/admin/page.hooks.tsx`
- Type: `FlaggedContent` → `/app/(admin)/admin/page.hooks.tsx`

**Feature: Get user reports**
- Hook: `useUserReports` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useUserReportsStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `getUserReportsAction` → `/app/(admin)/admin/page.hooks.tsx`
- Type: `UserReport` → `/app/(admin)/admin/page.hooks.tsx`

**Feature: Moderate content item**
- Hook: `useContentModeration` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useContentModerationStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `moderateContentAction` → `/app/(admin)/admin/page.hooks.tsx`
- Type: `ContentModerationAction` → `/app/(admin)/admin/page.hooks.tsx`

**Feature: Take user action**
- Hook: `useUserAction` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useUserActionStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `takeUserActionAction` → `/app/(admin)/admin/page.hooks.tsx`
- Type: `UserActionData` → `/app/(admin)/admin/page.hooks.tsx`

**Feature: Get audit log**
- Hook: `useAuditLog` → `/app/(admin)/admin/page.hooks.tsx`
- Store: `useAuditLogStore` → `/app/(admin)/admin/page.stores.ts`
- Action: `getAuditLogAction` → `/app/(admin)/admin/page.hooks.tsx`
- Type: `AuditLogEntry` → `/app/(admin)/admin/page.hooks.tsx`

### /app/(admin)/admin/page.hooks.tsx
- `useQueueMetrics` (used by: `/app/layout.tsx` → Get content queue metrics)
- `useModerationAnalytics` (used by: `/app/layout.tsx` → Get moderation analytics)
- `useModerationQueue` (used by: `/app/(admin)/admin/page.tsx` → Get moderation queue)
- `getModerationQueueAction` (used by: `/app/(admin)/admin/page.tsx` → Get moderation queue)
- `ModerationQueueItem` (used by: `/app/(admin)/admin/page.tsx` → Get moderation queue)
- `useFlaggedContent` (used by: `/app/(admin)/admin/page.tsx` → Get flagged content)
- `getFlaggedContentAction` (used by: `/app/(admin)/admin/page.tsx` → Get flagged content)
- `FlaggedContent` (used by: `/app/(admin)/admin/page.tsx` → Get flagged content)
- `useUserReports` (used by: `/app/(admin)/admin/page.tsx` → Get user reports)
- `getUserReportsAction` (used by: `/app/(admin)/admin/page.tsx` → Get user reports)
- `UserReport` (used by: `/app/(admin)/admin/page.tsx` → Get user reports)
- `useContentModeration` (used by: `/app/(admin)/admin/page.tsx` → Moderate content item)
- `moderateContentAction` (used by: `/app/(admin)/admin/page.tsx` → Moderate content item)
- `ContentModerationAction` (used by: `/app/(admin)/admin/page.tsx` → Moderate content item)
- `useUserAction` (used by: `/app/(admin)/admin/page.tsx` → Take user action)
- `takeUserActionAction` (used by: `/app/(admin)/admin/page.tsx` → Take user action)
- `UserActionData` (used by: `/app/(admin)/admin/page.tsx` → Take user action)
- `useAuditLog` (used by: `/app/(admin)/admin/page.tsx` → Get audit log)
- `getAuditLogAction` (used by: `/app/(admin)/admin/page.tsx` → Get audit log)
- `AuditLogEntry` (used by: `/app/(admin)/admin/page.tsx` → Get audit log)

### /app/(admin)/admin/page.stores.ts
- `useQueueMetricsStore` (used by: `/app/layout.tsx` → Get content queue metrics)
- `useModerationStore` (used by: `/app/layout.tsx` → Get moderation analytics)
- `useModerationQueueStore` (used by: `/app/(admin)/admin/page.tsx` → Get moderation queue)
- `useFlaggedContentStore` (used by: `/app/(admin)/admin/page.tsx` → Get flagged content)
- `useUserReportsStore` (used by: `/app/(admin)/admin/page.tsx` → Get user reports)
- `useContentModerationStore` (used by: `/app/(admin)/admin/page.tsx` → Moderate content item)
- `useUserActionStore` (used by: `/app/(admin)/admin/page.tsx` → Take user action)
- `useAuditLogStore` (used by: `/app/(admin)/admin/page.tsx` → Get audit log)

