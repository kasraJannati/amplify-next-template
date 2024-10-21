import React, { useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  useAuthenticator,
  Divider,
} from "@aws-amplify/ui-react";
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

  return (
    <>
      <header>
        <h1>Abloomify</h1>
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
            <MenuItem onClick={signOut}>Sign out</MenuItem>
          </Menu>
        </section>
      </header>
    </>
  );
};

export default Header;
