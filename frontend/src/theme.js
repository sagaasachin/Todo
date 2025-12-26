import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    success: { main: "#2e7d32" },
    error: { main: "#d32f2f" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
