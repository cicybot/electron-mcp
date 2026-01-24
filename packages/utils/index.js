/**
 * Utilities package - Shared utility functions
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function getGlobalJsCode() {
  const g = fs.readFileSync(path.join(__dirname, "../global.js"), "utf8");
  return g;
}

function generateId(length = 8) {
  return crypto.randomBytes(length).toString("hex");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDate(date) {
  return date.toISOString();
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
}

module.exports = {
  getGlobalJsCode,
  generateId,
  sleep,
  formatDate,
  sanitizeFilename,
};