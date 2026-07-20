declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: "USER" | "ADMIN";
      };
      validatedQuery?: unknown;
    }
  }
}

export {};
