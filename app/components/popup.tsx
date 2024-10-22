import React, { useState } from "react";
import { Button, ButtonColorTheme } from "@aws-amplify/ui-react";

type PopupType = {
  text: string;
  textBtnTrue: string;
  textBtnFalse: string;
  colorThemeBtnTrue?: ButtonColorTheme | undefined;
  colorThemeBtnFalse?: ButtonColorTheme | undefined;
  onPopupResponse: (response: boolean) => void;
};

export const PopupComponent = ({
  text,
  textBtnTrue,
  textBtnFalse,
  colorThemeBtnTrue,
  colorThemeBtnFalse,
  onPopupResponse,
}: PopupType) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleResponse = (response: boolean) => {
    setIsVisible(false); // Close popup after a response is made
    onPopupResponse(response); // Pass the response (true for Yes, false for No) to the parent
  };

  return isVisible ? (
    <section className="popup-component modal-view">
      <div>
        <p>
          <b>{text}</b>
        </p>
        <div className="buttons">
          <Button
            onClick={() => handleResponse(false)}
            colorTheme={colorThemeBtnFalse}
          >
            {textBtnFalse}
          </Button>
          <Button
            onClick={() => handleResponse(true)}
            colorTheme={colorThemeBtnTrue}
          >
            {textBtnTrue}
          </Button>
        </div>
      </div>
    </section>
  ) : null;
};
