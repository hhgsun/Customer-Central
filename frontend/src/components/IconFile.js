import React from 'react'

import IconFILE from "../images/icons/file.png"
import IconAI from "../images/icons/ai.png"
import IconJPG from "../images/icons/jpg.png"
import IconPDF from "../images/icons/pdf.png"
import IconPNG from "../images/icons/png.png"
import IconZIP from "../images/icons/zip.png"

export default function IconFile({ name }) {
  name = name ? name.split('.').pop() : null;

  let iconSrc;

  if (name === "ai") {
    iconSrc = IconAI;
  } else if (name === "jpg") {
    iconSrc = IconJPG;
  } else if (name === "pdf") {
    iconSrc = IconPDF;
  } else if (name === "png") {
    iconSrc = IconPNG;
  } else if (name === "zip") {
    iconSrc = IconZIP;
  } else {
    iconSrc = IconFILE;
  }

  return (
    <>
      {
        name
          ?
          <div className="file-icon-box me-2">
            <img src={iconSrc} />
          </div>
          : ""
      }
    </>
  )
}
