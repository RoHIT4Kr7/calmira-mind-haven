import React from "react";
import MangaViewer from "./manga-viewer/MangaViewer";

const TestMangaViewer = () => {
  const testStoryData = [
    {
      id: "1",
      imageUrl: "https://via.placeholder.com/800x600/purple/white?text=Panel+1",
      narrationUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      backgroundMusicUrl: "",
      panelNumber: 1,
      ready: true,
    },
    {
      id: "2",
      imageUrl: "https://via.placeholder.com/800x600/blue/white?text=Panel+2",
      narrationUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      backgroundMusicUrl: "",
      panelNumber: 2,
      ready: true,
    },
  ];

  return (
    <div>
      <h1>Test MangaViewer</h1>
      <MangaViewer
        storyData={testStoryData}
        storyId="test-story"
        socket={null}
        onPanelUpdate={() => {}}
      />
    </div>
  );
};

export default TestMangaViewer;
