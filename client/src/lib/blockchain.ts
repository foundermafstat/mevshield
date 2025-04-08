import { apiRequest } from './queryClient';

export interface SandwichAnalysisRequest {
  transactionHash: string;
  blockNumber: number;
}

export interface SandwichAnalysisResult {
  isSandwich: boolean;
  confidence: number;
  details?: {
    frontRunTx?: string;
    victimTx: string;
    backRunTx?: string;
    valueExtracted?: number;
    priceImpact?: number;
    attacker?: string;
  };
  explanation: string[];
}

// Function to analyze a transaction for sandwich attack patterns
export async function analyzeTransaction(
  request: SandwichAnalysisRequest
): Promise<SandwichAnalysisResult> {
  const res = await apiRequest('POST', '/api/analyze', request);
  return await res.json();
}

// Function to block an attacker
export async function blockAttacker(attackerId: number): Promise<void> {
  await apiRequest('PATCH', `/api/attacks/${attackerId}`, {
    isBlocked: true
  });
}

// Function to add an attacker to watchlist
export async function addToWatchlist(attackerId: number): Promise<void> {
  await apiRequest('PATCH', `/api/attacks/${attackerId}`, {
    isWatched: true
  });
}

// Helper function to format time elapsed
export function formatTimeElapsed(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

// Helper function to format addresses and transaction hashes for display
export function formatHash(hash: string, length = 6): string {
  if (!hash) return '';
  if (hash.length <= length * 2 + 2) return hash;
  
  return `${hash.slice(0, length + 2)}...${hash.slice(-length)}`;
}
