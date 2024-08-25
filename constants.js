import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();

const RPC_ENDPOINT = process.env.RPC_ENDPOINT ?? clusterApiUrl('mainnet-beta');
const RPC_WEBSOCKET_ENDPOINT =
  process.env.RPC_WEBSOCKET_ENDPOINT ?? 'wss://api.mainnet-beta.solana.com';

export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});

export const rayFee = new PublicKey(
  'DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8'
);
