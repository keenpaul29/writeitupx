const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  // Store active connections and their associated user data
  const clients = new Map();

  wss.on('connection', async (ws, req) => {
    let userId = null;

    try {
      // Extract token from the connection request
      const url = new URL(req.url, 'ws://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;

      // Store client connection with user data
      clients.set(ws, {
        userId,
        lastActivity: Date.now()
      });

      // Broadcast user presence to all connected clients
      broadcastUserPresence();

      // Handle incoming messages
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          handleMessage(ws, data);
        } catch (error) {
          console.error('Error processing message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      // Handle client disconnection
      ws.on('close', () => {
        clients.delete(ws);
        broadcastUserPresence();
      });

      // Send initial connection success message
      ws.send(JSON.stringify({ type: 'connected', userId }));

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(1008, 'Authentication failed');
    }
  });

  // Handle different types of messages
  const handleMessage = (ws, data) => {
    const { type, payload } = data;
    const client = clients.get(ws);

    if (!client) return;

    switch (type) {
      case 'cursor_position':
        broadcastToOthers(ws, {
          type: 'cursor_update',
          userId: client.userId,
          position: payload.position
        });
        break;

      case 'content_change':
        broadcastToOthers(ws, {
          type: 'content_update',
          userId: client.userId,
          changes: payload.changes
        });
        break;

      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;

      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }

    // Update last activity timestamp
    client.lastActivity = Date.now();
  };

  // Broadcast message to all clients except sender
  const broadcastToOthers = (sender, message) => {
    clients.forEach((client, ws) => {
      if (ws !== sender && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  };

  // Broadcast user presence information
  const broadcastUserPresence = () => {
    const activeUsers = Array.from(clients.values()).map(client => ({
      userId: client.userId,
      lastActivity: client.lastActivity
    }));

    const message = JSON.stringify({
      type: 'presence_update',
      users: activeUsers
    });

    clients.forEach((client, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  };

  // Cleanup inactive connections periodically
  setInterval(() => {
    const now = Date.now();
    clients.forEach((client, ws) => {
      if (now - client.lastActivity > 30000) { // 30 seconds timeout
        ws.close(1000, 'Connection timeout');
        clients.delete(ws);
      }
    });
  }, 10000); // Check every 10 seconds

  return wss;
};

module.exports = setupWebSocket;