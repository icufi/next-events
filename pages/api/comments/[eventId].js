import { MongoClient } from 'mongodb';

import { connectDatabase, insertDocument } from '../../../helpers/db-util';

async function handler(req, res) {
  const eventId = req.query.eventId;
  let client;
  try {
    client = connectDatabase();
  } catch (err) {
    res.status(500).json({ message: 'Failed to connect to database.' });
    return;
  }

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    await insertDocument(client, 'comments', newComment);

    newComment._id = result.insertedId;

    res.status(201).json({ message: 'Added comment.', comment: newComment });
  }

  if (req.method === 'GET') {
    const db = client.db();

    const documents = db
      .collection('comments')
      .find()
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json({ comments: documents });
  }

  client.close();
}

export default handler;
