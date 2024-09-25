// theme.d.ts
import '@mui/material/styles';
import { Theme } from '@mui/material/styles/createTheme';

// Extend the DefaultTheme interface
declare module '@mui/material/styles' {
  interface Theme {
    // Add custom properties if necessary
  }
  interface ThemeOptions {
    // Add custom properties if necessary
  }
}
