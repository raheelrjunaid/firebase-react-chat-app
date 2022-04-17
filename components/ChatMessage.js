import { Box, Paper, Text } from "@mantine/core";
import React from "react";

export default function ChatMessage({ message, uid }) {
  const originalSender = message.uid === uid;

  return (
    <>
      {!originalSender && <Text size="sm">{message.name}</Text>}
      <Paper
        mt={5}
        mb="sm"
        px="sm"
        py={5}
        radius="lg"
        sx={(theme) => ({
          color: "white",
          marginLeft: originalSender ? "auto" : 0,
          width: "fit-content",
          maxWidth: "30ch",
          backgroundColor: originalSender
            ? theme.colors.blue[6]
            : theme.colors[message.color][6],
        })}
      >
        <Text
          align={originalSender ? "right" : "left"}
          sx={{ overflowWrap: "break-word", hyphens: "auto" }}
        >
          {message.body}
        </Text>
      </Paper>
    </>
  );
}
