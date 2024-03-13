import WebSocket from 'ws'; // Import WebSocket module

export function PendingOrdersExecution() {
  const ws = new WebSocket("wss://stream.binance.com:9443/ws");
  ws.on('open', () => { // Use 'open' event instead of 'onopen'
    console.log("hello custom server"); // Corrected spelling of 'custom'
  });
}
