import { Button, Group, Header, Title, Menu } from "@mantine/core";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../scripts/firebase";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";

export default function ChatHeader() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  async function signInWithGitHub() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/");
  }

  function signOutRedirect() {
    router.push("/login");
    signOut(auth);
  }

  return (
    <Header py="xs" px="md">
      <Group position="apart">
        <Title order={5}>Raheel&apos;s Chat App</Title>
        {user ? (
          <Menu
            placement="end"
            withArrow
            control={
              <Button variant="outline" rightIcon={<FaChevronDown />}>
                {user.displayName}
              </Button>
            }
          >
            <Menu.Item icon={<FaSignOutAlt />} onClick={signOutRedirect}>
              Sign Out
            </Menu.Item>
          </Menu>
        ) : (
          <Button
            leftIcon={<FcGoogle />}
            variant="white"
            color="dark"
            onClick={signInWithGitHub}
          >
            Sign in with Google
          </Button>
        )}
      </Group>
    </Header>
  );
}
