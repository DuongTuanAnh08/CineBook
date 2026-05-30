const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/**/*.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('@/lib/mock-data') && !content.includes('useData()')) {
    // Extract what was imported from mock-data
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/lib\/mock-data['"];?/;
    const match = content.match(importRegex);
    
    if (match) {
      const vars = match[1].split(',').map(s => s.trim()).filter(s => s !== 'genres');
      const hasGenres = match[1].includes('genres');
      
      // Replace import
      let newImport = `import { useData } from '@/contexts/data-context'`;
      if (hasGenres) {
        newImport += `\nimport { genres } from '@/lib/mock-data'`;
      }
      
      content = content.replace(importRegex, newImport);
      
      // Insert `const { ... } = useData();` inside the default export function
      const funcRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{/;
      const funcMatch = content.match(funcRegex);
      
      if (funcMatch && vars.length > 0) {
        // Only if there are vars other than genres
        // Some vars might have aliasing like `concessionItems as initialItems`
        // useData doesn't return aliases, so we need to map them back or change it.
        // Let's just blindly inject the useData call for now, but handle alias manually
        let injectStr = `\n  const { ${vars.map(v => v.includes(' as ') ? v.split(' as ')[0] + ': ' + v.split(' as ')[1] : v).join(', ')} } = useData();`;
        content = content.replace(funcMatch[0], funcMatch[0] + injectStr);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
      }
    }
  }
});
