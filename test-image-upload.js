// Test script to verify image upload functionality
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function testImageUpload() {
  try {
    // Create a simple test image buffer (1x1 PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const form = new FormData();
    form.append('image', testImageBuffer, {
      filename: 'test-upload.png',
      contentType: 'image/png'
    });
    form.append('altText', 'Test image upload');

    console.log('Testing image upload...');
    const response = await fetch('http://localhost:5000/api/cms/images/upload', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    console.log('Upload response:', result);

    if (response.ok) {
      console.log('✓ Upload successful!');
      
      // Verify file exists
      const filename = result.filename;
      const filePath = `./uploads/images/${filename}`;
      
      if (fs.existsSync(filePath)) {
        console.log('✓ File exists on disk');
        
        // Test if image is accessible via HTTP
        const imageResponse = await fetch(`http://localhost:5000/uploads/images/${filename}`);
        if (imageResponse.ok) {
          console.log('✓ Image accessible via HTTP');
        } else {
          console.log('✗ Image not accessible via HTTP');
        }
      } else {
        console.log('✗ File does not exist on disk');
      }
    } else {
      console.log('✗ Upload failed:', result.error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testImageUpload();