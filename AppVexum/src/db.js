import Dexie from 'dexie';

const db = new Dexie('baseDB');

db.version(1).stores({
  tasks: '++id, title, completed, createdAt'
});

export default db;