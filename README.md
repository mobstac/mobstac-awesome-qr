# MobStac Awesome QR code generator

## Local Development & Testing

### Prerequisites

- Node.js 18+ (for ESM support)
- npm or yarn

### Setting Up Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd mobstac-awesome-qr
   npm install
   ```

2. **Build the package:**
   ```bash
   # For production build (CommonJS + Webpack)
   npm run build
   
   # For ESM build (for local testing with modern bundlers)
   npm run build:esm
   ```

3. **Link the package globally:**
   ```bash
   npm link
   ```

4. **In your website/project directory, link to the local package:**
   ```bash
   cd /path/to/your/website
   npm link mobstac-awesome-qr
   ```

### Development Workflow

1. **Make changes** to files in `src/` directory
2. **Build with ESM support** for local testing:
   ```bash
   npm run build:esm
   ```
3. **Test changes** on your local website - changes should reflect immediately
4. **For production**, use regular build:
   ```bash
   npm run build
   ```

### Unlinking (when done with local development)

```bash
# In your website directory
npm unlink mobstac-awesome-qr

# In the package directory (optional)
npm unlink
```

## Build Commands

- `npm run build` - Production build (CommonJS + Webpack)
- `npm run build:esm` - ESM build for local testing (includes OpenSSL workaround)
- `npm test` - Run test suite
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## Troubleshooting

### OpenSSL Errors
If you encounter OpenSSL errors during ESM builds, the `build:esm` command includes the necessary workaround. For CI/CD, use the regular `build` command.

### Import Errors
Make sure you're using the correct import syntax:
- ESM: `import { DataPattern } from 'mobstac-awesome-qr/lib/Enums'`
- CommonJS: `const { DataPattern } = require('mobstac-awesome-qr/lib/Enums')`

### npm link Issues
If changes don't reflect:
1. Run `npm run build:esm` in the package directory
2. Clear your website's build cache
3. Restart your development server