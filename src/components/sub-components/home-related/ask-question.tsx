import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

export const AskQuestion = ({ onAsk }: { onAsk?: () => void }) => {
  return (
    <div>
      <Card className={cn("cursor-pointer")}>
        <CardHeader className={cn("cursor-pointer")}>
          <button
            onClick={onAsk}
            className={cn("w-full cursor-pointer text-left")}
          >
            <CardTitle>Ask Question</CardTitle>
          </button>
        </CardHeader>
      </Card>
    </div>
  );
};
