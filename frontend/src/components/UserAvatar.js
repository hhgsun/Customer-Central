import React from 'react'
import { UPLOAD_AVATAR_URL } from '../config';
import NoAvatarSrc from "../images/no-avatar.png";

export default function UserAvatar({ avatar, size = "72" }) {
  return (
    <img
      src={avatar ? (avatar.newAddedUrl != null ? avatar.newAddedUrl : UPLOAD_AVATAR_URL + avatar.fileName) : NoAvatarSrc}
      height={size} width={size} className="rounded-circle" style={{objectFit: "cover"}} />
  )
}
