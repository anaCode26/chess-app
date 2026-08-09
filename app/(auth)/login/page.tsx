export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-2 text-center">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-muted-foreground">
        Wire Auth.js credentials / providers in{" "}
        <code className="text-foreground">lib/auth</code>.
      </p>
    </div>
  );
}
