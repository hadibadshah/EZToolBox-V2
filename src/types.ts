export interface VideoData {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  tags: string[];
  durationRaw: string;
  durationFormatted: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  category: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    standard: string;
    maxres: string;
  };
}

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  country: string;
  profileImage: string;
  bannerImage: string;
  viewCount: number;
  subscriberCount: number;
  videoCount: number;
  hiddenSubscriberCount: boolean;
  isMonetized?: boolean;
}

export interface FreeTool {
  name: string;
  description: string;
  icon: string;
  url: string;
  colorClass: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
