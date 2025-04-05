import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  InputAdornment,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Avatar,
  makeStyles
} from '@material-ui/core';
import {
  AttachMoney,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Event as EventIcon
} from '@material-ui/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import expenseService from '../../services/expenseService';
import groupService from '../../services/groupService';

// Removing @material-ui/pickers import

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
  formControl: {
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  stepper: {
    marginBottom: theme.spacing(4),
  },
  radioGroup: {
    marginBottom: theme.spacing(2),
  },
  memberList: {
    marginTop: theme.spacing(2),
    maxHeight: 300,
    overflow: 'auto',
  },
  amountInput: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
    },
  },
  splitTypeContainer: {
    marginBottom: theme.spacing(3),
  },
  splitDetailsContainer: {
    marginTop: theme.spacing(3),
  },
  memberAvatar: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  memberItem: {
    padding: theme.spacing(1, 0),
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
  totalAmount: {
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: theme.spacing(1),
  },
  summaryItem: {
    marginBottom: theme.spacing(2),
  },
  summaryContent: {
    marginTop: theme.spacing(3),
  },
}));

// Validation schema for expense details
const ExpenseDetailsSchema = Yup.object().shape({
  description: Yup.string()
    .min(3, 'Description must be at least 3 characters')
    .max(50, 'Description must be less than 50 characters')
    .required('Description is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  groupId: Yup.string()
    .required('Group is required'),
  paidBy: Yup.string()
    .required('Payer is required'),
  expenseDate: Yup.date()
    .required('Date is required'),
});

function CreateExpense() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupIdFromUrl = queryParams.get('groupId');

  const [activeStep, setActiveStep] = useState(0);
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    groupId: groupIdFromUrl || '',
    paidBy: '',
    expenseDate: new Date(),
    splitType: 'equal',
    splits: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [customSplits, setCustomSplits] = useState([]);

  const steps = ['Expense Details', 'Split Options', 'Review & Create'];

  useEffect(() => {
    // Fetch groups and members for the selected group
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch groups from API
        const groupsResponse = await groupService.getGroups();
        setGroups(groupsResponse.data);

        // If we have a group ID from URL, fetch its members
        if (groupIdFromUrl) {
          await fetchMembers(groupIdFromUrl);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [groupIdFromUrl]);

  const fetchMembers = async (groupId) => {
    try {
      // Fetch group details to get members
      const groupResponse = await groupService.getGroup(groupId);
      
      if (groupResponse.data && groupResponse.data.members) {
        setMembers(groupResponse.data.members);

        // Initialize equal splits for all members
        const initialSplits = groupResponse.data.members.map(member => ({
          memberId: member.id,
          memberName: member.name,
          amount: 0
        }));
        
        setCustomSplits(initialSplits);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGroupChange = async (groupId) => {
    setExpenseData(prev => ({ ...prev, groupId }));
    await fetchMembers(groupId);
  };

  const handleExpenseDetailsSubmit = (values) => {
    setExpenseData(prev => ({
      ...prev,
      description: values.description,
      amount: values.amount,
      groupId: values.groupId,
      paidBy: values.paidBy,
      expenseDate: values.expenseDate
    }));

    // Calculate equal splits when moving to the next step
    if (expenseData.splitType === 'equal') {
      const equalAmount = values.amount / members.length;
      const equalSplits = members.map(member => ({
        memberId: member.id,
        memberName: member.name,
        amount: parseFloat(equalAmount.toFixed(2))
      }));
      setCustomSplits(equalSplits);
    }

    handleNext();
  };

  const handleSplitTypeChange = (event) => {
    const newSplitType = event.target.value;
    setExpenseData(prev => ({ ...prev, splitType: newSplitType }));

    if (newSplitType === 'equal') {
      const equalAmount = expenseData.amount / members.length;
      const equalSplits = members.map(member => ({
        memberId: member.id,
        memberName: member.name,
        amount: parseFloat(equalAmount.toFixed(2))
      }));
      setCustomSplits(equalSplits);
    }
  };

  const handleCustomSplitChange = (memberId, value) => {
    const newValue = value === '' ? 0 : parseFloat(value);
    setCustomSplits(prev =>
      prev.map(split =>
        split.memberId === memberId ? { ...split, amount: newValue } : split
      )
    );
  };

  const handleCreateExpense = async () => {
    setSubmitting(true);
    
    try {
      // Create expense data object to send to API
      const finalExpenseData = {
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        groupId: expenseData.groupId,
        paidById: expenseData.paidBy,
        date: expenseData.expenseDate.toISOString().split('T')[0],
        splits: customSplits.map(split => ({
          userId: split.memberId,
          amount: split.amount
        }))
      };
      
      // Call API to create expense
      const response = await expenseService.createExpense(finalExpenseData);
      
      handleNext();
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    navigate(`/groups/${expenseData.groupId}`);
  };

  const calculateTotalSplit = () => {
    return customSplits.reduce((sum, split) => sum + (split.amount || 0), 0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Formik
            initialValues={{
              description: expenseData.description,
              amount: expenseData.amount,
              groupId: expenseData.groupId,
              paidBy: expenseData.paidBy,
              expenseDate: expenseData.expenseDate
            }}
            validationSchema={ExpenseDetailsSchema}
            onSubmit={handleExpenseDetailsSubmit}
          >
            {({ errors, touched, values, handleChange, setFieldValue }) => (
              <Form>
                <Field
                  as={TextField}
                  name="description"
                  label="Expense Description"
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                
                <Field
                  as={TextField}
                  name="amount"
                  label="Amount"
                  type="number"
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                  error={touched.amount && Boolean(errors.amount)}
                  helperText={touched.amount && errors.amount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                    className: classes.amountInput
                  }}
                />
                
                <FormControl 
                  variant="outlined" 
                  className={classes.formControl}
                  error={touched.groupId && Boolean(errors.groupId)}
                >
                  <InputLabel id="group-select-label">Group</InputLabel>
                  <Select
                    labelId="group-select-label"
                    id="groupId"
                    name="groupId"
                    value={values.groupId}
                    onChange={(e) => {
                      handleChange(e);
                      handleGroupChange(e.target.value);
                    }}
                    label="Group"
                  >
                    <MenuItem value="">
                      <em>Select a group</em>
                    </MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.groupId && errors.groupId && (
                    <FormHelperText>{errors.groupId}</FormHelperText>
                  )}
                </FormControl>
                
                <FormControl 
                  variant="outlined" 
                  className={classes.formControl}
                  error={touched.paidBy && Boolean(errors.paidBy)}
                  disabled={!values.groupId}
                >
                  <InputLabel id="paid-by-select-label">Paid By</InputLabel>
                  <Select
                    labelId="paid-by-select-label"
                    id="paidBy"
                    name="paidBy"
                    value={values.paidBy}
                    onChange={handleChange}
                    label="Paid By"
                  >
                    <MenuItem value="">
                      <em>Select who paid</em>
                    </MenuItem>
                    {members.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.paidBy && errors.paidBy && (
                    <FormHelperText>{errors.paidBy}</FormHelperText>
                  )}
                </FormControl>
                
                <FormControl className={classes.formControl}>
                  <TextField
                    id="expenseDate"
                    label="Expense Date"
                    type="date"
                    value={values.expenseDate.toISOString().split('T')[0]}
                    onChange={(e) => setFieldValue('expenseDate', new Date(e.target.value))}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.expenseDate && Boolean(errors.expenseDate)}
                    helperText={touched.expenseDate && errors.expenseDate}
                  />
                </FormControl>
                
                <div className={classes.buttonContainer}>
                  <Button 
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBackIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    endIcon={<ArrowForwardIcon />}
                    disabled={!values.groupId}
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
            <div className={classes.splitTypeContainer}>
              <Typography variant="h6" gutterBottom>
                How do you want to split the expense?
              </Typography>
              
              <RadioGroup
                name="splitType"
                value={expenseData.splitType}
                onChange={handleSplitTypeChange}
                className={classes.radioGroup}
              >
                <FormControlLabel 
                  value="equal" 
                  control={<Radio />} 
                  label="Split equally" 
                />
                <FormControlLabel 
                  value="custom" 
                  control={<Radio />} 
                  label="Custom split" 
                />
              </RadioGroup>
            </div>
            
            <div className={classes.splitDetailsContainer}>
              <Typography variant="subtitle1" gutterBottom>
                {expenseData.splitType === 'equal' 
                  ? 'Equal Split: Each person pays the same amount' 
                  : 'Custom Split: Specify how much each person pays'}
              </Typography>
              
              <List className={classes.memberList}>
                {customSplits.map((split, index) => (
                  <React.Fragment key={split.memberId}>
                    <ListItem className={classes.memberItem}>
                      <Avatar className={classes.memberAvatar}>
                        {split.memberName.charAt(0)}
                      </Avatar>
                      <ListItemText primary={split.memberName} />
                      <ListItemSecondaryAction>
                        <TextField
                          value={split.amount}
                          onChange={(e) => handleCustomSplitChange(split.memberId, e.target.value)}
                          type="number"
                          variant="outlined"
                          size="small"
                          disabled={expenseData.splitType === 'equal'}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          style={{ width: 120 }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < customSplits.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Typography variant="subtitle1" className={classes.totalAmount} color={
                Math.abs(calculateTotalSplit() - expenseData.amount) < 0.01 
                  ? "primary" 
                  : "error"
              }>
                Total: ${calculateTotalSplit().toFixed(2)} / ${parseFloat(expenseData.amount).toFixed(2)}
              </Typography>
              
              {expenseData.splitType === 'custom' && Math.abs(calculateTotalSplit() - expenseData.amount) >= 0.01 && (
                <Typography variant="caption" color="error" style={{ display: 'block', textAlign: 'right' }}>
                  The total split amount must equal the expense amount.
                </Typography>
              )}
            </div>
            
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
                disabled={
                  expenseData.splitType === 'custom' && 
                  Math.abs(calculateTotalSplit() - expenseData.amount) >= 0.01
                }
              >
                Review
              </Button>
            </div>
          </>
        );
        
      case 2:
        const payer = members.find(m => m.id === expenseData.paidBy);
        const group = groups.find(g => g.id === expenseData.groupId);
        
        return (
          <div className={classes.summaryContent}>
            <Typography variant="h6" gutterBottom>
              Review Expense Details
            </Typography>
            <Paper elevation={0} variant="outlined" className={classes.paper}>
              <Typography variant="subtitle1" className={classes.summaryItem}>
                <strong>Description:</strong> {expenseData.description}
              </Typography>
              <Typography variant="subtitle1" className={classes.summaryItem}>
                <strong>Amount:</strong> ${parseFloat(expenseData.amount).toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" className={classes.summaryItem}>
                <strong>Group:</strong> {group ? group.name : ''}
              </Typography>
              <Typography variant="subtitle1" className={classes.summaryItem}>
                <strong>Paid By:</strong> {payer ? payer.name : ''}
              </Typography>
              <Typography variant="subtitle1" className={classes.summaryItem}>
                <strong>Date:</strong> {expenseData.expenseDate.toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Split Type:</strong> {expenseData.splitType === 'equal' ? 'Equal' : 'Custom'}
              </Typography>
            </Paper>
            
            <Typography variant="h6" gutterBottom style={{ marginTop: 24 }}>
              Split Details
            </Typography>
            <List>
              {customSplits.map((split, index) => (
                <React.Fragment key={split.memberId}>
                  <ListItem>
                    <Avatar className={classes.memberAvatar}>
                      {split.memberName.charAt(0)}
                    </Avatar>
                    <ListItemText primary={split.memberName} />
                    <ListItemSecondaryAction>
                      <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        ${split.amount.toFixed(2)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < customSplits.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
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
                onClick={handleCreateExpense}
                disabled={submitting}
                endIcon={submitting ? null : <CheckIcon />}
              >
                Create Expense
                {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className={classes.successContainer}>
            <CheckIcon className={classes.successIcon} />
            <Typography variant="h5" gutterBottom>
              Expense Created Successfully!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
              Your expense "{expenseData.description}" has been added to the group.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
            >
              Go to Group
            </Button>
          </div>
        );
        
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Add New Expense
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

export default CreateExpense;