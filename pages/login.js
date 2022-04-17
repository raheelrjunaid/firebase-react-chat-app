import { Button, Center, Divider, Group, Image, Text } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../scripts/firebase";

export default function Login() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Chat App Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Group direction="column" align="center">
        <Image src="/hero-chat.svg" mt="xl" alt="Logo not found" />
        <Center>
          <Image src="/chat-logo.svg" alt="Raheel's Chat App" width={350} />
        </Center>
        <div style={{ width: "80%" }}>
          <Divider my="lg" />
        </div>
        {user ? (
          <>
            <Text>You&apos;re logged in!</Text>
            <Link href="/" passHref>
              <Button size="lg">Start Chatting</Button>
            </Link>
          </>
        ) : (
          <Text>Please login (top right corner) to use :)</Text>
        )}
        <Text size="sm" color="dimmed">
          Copyright by Raheel Junaid
        </Text>
      </Group>
    </>
  );
}
