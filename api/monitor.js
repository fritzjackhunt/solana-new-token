import { rayFee, solanaConnection } from '../constants'; // Adjust path as necessary
import axios from 'axios';
import chalk from 'chalk';
import { Connection } from '@solana/web3.js';

const TELEGRAM_BOT_TOKEN = '7077890021:AAG-rsFpkYQb8KnKjE6zUspHP6mhFI_sUvM';
const TELEGRAM_CHAT_ID = '5181134931';

async function sendMessageToTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
  };

  try {
    await axios.post(url, payload);
    console.log(chalk.green('Message sent to Telegram successfully.'));
  } catch (error) {
    console.error('Error sending message to Telegram:', error.message);
  }
}

function generateExplorerUrl(mint) {
  return `https://dexscreener.com/solana/${mint}`;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log(chalk.green(`Monitoring new Solana tokens...`));

    try {
      connection.onLogs(
        rayFee,
        async ({ err, signature }) => {
          if (err) {
            console.error(`Connection contains error, ${err}`);
            return;
          }

          console.log(chalk.bgGreen(`Found new token signature: ${signature}`));

          const parsedTransaction = await connection.getParsedTransaction(
            signature,
            {
              maxSupportedTransactionVersion: 0,
              commitment: 'confirmed',
            }
          );

          if (parsedTransaction && parsedTransaction?.meta.err == null) {
            console.log(`Successfully parsed transaction`);
            const preTokenBalances = parsedTransaction?.meta.preTokenBalances;

            const mintAddresses = preTokenBalances
              .map(balance => balance.mint)
              .filter(mint => mint && mint !== 'So11111111111111111111111111111111111111112');

            if (mintAddresses.length > 0) {
              mintAddresses.forEach(mint => {
                const explorerUrl = generateExplorerUrl(mint);
                const message = `New Token Found!\nMint Address: ${mint}\nExplorer URL: ${explorerUrl}`;
                sendMessageToTelegram(message);
              });
            } else {
              console.log('No mint addresses found in preTokenBalances.');
            }
          }
        }
      );

      res.status(200).json({ message: 'Monitoring started' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error starting monitoring' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}