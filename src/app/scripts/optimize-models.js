import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve public directory relative to project root
const publicDir = path.resolve(__dirname, '../../../public');

function stlToObj(stlBuffer) {
  const header = stlBuffer.toString('utf8', 0, 50).trim();
  const isAscii = header.startsWith('solid');
  
  if (isAscii) {
    const text = stlBuffer.toString('utf8');
    const lines = text.split('\n');
    let objText = '';
    let vertCount = 0;
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('vertex ')) {
        const parts = line.split(/\s+/);
        objText += `v ${parts[1]} ${parts[2]} ${parts[3]}\n`;
        vertCount++;
        if (vertCount % 3 === 0) {
          objText += `f ${vertCount - 2} ${vertCount - 1} ${vertCount}\n`;
        }
      }
    }
    return objText;
  } else {
    const numTriangles = stlBuffer.readUInt32LE(80);
    let objText = '';
    let offset = 84;
    for (let i = 0; i < numTriangles; i++) {
      if (offset + 50 > stlBuffer.length) break;
      offset += 12; // Skip normal
      
      const v1x = stlBuffer.readFloatLE(offset);
      const v1y = stlBuffer.readFloatLE(offset + 4);
      const v1z = stlBuffer.readFloatLE(offset + 8);
      offset += 12;
      
      const v2x = stlBuffer.readFloatLE(offset);
      const v2y = stlBuffer.readFloatLE(offset + 4);
      const v2z = stlBuffer.readFloatLE(offset + 8);
      offset += 12;
      
      const v3x = stlBuffer.readFloatLE(offset);
      const v3y = stlBuffer.readFloatLE(offset + 4);
      const v3z = stlBuffer.readFloatLE(offset + 8);
      offset += 12;
      
      offset += 2; // Skip attribute byte count
      
      objText += `v ${v1x} ${v1y} ${v1z}\n`;
      objText += `v ${v2x} ${v2y} ${v2z}\n`;
      objText += `v ${v3x} ${v3y} ${v3z}\n`;
      
      const vertIdx = i * 3 + 1;
      objText += `f ${vertIdx} ${vertIdx + 1} ${vertIdx + 2}\n`;
    }
    return objText;
  }
}

console.log('--- Scanning public/ directory for 3D files to optimize ---');

if (!fs.existsSync(publicDir)) {
  console.error(`Error: Public directory not found at ${publicDir}`);
  process.exit(1);
}

const files = fs.readdirSync(publicDir);

for (const file of files) {
  const filePath = path.join(publicDir, file);
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  
  // 1. Process raw STL files
  if (ext === '.stl') {
    console.log(`\n[STL] Found raw file: ${file}`);
    const tempObjPath = path.join(publicDir, `${baseName}_temp.obj`);
    const finalGlbPath = path.join(publicDir, `${baseName}.glb`);
    
    try {
      const stlBuf = fs.readFileSync(filePath);
      const objText = stlToObj(stlBuf);
      fs.writeFileSync(tempObjPath, objText);
      
      console.log(` > Converting STL template to GLB...`);
      execSync(`npx obj2gltf -i "${tempObjPath}" -o "${finalGlbPath}" -b`, { stdio: 'ignore' });
      fs.unlinkSync(tempObjPath);
      
      console.log(` > Optimizing vertices (simplifying to 5%)...`);
      const optimizedPath = path.join(publicDir, `${baseName}_opt.glb`);
      execSync(`npx @gltf-transform/cli weld "${finalGlbPath}" "${optimizedPath}"`, { stdio: 'ignore' });
      execSync(`npx @gltf-transform/cli simplify "${optimizedPath}" "${optimizedPath}" --ratio 0.05 --error 1`, { stdio: 'ignore' });
      
      fs.renameSync(optimizedPath, finalGlbPath);
      console.log(` ✓ Successfully optimized: ${file} -> ${baseName}.glb`);
    } catch (err) {
      console.error(` ✗ Failed to process STL: ${file}`, err.message);
    }
  }
  // 2. Process raw OBJ files
  else if (ext === '.obj' && !file.includes('_temp')) {
    console.log(`\n[OBJ] Found raw file: ${file}`);
    const finalGlbPath = path.join(publicDir, `${baseName}.glb`);
    
    try {
      console.log(` > Converting OBJ to GLB...`);
      execSync(`npx obj2gltf -i "${filePath}" -o "${finalGlbPath}" -b`, { stdio: 'ignore' });
      
      console.log(` > Optimizing vertices (simplifying to 5%)...`);
      const optimizedPath = path.join(publicDir, `${baseName}_opt.glb`);
      execSync(`npx @gltf-transform/cli weld "${finalGlbPath}" "${optimizedPath}"`, { stdio: 'ignore' });
      execSync(`npx @gltf-transform/cli simplify "${optimizedPath}" "${optimizedPath}" --ratio 0.05 --error 1`, { stdio: 'ignore' });
      
      fs.renameSync(optimizedPath, finalGlbPath);
      console.log(` ✓ Successfully optimized: ${file} -> ${baseName}.glb`);
    } catch (err) {
      console.error(` ✗ Failed to process OBJ: ${file}`, err.message);
    }
  }
  // 3. Process raw large GLB files directly (compress if larger than 2MB)
  else if (ext === '.glb' && !file.includes('_opt')) {
    const stats = fs.statSync(filePath);
    const sizeInMb = stats.size / (1024 * 1024);
    
    if (sizeInMb > 2.0) {
      console.log(`\n[GLB] Found heavy model: ${file} (${sizeInMb.toFixed(2)} MB)`);
      const optimizedPath = path.join(publicDir, `${baseName}_opt.glb`);
      
      try {
        console.log(` > Optimizing vertices (simplifying to 2%)...`);
        execSync(`npx @gltf-transform/cli weld "${filePath}" "${optimizedPath}"`, { stdio: 'ignore' });
        execSync(`npx @gltf-transform/cli simplify "${optimizedPath}" "${optimizedPath}" --ratio 0.02 --error 1`, { stdio: 'ignore' });
        
        fs.unlinkSync(filePath);
        fs.renameSync(optimizedPath, filePath);
        console.log(` ✓ Successfully compressed GLB: ${file}`);
      } catch (err) {
        console.error(` ✗ Failed to optimize GLB: ${file}`, err.message);
      }
    }
  }
}

console.log('\n--- 3D optimization scan completed! ---');
