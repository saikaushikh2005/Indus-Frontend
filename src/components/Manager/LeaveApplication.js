import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Alert } from '@mui/material';
import Sidebar from '../Manager/ManagerSidebar';

const ApplyLeave = () => {
    const [formData, setFormData] = useState({
        reason: '',
        startDate: '',
        endDate: ''
    });

    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [error, setError] = useState('');

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
                const userId = 1; // Replace with actual user ID
                const response = await fetch(`http://localhost:8080/leave/apply?userId=${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setFeedbackMessage('Leave application submitted successfully!');
                    setError('');
                    setIsModalOpen(true);
                } else {
                    throw new Error('Failed to submit leave request');
                }
            } catch (err) {
                setError('Failed to submit leave request');
                console.error(err);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFeedbackMessage('');
        setError('');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'linear-gradient(to right, #50026f, #000)', height: '100vh', overflow: 'auto' }}>
                <Box sx={{ width: '100%', mb: 3 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ color: 'black' }}>
                        Leave Request
                    </Typography>
                </Box>
                <Paper elevation={3} sx={{ padding: 3, bgcolor: 'white', maxWidth: 800, margin: 'auto' }}>
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
                                <TextField
                                    fullWidth
                                    id="startDate"
                                    name="startDate"
                                    label="Start Date"
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
                                            color: 'black'
                                        },
                                        '& label': {
                                            color: 'black'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="endDate"
                                    name="endDate"
                                    label="End Date"
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
                                            color: 'black'
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
                </Paper>
                {feedbackMessage && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {feedbackMessage}
                    </Alert>
                )}
                
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

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
