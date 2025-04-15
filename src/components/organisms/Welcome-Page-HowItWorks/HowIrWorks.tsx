"use client";
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import CustomButton from '@/components/atoms/button/CustomButton';
import { ChevronRight } from '@mui/icons-material';
import { useRouter } from 'next/navigation'; 

const HowItWorks = () => {
    const router = useRouter();
  
  const steps = [
    { number: "1", title: "Upload CVs", description: "Upload multiple CVs in various formats or connect to your existing database." },
    { number: "2", title: "Add Job Descriptions", description: "Input your job requirements or upload JD documents." },
    { number: "3", title: "AI Analysis", description: "Our AI analyzes and categorizes CVs, mapping them to suitable job descriptions." },
    { number: "4", title: "Search & Filter", description: "Use advanced search to find the perfect candidates for your positions." },
  ];

  return (
    <Box id="how-it-works" sx={{ py: 8, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          How It Works
        </Typography>
        <Box sx={{ maxWidth: 600, mx: 'auto', position: 'relative' }}>
          <Box sx={{ ml: 4, borderLeft: 2, borderColor: 'DodgerBlue.main', pl: 4, py: 2 }}>
            {steps.map((step, index) => (
              <Box key={index} sx={{ position: 'relative', mb: 4 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -32,
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: 'DodgerBlue.main',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {step.number}
                </Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {step.title}
                </Typography>
                <Typography color="text.secondary">{step.description}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CustomButton
            variant="primary"
            size="large"
            endIcon={<ChevronRight />}
            onClick={() => router.push('/dashboard')}
          >
            Get Started
          </CustomButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
