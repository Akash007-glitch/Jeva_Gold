import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = './image';

if (!fs.existsSync(srcDir)) {
  console.error(`Source directory ${srcDir} does not exist.`);
  process.exit(1);
}

const files = fs.readdirSync(srcDir);
const imageExtensions = ['.png', '.jpg', '.jpeg'];

async function compressAll() {
  console.log('Starting image compression...');
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const inputPath = path.join(srcDir, file);
      const outputName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(srcDir, outputName);

      try {
        console.log(`Processing: ${file} -> ${outputName}`);
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        const origStats = fs.statSync(inputPath);
        const compStats = fs.statSync(outputPath);
        const saved = ((origStats.size - compStats.size) / origStats.size * 100).toFixed(1);
        console.log(`  Success! Size: ${(origStats.size / 1024).toFixed(1)} KB -> ${(compStats.size / 1024).toFixed(1)} KB (Saved ${saved}%)`);
      } catch (err) {
        console.error(`  Error processing ${file}:`, err.message);
      }
    }
  }
  console.log('Image compression completed.');
}

compressAll();
