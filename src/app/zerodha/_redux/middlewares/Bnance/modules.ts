export const wsConnect = (host: string) => ({ type: "WS_CONNECT", host });
export const wsConnecting = (host: string) => ({ type: "WS_CONNECTING", host });
export const wsConnected = (host: string) => ({ type: "WS_CONNECTED", host });
export const wsDisconnect = (host: string) => ({ type: "WS_DISCONNECT", host });
export const wsDisconnected = (host: string) => ({
  type: "WS_DISCONNECTED",
  host,
});
