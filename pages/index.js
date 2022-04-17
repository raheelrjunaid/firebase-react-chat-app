import {
  ActionIcon,
  LoadingOverlay,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import {
  addDoc,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaPaperPlane } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import { auth, db, messagesRef } from "../scripts/firebase";

export default function Home() {
  const [user, userLoading, userError] = useAuthState(auth);
  const [userColor, setUserColor] = useState(null);
  const [messages, messagesLoading, messagesError] = useCollectionData(
    query(messagesRef, orderBy("createdAt"), limit(25))
  );
  const notifications = useNotifications();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      newMessage: "",
    },
    validationRules: {
      newMessage: (value) => value.length > 0,
    },
  });
  const mainScrollView = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (userError) {
      notifications.showNotification({
        title: "Error getting user",
        message: userError,
        color: "red",
      });
    } else if (messagesError) {
      notifications.showNotification({
        title: "Error getting messages",
        message: messagesError,
        color: "red",
      });
    }
  }, [userError, messagesError, notifications]);

  useEffect(() => {
    async function getUserColor() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const result = await getDoc(docRef);
        setUserColor(result.data()?.color);
      } else {
        router.push("/login");
      }
    }
    if (!userLoading) getUserColor();
  }, [userLoading, router, user]);

  const scrollToBottom = () =>
    // Nullish coalescing used if useRef hasn't attached yet
    mainScrollView?.current?.scrollTo({
      top: mainScrollView.current.scrollHeight,
      behavior: "smooth",
    });

  async function handleSubmit({ newMessage }) {
    // Only submit if user is logged in
    try {
      await addDoc(messagesRef, {
        uid: user.uid,
        name: user.displayName,
        createdAt: serverTimestamp(),
        body: newMessage,
        color: userColor,
      });
      form.reset();
    } catch (error) {
      console.log(error);
      notifications.showNotification({
        title: "Error sending message",
        message:
          "You might be banned or there is another problem (see console)",
        color: "red",
      });
    }
  }

  return (
    <>
      <Head>
        <title>Chat App Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingOverlay visible={messagesLoading} />
      <ScrollArea
        sx={() => ({ flexGrow: 1 })}
        px="md"
        viewportRef={mainScrollView}
      >
        {!messagesLoading &&
          user &&
          messages.map((message, index) => {
            return (
              <ChatMessage
                message={message}
                uid={user.uid}
                key={index}
              ></ChatMessage>
            );
          })}
      </ScrollArea>
      {userColor ? (
        <>
          <Text align="center" my="sm" size="sm" color="dimmed">
            No bad words or you&apos;ll be banned for life!
          </Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              placeholder="New message"
              rightSection={
                <ActionIcon color="blue" type="submit" variant="filled">
                  <FaPaperPlane />
                </ActionIcon>
              }
              {...form.getInputProps("newMessage")}
            />
          </form>
        </>
      ) : (
        <Text align="center" my="sm">
          Still building your profile, refresh the page in a sec :)
        </Text>
      )}
    </>
  );
}
