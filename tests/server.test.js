const request = require('supertest');
const { app, store } = require('../src/server');

beforeEach(() => store.clear());

// ── Health Endpoint (US-06) ───────────────────────────────────────────────────
describe('GET /health (US-06)', () => {
  test('returns status ok with uptime', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.timestamp).toBeDefined();
  });
});

// ── POST /tasks (US-01) ───────────────────────────────────────────────────────
describe('POST /tasks (US-01)', () => {
  test('creates a task and returns 201', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Integration test task' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Integration test task');
    expect(res.body.status).toBe('open');
    expect(res.body.id).toBeDefined();
  });

  test('returns 400 for empty title', async () => {
    const res = await request(app).post('/tasks').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/non-empty string/);
  });

  test('returns 400 when title is missing', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
  });
});

// ── GET /tasks (US-02) ────────────────────────────────────────────────────────
describe('GET /tasks (US-02)', () => {
  test('returns empty array initially', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns all created tasks', async () => {
    await request(app).post('/tasks').send({ title: 'Task A' });
    await request(app).post('/tasks').send({ title: 'Task B' });
    const res = await request(app).get('/tasks');
    expect(res.body).toHaveLength(2);
  });
});

// ── GET /tasks?status= (US-05) ───────────────────────────────────────────────
describe('GET /tasks?status filter (US-05)', () => {
  test('filters open tasks', async () => {
    const r1 = await request(app).post('/tasks').send({ title: 'Open' });
    const r2 = await request(app).post('/tasks').send({ title: 'Will close' });
    await request(app).patch(`/tasks/${r2.body.id}/complete`);

    const res = await request(app).get('/tasks?status=open');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(r1.body.id);
  });

  test('returns 400 for invalid status', async () => {
    const res = await request(app).get('/tasks?status=invalid');
    expect(res.status).toBe(400);
  });
});

// ── PATCH /tasks/:id/complete (US-03) ────────────────────────────────────────
describe('PATCH /tasks/:id/complete (US-03)', () => {
  test('marks task as done', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Finish me' });
    const res = await request(app).patch(`/tasks/${created.body.id}/complete`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
    expect(res.body.completedAt).not.toBeNull();
  });

  test('returns 404 for unknown ID', async () => {
    const res = await request(app).patch('/tasks/ghost-id/complete');
    expect(res.status).toBe(404);
  });
});

// ── DELETE /tasks/:id (US-04) ─────────────────────────────────────────────────
describe('DELETE /tasks/:id (US-04)', () => {
  test('deletes the task', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Remove me' });
    const res = await request(app).delete(`/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(true);
  });

  test('returns 404 for unknown ID', async () => {
    const res = await request(app).delete('/tasks/no-such-task');
    expect(res.status).toBe(404);
  });
});
