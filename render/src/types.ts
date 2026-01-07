
export const DEFAULT_RPC_URL = "http://127.0.0.1:3456/rpc";

export interface RpcResponse<T> {
  ok: boolean;
  result?: T;
  error?: string;
}

export interface WindowInfo {
  id: number;
  wcId: number;
  url: string; 
}

export type WindowMap = Record<string, Record<string, { id: number; wcId: number }>>;

export interface NetworkLog {
    id: string;
    url: string;
    method: string;
    statusCode?: number;
    timestamp: number;
    requestHeaders?: Record<string, string>;
    responseHeaders?: Record<string, string>;
    win_id?: number; 
    resourceType?: string;
}
