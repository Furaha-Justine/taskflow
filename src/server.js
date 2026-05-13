/**
 * TaskFlow HTTP Server
 * Exposes task operations over REST + health monitoring endpoint (US-06).
 */

const express = require('express');
const TaskStore = require('./taskStore');
const logger = require('./logger');

const app = express();
app.use(express.json());

const store = new TaskStore();
const START_TIME = Date.now();

// ── Health Check (US-06) ──────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    timestamp: new Date().toISOString(),
  });
});

// ── POST /tasks — Add a task (US-01) ─────────────────────────────────────────
app.post('/tasks', (req, res) => {
  try {
    const task = store.addTask(req.body.title);
    logger.info('addTask', { taskId: task.id, title: task.title });
    res.status(201).json(task);
  } catch (err) {
    logger.error('addTask', { error: err.message });
    res.status(400).json({ error: err.message });
  }
});

// ── GET /tasks — List tasks (US-02, US-05) ───────────────────────────────────
app.get('/tasks', (req, res) => {
  try {
    const tasks = store.listTasks(req.query.status ? { status: req.query.status } : {});
    logger.info('listTasks', { count: tasks.length, filter: req.query.status || 'none' });
    res.json(tasks);
  } catch (err) {
    logger.error('listTasks', { error: err.message });
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH /tasks/:id/complete — Complete a task (US-03) ──────────────────────
app.patch('/tasks/:id/complete', (req, res) => {
  try {
    const task = store.completeTask(req.params.id);
    logger.info('completeTask', { taskId: task.id });
    res.json(task);
  } catch (err) {
    logger.error('completeTask', { error: err.message, taskId: req.params.id });
    res.status(404).json({ error: err.message });
  }
});

// ── DELETE /tasks/:id — Delete a task (US-04) ────────────────────────────────
app.delete('/tasks/:id', (req, res) => {
  try {
    const result = store.deleteTask(req.params.id);
    logger.info('deleteTask', { taskId: result.id });
    res.json(result);
  } catch (err) {
    logger.error('deleteTask', { error: err.message, taskId: req.params.id });
    res.status(404).json({ error: err.message });
  }
});

module.exports = { app, store };
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info('server:start', { port: PORT });
    console.log(`TaskFlow running on http://localhost:${PORT}`);
  });
}
