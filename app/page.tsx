"use client";

import React from "react";
import Typography from "./core/Typography";

export default function Home() {
  return (
    <div
      style={{
        padding: "clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 3rem)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Typography variant="display-xl" gradient align="center">
        VEDIKA AI
      </Typography>
      <Typography
        variant="body-xl"
        color="secondary"
        align="center"
        style={{ 
          maxWidth: "600px", 
          margin: "0 auto",
          marginBottom: "clamp(2rem, 4vw, 3rem)"
        }}
      >
        Welcome to the VEDIKA AI Web Portal - your gateway to intelligent automation
        and data insights.
      </Typography>
    </div>
  );
}
