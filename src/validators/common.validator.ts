import { z } from "zod";

export const positiveIdParamsSchema = (resourceName: string) => {
  return z.object({
    id: z.coerce
      .number()
      .int()
      .positive(`${resourceName} id must be a positive integer`),
  });
};
