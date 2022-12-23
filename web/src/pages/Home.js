import React from 'react'
import { Container, Grid } from '@mui/material'
import ActivityCard from '../components/ActivityCard'
import ClientsTable from '../components/ClientsTable'

function HomePage() {
    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item>
                    <ActivityCard />
                </Grid>
                <Grid item xs={12}>
                    <ClientsTable newlyAdded={true} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default HomePage