import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

let server: Server;
const PORT: number = 5000;

async function main() {
  try {
    await mongoose.connect('mongodb+srv://757mohammadatiq:757mohammadatiq@cluster0.iyiex3d.mongodb.net/advanced-note-app?retryWrites=true&w=majority&appName=Cluster0');

    console.log('✅ Connected to MongoDB with Mongoose');

    server = app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Error starting the server:', error);
  }
}

main();
