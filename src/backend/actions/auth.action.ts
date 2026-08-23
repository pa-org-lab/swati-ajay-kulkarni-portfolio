"use server";

import { User } from "../models/user.model";
import { SignupSchema, LoginSchema } from "../schemas/auth.schema";
import bcrypt from "bcryptjs";
import dbConnect from "../config/dbConnect";

export async function signup(data: unknown) {

  const validData = SignupSchema.safeParse(data);
  if (!validData.success) {
    return { success: false, error: validData.error.issues };
  }

  const { name, email, password } = validData.data;

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true, user };
}

export async function login(data: unknown) {
  const validData = LoginSchema.safeParse(data);
  if (!validData.success) {
    return { success: false, error: validData.error.issues };
  }

  const { email, password } = validData.data;

  await dbConnect();

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, error: "Invalid password" };
  }

  return { success: true, user };
}
