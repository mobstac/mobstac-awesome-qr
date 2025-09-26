const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create ESM versions by compiling TypeScript source directly to ESM
const filesToConvert = [
    'index.ts',
    'Enums.ts',
    'Types.ts',
    'Models.ts',
    'Common.ts',
    'Constants.ts',
    'Util.ts',
    'Svg.ts'
];

console.log('🔄 Compiling TypeScript source files to ESM...');

// Compile TypeScript source files directly to ESM
try {
    execSync('tsc --module esnext --outDir lib-esm --target es2018', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
    });
    console.log('✅ TypeScript compilation to ESM completed');
} catch (error) {
    console.error('❌ TypeScript compilation failed:', error.message);
    process.exit(1);
}

// Copy the compiled ESM files to lib directory with .esm.js extension and fix import paths
filesToConvert.forEach(fileName => {
    const sourcePath = path.join(__dirname, '../lib-esm', fileName.replace('.ts', '.js'));
    const targetPath = path.join(__dirname, '../lib', fileName.replace('.ts', '.esm.js'));
    
    if (fs.existsSync(sourcePath)) {
        let content = fs.readFileSync(sourcePath, 'utf8');
        
        // Fix import paths to use .esm.js extensions
        content = content.replace(/from '\.\/([^']+)';/g, "from './$1.esm';");
        content = content.replace(/from "\.\/([^"]+)";/g, 'from "./$1.esm";');
        
        fs.writeFileSync(targetPath, content);
        console.log(`✅ Created ESM version: ${fileName.replace('.ts', '.esm.js')}`);
    }
});

console.log('✅ All ESM versions created successfully!');
