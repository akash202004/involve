import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      console.log("🔌 [SOCKET] Connecting to:", backendUrl);

      this.socket = io(backendUrl, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error("❌ [SOCKET] Failed to initialize socket:", error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ [SOCKET] Connected successfully");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 [SOCKET] Disconnected:", reason);
      this.isConnected = false;

      // Auto-reconnect for certain disconnect reasons
      if (
        reason === "io server disconnect" ||
        reason === "io client disconnect"
      ) {
        console.log("🔄 [SOCKET] Attempting to reconnect...");
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ [SOCKET] Connection error:", error);
      this.isConnected = false;
      this.reconnectAttempts++;

      // Provide helpful error messages
      if (error.message.includes("xhr poll error")) {
        console.log(
          "💡 [SOCKET] Make sure the backend server is running on port 5000"
        );
      } else if (error.message.includes("timeout")) {
        console.log(
          "💡 [SOCKET] Connection timeout - check your network connection"
        );
      }

      // Manual reconnection after delay
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectTimer = setTimeout(() => {
          console.log(
            `🔄 [SOCKET] Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
          );
          this.socket?.connect();
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 [SOCKET] Reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ [SOCKET] Reconnection failed after all attempts");
      this.isConnected = false;
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 [SOCKET] Reconnection attempt ${attemptNumber}`);
    });

    this.socket.on("error", (error) => {
      console.error("❌ [SOCKET] Socket error:", error);
    });
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
      console.warn(
        "⚠️ [SOCKET] Socket not connected, cannot emit event:",
        event
      );
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
    };
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;
