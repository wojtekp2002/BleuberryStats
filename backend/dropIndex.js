// dropIndex.js
const mongoose = require('mongoose');

async function drop() {
  // <-- zmieniamy fallback na Twoją bazę:
  const uri = process.env.MONGODB_URI
    || 'mongodb://127.0.0.1:27017/BleuberryStats';

  console.log('Łączenie z:', uri);
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection.db;

    console.log('Sprawdzam indeksy przed usunięciem…');
    const indexes = await db.collection('users').indexes();
    console.log(indexes);

    // Usuńmy indeks username_1
    await db.collection('users').dropIndex('username_1');
    console.log('✅ Usunięto indeks username_1');

    console.log('Sprawdzam indeksy po usunięciu…');
    const after = await db.collection('users').indexes();
    console.log(after);

  } catch (err) {
    console.error('❌ Coś poszło nie tak:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

drop();
