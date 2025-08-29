const express = require('express');
const router = express.Router();
const Query = require('../models/query');
const openai = require('../services/openai');

router.post('/', async (req, res) => {
  const { question, pdfText } = req.body;
  let answer = 'Placeholder answer';
  let sentiment = 'neutral';
  let audio = null;

  try {
    if (openai) {
      const messages = [
        {
          role: 'system',
          content:
            'You are a helpful support agent. Reply in JSON with keys answer and sentiment (angry, neutral, happy).',
        },
      ];
      if (pdfText) {
        messages.push({
          role: 'system',
          content: `Document content:\n${pdfText.slice(0, 2000)}`,
        });
      }
      messages.push({ role: 'user', content: question });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'response',
            schema: {
              type: 'object',
              properties: {
                answer: { type: 'string' },
                sentiment: { type: 'string' },
              },
              required: ['answer', 'sentiment'],
              additionalProperties: false,
            },
          },
        },
      });

      const parsed = JSON.parse(completion.choices[0].message.content);
      answer = parsed.answer;
      sentiment = parsed.sentiment;

      const speech = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'alloy',
        input: answer,
      });
      audio = Buffer.from(await speech.arrayBuffer()).toString('base64');
    }
  } catch (err) {
    console.error(err);
  }

  await Query.create({ question, sentiment });
  res.json({ answer, sentiment, audio, sources: [] });
});

module.exports = router;
