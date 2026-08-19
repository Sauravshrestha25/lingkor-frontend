"use client";

import { useEffect } from "react";

// Generated from public/webx-white-logo.svg's alpha channel at 90 × 34 pixels.
const signature = `
                                                   ██▄
                                                   ███▄                              ▄▄▄▄▄
                                                   ████                             █████
                                                   ████                           ▄█████
              ▄▄▄                                  ████              ▄▄▄▄        ▄████▀
▀██▄         █████        ▄▄██▀   ▄▄███████▄▄      ████▄███████▄▄    █████      ▄████▀
 ████▄      ██████▄      ▄████   █████████████     ███████████████▄   ▀████▄   █████
  ████     ▄███████      ████  ▄█████▀   ▀█████    ██████▀   ▀▀████▄   ▀████▄ █████
  ▀████    █████████    ████▀  ████▀       ▀████   ████▀       ▀████    ▀███▄████▀
   ████▄  ▄████ ████▄  ▄████  ▄█████████████████   ████         █████     ▀▄████▀
    ████  ████   ████  ████   ▀█████████████████   ████         █████     ▄█████
    ▀████████▀   ▀████████▀    █████▀▀▀▀▀▀▀▀▀▀▀▀   ████         ████▀    ████████▄
     ████████     ████████     ▀████▄     ▄██▄     ████       ▄█████    █████ ████▄
      ██████       ██████       ▀█████████████▀    ███████████████▀   ▄████▀  ▀█████
      ▀████▀       ▀████▀         ▀█████████▀      █████████████▀    ▄████▀     █████
       ▀▀▀▀         ▀▀▀▀             ▀▀▀▀▀         ▀▀▀▀▀▀▀▀▀▀▀      █████▀       ▀▀▀▀▀
                                                                   █████

Designed & developed by WebX Nepal
https://webxnepal.com
`;

export default function WebxSignature() {
  useEffect(() => {
    const comment = document.createComment(signature);
    document.body.prepend(comment);

    return () => comment.remove();
  }, []);

  return null;
}
