"use client";
import React from 'react';
import DashboardLayout from './dashboard/layout'; // Ensure this path is correct
import { Box, Container, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, Button } from '@mui/material';

const HomePageContent = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to MetProAi
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Your AI assistant for medical analysis and conversation
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#1E293B', color: '#CBD5E1', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="#94A3B8">
                Total Conversations
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="white">
                24
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#1E293B', color: '#CBD5E1', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="#94A3B8">
                Documents Analyzed
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="white">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#1E293B', color: '#CBD5E1', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="div" color="#94A3B8">
                Average Response Time
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="white">
                1.2s
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4} gutterBottom color="white">
        Recent Conversations
      </Typography>
      <List sx={{ bgcolor: '#1E293B', borderRadius: 1 }}>
        <ListItem divider sx={{ py: 1.5, borderBottom: '1px solid #334155' }}>
          <ListItemText
            primary={<Typography color="white">Headache symptoms</Typography>}
            secondary={<Typography color="#94A3B8">12 messages • 30 mins ago</Typography>}
          />
          <Button variant="outlined" color="primary" size="small">
            Continue
          </Button>
        </ListItem>
        <ListItem divider sx={{ py: 1.5, borderBottom: '1px solid #334155' }}>
          <ListItemText
            primary={<Typography color="white">Medication review</Typography>}
            secondary={<Typography color="#94A3B8">5 messages • 2 hours ago</Typography>}
          />
          <Button variant="outlined" color="primary" size="small">
            Continue
          </Button>
        </ListItem>
        <ListItem sx={{ py: 1.5 }}>
          <ListItemText
            primary={<Typography color="white">MRI results analysis</Typography>}
            secondary={<Typography color="#94A3B8">8 messages • 2 days ago</Typography>}
          />
          <Button variant="outlined" color="primary" size="small">
            Continue
          </Button>
        </ListItem>
      </List>
    </Container>
  );
};

export default function Home() {
  return (
    <DashboardLayout>
      <HomePageContent />
    </DashboardLayout>
  );
}