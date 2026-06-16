import { Metadata } from "next";
import { channelsMetadata } from "../../components/constants/channelsMetadata";
import { TvSetNavigator } from "../../components";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ channel: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { channel } = await params;
  const channelId = parseInt(channel, 10);

  if (isNaN(channelId)) {
    return {
      title: "Channel Not Found - TV Set",
      description: "This TV channel does not exist.",
    };
  }

  const channelData = channelsMetadata[channelId] || {
    name: `Channel ${channelId}`,
    title: `Channel ${channelId} - No Service`,
    description: `This channel ${channelId} has no service or is under construction.`,
  };

  return {
    title: `${channelData.title || channelData.name} - TV Set`,
    description: channelData.description,
    keywords: channelData.keywords || ["TV Set", "interactive", "portfolio"],
  };
}

export default async function ChannelPage({ params }: PageProps) {
  const { channel } = await params;
  const channelId = parseInt(channel, 10);

  if (isNaN(channelId)) {
    redirect("/0");
  }

  const channelData = channelsMetadata[channelId] || {
    name: `Channel ${channelId}`,
    title: `Channel ${channelId} - No Service`,
    description: `This channel ${channelId} has no service or is under construction.`,
  };

  return (
    <>
      {/* Pre-populated SEO/ATS semantic content */}
      <section
        className="sr-only"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <h1>{channelData.title || channelData.name}</h1>
        <p>{channelData.description}</p>
        {channelData.contentHtml && (
          <div dangerouslySetInnerHTML={{ __html: channelData.contentHtml }} />
        )}
      </section>

      {/* Interactive TvSetNavigator starting with this channel */}
      <TvSetNavigator initialChannel={channelId} />
    </>
  );
}
