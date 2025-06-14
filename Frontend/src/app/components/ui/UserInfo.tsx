"use client";

import { useUser } from "@civic/auth/react";

export function UserInfo() {
  const { user } = useUser();

  if (!user) return <div>User not logged in</div>

  return <div>Hello { user.name }!</div>
} 