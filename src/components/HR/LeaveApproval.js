import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Alert } from '@mui/material';
import Sidebar from '../HR/HRSidebar';
import '../../styles/HR/HRLeaveApproval.css';

const LeaveApproval = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch leave requests from the backend
        const fetchLeaveRequests = async () => {
            try {
                const response = await fetch('http://localhost:8080/leave/requests');
                if (response.ok) {
                    const data = await response.json();
                    setLeaveRequests(data);
                } else {
                    throw new Error('Failed to fetch leave requests');
                }
            } catch (err) {
                setError('Failed to fetch leave requests');
                console.error(err);
            }
        };

        fetchLeaveRequests();
    }, []);

    const handleAcceptLeave = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/leave/approve/${id}`, {
                method: 'PATCH'
            });

            if (response.ok) {
                setLeaveRequests(leaveRequests.filter(request => request.id !== id));
                setFeedbackMessage('Leave request accepted successfully!');
                setError('');
            } else {
                throw new Error('Failed to accept leave request');
            }
        } catch (err) {
            setError('Failed to accept leave request');
            console.error(err);
        }
    };

    const handleDenyLeave = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/leave/deny/${id}`, {
                method: 'PATCH'
            });

            if (response.ok) {
                setLeaveRequests(leaveRequests.filter(request => request.id !== id));
                setFeedbackMessage('Leave request denied!');
                setError('');
            } else {
                throw new Error('Failed to deny leave request');
            }
        } catch (err) {
            setError('Failed to deny leave request');
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h4" align="center" gutterBottom color="black">
                        Leave Approval
                    </Typography>
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

                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {leaveRequests.map(request => (
                        <Grid item xs={12} md={6} key={request.id}>
                            <Card elevation={3} sx={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                                <CardContent>
                                    <Typography variant="h6" color="black">
                                        Employee Name: {request.employeeName}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        Position: {request.position}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        Department: {request.department}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        Leave Type: {request.leaveType}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        Start Date: {request.startDate}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        End Date: {request.endDate}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        Reason: {request.reason}
                                    </Typography>
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            onClick={() => handleAcceptLeave(request.id)}>
                                            Accept
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="error" 
                                            onClick={() => handleDenyLeave(request.id)}>
                                            Deny
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default LeaveApproval;
