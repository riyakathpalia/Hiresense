import React from 'react';
import { useRouter } from 'next/navigation'; 
import { Container, Typography, Box } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import CustomButton from '@/components/atoms/button/CustomButton';

const CallToAction = () => {
  const router = useRouter();

  return (
    <Box sx={{ py: 8, px: 2, bgcolor: 'DodgerBlue.main', color: 'BlackPearl.main', textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          Ready to Transform Your Hiring Process?
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
          Start managing your CVs intelligently and find the perfect candidates faster with our AI-powered platform.
        </Typography>
        <CustomButton
          variant="primary"
          size="large"
          color='white'
          endIcon={<ChevronRight />}
          onClick={() => router.push('/upload')}
          sx={{
            backgroundColor:"BlackPearl.main",
            color:"white"
          }}
        >
          Get Started Now
        </CustomButton>
      </Container>
    </Box>
  );
};

export default CallToAction;