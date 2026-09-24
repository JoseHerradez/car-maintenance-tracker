"use server";

import { auth } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { headers } from "next/headers";

export async function registerUser(formData: FormData) {
  try {
    const validatedData = registerSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const result = await auth.api.signUpEmail({
      body: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      },
      headers: await headers(),
    });

    if (!result.user) {
      return { error: "Registration failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration" };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const validatedData = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
      headers: await headers(),
    });

    if (!result.user) {
      return { error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Invalid email or password" };
  }
}

export async function logoutUser() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: "An error occurred during logout" };
  }
}
