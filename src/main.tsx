import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Button, createTheme, MantineProvider, rem } from "@mantine/core";
import App from "./App";

const theme = createTheme({
  fontSizes: {
    xs: rem(10),
    sm: rem(12),
    md: rem(14),
    lg: rem(16),
    xl: rem(20),
  },
  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55",
    lg: "1.6",
    xl: "1.65",
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "cyan",
        variant: "outline",
      },
    }),
  },
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
    </StrictMode>
  );
}
