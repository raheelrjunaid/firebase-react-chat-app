import { AppShell, MantineProvider, Paper } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import ChatHeader from "../components/Header";

export default function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <AppShell
          header={<ChatHeader />}
          padding={0}
          mx="auto"
          sx={() => ({ maxWidth: 600 })}
        >
          <Paper
            radius="sm"
            sx={(theme) => ({
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.colors.dark[8],
            })}
          >
            <Component {...pageProps} />
          </Paper>
        </AppShell>
      </NotificationsProvider>
    </MantineProvider>
  );
}
