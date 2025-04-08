import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define supported exchanges
export const exchanges = ["Uniswap V3", "SushiSwap", "PancakeSwap", "Curve", "Balancer", "dYdX", "GMX", "TraderJoe", "SpookySwap", "QuickSwap", "VVS Finance", "Raydium"];

export const attackStatuses = ["Confirmed Attack", "Potential Attack", "False Positive", "No Threat"] as const;

// Define attacks table schema
export const attacks = pgTable("attacks", {
  id: serial("id").primaryKey(),
  status: text("status").notNull(),
  exchange: text("exchange").notNull(),
  tokenPair: text("token_pair").notNull(),
  token0Symbol: text("token0_symbol").notNull(),
  token1Symbol: text("token1_symbol").notNull(),
  valueExtracted: doublePrecision("value_extracted").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  frontRunTxHash: text("front_run_tx_hash").notNull(),
  victimTxHash: text("victim_tx_hash").notNull(),
  backRunTxHash: text("back_run_tx_hash").notNull(),
  attackerAddress: text("attacker_address").notNull(),
  victimAddress: text("victim_address").notNull(),
  confidence: doublePrecision("confidence").notNull(),
  priceImpact: doublePrecision("price_impact").notNull(),
  metadata: json("metadata"),
  isBlocked: boolean("is_blocked").notNull().default(false),
  isWatched: boolean("is_watched").notNull().default(false),
});

export const insertAttackSchema = createInsertSchema(attacks).omit({
  id: true,
  timestamp: true
});

export type InsertAttack = z.infer<typeof insertAttackSchema>;
export type Attack = typeof attacks.$inferSelect;

// Define stats table for dashboard metrics
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  totalAttacks: integer("total_attacks").notNull().default(0),
  potentialAttacks: integer("potential_attacks").notNull().default(0),
  confirmedAttacks: integer("confirmed_attacks").notNull().default(0),
  valueAtRisk: doublePrecision("value_at_risk").notNull().default(0),
  protectedTransactions: integer("protected_transactions").notNull().default(0),
  monitoredDexs: integer("monitored_dexs").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  lastUpdated: true
});

export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;
