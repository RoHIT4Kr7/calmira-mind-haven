import React from "react";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  title: string;
  imageClass: string;
  targetUrl: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, imageClass, targetUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="game-card">
      <div className={`game-image ${imageClass}`} role="img" aria-label={`${title} preview`}>
        <div className="frame-content">
          <button
            className="view-details-btn"
            onClick={() => navigate(targetUrl)}
            aria-label={`Open ${title}`}
          >
            {title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
