import React from "react";
import { render, screen } from "@testing-library/react";
import StatsDigest from "../StatsDigest";

const mockVideos = [
  {
    id: "1",
    title: "Video A",
    channelTitle: "Channel A",
    description: "",
    publishedAt: new Date().toISOString(),
    viewCount: 1_000_000,
    thumbnails: {
      url: "",
      width: 480,
      height: 270
    },
    categoryId: "24"
  },
  {
    id: "2",
    title: "Video B",
    channelTitle: "Channel B",
    description: "",
    publishedAt: new Date().toISOString(),
    viewCount: 500_000,
    thumbnails: {
      url: "",
      width: 480,
      height: 270
    },
    categoryId: "24"
  }
];

describe("StatsDigest", () => {
  it("displays aggregate stats", () => {
    render(<StatsDigest videos={mockVideos} />);
    expect(screen.getByText(/Aggregate Views/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Views/i)).toBeInTheDocument();
    expect(screen.getAllByText(/views/i).length).toBeGreaterThan(0);
  });

  it("renders placeholder when empty", () => {
    render(<StatsDigest videos={[]} />);
    expect(
      screen.getByText(/Run the agent to populate the dashboard/i)
    ).toBeInTheDocument();
  });
});
