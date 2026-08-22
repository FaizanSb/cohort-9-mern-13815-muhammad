import mongoose from 'mongoose';

export const connectTestDB = async () => {
  const uri = process.env.MONGO_URI_TEST;
  await mongoose.connect(uri);
};


export const closeTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
  } finally {
    await mongoose.connection.close();
  }
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};