import React from "react";
import "./beforeOnboarding.css";
import Stars from "./Stars";
import MusicToggle from "./MusicToggle";
import GameCard from "./GameCard";

const BeforeOnboarding: React.FC = () => {
  return (
    <div className="before-container">
      {/* Background Music Toggle */}
      <MusicToggle />

      {/* Star Field */}
      <Stars />

      <div className="container">
        <h5 className="title">WELCOME TO CALMIRA MIND HAVEN</h5>

        <div className="games-section">
          {/* Card 1 */}
          <GameCard
            title="Manga Creation"
            imageClass="sherlock-image"
            targetUrl="/mental-wellness"
          />

          {/* Card 2 */}
          <GameCard
            title="Voice AI Agent"
            imageClass="frame-crafters-image"
            targetUrl="/voice"
          />
        </div>
      </div>
    </div>
  );
};

export default BeforeOnboarding;
