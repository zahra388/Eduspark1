import { SyncItem } from "../types";

type SyncListener = (isOnline: boolean, pendingCount: number, lastSyncTime: number | null) => void;

class SyncService {
  private listeners: Set<SyncListener> = new Set();
  private isOnline: boolean = typeof navigator !== "undefined" ? navigator.onLine : true;
  private lastSyncTime: number | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.handleNetworkChange(true));
      window.addEventListener("offline", () => this.handleNetworkChange(false));
      const savedTime = localStorage.getItem("eduspark_last_sync");
      if (savedTime) this.lastSyncTime = parseInt(savedTime, 10);
    }
  }

  private handleNetworkChange(online: boolean) {
    this.isOnline = online;
    if (online) {
      this.syncNow();
    }
    this.notify();
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.isOnline, this.getPendingCount(), this.lastSyncTime);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const count = this.getPendingCount();
    this.listeners.forEach((l) => l(this.isOnline, count, this.lastSyncTime));
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getPendingQueue(): SyncItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("eduspark_offline_queue");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public getPendingCount(): number {
    return this.getPendingQueue().length;
  }

  public queueItem(type: SyncItem["type"], payload: any): SyncItem {
    const item: SyncItem = {
      id: "sync_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      type,
      payload,
      timestamp: Date.now(),
      synced: false,
    };

    const current = this.getPendingQueue();
    current.push(item);
    localStorage.setItem("eduspark_offline_queue", JSON.stringify(current));
    this.notify();

    // If online, attempt immediate sync in background
    if (this.isOnline) {
      this.syncNow();
    }

    return item;
  }

  public async syncNow(): Promise<{ success: boolean; syncedCount: number }> {
    const queue = this.getPendingQueue();
    if (queue.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: queue,
          userId: localStorage.getItem("eduspark_user_id") || "guest_student",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.removeItem("eduspark_offline_queue");
        this.lastSyncTime = Date.now();
        localStorage.setItem("eduspark_last_sync", this.lastSyncTime.toString());
        this.notify();
        return { success: true, syncedCount: data.syncedCount || queue.length };
      }
    } catch (e) {
      console.warn("Background sync failed (will retry automatically):", e);
    }
    return { success: false, syncedCount: 0 };
  }

  public clearQueue(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("eduspark_offline_queue");
      this.notify();
    }
  }
}

export const syncService = new SyncService();
