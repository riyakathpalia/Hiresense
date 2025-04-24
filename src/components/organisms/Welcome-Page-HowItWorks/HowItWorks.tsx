"use client";
import { Box, Container, Typography } from '@mui/material';
import CustomButton from '@/components/atoms/button/CustomButton';
import { ChevronRight } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const HowItWorks = () => {
  const router = useRouter();

  const steps = [
    { number: "1", title: "Upload Patient Data", description: "Upload medical reports, prescriptions, lab results, or connect your EMR system." },
    { number: "2", title: "Generate Case Summary", description: "MetProAi automatically summarizes medical history and key clinical notes." },
    { number: "3", title: "Ask Medical Queries", description: "Interact with the AI assistant for insights, explanations, or treatment suggestions." },
    { number: "4", title: "Track & Manage Sessions", description: "Review saved chats, manage patient cases, and maintain your medical workflow." },
  ];

  return (
    <Box id="how-it-works" sx={{ py: 8, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          How MetProAi Works
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
            onClick={() => router.push('/Dashboard')}
          >
            Get Started
          </CustomButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
