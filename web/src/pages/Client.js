import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientsService from "../services/clients.service";
import LaptopIcon from '@mui/icons-material/Laptop';
import { Card, Grid, CardContent, Table, TableBody, TableCell, TableRow, TableContainer, Typography, CircularProgress, Tooltip, Skeleton } from "@mui/material";
import { Container } from "@mui/system";
import { Duration, DateTime } from 'luxon';
import useAlert from '../components/Alerts/useAlert';

function ClientPage(props) {
    let { id } = useParams();
    const [client, setClient] = useState();
    const snackbar = useAlert();

    if (!id) {
        id = props.id;
    }
    useEffect(() => {
        ClientsService.get(id).then(
            (response) => {
                setClient(response.data);
                if (!response.data.length) {
                    snackbar.showError("Client does not exist")
                }
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                snackbar.showError(resMessage);
            }
        );
    }, [id]);

    return (
        <Container>
            <Grid container spacing={3} justifyContent="space-between">
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Grid item container justifyContent="space-between">
                                <Grid item>
                                    <LaptopIcon sx={{ fontSize: "120px" }} />
                                </Grid>
                                <Grid item>
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        Last seen
                                                    </TableCell>
                                                    <TableCell>
                                                        {client?.length ? (
                                                            client.last_updated
                                                        ) : (
                                                            <Skeleton variant="rectangle" width={100} />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Uptime
                                                    </TableCell>
                                                    <Tooltip title="(days:hours:minutes)">
                                                        <TableCell>
                                                            {client?.length ? (
                                                                Duration.fromObject({ seconds: client.uptime }).toFormat("dd:hh:mm")
                                                            ) : (
                                                                <Skeleton variant="rectangle" width={100} />
                                                            )}
                                                        </TableCell>
                                                    </Tooltip>

                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Registration date</TableCell>
                                                    <Tooltip title={client?.created_at}>
                                                        <TableCell>
                                                            {client?.length ? (
                                                                DateTime.fromISO(client.created_at).toRelativeCalendar()
                                                            ) : (
                                                                <Skeleton variant="rectangle" width={100} />
                                                            )}
                                                        </TableCell>
                                                    </Tooltip>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Hardware</Typography>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Manufacturer</TableCell>
                                            <TableCell>
                                                {client?.length ? (
                                                    client.hardware[0].manufacturer
                                                ) : (
                                                    <Skeleton variant="rectangle" width={100} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Product name</TableCell>
                                            <TableCell>
                                                {client?.length ? (
                                                    client.hardware[0].product_name
                                                ) : (
                                                    <Skeleton variant="rectangle" width={100} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Serial number</TableCell>
                                            <TableCell>
                                                {client?.length ? (
                                                    client.hardware[0].serial
                                                ) : (
                                                    <Skeleton variant="rectangle" width={100} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>UUID</TableCell>
                                            <TableCell>
                                                {client?.length ? (
                                                    client.uuid
                                                ) : (
                                                    <Skeleton variant="rectangle" width={100} />
                                                )}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ClientPage