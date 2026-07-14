import { getResourcesByTopic, Topic } from "@/lib/resources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { TopicFilter } from "@/components/resources/TopicFilter";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const topicParam = resolvedParams.topic;
  
  const currentTopic = (typeof topicParam === "string" ? topicParam : "All") as Topic | "All";
  const resources = getResourcesByTopic(currentTopic);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--ds-text)" }}>Resource Hub</h1>
        <p className="text-sm mb-6" style={{ color: "var(--ds-text-muted)" }}>
          Curated tutorials, courses, and practice platforms for Data Analysts.
        </p>
      </div>

      <TopicFilter />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-24" style={{ color: "var(--ds-text-muted)" }}>
          <p>No resources found for this topic.</p>
        </div>
      )}
    </div>
  );
}
