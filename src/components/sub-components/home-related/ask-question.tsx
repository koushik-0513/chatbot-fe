import Link from "next/link";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const AskQuestion = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Link href="/ask-question">
            <CardTitle className="">Ask Question</CardTitle>
          </Link>
        </CardHeader>
      </Card>
    </div>
  );
};
