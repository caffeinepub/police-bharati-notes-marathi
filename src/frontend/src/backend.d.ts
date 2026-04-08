import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Topic {
    id: bigint;
    title: string;
    content: string;
    subtopics: Array<string>;
    category: string;
}
export interface TopicInput {
    title: string;
    content: string;
    subtopics: Array<string>;
    category: string;
}
export interface backendInterface {
    addTopic(topic: TopicInput): Promise<bigint>;
    deleteTopic(id: bigint): Promise<void>;
    getAllCategories(): Promise<Array<string>>;
    getAllTopics(): Promise<Array<Topic>>;
    getTopic(id: bigint): Promise<Topic>;
    getTopicsByCategory(category: string): Promise<Array<Topic>>;
    seedSampleData(): Promise<void>;
    updateTopic(id: bigint, updatedTopic: TopicInput): Promise<void>;
}
