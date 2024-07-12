'use client';
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Colors } from "./colors";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap'
})


const theme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
      },
})

export default theme;