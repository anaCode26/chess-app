import { z } from "zod";

export const unsubscribeSchema = z.object({
  token: z.string().trim().min(1, "A token is required"),
});

export type UnsubscribeInput = z.infer<typeof unsubscribeSchema>;
