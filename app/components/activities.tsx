import { Box, Grid, Card, CardContent, CardHeader, Avatar, Typography, CardMedia } from '@mui/material';
import dayjs from 'dayjs';
import { Activity } from '../helpers/types';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Colors } from '../theme/colors';


// Defining the props interface for the Activities component
interface ActivitiyProps {
    activities: { data: Activity[] } // Array of activity data
}

/**
 * Renders actitivties with a map in a grid component
 * @param activities fetched Activities 
 * @returns rendered Grid component 
 */
export default function Activities({ activities }: ActivitiyProps) {

    return (
        <Box>
            <Grid container spacing={1} columns={12}>
                {activities && activities.data.toReversed().map(activity => (
                    <Grid key={activity.id} item xs={12} md={6} lg={3}>
                        <Card sx={{
                            backgroundColor: Colors.white,
                            borderRadius: '10px'
                        }}>
                            <CardHeader
                                sx={{
                                    color: Colors.black,

                                }}
                                avatar={
                                    <Avatar sx={{ bgcolor: Colors.mint }}>
                                        {activity.type == 'Ride' ? <DirectionsBikeIcon sx={{ color: Colors.magenta }} /> :
                                            activity.type == 'Run' ? <DirectionsRunIcon sx={{ color: Colors.magenta }} /> :
                                                <>R</>}
                                    </Avatar>
                                }
                                title={activity.name}
                                subheader={dayjs(activity.start_date_local).format('DD, MMMM YYYY')}
                                subheaderTypographyProps={{ style: { color: 'gray' } }}
                            />
                            <CardMedia
                                component="img"
                                height="140"
                                image={`https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:${activity.map.summary_polyline}&key=${process.env.NEXT_PUBLIC_GOOGLE_STATIC_MAP_API as string}`}
                                alt="Paella dish"
                            />
                            <CardContent>
                                <Grid container spacing={0.5} columns={12} sx={{ color: 'black', textAlign: 'center' }}>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Typography variant="caption">
                                            Distance
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {(activity.distance / 1000).toFixed(2)} km
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Typography variant="caption">
                                            Pace
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {(activity.average_speed * 3.6).toFixed(2)} km/h
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Typography variant="caption">
                                            Time
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {(activity.moving_time / 3600).toFixed(2)} h
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
