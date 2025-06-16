import fs from 'fs';
import path from 'path';

// Post-build script to organize files for server deployment
async function postBuild() {
  const publicDir = path.resolve('dist/public');
  const distDir = path.resolve('dist');
  
  if (!fs.existsSync(publicDir)) {
    console.error('Public build directory not found');
    process.exit(1);
  }
  
  // Copy all files from dist/public to dist root for server deployment
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // Copy directory recursively
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(sourcePath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destPath);
    }
  }
  
  console.log('✓ Organized build files for server deployment');
}

function copyDir(src: string, dest: string) {
  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const sourcePath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

postBuild().catch(console.error);