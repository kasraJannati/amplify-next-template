"use client";

import React, { useState, useEffect } from "react";
import { AccountSettings, Button, TextField } from "@aws-amplify/ui-react";
import {
  fetchUserAttributes,
  updateUserAttribute,
  confirmUserAttribute,
} from "aws-amplify/auth";
import { AlertComponent } from "../components/alert";
import { useUserContext } from "../context/UserContext";

const EditProfilePage = () => {
  const { userAttributes, setUserAttributes } = useUserContext();
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailUpdateInitiated, setEmailUpdateInitiated] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [alertMessage, setAlertMessage] = useState<{
    text: string;
    variation: "info" | "error" | "warning" | "success";
  } | null>(null);

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

  // Handle preferred_username update
  const handleUpdateUsername = async () => {
    try {
      await updateUserAttribute({
        userAttribute: {
          attributeKey: "preferred_username",
          value: newUsername,
        },
      });
      // Update the context with the new preferred_username
      setUserAttributes((prevAttributes: any) => ({
        ...prevAttributes,
        preferred_username: newUsername,
      }));
      setAlertMessage({
        text: "Username updated successfully!",
        variation: "success",
      });
    } catch (error) {
      console.error(error);
      setAlertMessage({
        text: "Failed to update username.",
        variation: "error",
      });
    }
  };

  // Handle email update
  const handleUpdateEmail = async () => {
    // Check if the new email is the same as the current email
    const currentEmail = userAttributes.email || "";
    if (newEmail === currentEmail) {
      setAlertMessage({
        text: "No update needed. Same email as current one.",
        variation: "warning",
      });
      return;
    }
    try {
      await updateUserAttribute({
        userAttribute: {
          attributeKey: "email",
          value: newEmail,
        },
      });
      setAlertMessage({
        text: "A verification code has been sent to your new email!",
        variation: "info",
      });
      setEmailUpdateInitiated(true);
    } catch (error) {
      console.error(error);
      setAlertMessage({
        text: "Failed to update email.",
        variation: "error",
      });
    }
  };

  // Handle email confirmation
  const handleConfirmEmail = async () => {
    try {
      await confirmUserAttribute({
        userAttributeKey: "email",
        confirmationCode: confirmationCode,
      });
      setAlertMessage({
        text: "Email updated successfully!",
        variation: "success",
      });
    } catch (error) {
      console.error(error);
      setAlertMessage({ text: "Failed to confirm email.", variation: "error" });
    }
  };

  // Handle password confirmation
  const handleUpdatePassword = () => {
    setAlertMessage({
      text: "Password is successfully changed!",
      variation: "success",
    });
  };

  return (
    <>
      <h2 className="mb-6">Edit Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <section className="bg-white p-4 rounded flex flex-col gap-4">
            <h3>Update Preferred Username</h3>
            <TextField
              label="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Button onClick={handleUpdateUsername} disabled={!newUsername}>
              Update Username
            </Button>
          </section>
        </div>

        <div className="row-span-2">
          <section className="bg-white p-4 rounded flex flex-col gap-4">
            <h3>Update Email Address</h3>
            <TextField
              label="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button onClick={handleUpdateEmail} disabled={!newEmail}>
              Update Email
            </Button>
            {emailUpdateInitiated && (
              <section className="mt-6 flex flex-col gap-4">
                <h3>Confirm New Email</h3>
                <TextField
                  label="Enter verification code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <Button
                  onClick={handleConfirmEmail}
                  disabled={!confirmationCode}
                >
                  Confirm Email
                </Button>
              </section>
            )}
          </section>
        </div>

        <div>
          <section className="bg-white p-4 rounded">
            <h3 className="mb-4">Update Password</h3>
            <AccountSettings.ChangePassword onSuccess={handleUpdatePassword} />
          </section>
        </div>
      </div>
      {alertMessage && (
        <AlertComponent
          key={Date.now()} // unique key to force re-render
          text={alertMessage.text}
          variation={alertMessage.variation}
          autoDismiss={true}
        />
      )}
    </>
  );
};

export default EditProfilePage;
