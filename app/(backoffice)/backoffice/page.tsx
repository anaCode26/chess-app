import { Caption, Title } from "@components/ui/text";

export default function BackofficePage() {
  return (
    <div className="space-y-2">
      <Title as="h1" size="lg">
        Dashboard
      </Title>
      <Caption>
        Protected by <code className="text-chalk">proxy.ts</code>.
      </Caption>
    </div>
  );
}
