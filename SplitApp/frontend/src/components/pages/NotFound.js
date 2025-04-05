import React from 'react';
import { Container, Typography, Button, Box } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to="/"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;