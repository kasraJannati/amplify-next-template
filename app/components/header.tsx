import React, { useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  useAuthenticator,
  Divider,
  Image,
} from "@aws-amplify/ui-react";
import Link from "next/link";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { fetchUserAttributes } from "aws-amplify/auth";

const Header = () => {
  const { userAttributes, setUserAttributes } = useUserContext();
  const { signOut } = useAuthenticator();
  const router = useRouter();

  // Fetch user attributes
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAttributes();
  }, []);

  const handleSignOut = async () => {
    try {
      // Clear user context, local storage and session
      setUserAttributes(null);
      localStorage.clear();
      sessionStorage.clear();
      signOut();
      router.push("/");
    } catch (error) {
      console.log("Error during sign out:", error);
    }
  };

  return (
    <>
      <header>
        <Link href="/">
          <Image alt="Amplifylogo" src="/abloomify.jpg" width="200px" />
        </Link>
        <section>
          <Menu
            menuAlign="end"
            trigger={
              <MenuButton variation="primary">
                {userAttributes?.preferred_username || "User"}
              </MenuButton>
            }
          >
            <MenuItem onClick={() => router.push("/edit-profile")}>
              Edit profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </Menu>
        </section>
      </header>
    </>
  );
};

export default Header;
