import OpenAI from "openai";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import History from '../models/history.js';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.APIKEY,
});

export const doTranslate = async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const targetLang = language ? language : "English";

    const prompt = `Translate the following text into ${targetLang} and only give translation in response nothing else: """${text}"""`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const translatedText =
      response.choices[0]?.message?.content || "No translation available.";

    return res.status(200).json({
      translatedText
    });
  } catch (error) {
    console.error("Translation error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const doVerify = (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await History.find({ user: userId }).sort({ timestamp: -1 });
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const save = async (req, res) => {
    try {
    const { user, messages, nickname } = req.body;

    const newHistory = new History({
      user,
      messages,
      nickname,
      timestamp: new Date()
    });

    const savedHistory = await newHistory.save();

    return res.status(201).json(savedHistory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}