import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  Grid, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Chip,
  Divider,
  CircularProgress,
  makeStyles 
} from '@material-ui/core';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Group as GroupIcon, 
  Person as PersonIcon, 
  ArrowBack as ArrowBackIcon, 
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon
} from '@material-ui/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import groupService from '../../services/groupService';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  stepper: {
    marginBottom: theme.spacing(4),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  formField: {
    marginBottom: theme.spacing(3),
  },
  membersList: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  memberEmail: {
    marginRight: theme.spacing(1),
  },
  memberChip: {
    margin: theme.spacing(0.5),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  summaryContent: {
    marginTop: theme.spacing(3),
  },
  summaryItem: {
    marginBottom: theme.spacing(2),
  },
  successIcon: {
    fontSize: 60,
    color: theme.palette.success.main,
    marginBottom: theme.spacing(2),
  },
  successContainer: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  buttonProgress: {
    marginLeft: theme.spacing(1),
  },
}));

// Validation schemas
const GroupDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must be less than 50 characters')
    .required('Group name is required'),
  description: Yup.string()
    .max(200, 'Description must be less than 200 characters'),
});

const AddMembersSchema = Yup.object().shape({
  memberEmail: Yup.string()
    .email('Invalid email address')
});

function CreateGroup() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    members: []
  });
  const [newMember, setNewMember] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = ['Group Details', 'Add Members', 'Review & Create'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGroupDetailsSubmit = (values) => {
    setGroupData(prev => ({
      ...prev,
      name: values.name,
      description: values.description
    }));
    handleNext();
  };

  const handleAddMember = () => {
    if (!newMember || !newMember.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return;
    }

    if (groupData.members.includes(newMember)) {
      return;
    }

    setGroupData(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
    setNewMember('');
  };

  const handleRemoveMember = (email) => {
    setGroupData(prev => ({
      ...prev,
      members: prev.members.filter(member => member !== email)
    }));
  };

  const handleCreateGroup = async () => {
    setIsSubmitting(true);
    
    try {
      // Create a group object to send to the API
      const newGroupData = {
        name: groupData.name,
        description: groupData.description,
        members: groupData.members
      };
      
      // Call the API to create the group
      const response = await groupService.createGroup(newGroupData);
      
      // If we have members, add them to the group
      if (groupData.members.length > 0) {
        await Promise.all(
          groupData.members.map(email => 
            groupService.addMember(response.data.id, { email })
          )
        );
      }
      
      handleNext();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    navigate('/groups');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Formik
            initialValues={{ 
              name: groupData.name, 
              description: groupData.description 
            }}
            validationSchema={GroupDetailsSchema}
            onSubmit={handleGroupDetailsSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  label="Group Name"
                  name="name"
                  variant="outlined"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  className={classes.formField}
                />
                
                <Field
                  as={TextField}
                  fullWidth
                  label="Description (Optional)"
                  name="description"
                  variant="outlined"
                  multiline
                  rows={4}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  className={classes.formField}
                />
                
                <div className={classes.buttonContainer}>
                  <Button 
                    onClick={() => navigate('/groups')}
                    startIcon={<ArrowBackIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Next
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        );
        
      case 1:
        return (
          <>
            <Formik
              initialValues={{ memberEmail: '' }}
              validationSchema={AddMembersSchema}
              onSubmit={(values, { resetForm }) => {
                if (values.memberEmail) {
                  setNewMember(values.memberEmail);
                  resetForm();
                }
              }}
            >
              {({ errors, touched, submitForm }) => (
                <Form>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Add Member by Email"
                        name="memberEmail"
                        variant="outlined"
                        error={touched.memberEmail && Boolean(errors.memberEmail)}
                        helperText={touched.memberEmail && errors.memberEmail}
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={handleAddMember}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
            
            <Divider className={classes.divider} />
            
            <Typography variant="h6" gutterBottom>
              Group Members ({groupData.members.length})
            </Typography>
            
            {groupData.members.length > 0 ? (
              <List className={classes.membersList}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="You (Creator)" 
                    secondary="your@email.com" 
                  />
                </ListItem>
                
                {groupData.members.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        {member.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`Member ${index + 1}`}
                      secondary={member} 
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleRemoveMember(member)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No additional members added yet. The group will only include you.
              </Typography>
            )}
            
            <div className={classes.buttonContainer}>
              <Button 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </div>
          </>
        );
        
      case 2:
        return (
          <div className={classes.summaryContent}>
            <Typography variant="h6" gutterBottom>
              Group Details
            </Typography>
            <Paper elevation={0} variant="outlined" className={classes.paper}>
              <Typography variant="subtitle1" className={classes.summaryItem}>
                <strong>Group Name:</strong> {groupData.name}
              </Typography>
              {groupData.description && (
                <Typography variant="subtitle1" className={classes.summaryItem}>
                  <strong>Description:</strong> {groupData.description}
                </Typography>
              )}
              <Typography variant="subtitle1">
                <strong>Total Members:</strong> {groupData.members.length + 1} (including you)
              </Typography>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            <Paper elevation={0} variant="outlined" className={classes.paper}>
              <Chip 
                avatar={<Avatar>Y</Avatar>}
                label="You (Creator)"
                className={classes.memberChip}
                color="primary"
              />
              {groupData.members.map((member, index) => (
                <Chip 
                  key={index}
                  avatar={<Avatar>{member.charAt(0).toUpperCase()}</Avatar>}
                  label={member}
                  className={classes.memberChip}
                />
              ))}
            </Paper>
            
            <div className={classes.buttonContainer}>
              <Button 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateGroup}
                disabled={isSubmitting}
                endIcon={isSubmitting ? null : <CheckIcon />}
              >
                Create Group
                {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className={classes.successContainer}>
            <CheckIcon className={classes.successIcon} />
            <Typography variant="h5" gutterBottom>
              Group Created Successfully!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
              Your new group "{groupData.name}" has been created. You can now start adding expenses.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
            >
              Go to My Groups
            </Button>
          </div>
        );
        
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Create New Group
      </Typography>
      
      <Paper className={classes.paper}>
        <Stepper 
          activeStep={activeStep} 
          className={classes.stepper}
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
      </Paper>
    </Container>
  );
}

export default CreateGroup;