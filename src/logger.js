/**
 * logger.js — Structured JSON logger for TaskFlow (US-07).
 * Every operation emits a JSON line to stdout for easy parsing.
 */

function log(level, operation, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    operation,
    ...meta,
  };
  console.log(JSON.stringify(entry));
}

const logger = {
  info: (operation, meta) => log('INFO', operation, meta),
  error: (operation, meta) => log('ERROR', operation, meta),
  warn: (operation, meta) => log('WARN', operation, meta),
};

module.exports = logger;
