import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

describe('Notes API', () => {
  let cookie; // logged-in user ka session cookie yahan store hoga
  let otherUserCookie; // dusre user ka cookie (IDOR test ke liye)

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    // Har test se pehle ek fresh user signup + login karo, cookie nikal lo
    const signupRes = await request(app).post('/api/auth/signup').send({
      name: 'Note Owner',
      email: 'owner@example.com',
      password: '123456',
    });
    cookie = signupRes.headers['set-cookie'];

    // Doosra user bhi bana lo — permission tests ke liye
    const otherRes = await request(app).post('/api/auth/signup').send({
      name: 'Other User',
      email: 'other@example.com',
      password: '123456',
    });
    otherUserCookie = otherRes.headers['set-cookie'];
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe('POST /api/notes', () => {
    it('should create a note for logged-in user', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ title: 'My First Note', content: 'Some content here' });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.note).to.have.property('title', 'My First Note');
    });

    it('should reject note creation without auth', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({ title: 'No Auth Note', content: 'content' });

      expect(res.status).to.equal(401);
    });

    it('should reject note with missing title', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ content: 'content only' });

      expect(res.status).to.equal(400);
    });
  });

  describe('GET /api/notes', () => {
    it('should return only the logged-in user\'s notes', async () => {
      // owner ke 2 notes
      await request(app).post('/api/notes').set('Cookie', cookie).send({ title: 'Note 1', content: 'A' });
      await request(app).post('/api/notes').set('Cookie', cookie).send({ title: 'Note 2', content: 'B' });

      // other user ka 1 note
      await request(app).post('/api/notes').set('Cookie', otherUserCookie).send({ title: 'Other Note', content: 'C' });

      const res = await request(app).get('/api/notes').set('Cookie', cookie);

      expect(res.status).to.equal(200);
      expect(res.body.count).to.equal(2); // sirf owner ke 2 notes, other user ka nahi
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should get a single note by id', async () => {
      const createRes = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ title: 'Single Note', content: 'test' });

      const res = await request(app)
        .get(`/api/notes/${createRes.body.note._id}`)
        .set('Cookie', cookie);

      expect(res.status).to.equal(200);
      expect(res.body.note.title).to.equal('Single Note');
    });

    it('should NOT allow accessing another user\'s note (IDOR check)', async () => {
      const createRes = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ title: 'Private Note', content: 'secret' });

      // Other user try kare owner ki note access karne
      const res = await request(app)
        .get(`/api/notes/${createRes.body.note._id}`)
        .set('Cookie', otherUserCookie);

      expect(res.status).to.equal(404); // "not found" — exist karti hai batana bhi security leak hai
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update own note', async () => {
      const createRes = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ title: 'Old Title', content: 'Old content' });

      const res = await request(app)
        .put(`/api/notes/${createRes.body.note._id}`)
        .set('Cookie', cookie)
        .send({ title: 'Updated Title' });

      expect(res.status).to.equal(200);
      expect(res.body.note.title).to.equal('Updated Title');
      expect(res.body.note.content).to.equal('Old content'); // untouched field preserve hona chahiye
    });

    it('should NOT allow updating another user\'s note', async () => {
      const createRes = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ title: 'Owner Note', content: 'content' });

      const res = await request(app)
        .put(`/api/notes/${createRes.body.note._id}`)
        .set('Cookie', otherUserCookie)
        .send({ title: 'Hacked Title' });

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete own note', async () => {
      const createRes = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ title: 'To Delete', content: 'content' });

      const res = await request(app)
        .delete(`/api/notes/${createRes.body.note._id}`)
        .set('Cookie', cookie);

      expect(res.status).to.equal(200);

      // Confirm ke wo waqai delete ho gayi
      const getRes = await request(app)
        .get(`/api/notes/${createRes.body.note._id}`)
        .set('Cookie', cookie);
      expect(getRes.status).to.equal(404);
    });

    it('should NOT allow deleting another user\'s note', async () => {
      const createRes = await request(app)
        .post('/api/notes')
        .set('Cookie', cookie)
        .send({ title: 'Protected Note', content: 'content' });

      const res = await request(app)
        .delete(`/api/notes/${createRes.body.note._id}`)
        .set('Cookie', otherUserCookie);

      expect(res.status).to.equal(404);
    });
  });
});