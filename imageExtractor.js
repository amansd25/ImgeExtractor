const fs = require('fs');
const Tesseract = require('tesseract.js');


async function extractTextFromImage(imagePath) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imagePath,
      'eng', 
      { logger: (info) => console.log(info) } 
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch((error) => {
      reject(error);
    });
  });
}

function processExtractedText(text) {
  const keyValuePairs = text.split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .map(line => line.split(' - '))
    .reduce((acc, [key, value]) => {
      acc[key.trim()] = value.trim();
      return acc;
    }, {});

  return keyValuePairs;
}

async function processImage(imagePath) {
  try {
    const extractedText = await extractTextFromImage(imagePath);
    const keyValuePairs = processExtractedText(extractedText);
    console.log('Output:', keyValuePairs);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const imagePath = 'images/mod.jpg';
processImage(imagePath);
