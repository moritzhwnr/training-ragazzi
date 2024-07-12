"use client"

import { Box, Button, CircularProgress, Drawer, IconButton, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import { Colors } from '../theme/colors';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Close, FamilyRestroomRounded } from '@mui/icons-material';
import Activities from '../components/activities';
import useSWR from 'swr';
import { Activity } from '../helpers/types';
import Chat from '../components/chat';

/**
 * This function returns the start and end dates of a specified ISO week in a given year.
 * 
 * @param {number} weekNumber - The ISO week number for which to retrieve the start and end dates.
 * @param {number} year - The year in which the specified week falls.
 * @returns {string[]} An array containing the formatted start and end dates of the specified week.
 */
const getDatesByWeek = (weekNumber: number, year: number) => {
    // Extend dayjs with the isoWeek plugin to handle ISO week calculations.
    dayjs.extend(isoWeek);

    // Calculate the start of the specified week in the given year.
    const startOfWeek = dayjs().year(year).isoWeek(weekNumber).startOf('isoWeek');

    // Calculate the end of the specified week in the given year.
    const endOfWeek = dayjs().year(year).isoWeek(weekNumber).endOf('isoWeek');

    // Store the start and end dates in an array.
    const dates = [startOfWeek, endOfWeek];

    // Format the dates to 'YYYY-MM-DD HH:ss:mm' format.
    const formattedDates = dates.map(date => date.format('YYYY-MM-DD HH:ss:mm'));

    // Return the formatted dates.
    return formattedDates;
}

export default function Page() {

    // Extend dayjs with the isoWeek plugin to enable ISO week calculations
    dayjs.extend(isoWeek);

    // Get the current ISO week number
    const currentWeek = dayjs(dayjs()).isoWeek();

    // Initialize the state for the selected week with the current week
    const [week, setWeek] = useState(currentWeek);

    /**
     * Handles the change of the week.
     * @param {boolean} shift - If true, decrease the week number by 1, otherwise increase by 1.
     */
    const handleWeekChange = (shift: boolean) => {
        if (week > 1 && week < 52) {
            if (shift) {
                setWeek(week - 1);
            } else {
                if (week < currentWeek) {
                    setWeek(week + 1);
                }
            }
        }
    };

    // Get the start and end dates for the selected week
    const dates = getDatesByWeek(week, 2024);

    // Fetcher function for useSWR to fetch data from the given URL
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    // Construct the API URL with the start and end dates of the week
    const url = `/api/strava/activities?start=${dates[0]}&end=${dates[dates.length - 1]}`;
    console.log(url);

    // Fetch data using SWR
    const { data, error, isLoading } = useSWR<{ data: Activity[] }>(url, fetcher);

    // State for controlling the Drawer component
    const [open, setOpen] = useState(false);

    /**
     * Toggles the state of the Drawer.
     * @param {boolean} newOpen - The new state of the Drawer.
     */
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };


    return (
        <Box
            sx={{
                display: { md: 'flex', xs: 'block' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '100vh',
                height: '100%',
                gap: { xs: '20px', sm: '30px', md: '40px' },
                px: { xs: '20px', sm: '40px', md: '60px' },
                py: { xs: '20px', sm: '40px', md: '50px' },
            }}
        >
            <Box
                sx={{
                    width: { xs: '300px', sm: '350px', md: '430px' },
                    height: { xs: '100px', sm: '115px', md: '133px' },
                    position: 'relative',
                }}
            >
                <Image src="/label.svg" alt="Logo" fill priority />
            </Box>
            {isLoading ?
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box> :
                data && data.data.length !== 0 ? <Activities activities={data} /> :
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='h6' sx={{ color: Colors.white }}>
                            No activities in this week
                        </Typography>
                    </Box>
            }
            <Box
                sx={{
                    display: { md: 'flex', xs: 'flex' },
                    flexDirection: { md: 'row', xs: 'column' },
                    gap: '20px',
                    p: '10px'
                }}
            >
                <Button onClick={toggleDrawer(true)} sx={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    p: 0.5,
                    backgroundColor: Colors.purple,
                    ":hover": {
                        bgcolor: Colors.magenta
                    },
                    //height: '20%',
                    borderRadius: '50px',
                }}>
                    <Typography variant='h5' sx={{ color: Colors.white }}>
                        AI Analyze my Week
                    </Typography>
                </Button>
                <Drawer anchor={'bottom'} open={open} onClose={toggleDrawer(false)}>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'flex-end'
                    }}>
                        <IconButton aria-label="close" onClick={toggleDrawer(false)} sx={{
                            ":hover": {
                                bgcolor: 'transparent',
                                color: Colors.magenta
                            }
                        }}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        px: 5,
                        py: 1
                    }}>
                        {data && <Chat activities={data} />}
                    </Box>
                </Drawer>
                <Box sx={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    gap: '5px',
                    p: 0.5,
                    backgroundColor: Colors.purple,

                    //height: '20%',
                    borderRadius: '50px',
                }}>
                    <IconButton aria-label="left" size="large" onClick={() => handleWeekChange(true)} sx={{
                        ":hover": {
                            bgcolor: 'transparent',
                            color: Colors.magenta
                        }
                    }}>
                        <ArrowBackIosNewIcon fontSize="inherit" />
                    </IconButton>
                    <Typography variant='h5' sx={{ color: Colors.white }}>
                        KW {week}
                    </Typography>
                    <IconButton aria-label="right" size="large" onClick={() => handleWeekChange(false)} sx={{
                        ":hover": {
                            bgcolor: 'transparent',
                            color: Colors.magenta
                        }
                    }}>
                        <ArrowForwardIosIcon fontSize="inherit" />
                    </IconButton>
                </Box>
                <Button sx={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    p: 0.5,
                    backgroundColor: Colors.purple,
                    ":hover": {
                        bgcolor: Colors.magenta
                    },
                    //height: '20%',
                    borderRadius: '50px',
                }}>
                    <Typography variant='h5' sx={{ color: Colors.white }}>
                        Get my stats
                    </Typography>
                </Button>
            </Box>

        </Box>
    );
}