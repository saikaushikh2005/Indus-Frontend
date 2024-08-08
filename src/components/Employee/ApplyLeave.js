import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper } from '@mui/material';
import axios from 'axios';
import Sidebar from './EmployeeSidebar';
import './../../styles/Employee/EmpApplyLeave.css';

const ApplyLeave = () => {
    const [formData, setFormData] = useState({
        reason: '',
        startDate: '',
        endDate: ''
    });

    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leaveStatus, setLeaveStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required';
            isValid = false;
        }
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
            isValid = false;
        }
        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
            isValid = false;
        } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
            newErrors.endDate = 'End date must be after start date';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.post('/leave/apply?userId=1', formData); // Replace userId with actual value

                if (response.status === 200) {
                    setLeaveStatus(response.data.status); // Assuming response contains status
                    setIsModalOpen(true);
                } else {
                    setErrors({ submit: 'Failed to submit leave request' });
                }
            } catch (error) {
                setErrors({ submit: 'Failed to submit leave request' });
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#e0e0e0', height: '100vh', overflow: 'auto' }}>
                <Paper elevation={3} sx={{ padding: 3, bgcolor: 'white', maxWidth: '600px', margin: '0 auto', borderRadius: '8px' }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
                        Leave Application
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    id="reason"
                                    name="reason"
                                    label="Reason"
                                    variant="outlined"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    error={Boolean(errors.reason)}
                                    helperText={errors.reason}
                                    sx={{ 
                                        bgcolor: 'white',
                                        '& .MuiInputBase-input': { 
                                            color: 'black'
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'black'
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'black'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'black'
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'black'
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ color: 'black' }}>Start Date</Typography>
                                <TextField
                                    fullWidth
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    error={Boolean(errors.startDate)}
                                    helperText={errors.startDate}
                                    sx={{ 
                                        bgcolor: 'white', 
                                        '& input': { 
                                            color: 'black', 
                                            paddingTop: '16px' 
                                        },
                                        '& label': {
                                            color: 'black'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ color: 'black' }}>End Date</Typography>
                                <TextField
                                    fullWidth
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    error={Boolean(errors.endDate)}
                                    helperText={errors.endDate}
                                    sx={{ 
                                        bgcolor: 'white', 
                                        '& input': { 
                                            color: 'black', 
                                            paddingTop: '16px' 
                                        },
                                        '& label': {
                                            color: 'black'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    Submit Leave Request
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    {leaveStatus && (
                        <Box sx={{ mt: 3, bgcolor: 'white', p: 2, borderRadius: '8px', boxShadow: 1 }}>
                            <Typography variant="h6" align="center" color="black">
                                Leave Status: {leaveStatus}
                            </Typography>
                        </Box>
                    )}
                </Paper>
                <Dialog open={isModalOpen} onClose={closeModal}>
                    <DialogTitle>Success</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Leave application submitted successfully!
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default ApplyLeave;
