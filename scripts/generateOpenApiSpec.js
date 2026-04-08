const swaggerJsdoc = require('swagger-jsdoc');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const swaggerConfig = require('../src/config/swaggerConfig');

const specs = swaggerJsdoc(swaggerConfig);

// Convert to YAML
const yamlSpec = yaml.dump(specs, {
  indent: 2,
  lineWidth: -1,
  noRefs: true,
});

// Ensure directory exists
const outputDir = path.join(__dirname, '..', 'specmatic');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write to file
const outputPath = path.join(outputDir, 'openapi.v1.yaml');
fs.writeFileSync(outputPath, yamlSpec, 'utf8');

console.log(`✅ OpenAPI spec generated: ${outputPath}`);
