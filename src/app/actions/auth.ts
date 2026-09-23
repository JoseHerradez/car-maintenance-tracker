"use server";

import { signIn as nextAuthSignIn } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function registerUser(formData: FormData) {
  try {
    // Validate the form data
    const validatedData = registerSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create the user
    await db.insert(users).values({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    // Sign in the user automatically
    const result = await nextAuthSignIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    // Check if sign in failed
    if (result?.error) {
      return { error: "Registration succeeded but sign in failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration" };
  }
}

export async function loginUser(formData: FormData) {
  try {
    // Validate the form data
    const validatedData = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Sign in with credentials
    const result = await nextAuthSignIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    // Check if sign in failed (result will have an error property)
    if (result?.error) {
      return { error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred" };
  }
}
