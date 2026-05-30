const fs = require('fs');

const cssPath = 'src/index.css';
let content = fs.readFileSync(cssPath, 'utf8');

// Strip the garbled output from echo >> 
// `echo ""` and following text in UTF-16LE might have `\u0000` or look weird.
content = content.replace(/@layer components\s*\{[\s\S]*$/, '');
// Also remove null characters if any
content = content.replace(/\0/g, '');

const containerStyles = `
@layer components {
  .container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    max-width: 1400px;
  }
  @media (min-width: 768px) {
    .container {
      padding-right: 2.5rem;
      padding-left: 2.5rem;
    }
  }
  @media (min-width: 1024px) {
    .container {
      padding-right: 4rem;
      padding-left: 4rem;
    }
  }
}
`;

fs.writeFileSync(cssPath, content.trim() + '\n' + containerStyles, 'utf8');
console.log('Fixed CSS');
