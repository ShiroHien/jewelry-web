import { Request, Response } from 'express';

export const processChat = async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    // Here you'll integrate your trained chatbot's API
    // For now, we'll return a simple response
    const reply = "Xin chào! Tôi là trợ lý ảo của KLORA. Hiện tại tôi đang được phát triển và sẽ sớm có thể trả lời các câu hỏi của bạn.";
    
    res.json({ reply });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ message: 'Error processing chat message' });
  }
};
