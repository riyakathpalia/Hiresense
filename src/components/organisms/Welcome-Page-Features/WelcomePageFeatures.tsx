"use client"

import { Box, Container, Grid, Typography } from "@mui/material";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import { FileText, Search, Users, BarChart4 } from "lucide-react";

export const WelcomePageFeatures = () => {
    const features = [
        {
          icon: <FileText style={{ fontSize: 40, color: "#1976d2" }} />, // MUI primary color
          title: "Multi-source CV & JD Ingestion",
          description:
            "Upload CVs in various formats including PDF, DOCX, CSV, or connect to databases for seamless data integration.",
        },
        {
          icon: <Search style={{ fontSize: 40, color: "#1976d2" }} />, // MUI primary color
          title: "Dependable Shortlisting",
          description:
            "AI-powered shortlisting from large pools of CVs matched against multiple Job Descriptions with high accuracy.",
        },
        {
          icon: <Users style={{ fontSize: 40, color: "#1976d2" }} />, // MUI primary color
          title: "Resume Summarization",
          description:
            "Automatically extract and highlight key information including skills, education, and experience from resumes.",
        },
        {
          icon: <BarChart4 style={{ fontSize: 40, color: "#1976d2" }} />, // MUI primary color
          title: "Advanced Search & Filters",
          description:
            "Intelligent keyword suggestions and advanced filtering options to find the perfect candidates faster.",
        },
      ];

  return (
    <Box component="section" id="features" 
    sx={{
        backgroundColor: "BlueMirage.main",
        width: "100%",
        py:5,
      }}>
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Powerful Features
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