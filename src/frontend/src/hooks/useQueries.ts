import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Topic, TopicInput } from "../backend.d";
import { FALLBACK_CATEGORIES, FALLBACK_TOPICS } from "../data/fallbackData";
import { useActor } from "./useActor";

const SEED_KEY = "police_bharati_seeded";

export function useSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      const alreadySeeded = localStorage.getItem(SEED_KEY);
      if (alreadySeeded) return;
      await actor.seedSampleData();
      localStorage.setItem(SEED_KEY, "true");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return FALLBACK_CATEGORIES;
      try {
        const result = await actor.getAllCategories();
        return result.length > 0 ? result : FALLBACK_CATEGORIES;
      } catch {
        return FALLBACK_CATEGORIES;
      }
    },
    enabled: !isFetching,
    placeholderData: FALLBACK_CATEGORIES,
  });
}

export function useGetTopicsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Topic[]>({
    queryKey: ["topics", category],
    queryFn: async () => {
      if (!actor) return FALLBACK_TOPICS.filter((t) => t.category === category);
      try {
        const result = await actor.getTopicsByCategory(category);
        return result.length > 0
          ? result
          : FALLBACK_TOPICS.filter((t) => t.category === category);
      } catch {
        return FALLBACK_TOPICS.filter((t) => t.category === category);
      }
    },
    enabled: !!category && !isFetching,
    placeholderData: FALLBACK_TOPICS.filter((t) => t.category === category),
  });
}

export function useGetTopic(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Topic | null>({
    queryKey: ["topic", id?.toString()],
    queryFn: async () => {
      if (!id) return null;
      if (!actor) return FALLBACK_TOPICS.find((t) => t.id === id) ?? null;
      try {
        return await actor.getTopic(id);
      } catch {
        return FALLBACK_TOPICS.find((t) => t.id === id) ?? null;
      }
    },
    enabled: id !== null && !isFetching,
  });
}

export function useGetAllTopics() {
  const { actor, isFetching } = useActor();
  return useQuery<Topic[]>({
    queryKey: ["topics"],
    queryFn: async () => {
      if (!actor) return FALLBACK_TOPICS;
      try {
        const result = await actor.getAllTopics();
        return result.length > 0 ? result : FALLBACK_TOPICS;
      } catch {
        return FALLBACK_TOPICS;
      }
    },
    enabled: !isFetching,
    placeholderData: FALLBACK_TOPICS,
  });
}

export function useAddTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (topic: TopicInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTopic(topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
