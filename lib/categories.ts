export type TrendCategory = {
  id: string;
  label: string;
  description: string;
};

export const TREND_CATEGORIES: TrendCategory[] = [
  {
    id: "0",
    label: "All",
    description: "Aggregated view across every YouTube category in India."
  },
  {
    id: "1",
    label: "Film & Animation",
    description: "Bollywood trailers, film commentary, celebrity channels."
  },
  {
    id: "2",
    label: "Autos & Vehicles",
    description: "Auto reviews, road trips, EV launches and more."
  },
  {
    id: "10",
    label: "Music",
    description: "Indian pop, filmi albums, indie releases, classical performances."
  },
  {
    id: "17",
    label: "Sports",
    description: "Cricket highlights, kabaddi, esports tournaments."
  },
  {
    id: "20",
    label: "Gaming",
    description: "BGMI, Free Fire, FIFA, and mobile gaming creators."
  },
  {
    id: "22",
    label: "People & Blogs",
    description: "Lifestyle, vlogs, creator interviews."
  },
  {
    id: "23",
    label: "Comedy",
    description: "Sketches, stand-up, meme culture in India."
  },
  {
    id: "24",
    label: "Entertainment",
    description: "Reality shows, TV moments, pop culture breakdowns."
  },
  {
    id: "25",
    label: "News & Politics",
    description: "Breaking news, explainers, political commentary, regional coverage."
  },
  {
    id: "26",
    label: "Howto & Style",
    description: "DIY, fashion, cooking, and productivity."
  },
  {
    id: "27",
    label: "Education",
    description: "Competitive exam prep, edtech, explainer channels."
  },
  {
    id: "28",
    label: "Science & Technology",
    description: "Tech news, reviews, space and innovation."
  },
  {
    id: "29",
    label: "Nonprofits & Activism",
    description: "NGO spotlights, social impact stories, activism campaigns."
  }
];
