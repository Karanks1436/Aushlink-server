const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
exports.aadhaarVerify = async (req, res) => {
  try {
    const file = req.file;
    const side = req.body.side;

    if (!file) return res.status(400).json({ error: 'No image uploaded' });

    const base64 = fs.readFileSync(file.path, { encoding: 'base64' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64,
        },
      },
      {
        text: `Extract ${side === 'aadhaarFront' ? 'name, DOB, gender' : 'address'} from the Aadhaar image.`,
      },
    ]);

    const text = result.response.text();

    const extracted = {
      name: (text.match(/Name[:\-]?\s*(.+)/i) || [])[1] || '',
      dob: (text.match(/DOB[:\-]?\s*([0-9\-\/]+)/i) || [])[1] || '',
      gender: (text.match(/Gender[:\-]?\s*(Male|Female|Other)/i) || [])[1] || '',
      address: (text.match(/Address[:\-]?\s*(.+)/i) || [])[1] || '',
    };

    return res.json(extracted);
  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(500).json({ error: 'Gemini OCR Failed', detail: err.message });
  }
};
