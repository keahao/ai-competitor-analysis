export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://your-domain.com',
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          {
            role: 'system',
            content: '你是一位市场分析师。根据用户输入的产品信息，分析竞争对手，包括市场定位、优势劣势、差异化策略等。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ result: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'AI generation failed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
