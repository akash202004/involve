import { db } from "@/lib/db";
import { users } from "@/models/schema";
import { userSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

// Create User
export const createUser = async (req: Request, res: Response) => {
  try {
    const parsedData = userSchema.omit({ createdAt: true }).parse(req.body);

    const newUser = await db.insert(users).values(parsedData).returning();
    res.status(201).json({ message: "User created", data: newUser[0] });
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
    return;
  }
};

// Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
    return;
  }
};

// Get User by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.select().from(users).where(eq(users.id, id));

    if (user.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user by id" });
    return;
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedData = userSchema.partial().parse(req.body);

    const updatedUser = await db
      .update(users)
      .set(parsedData)
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      res.status(404).json({ error: "User not found or not updated" });
      return;
    }

    res.status(200).json({ message: "User updated", data: updatedUser[0] });
  } catch (error) {
    res.status(400).json({ error: "Failed to update user" });
    return;
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await db.delete(users).where(eq(users.id, id)).returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted", data: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
    return;
  }
};
