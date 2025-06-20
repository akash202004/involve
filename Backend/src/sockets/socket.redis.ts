import { createAdapter } from "@socket.io/redis-adapter";
import { redisPub, redisSub } from "@/config/redis";

export const initSocketServer = (io: any) => {
  io.adapter(createAdapter(redisPub, redisSub)); 
};
