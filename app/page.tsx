"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading, Paragraph, Text } from "./core/Typography";
import { Container, Grid, Stack, Flex, Box, Columns } from "./core/Grid";
import { ThemeControls } from "./core/ThemeWrapper";
import * as Icons from "./core/icons";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container size="lg" paddingX={4} paddingY={8}>
      <Stack direction="vertical" spacing={8}>
        {/* Hero Section */}
        <Box className="alexika-hero text-center">
          <Stack direction="vertical" spacing={6}>
            <Flex justifyContent="center" alignItems="center" gap={3}>
              <Icons.Palette className="h-12 w-12 text-primary" />
              <Heading
                level={1}
                gradient={true}
                weight={800}
                className="alexika-gradient-text"
              >
                ALEXIKA AI
              </Heading>
            </Flex>
            <Box maxWidth="768px" marginX="auto">
              <Paragraph variant="body-xl" color="secondary" align="center" className="leading-relaxed">
                Experience the future of web development with our comprehensive design system.
                Advanced component architecture, intelligent theme management, and seamless
                shadcn/ui integration for unparalleled developer experience.
              </Paragraph>
            </Box>

            {/* Quick Actions */}
            <Flex justifyContent="center" wrap="wrap" gap={4}>
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
            </Flex>
          </Stack>
        </Box>

        {/* Theme Controls Section */}
        <Flex justifyContent="center">
          <Box className="alexika-theme-controls">
            <ThemeControls />
          </Box>
        </Flex>

        {/* Features Grid */}
        <Columns count={3} minWidth="280px" gap={6}>
          <Card className="alexika-feature-card h-full">
            <CardHeader>
              <CardTitle>
                <Flex alignItems="center" gap={2}>
                  <Icons.Palette className="h-5 w-5 text-primary" />
                  <span>Color System</span>
                </Flex>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Stack direction="vertical" spacing={4}>
                <Text variant="body-sm" color="secondary">
                  Comprehensive color tokens with automatic light/dark theme support and custom theme generation.
                </Text>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/core/color">
                    Explore Colors
                    <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card className="alexika-feature-card h-full">
            <CardHeader>
              <CardTitle>
                <Flex alignItems="center" gap={2}>
                  <Icons.FileText className="h-5 w-5 text-primary" />
                  <span>Typography</span>
                </Flex>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Stack direction="vertical" spacing={4}>
                <Text variant="body-sm" color="secondary">
                  Responsive typography system with multiple variants, weights, and special effects like gradients.
                </Text>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/core/typography">
                    View Typography
                    <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card className="alexika-feature-card h-full">
            <CardHeader>
              <CardTitle>
                <Flex alignItems="center" gap={2}>
                  <Icons.Grid3x3 className="h-5 w-5 text-primary" />
                  <span>Icon Library</span>
                </Flex>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Stack direction="vertical" spacing={4}>
                <Text variant="body-sm" color="secondary">
                  200+ carefully curated Lucide React icons with consistent rounded styling and size controls.
                </Text>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/core/icons">
                    Browse Icons
                    <Icons.ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Columns>

        {/* Technical Features */}
        <Card className="alexika-card-enhanced">
          <CardHeader>
            <CardTitle>
              <Flex alignItems="center" gap={2}>
                <Icons.Zap className="h-5 w-5 text-primary" />
                <span>Technical Features</span>
              </Flex>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Grid columns={2} gap={8}>
              <Box>
                <Stack direction="vertical" spacing={3}>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">shadcn/ui component integration</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Next.js 15 with Turbopack</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">TypeScript with strict mode</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Tailwind CSS v4</Text>
                  </Flex>
                </Stack>
              </Box>
              <Box>
                <Stack direction="vertical" spacing={3}>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Automated theme switching</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Custom color palette generation</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Optimized Grid/Flex/Box components</Text>
                  </Flex>
                  <Flex alignItems="center" gap={2}>
                    <Icons.Check className="h-4 w-4 text-success" />
                    <Text variant="body-sm">Responsive layout system</Text>
                  </Flex>
                </Stack>
              </Box>
            </Grid>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="alexika-status-card">
          <CardContent>
            <Flex justifyContent="center" alignItems="center" gap={2} paddingY={2}>
              <Icons.CheckCircle className="h-5 w-5 text-success" />
              <Text variant="body-md" weight={600} className="text-success">
                All systems operational - Optimized Grid System active!
              </Text>
            </Flex>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}