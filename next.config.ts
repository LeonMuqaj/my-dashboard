import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://192.168.*.*:3000",  // Allow any 192.168.x.x address
    "http://10.*.*.*:3000",     // Allow any 10.x.x.x address  
    "http://172.16.*.*:3000",   // Allow any 172.16.x.x address
  ],
};

export default nextConfig;
