import React, { useEffect } from "react";

const Stars: React.FC = () => {
  useEffect(() => {
    const starsContainer = document.getElementById("stars");
    if (!starsContainer) return;

    const numberOfStars = 150;
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      const size = Math.random() * 2 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.animationDelay = Math.random() * 3 + "s";
      starsContainer.appendChild(star);
    }
  }, []);

  return <div className="stars" id="stars"></div>;
};

export default Stars;
