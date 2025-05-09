import React from 'react';
import { useRouter } from 'next/navigation'; 
import { Container, Typography, Box } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import CustomButton from '@/components/atoms/button/CustomButton';

const CallToAction = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        bgcolor: 'DodgerBlue.main',
        color: 'BlackPearl.main',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          Ready to Revolutionize Your Clinical Workflow?
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
          Let MetProAI assist you in managing medical data, analyzing reports, and providing fast, intelligent insights.
        </Typography>
        <CustomButton
          variant="primary"
          size="large"
          color="white"
          endIcon={<ChevronRight />}
          onClick={() => router.push('/upload')}
          sx={{
            backgroundColor: "BlackPearl.main",
            color: "white"
          }}
        >
          Get Started Now
        </CustomButton>
      </Container>
    </Box>
  );
};

export default CallToAction;
