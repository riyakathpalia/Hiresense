import React from "react";
import { Typography, Box, Container, Grid, Paper, Avatar, AvatarGroup } from "@mui/material";
import CustomButton from "@/components/atoms/button/CustomButton";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material";

const HeroSection: React.FC = () => {
  const router = useRouter();
  const theme = useTheme()

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
              <span style={{ color: "#3f51b5" }}>AI-Powered</span> CV Management &
              <Box component="span" sx={{ position: "relative", display: "inline-block" }}>
                <Box component="span" sx={{ position: "relative", zIndex: 10 }}> Shortlisting</Box>
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
              Upload multiple CVs, chat with AI to analyze them, and find the perfect candidates for your job openings with intelligent matching and categorization.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 3 }}>
              <CustomButton variant="primary" color="primary" size="large" onClick={() => router.push("/upload")} endIcon={<ChevronRight />}>
                Upload CVs
              </CustomButton>
              <CustomButton variant="outline" size="large" onClick={() => router.push("/dashboard")}>
                View Dashboard
              </CustomButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 4, color: "text.secondary" }}>
              <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              <AvatarGroup total={4} sx={{ width: 32, height: 32, fontSize: 14}}>
                {[...Array(4)].map((_, i) => (
                  <Avatar key={i} sx={{ bgcolor: "DodgerBlue.main", width: 32, height: 32, fontSize: 14 }}>
                    {String.fromCharCode(65 + i)}
                  </Avatar>
                ))}
                </AvatarGroup>
              </Box>
              <Typography variant="body2">Trusted by 1000+ hiring managers & recruiters</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Chat Repesentation */}
            <Paper 
              elevation={6} 
              sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    position: "relative", 
                    }}>
                      <Box sx={{mb:15}}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "DodgerBlue.main", mr: 2 }}>AI</Avatar>
                <Box>
                  <Typography variant="subtitle1">CV Magic Assistant</Typography>
                  <Typography variant="caption" color="textSecondary">Analyzing candidates...</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                {["I've analyzed 150 CVs for the Senior Developer position.",
                  "Top 15 candidates identified based on skills and experience.",
                  "Would you like to see the shortlist or search by specific criteria?"]
                .map((msg, idx) => (
                  <Box key={idx} sx={{ p: 1, bgcolor: "BlueMirage.main", borderRadius: 1, mb: 1 }}>
                    {msg}
                  </Box>
                ))}
              </Box>
              </Box>
              <Box sx={{ p: 1, bgcolor: "rgba(63, 81, 181, 0.1)", borderRadius: 1, position: "relative" }}>
                Show me the top 5 candidates with React and TypeScript experience
                <CustomButton variant="primary" size="small" sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}>
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
