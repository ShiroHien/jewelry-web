import { Request, Response } from 'express';
import { getStreamingResponse } from '../services/ollamaService';

export const processChat = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    // Stream the response
    await getStreamingResponse(message, (chunk: string) => {
      fullResponse += chunk;
      // Send each chunk as SSE
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // Send done signal
    res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.write(`data: ${JSON.stringify({ error: 'Error processing chat message' })}\n\n`);
    res.end();
  }
};
