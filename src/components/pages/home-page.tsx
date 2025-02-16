"use client";

import { useCounterStore } from "@/providers/counter-store-provider";
import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react";

export const HomePage = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  );

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      Count: {count}
      <div className="flex gap-4">
        <Button type="button" onClick={incrementCount}>
          <MailOpen />
          Increment Count
        </Button>
        <Button type="button" onClick={decrementCount}>
          Decrement Count
        </Button>
      </div>
    </div>
  );
};
