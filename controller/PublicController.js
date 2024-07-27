const { default: mongoose } = require("mongoose");

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  if (bytes === null) return "Unknown";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const getDbStats = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.command({ dbStats: 1 });

    // Format the size-related fields
    const formattedStats = {
      db: stats.db,
      collections: stats.collections,
      views: stats.views,
      objects: stats.objects,
      avgObjSize: formatBytes(stats.avgObjSize),
      dataSize: formatBytes(stats.dataSize),
      storageSize: formatBytes(stats.storageSize),
      totalFreeStorageSize: formatBytes(stats.totalFreeStorageSize),
      numExtents: stats.numExtents,
      indexes: stats.indexes,
      indexSize: formatBytes(stats.indexSize),
      indexFreeStorageSize: formatBytes(stats.indexFreeStorageSize),
      fileSize: formatBytes(stats.fileSize),
      nsSizeMB: stats.nsSizeMB + " MB",
      ok: stats.ok,
    };
    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Error fetching DB stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getDbStats };
