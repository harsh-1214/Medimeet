import { ActionResponse } from "@/types/action";
import { isRedirectError } from "next/dist/client/components/redirect";
import { ZodError } from "zod";



export async function safeAction<T>(
  actionName: string,
  fn: () => Promise<T>,
): Promise<ActionResponse<T>> {
  try {
    const data = await fn();
    return { success : true, data };
  } catch (error: unknown) {
    // Let Next.js redirect() pass through if you ever use it
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Invalid input data.",
      };
    }

    console.error(`[${actionName}_ERROR]:`, error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }
}
