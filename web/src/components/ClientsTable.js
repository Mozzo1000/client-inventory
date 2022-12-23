import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box, CircularProgress, Drawer, Container, Grid, IconButton, Button, Badge } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import ClientsService from '../services/clients.service';
import { Duration, DateTime } from 'luxon';
import LinkMUI from '@mui/material/Link';
import ClientPage from '../pages/Client';
import CloseIcon from "@mui/icons-material/Close";
import { Link } from 'react-router-dom';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StyledBadge from './StyledBadge';

function ClientsTable(props) {
    const [clients, setClients] = useState({});
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openedID, setOpenedID] = useState();

    const handleOpenDrawer = () => {
        setOpenDrawer(true);
    };
    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setOpenedID();
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        {
            field: 'uuid',
            headerName: 'UUID',
            flex: 0.8,
            renderCell: (params) => { return <Typography><LinkMUI sx={{ cursor: "pointer" }} underline="hover" onClick={() => (handleOpenDrawer(), setOpenedID(params.row.id))}>{params.value}</LinkMUI></Typography> }
        },
        {
            field: 'os',
            headerName: 'OS',
            flex: 1,
        },
        {
            field: 'uptime',
            headerName: 'Uptime',
            flex: 0.3,
            renderCell: (params) => { return Duration.fromObject({ seconds: params.value }).toFormat("dd:hh:mm") }
        },
        {
            field: 'last_updated',
            headerName: 'Last seen',
            width: 110,
            flex: 0.3,
            renderCell: (params) => { return DateTime.fromISO(params.value).toRelative() }
        },
    ];

    useEffect(() => {
        if (!props.newlyAdded) {
            ClientsService.getAll().then(
                (response) => {
                    setClients(response.data);
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
        } else {
            ClientsService.getLatest().then(
                (response) => {
                    setClients(response.data);
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
        }
    }, []);

    return (
        <>

            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item container justifyContent="space-between">
                            <Grid item>
                                <StyledBadge color="primary" badgeContent={clients && Object.keys(clients).length} showZero>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        {props.newlyAdded ? (
                                            "New clients"
                                        ) : (
                                            "All clients"
                                        )}
                                    </Typography>
                                </StyledBadge>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ height: 400, width: "100%" }}>
                                <DataGrid
                                    rows={clients}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    disableSelectionOnClick
                                    loading
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card >
            <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
                <Container>
                    <Grid container spacing={3} direction="row" justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <IconButton onClick={handleCloseDrawer}>
                                <CloseIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                component={Link}
                                to={"/clients/" + openedID}
                                startIcon={<OpenInNewIcon />}
                            >
                                Open
                            </Button>
                        </Grid>
                    </Grid>
                    <br />
                    <ClientPage id={openedID} />
                </Container>
            </Drawer>
        </>
    )
}

export default ClientsTable