import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAttackSchema } from "@shared/schema";
import { initBlockchainMonitoring } from "./services/blockchain";
import { analyzePotentialSandwichAttack } from "./services/sandwich-detector";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize blockchain monitoring
  await initBlockchainMonitoring();

  // Get all attacks with pagination
  app.get("/api/attacks", async (req, res) => {
    const limit = parseInt(req.query.limit as string || "10");
    const offset = parseInt(req.query.offset as string || "0");
    const exchange = req.query.exchange as string;
    const status = req.query.status as string;
    
    try {
      let attacks;
      if (exchange) {
        attacks = await storage.getAttacksByExchange(exchange, limit, offset);
      } else if (status) {
        attacks = await storage.getAttacksByStatus(status, limit, offset);
      } else {
        attacks = await storage.getAllAttacks(limit, offset);
      }
      
      const total = await storage.getAttackCount();
      
      res.json({
        attacks,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + attacks.length < total
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attacks" });
    }
  });

  // Get attack by ID
  app.get("/api/attacks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
      const attack = await storage.getAttackById(id);
      
      if (!attack) {
        return res.status(404).json({ error: "Attack not found" });
      }
      
      res.json(attack);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attack" });
    }
  });

  // Create a new attack
  app.post("/api/attacks", async (req, res) => {
    try {
      const attackData = insertAttackSchema.parse(req.body);
      const attack = await storage.createAttack(attackData);
      res.status(201).json(attack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create attack" });
    }
  });

  // Update an attack
  app.patch("/api/attacks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
      const updatedAttack = await storage.updateAttack(id, req.body);
      
      if (!updatedAttack) {
        return res.status(404).json({ error: "Attack not found" });
      }
      
      res.json(updatedAttack);
    } catch (error) {
      res.status(500).json({ error: "Failed to update attack" });
    }
  });

  // Analyze a transaction for potential sandwich attacks
  app.post("/api/analyze", async (req, res) => {
    const { transactionHash, blockNumber = 0 } = req.body;
    
    if (!transactionHash) {
      return res.status(400).json({ error: "Venn ID is required" });
    }
    
    try {
      const result = await analyzePotentialSandwichAttack(transactionHash, blockNumber);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze transaction" });
    }
  });

  // Get dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      
      if (!stats) {
        return res.status(404).json({ error: "Stats not found" });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get detected sandwich attack patterns
  app.get("/api/patterns", async (req, res) => {
    // This would typically analyze patterns from stored attacks
    // For now, just return a sample of common patterns
    res.json({
      patterns: [
        {
          name: "High Gas Price Front-running",
          description: "Attackers front-run transactions with abnormally high gas prices",
          frequency: 68,
          avgValueExtracted: 3245.75
        },
        {
          name: "MEV Bot Sandwiching",
          description: "MEV bots sandwiching large swaps on popular DEXs",
          frequency: 42,
          avgValueExtracted: 7823.12
        },
        {
          name: "Mempool Sniping",
          description: "Transactions in the mempool being targeted for sandwich attacks",
          frequency: 37,
          avgValueExtracted: 2145.50
        }
      ]
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
