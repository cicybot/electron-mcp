
const { pool } = require('../src/db');
const userDB = require('../src/db/user');

describe('User CRUD Operations', () => {
    let testUserId;

    // 1. SETUP: Create table and clean old data
    beforeAll(async () => {

        await userDB.initTable();
        // Optional: Clear table so tests are idempotent
    });

    // 2. CLOSE: Disconnect after tests finish
    afterAll(async () => {
        await pool.end();
    });

    it('should CREATE a new user', async () => {
        testUserId = await userDB.createUser('jack', 'jack@example.com');
        expect(testUserId).toBeDefined();
        expect(typeof testUserId).toBe('number');
    });

    it('should READ users', async () => {
        const users = await userDB.getUsers();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        expect(users[0].username).toBe('jack');
    });

    it('should UPDATE a user', async () => {
        await userDB.updateUser(testUserId, 'newjack@example.com');
        const res = await pool.query('SELECT email FROM users WHERE id = ?', [testUserId]);
        const [rows] = res;
        expect(rows[0].email).toBe('newjack@example.com');
    });

    it('should DELETE a user', async () => {
        await userDB.deleteUser(testUserId);
        const  res = await pool.query('SELECT * FROM users WHERE id = ?', [testUserId]);
        const [rows] = res;
        expect(rows.length).toBe(0);
    });
});