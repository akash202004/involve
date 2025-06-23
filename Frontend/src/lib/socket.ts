import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      // Get backend URL with fallback
      const backendUrl = this.getBackendUrl();
      console.log("🔌 [SOCKET] Attempting connection to:", backendUrl);

      // Create socket with improved configuration
      this.socket = io(backendUrl, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        upgrade: true,
        rememberUpgrade: true,
        // Add additional options for better connection
        withCredentials: true,
        extraHeaders: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      this.setupEventListeners();
      this.startConnectionMonitoring();
    } catch (error) {
      console.error("❌ [SOCKET] Failed to initialize socket:", error);
      this.handleConnectionError(error);
    }
  }

  private getBackendUrl(): string {
    // Try multiple backend URLs in order of preference
    const possibleUrls = [
      process.env.NEXT_PUBLIC_BACKEND_URL,
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "https://your-production-backend.com", // Add your production URL
    ];

    const backendUrl = possibleUrls.find(url => url) || "http://localhost:5000";
    console.log("🌐 [SOCKET] Using backend URL:", backendUrl);
    return backendUrl;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ [SOCKET] Connected successfully");
      console.log("🆔 [SOCKET] Socket ID:", this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.clearReconnectTimer();
      
      // Send a test message to verify connection
      this.emit("test_message", { 
        message: "Frontend connected", 
        timestamp: new Date().toISOString() 
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 [SOCKET] Disconnected:", reason);
      this.isConnected = false;

      // Auto-reconnect for certain disconnect reasons
      if (reason === "io server disconnect" || reason === "io client disconnect") {
        console.log("🔄 [SOCKET] Attempting to reconnect...");
        setTimeout(() => {
          this.socket?.connect();
        }, 1000);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ [SOCKET] Connection error:", error);
      this.isConnected = false;
      this.reconnectAttempts++;

      this.handleConnectionError(error);

      // Manual reconnection after delay
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else {
        console.error("❌ [SOCKET] Max reconnection attempts reached");
        this.showConnectionError();
      }
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 [SOCKET] Reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.clearReconnectTimer();
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ [SOCKET] Reconnection failed after all attempts");
      this.isConnected = false;
      this.showConnectionError();
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 [SOCKET] Reconnection attempt ${attemptNumber}/${this.maxReconnectAttempts}`);
    });

    this.socket.on("error", (error) => {
      console.error("❌ [SOCKET] Socket error:", error);
    });

    // Listen for test responses
    this.socket.on("test_response", (data) => {
      console.log("📨 [SOCKET] Received test response:", data);
    });

    // Listen for job updates
    this.socket.on("job_update", (data) => {
      console.log("📨 [SOCKET] Job update received:", data);
    });

    // Listen for worker location updates
    this.socket.on("worker_location", (data) => {
      console.log("📍 [SOCKET] Worker location update:", data);
    });
  }

  private handleConnectionError(error: any) {
    console.error("❌ [SOCKET] Connection error details:", {
      message: error.message,
      type: error.type,
      description: error.description,
    });

    // Provide specific error messages
    if (error.message.includes("xhr poll error")) {
      console.log("💡 [SOCKET] Backend server might not be running. Start it with: npm run dev");
    } else if (error.message.includes("timeout")) {
      console.log("💡 [SOCKET] Connection timeout - check your network connection");
    } else if (error.message.includes("CORS")) {
      console.log("💡 [SOCKET] CORS error - check backend CORS configuration");
    } else if (error.message.includes("ECONNREFUSED")) {
      console.log("💡 [SOCKET] Connection refused - backend server not available");
    }
  }

  private scheduleReconnect() {
    this.clearReconnectTimer();
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`⏰ [SOCKET] Scheduling reconnect in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      console.log(`🔄 [SOCKET] Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      if (this.socket) {
        this.socket.connect();
      }
    }, delay);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startConnectionMonitoring() {
    // Monitor connection status every 30 seconds
    this.connectionCheckInterval = setInterval(() => {
      const status = this.getConnectionStatus();
      if (!status.connected && this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log("🔍 [SOCKET] Connection check - attempting reconnect");
        this.socket?.connect();
      }
    }, 30000);
  }

  private showConnectionError() {
    console.error("❌ [SOCKET] Connection failed. Please check:");
    console.error("1. Backend server is running on port 5000");
    console.error("2. Redis server is running");
    console.error("3. Network connection is stable");
    console.error("4. No firewall blocking the connection");
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Connect to socket
  connect() {
    if (this.socket && !this.isConnected) {
      console.log("🔌 [SOCKET] Manually connecting...");
      this.socket.connect();
    }
  }

  // Disconnect from socket
  disconnect() {
    if (this.socket) {
      console.log("🔌 [SOCKET] Manually disconnecting...");
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Emit event with error handling
  emit(event: string, data: any) {
    if (this.socket && this.isConnected) {
      try {
        this.socket.emit(event, data);
        console.log(`📤 [SOCKET] Emitted: ${event}`, data);
      } catch (error) {
        console.error(`❌ [SOCKET] Failed to emit ${event}:`, error);
      }
    } else {
      console.warn(`⚠️ [SOCKET] Socket not connected, cannot emit event: ${event}`);
      // Queue the event for when connection is restored
      this.queueEvent(event, data);
    }
  }

  private eventQueue: Array<{ event: string; data: any }> = [];

  private queueEvent(event: string, data: any) {
    this.eventQueue.push({ event, data });
    console.log(`📋 [SOCKET] Queued event: ${event} (queue size: ${this.eventQueue.length})`);
  }

  private processEventQueue() {
    if (this.eventQueue.length > 0 && this.isConnected) {
      console.log(`📤 [SOCKET] Processing ${this.eventQueue.length} queued events`);
      this.eventQueue.forEach(({ event, data }) => {
        this.socket?.emit(event, data);
      });
      this.eventQueue = [];
    }
  }

  // Listen to event
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
      console.log(`👂 [SOCKET] Listening to: ${event}`);
    }
  }

  // Remove event listener
  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Join room
  joinRoom(roomName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("join_room", { room: roomName });
      console.log(`🏠 [SOCKET] Joined room: ${roomName}`);
    } else {
      console.warn("⚠️ [SOCKET] Cannot join room - socket not connected");
    }
  }

  // Leave room
  leaveRoom(roomName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("leave_room", { room: roomName });
      console.log(`🚪 [SOCKET] Left room: ${roomName}`);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketConnected: this.socket?.connected || false,
      reconnectAttempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      socketId: this.socket?.id || null,
      eventQueueSize: this.eventQueue.length,
    };
  }

  // Test connection
  testConnection() {
    console.log("🧪 [SOCKET] Testing connection...");
    this.emit("test_message", { 
      message: "Connection test", 
      timestamp: new Date().toISOString() 
    });
  }

  // Cleanup
  destroy() {
    this.clearReconnectTimer();
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }
    if (this.socket) {
      this.socket.disconnect();
    }
    this.isConnected = false;
    this.eventQueue = [];
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
