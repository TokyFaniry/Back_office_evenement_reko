import React, { useState, useEffect } from "react";
import { Statistic, Row, Col, Typography } from "antd";
import moment from "moment";
import styled, { keyframes } from "styled-components";

const { Text } = Typography;

// Animation pour les particules flottantes
const floating = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

// Style des particules
const ParticleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const Particle = styled.div`
  position: absolute;
  background: linear-gradient(45deg, #ff6b6b, #ff8787);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: ${floating} 8s linear infinite;
  opacity: 0;
  filter: blur(1px);

  &:nth-child(2n) {
    background: linear-gradient(45deg, #69db7c, #8ce99a);
  }

  &:nth-child(3n) {
    background: linear-gradient(45deg, #4dabf7, #74c0fc);
  }
`;

const Countdown = ({ targetDate, style }) => {
  const calculateTimeLeft = () => {
    const now = moment();
    const end = moment(targetDate);

    if (!end.isValid()) return { isValid: false };

    const totalSeconds = Math.max(0, end.diff(now, "seconds"));

    return {
      days: Math.floor(totalSeconds / (3600 * 24)),
      hours: Math.floor((totalSeconds % (3600 * 24)) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isValid: totalSeconds > 0,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate || !moment(targetDate).isValid()) {
    return (
      <div style={{ textAlign: "center", ...style }}>
        <Text style={{ color: "#333" }}>Date invalide</Text>
      </div>
    );
  }

  if (!timeLeft.isValid) {
    return (
      <div style={{ textAlign: "center", ...style }}>
        <Text style={{ fontSize: "1.2rem", color: "#333" }}>
          🎉 L'événement a commencé !
        </Text>
      </div>
    );
  }

  // Génération des particules aléatoires
  const generateParticles = () =>
    Array.from({ length: 15 }, (_, i) => (
      <Particle
        key={i}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 5}s`,
        }}
      />
    ));

  // Styles modernes
  const containerStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "16px",
    padding: "32px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    ...style,
  };

  const timeBlockStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "20px",
    borderRadius: "16px",
    minWidth: "120px",
    textAlign: "center",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    zIndex: 1,
  };

  const valueStyle = {
    fontSize: "2.8rem",
    fontWeight: 700,
    lineHeight: 1.2,
    background: "linear-gradient(45deg, #2b2d42, #4a4e69)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const labelStyle = {
    color: "#4a4e69",
    fontSize: "0.95rem",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginTop: "12px",
    fontWeight: 600,
  };

  const colonStyle = {
    fontSize: "2.5rem",
    color: "#4a4e69",
    transform: "translateY(8px)",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={containerStyle}>
      <ParticleContainer>{generateParticles()}</ParticleContainer>

      <Row justify="center" gutter={[24, 24]}>
        {Object.entries(timeLeft).map(([key, value], index) => {
          if (key === "isValid") return null;

          return (
            <React.Fragment key={key}>
              <Col>
                <div
                  style={timeBlockStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Statistic
                    value={value.toString().padStart(2, "0")}
                    valueStyle={valueStyle}
                  />
                  <Text style={labelStyle}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </div>
              </Col>
              {index < 3 && (
                <Col style={{ display: "flex", alignItems: "center" }}>
                  <Text style={colonStyle}>:</Text>
                </Col>
              )}
            </React.Fragment>
          );
        })}
      </Row>
    </div>
  );
};

export default React.memo(Countdown);
