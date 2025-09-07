/**
 * ALEXIKA AI - Home Page Component
 * 
 * The main landing page showcasing the ALEXIKA AI platform with:
 * - Hero headline with gradient typography effect
 * - Descriptive tagline using responsive typography system
 * - Centered layout optimized for all device sizes
 */

"use client";

import React from "react";
import Typography from "./core/Typography";

export default function Home() {
  return (
    <div>
      <Typography variant="display-xl" gradient align="center">
        ALEXIKA AI
      </Typography>
      <Typography variant="body-lg" color="secondary" align="center">
        The Next-Generation AI Platform
      </Typography>
    </div>
  );
}
