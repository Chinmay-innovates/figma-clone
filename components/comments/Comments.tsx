"use client";

import { ClientSideSuspense } from "@liveblocks/react";

import { CommentsOverlay } from "@/components/comments/CommentsOverlay";
import Loader from "../Loader";

export const Comments = () => (
  <ClientSideSuspense fallback={<Loader/>}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);