import requests
import json

def query_ollama(prompt, model="llama2", stream=True):
    """
    Send a prompt to Ollama API and get a response
    
    Args:
        prompt (str): The prompt to send to the model
        model (str): The model name to use (default: llama2)
        stream (bool): Whether to stream the response (default: False)
    
    Returns:
        str: The model's response
    """
    url = "http://127.0.0.1:11435/api/generate"
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": stream
    }
    
    try:
        response = requests.post(url, json=payload, stream=stream)
        response.raise_for_status()
        
        if stream:
            # Handle streaming response
            full_response = ""
            for line in response.iter_lines():
                if line:
                    json_response = json.loads(line)
                    if 'response' in json_response:
                        print(json_response['response'], end='', flush=True)
                        full_response += json_response['response']
            print()  # New line after streaming
            return full_response
        else:
            # Handle non-streaming response
            result = response.json()
            return result.get('response', '')
    
    except requests.exceptions.RequestException as e:
        return f"Error: {e}"

if __name__ == "__main__":
    # Example usage
    prompt = "Tell me about Pyongyang"
    
    print("Sending prompt to Ollama...")
    print(f"Prompt: {prompt}\n")
    
    response = query_ollama(prompt, model="llama3.2:1b", stream=True)
    
    print(f"Response: {response}")