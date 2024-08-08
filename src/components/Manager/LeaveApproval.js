import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Alert } from '@mui/material';
import Sidebar from '../HR/HRSidebar';
import '../../styles/HR/HRLeaveApproval.css';

const LeaveApproval = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch leave requests for the manager
        const fetchLeaveRequests = async () => {
            try {
                const response = await fetch('http://localhost:8080/leave/user/1'); // Replace 1 with actual userId if necessary
                if (!response.ok) {
                    throw new Error('Failed to fetch leave requests');
                }
                const data = await response.json();
                setLeaveRequests(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchLeaveRequests();
    }, []);

    const handleLeaveAction = async (id, action) => {
        try {
            const response = await fetch(`http://localhost:8080/leave/manager/${action}/${id}`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error(`Failed to ${action} leave request`);
            }
            const message = action === 'approve' ? 'Leave request accepted successfully!' : 'Leave request denied!';
            setLeaveRequests(leaveRequests.filter(request => request.id !== id));
            setFeedbackMessage(message);
            setError('');
        } catch (err) {
            setError(err.message);
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
                                        Employee Name: {request.user.name}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        Position: {request.user.position}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        Department: {request.user.department}
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
                                    <Typography variant="body2" color="black">
                                        Status: {request.status}
                                    </Typography>
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            onClick={() => handleLeaveAction(request.id, 'approve')}>
                                            Approve
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="error" 
                                            onClick={() => handleLeaveAction(request.id, 'deny')}>
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
