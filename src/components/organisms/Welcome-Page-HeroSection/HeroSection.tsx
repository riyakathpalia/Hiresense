import CustomButton from "@/components/atoms/button/CustomButton";
import { Avatar, AvatarGroup, Box, Container, Grid, Paper, Typography, useTheme } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const HeroSection: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box sx={{
      py: 10,
      px: 2,
      background: `linear-gradient(to top, ${theme.palette.BlueMirage.main}, transparent)`,
      overflow: "hidden"
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              <span style={{ color: "#3f51b5" }}>AI-Powered</span> Medical Documentation &
              <Box component="span" sx={{ position: "relative", display: "inline-block" }}>
                <Box component="span" sx={{ position: "relative", zIndex: 10 }}> Clinical Insights</Box>
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    left: 0,
                    width: "100%",
                    height: "6px",
                    backgroundColor: "rgba(63, 81, 181, 0.2)",
                    borderRadius: "4px",
                    zIndex: 0
                  }}
                />
              </Box>
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Upload medical documents, analyze patient data with AI, and get intelligent clinical insights to support your diagnostic workflow.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 3 }}>
              <CustomButton 
                variant="primary" 
                color="primary" 
                size="large" 
                onClick={() => router.push("/upload")} 
                endIcon={<ChevronRight />}
              >
                Upload Files
              </CustomButton>
              <CustomButton 
                variant="outline" 
                size="large" 
                onClick={() => router.push("/Dashboard")}
              >
                View Dashboard
              </CustomButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 4, color: "text.secondary" }}>
              <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                <AvatarGroup total={4} sx={{ width: 32, height: 32, fontSize: 14 }}>
                  {[...Array(4)].map((_, i) => (
                    <Avatar 
                      key={i} 
                      sx={{ 
                        bgcolor: "DodgerBlue.main", 
                        width: 32, 
                        height: 32, 
                        fontSize: 14 
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
              <Typography variant="body2">
                Trusted by 500+ healthcare providers and clinicians
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* AI Medical Assistant Representation */}
            <Paper 
              elevation={6} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                position: "relative",
                backgroundColor: theme.palette.background.paper
              }}
            >
              <Box sx={{ mb: 15 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "DodgerBlue.main", mr: 2 }}>AI</Avatar>
                  <Box>
                    <Typography variant="subtitle1">MetPro Clinical Assistant</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Analyzing patient data...
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  {[
                    "I've analyzed 25 patient records with similar symptoms.",
                    "Top 3 differential diagnoses identified based on lab results.",
                    "Would you like to review treatment options or search clinical guidelines?"
                  ].map((msg, idx) => (
                    <Box 
                      key={idx} 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: "rgba(63, 81, 181, 0.08)", 
                        borderRadius: 1, 
                        mb: 1.5,
                        borderLeft: `3px solid ${theme.palette.primary.main}`
                      }}
                    >
                      {msg}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: "rgba(63, 81, 181, 0.1)", 
                borderRadius: 1, 
                position: "relative" 
              }}>
                Show me the latest treatment guidelines for Type 2 Diabetes
                <CustomButton 
                  variant="primary" 
                  size="small" 
                  sx={{ 
                    position: "absolute", 
                    right: 8, 
                    top: "50%", 
                    transform: "translateY(-50%)" 
                  }}
                >
                  <ChevronRight />
                </CustomButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;