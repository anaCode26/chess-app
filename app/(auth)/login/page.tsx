import { Caption, Title } from "@components/ui/text";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-2 text-center">
      <Title as="h1" size="lg">
        Login
      </Title>
      <Caption>
        Wire Auth.js credentials / providers in{" "}
        <code className="text-chalk">lib/auth</code>.
      </Caption>
    </div>
  );
}
