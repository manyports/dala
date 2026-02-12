import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function safeJsonParse<T = unknown>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type")
  
  if (!contentType || !contentType.includes("application/json")) {
    if (contentType?.includes("text/html")) {
      const text = await response.text()
      console.error("Expected JSON but got HTML:", text.slice(0, 200))
      return null
    }
    return null
  }

  try {
    return await response.json()
  } catch (error) {
    console.error("Failed to parse JSON:", error)
    return null
  }
}
