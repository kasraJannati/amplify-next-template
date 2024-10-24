import React, { useState, useEffect } from "react";
import { Alert, AlertProps } from "@aws-amplify/ui-react";

type AlertType = {
  text: string;
  variation: "info" | "error" | "warning" | "success";
  autoDismiss: boolean;
  clearAlert: () => void;
  duration?: number;
} & AlertProps;

export const AlertComponent = ({
  text,
  variation,
  duration = 3000,
  autoDismiss,
  clearAlert, // Destructure clearAlert
  ...rest
}: AlertType) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        clearAlert();
      }, duration);
      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [duration, autoDismiss]);

  return isVisible ? (
    <Alert variation={variation} {...rest}>
      {text}
    </Alert>
  ) : null;
};
