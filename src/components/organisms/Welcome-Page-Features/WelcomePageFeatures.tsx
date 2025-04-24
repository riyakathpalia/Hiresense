"use client"

import { Box, Container, Grid, Typography } from "@mui/material";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import { FileText, Stethoscope, Brain, FileSearch } from "lucide-react";

export const WelcomePageFeatures = () => {
  const features = [
    {
      icon: <FileText style={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Multi-Format Medical Document Upload",
      description:
        "Upload and parse medical reports, prescriptions, and lab results in PDF, DOCX, and image formats.",
    },
    {
      icon: <Stethoscope style={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Patient Case Summarization",
      description:
        "Automatically summarize medical history and highlight key clinical notes for rapid review.",
    },
    {
      icon: <Brain style={{ fontSize: 40, color: "#1976d2" }} />,
      title: "AI Diagnostic Insights",
      description:
        "Get intelligent suggestions and risk analysis based on patient symptoms, history, and uploaded documents.",
    },
    {
      icon: <FileSearch style={{ fontSize: 40, color: "#1976d2" }} />,
      title: "Smart Record Search",
      description:
        "Use filters and keywords to quickly retrieve relevant patient records and medical data.",
    },
  ];

  return (
    <Box
      component="section"
      id="features"
      sx={{
        backgroundColor: "BlueMirage.main", // Update if this color doesn't exist in your theme
        width: "100%",
        py: 5,
      }}
    >
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Key Features of MetProAi
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
