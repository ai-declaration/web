"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExampleRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/generator/?preset=${slug}`);
  }, [router, slug]);

  return (
    <div className="flex items-center justify-center py-24">
      <p className="text-muted-foreground">Loading example...</p>
    </div>
  );
}
