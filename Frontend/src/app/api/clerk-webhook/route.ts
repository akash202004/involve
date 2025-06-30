import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser } from "@/lib/userService";

// Webhook secret from Clerk dashboard
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await request.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(webhookSecret || "");

    let evt: any;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error occured", {
        status: 400,
      });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, phone_numbers } =
        evt.data;

      // Get primary email
      const primaryEmail = email_addresses?.find(
        (email: any) => email.id === evt.data.primary_email_address_id
      );
      const email = primaryEmail?.email_address;

      if (!email) {
        console.error("No email found for user:", id);
        return new NextResponse("No email found", { status: 400 });
      }

      try {
        // Create user in your database
        const userData = {
          firstName: first_name || "User",
          lastName: last_name || "Name",
          email: email,
          phoneNumber:
            phone_numbers?.[0]?.phone_number?.replace(/\D/g, "") ||
            "919999999999",
          address: "",
          city: "",
          state: "",
          country: "",
        };

        const newUser = await createUser(userData);
        console.log("✅ User created in database:", newUser.id);

        return NextResponse.json({
          message: "User created successfully",
          userId: newUser.id,
        });
      } catch (error) {
        console.error("Error creating user in database:", error);
        return new NextResponse("Error creating user in database", {
          status: 500,
        });
      }
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
