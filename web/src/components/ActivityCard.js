import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, Typography, Box, CircularProgress, IconButton } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StatsService from '../services/stats.service';

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography component="div" color="text.secondary">
                    {props.value_real}
                </Typography>
            </Box>
        </Box>
    );
}

function ActivityCard() {
    const [stats, setStats] = useState();

    useEffect(() => {
        StatsService.get().then(
            (response) => {
                setStats(response.data);
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage);
            }
        );
    }, []);

    return (
        <Card>
            <CardContent>
                {stats ? (
                    <Grid container direction="column" spacing={3} justifyContent="space-between" alignItems="center">
                        <Grid item container direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Grid item>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>Client Activity</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <CircularProgressWithLabel
                                size={80}
                                value={
                                    ((stats.active_clients - 0) * 100) / (stats.total_clients - 0)
                                }
                                value_real={stats.active_clients}
                                sx={{
                                    borderRadius: "100%",
                                    boxShadow: "inset 0 0 0px 6.5px gray",
                                    backgroundColor: "transparent",
                                }}
                            />
                        </Grid>

                        <Grid item>
                            <Typography>Total clients: {stats.total_clients}</Typography>
                        </Grid>
                    </Grid>
                ) : (
                    <CircularProgress />
                )}
            </CardContent>
        </Card>
    )
}

export default ActivityCard