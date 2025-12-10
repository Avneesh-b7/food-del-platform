import mongoose from "mongoose";

async function healthCheckController(req, res) {
  try {
    const uptime = process.uptime();
    const requesterIP = req.ip; // <- using req safely Just for fun lol
    const dbState = mongoose.connection.readyState;
    const timestamp = new Date().toISOString();

    console.log(`Health check requested by ${requesterIP} at ${timestamp}`);

    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatus =
      dbState === 1
        ? "connected"
        : dbState === 2
          ? "connecting"
          : dbState === 3
            ? "disconnecting"
            : "disconnected";

    return res.status(200).json({
      success: true,
      message: "Service is healthy",
      system: {
        uptime_seconds: Math.floor(uptime),
        timestamp: new Date().toISOString(),
      },
      database: {
        status: dbStatus,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return res.status(500).json({
      success: false,
      message: "Service health check failed",
      error: error?.message || "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

export { healthCheckController };
