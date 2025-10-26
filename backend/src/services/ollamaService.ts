interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export const getStreamingResponse = async (
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  console.log('=== Ollama Streaming Request ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Prompt:', prompt);
  console.log('Model: llama3.2:1b');
  console.log('Stream: true');
  console.log('===============================');

  try {
    const response = await fetch('http://127.0.0.1:11435/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: true,
      }),
    });

    console.log('Ollama Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    const decoder = new TextDecoder();
    let chunkCount = 0;
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log(`Streaming completed. Total chunks received: ${chunkCount}`);
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const json: OllamaResponse = JSON.parse(line);
            if (json.response) {
              chunkCount++;
              onChunk(json.response);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw error;
  }
};

export const getNonStreamingResponse = async (prompt: string): Promise<string> => {
  console.log('=== Ollama Non-Streaming Request ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Prompt:', prompt);
  console.log('Model: llama3.2:1b');
  console.log('Stream: false');
  console.log('===================================');

  try {
    const response = await fetch('http://127.0.0.1:11435/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false,
      }),
    });

    console.log('Ollama Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OllamaResponse = await response.json();
    console.log('Response length:', data.response.length, 'characters');
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw error;
  }
};