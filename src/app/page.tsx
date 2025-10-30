
"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen gap-2">
      <Button onClick={() => window.location.href = "/dashboard/admin"}>Dashboard admin</Button>
    </div>
  );
}