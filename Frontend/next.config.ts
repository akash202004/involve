import { createCivicAuthPlugin } from "@civic/auth/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.pravatar.cc', 'via.placeholder.com'],
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "8f217843-99ca-4206-ad02-b10adbe0c926"
});

export default withCivicAuth(nextConfig);
