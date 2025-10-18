"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading, Paragraph, Text } from "./core/Typography";
import { GridContainer, GridRow, GridColumn } from "./core/Grid";
import { ThemeControls } from "./core/ThemeWrapper";
import * as Icons from "./core/icons";
import Link from "next/link";

export default function HomePage() {
  return (
    <GridContainer maxWidth="large" padding={true}>
      <div className="space-y-8 py-8">
        {/* Hero Section */}
        <div className="alexika-hero text-center space-y-6">
          <Heading 
            level={1} 
            gradient={true} 
            weight={800}
            className="flex items-center justify-center gap-3 alexika-gradient-text"
          >
            <Icons.Palette className="h-12 w-12 text-primary" />
            ALEXIKA AI
          </Heading>
          <Paragraph variant="body-xl" color="secondary" align="center" className="max-w-3xl mx-auto leading-relaxed">
            Experience the future of web development with our comprehensive design system. 
            Advanced component architecture, intelligent theme management, and seamless 
            shadcn/ui integration for unparalleled developer experience.
          </Paragraph>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button asChild>
              <Link href="/core/color">
                <Icons.Palette className="h-4 w-4 mr-2" />
                Color System
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/core/typography">
                <Icons.FileText className="h-4 w-4 mr-2" />
                Typography
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/core/icons">
                <Icons.Grid3x3 className="h-4 w-4 mr-2" />
                Icons
              </Link>
            </Button>
          </div>
        </div>

        {/* Theme Controls Section */}
        <div className="flex justify-center">
          <div className="alexika-theme-controls">
            <ThemeControls />
          </div>
        </div>

        {/* Features Grid */}
        <GridRow columns={12} gap={1.5} autoLayout={true}>
          <GridColumn className="flex">
            <Card className="w-full alexika-feature-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Palette className="h-5 w-5 text-primary" />
                  Color System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="body-sm" color="secondary" className="mb-4">
                  Comprehensive color tokens with automatic light/dark theme support and custom theme generation.
                </Text>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/core/color">
                    Explore Colors
                    <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </GridColumn>

          <GridColumn className="flex">
            <Card className="w-full alexika-feature-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.FileText className="h-5 w-5 text-primary" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="body-sm" color="secondary" className="mb-4">
                  Responsive typography system with multiple variants, weights, and special effects like gradients.
                </Text>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/core/typography">
                    View Typography
                    <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </GridColumn>

          <GridColumn className="flex">
            <Card className="w-full alexika-feature-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Grid3x3 className="h-5 w-5 text-primary" />
                  Icon Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="body-sm" color="secondary" className="mb-4">
                  200+ carefully curated Lucide React icons with consistent rounded styling and size controls.
                </Text>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/core/icons">
                    Browse Icons
                    <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </GridColumn>
        </GridRow>

        {/* Technical Features */}
        <Card className="alexika-card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Zap className="h-5 w-5 text-primary" />
              Technical Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GridRow columns={12} gap={2} autoLayout={true}>
              <GridColumn>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">shadcn/ui component integration</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Next.js 15 with Turbopack</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">TypeScript with strict mode</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Tailwind CSS v4</Text>
                  </div>
                </div>
              </GridColumn>
              <GridColumn>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Automated theme switching</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Custom color palette generation</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Copy-to-clipboard functionality</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Responsive grid system</Text>
                  </div>
                </div>
              </GridColumn>
            </GridRow>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="alexika-status-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Icons.CheckCircle className="h-5 w-5 text-success" />
              <Text variant="body-md" weight={600} className="text-success">
                All systems operational - shadcn/ui migration completed successfully!
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </GridContainer>
  );
}