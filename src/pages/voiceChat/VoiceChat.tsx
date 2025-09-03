import React from "react";
import { useNavigate } from "react-router-dom";
import "./VoiceChat.css";

const VoiceChat: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="voice-chat-page">
      {/* Floating particles */}
      <div className="particles">
        <div className="particle" style={{ left: "10%", animationDuration: "18s" }} />
        <div className="particle" style={{ left: "25%", animationDuration: "22s" }} />
        <div className="particle" style={{ left: "40%", animationDuration: "20s" }} />
        <div className="particle" style={{ left: "55%", animationDuration: "26s" }} />
        <div className="particle" style={{ left: "70%", animationDuration: "24s" }} />
        <div className="particle" style={{ left: "85%", animationDuration: "19s" }} />
      </div>

      {/* Container */}
      <div className="voice-container">
        <div className="voice-agent-header">
          <div className="agent-wrapper">
            <img
              src="/images/voice-agent-logo.png"
              alt="AI Voice Agent"
              className="voice-agent-logo"
            />
            {/* mic emitter */}
            <div className="mic-emitter">
              <div className="wave w1"></div>
              <div className="wave w2"></div>
              <div className="wave w3"></div>
            </div>
          </div>
          <span className="voice-agent-text">AI Voice Agent</span>
        </div>

        <button className="end-call-btn" onClick={() => navigate(-1)}>
          END CALL
        </button>
      </div>
    </div>
  );
};

export default VoiceChat;
