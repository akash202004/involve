import { AptosClient, AptosAccount, HexString, TxnBuilderTypes, BCS } from "aptos";
import dotenv from "dotenv";
dotenv.config();

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

const PRIVATE_KEY = process.env.APTOS_PRIVATE_KEY!;
const ACCOUNT_ADDRESS = process.env.APTOS_ACCOUNT_ADDRESS!;

// Create account from private key
const privateKeyBytes = new Uint8Array(Buffer.from(PRIVATE_KEY, "hex"));
const account = new AptosAccount(privateKeyBytes);

export async function logBookingOnChain({
  jobId,
  user,
  worker,
  timestamp,
}: {
  jobId: number;
  user: string;
  worker: string;
  timestamp: number;
}) {
  const payload = {
    type: "entry_function_payload",
    function: `${ACCOUNT_ADDRESS}::booking::add_booking`,
    type_arguments: [],
    arguments: [jobId, user, worker, timestamp],
  };

  try {
    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const txResult = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(txResult.hash);

    return txResult.hash;
  } catch (err) {
    console.error("⚠️ Blockchain log failed:", err);
    return null;
  }
}
