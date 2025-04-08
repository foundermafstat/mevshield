import { 
  users, type User, type InsertUser, 
  attacks, type Attack, type InsertAttack,
  stats, type Stats, type InsertStats
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Attack operations
  getAllAttacks(limit?: number, offset?: number): Promise<Attack[]>;
  getAttacksByStatus(status: string, limit?: number, offset?: number): Promise<Attack[]>;
  getAttacksByExchange(exchange: string, limit?: number, offset?: number): Promise<Attack[]>;
  getAttackById(id: number): Promise<Attack | undefined>;
  createAttack(attack: InsertAttack): Promise<Attack>;
  updateAttack(id: number, attack: Partial<Attack>): Promise<Attack | undefined>;
  getAttackCount(): Promise<number>;
  
  // Stats operations
  getStats(): Promise<Stats | undefined>;
  updateStats(stats: Partial<InsertStats>): Promise<Stats | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private attacksData: Map<number, Attack>;
  private statsData: Stats | undefined;
  private userCurrentId: number;
  private attackCurrentId: number;

  constructor() {
    this.users = new Map();
    this.attacksData = new Map();
    this.userCurrentId = 1;
    this.attackCurrentId = 1;
    
    // Initialize with some default stats
    this.statsData = {
      id: 1,
      totalAttacks: 147,
      potentialAttacks: 42,
      confirmedAttacks: 85,
      valueAtRisk: 342500,
      protectedTransactions: 8942,
      monitoredDexs: 12,
      lastUpdated: new Date()
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Attack operations
  async getAllAttacks(limit = 100, offset = 0): Promise<Attack[]> {
    const attacks = Array.from(this.attacksData.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return attacks.slice(offset, offset + limit);
  }
  
  async getAttacksByStatus(status: string, limit = 100, offset = 0): Promise<Attack[]> {
    const attacks = Array.from(this.attacksData.values())
      .filter(attack => attack.status === status)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return attacks.slice(offset, offset + limit);
  }
  
  async getAttacksByExchange(exchange: string, limit = 100, offset = 0): Promise<Attack[]> {
    const attacks = Array.from(this.attacksData.values())
      .filter(attack => attack.exchange === exchange)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return attacks.slice(offset, offset + limit);
  }
  
  async getAttackById(id: number): Promise<Attack | undefined> {
    return this.attacksData.get(id);
  }
  
  async createAttack(insertAttack: InsertAttack): Promise<Attack> {
    const id = this.attackCurrentId++;
    const attack: Attack = { 
      ...insertAttack, 
      id, 
      timestamp: new Date()
    };
    
    this.attacksData.set(id, attack);
    
    // Update stats
    if (this.statsData) {
      this.statsData.totalAttacks += 1;
      
      if (attack.status === "Confirmed Attack") {
        this.statsData.confirmedAttacks += 1;
      } else if (attack.status === "Potential Attack") {
        this.statsData.potentialAttacks += 1;
      }
      
      this.statsData.valueAtRisk += attack.valueExtracted;
      this.statsData.lastUpdated = new Date();
    }
    
    return attack;
  }
  
  async updateAttack(id: number, attackUpdate: Partial<Attack>): Promise<Attack | undefined> {
    const existingAttack = this.attacksData.get(id);
    
    if (!existingAttack) {
      return undefined;
    }
    
    const updatedAttack: Attack = { ...existingAttack, ...attackUpdate };
    this.attacksData.set(id, updatedAttack);
    
    return updatedAttack;
  }
  
  async getAttackCount(): Promise<number> {
    return this.attacksData.size;
  }
  
  // Stats operations
  async getStats(): Promise<Stats | undefined> {
    return this.statsData;
  }
  
  async updateStats(statsUpdate: Partial<InsertStats>): Promise<Stats | undefined> {
    if (!this.statsData) {
      return undefined;
    }
    
    this.statsData = {
      ...this.statsData,
      ...statsUpdate,
      lastUpdated: new Date()
    };
    
    return this.statsData;
  }
}

export const storage = new MemStorage();
