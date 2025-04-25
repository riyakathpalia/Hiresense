import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  sx?: SxProps<Theme>;
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className ,sx}) => {
  return (
    <StyledCard className={className} elevation={2} sx={{backgroundColor:""}}>
      <CardContent>
        <div style={{ marginBottom: '16px' }}>{icon}</div>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default FeatureCard;