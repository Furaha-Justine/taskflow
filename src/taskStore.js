/**
 * TaskStore — in-memory task storage engine.
 * Implements the core CRUD operations for TaskFlow.
 */

const { v4: uuidv4 } = require('uuid');

class TaskStore {
  constructor() {
    /** @type {Map<string, Object>} */
    this.tasks = new Map();
  }

  /**
   * Add a new task.
   * @param {string} title - Non-empty task title
   * @returns {{ id: string, title: string, status: string, createdAt: string }}
   * @throws {Error} if title is empty or not a string
   */
  addTask(title) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new Error('Task title must be a non-empty string');
    }
    const task = {
      id: uuidv4(),
      title: title.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    this.tasks.set(task.id, task);
    return { ...task };
  }

  /**
   * List all tasks, sorted by creation date (oldest first).
   * @param {{ status?: string }} [options] - Optional filter
   * @returns {Array<Object>}
   */
  listTasks(options = {}) {
    let result = Array.from(this.tasks.values());
    if (options.status) {
      if (!['open', 'done'].includes(options.status)) {
        throw new Error("Status filter must be 'open' or 'done'");
      }
      result = result.filter(t => t.status === options.status);
    }
    return result
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(t => ({ ...t }));
  }

  /**
   * Mark a task as complete.
   * @param {string} id - Task UUID
   * @returns {Object} Updated task
   * @throws {Error} if task not found
   */
  completeTask(id) {
    const task = this.tasks.get(id);
    if (!task) throw new Error(`Task not found: ${id}`);
    task.status = 'done';
    task.completedAt = new Date().toISOString();
    return { ...task };
  }

  /**
   * Delete a task by ID.
   * @param {string} id - Task UUID
   * @returns {{ deleted: true, id: string }}
   * @throws {Error} if task not found
   */
  deleteTask(id) {
    if (!this.tasks.has(id)) throw new Error(`Task not found: ${id}`);
    this.tasks.delete(id);
    return { deleted: true, id };
  }

  /** Clear all tasks (used in tests). */
  clear() {
    this.tasks.clear();
  }
}

module.exports = TaskStore;
