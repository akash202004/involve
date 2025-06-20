import { createAdapter } from '@socket.io/redis-adapter';
import { redisPub, redisSub } from './redis';

export const initSocketRedisAdapter = (io: any) => {
  io.adapter(createAdapter(redisPub, redisSub));
};