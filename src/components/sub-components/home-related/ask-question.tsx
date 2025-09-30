import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const AskQuestion = ({ onAsk }: { onAsk?: () => void }) => {
  return (
    <div>
      <Card className="cursor-pointer">
        <CardHeader className="cursor-pointer">
          <button onClick={onAsk} className="w-full cursor-pointer text-left">
            <CardTitle>Ask Question</CardTitle>
          </button>
        </CardHeader>
      </Card>
    </div>
  );
};
