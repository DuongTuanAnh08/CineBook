const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/promotions/index.jsx',
  'src/pages/resale/index.jsx',
  'src/pages/login/index.jsx',
  'src/pages/register/index.jsx'
];

filesToFix.forEach(filePath => {
  const absolutePath = path.resolve(filePath);
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');

    // 1. Fix the `return \n <div` issue
    content = content.replace(/return\s*\n\s*<div/g, 'return (\n    <div');

    // 2. We also need to fix the closing parenthesis at the very end of the file.
    // The previous error was that the component ended with:
    //     </div>
    //   ;
    // }
    // OR
    //     </div>
    // }
    // We should ensure it ends with `  );\n}`
    
    // First, let's fix the `;\n}` if it exists
    content = content.replace(/;\s*\n\}\s*$/, ');\n}\n');
    
    // If it just ends with `</div>\n}` without the semicolon, fix that
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/div>\s*\n\}\s*$/)) {
      content = content.replace(/<\/div>\s*\n\}\s*$/, '</div>\n  );\n}\n');
    }
    
    // If it ends with `</main>\n}`, fix that
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/main>\s*\n\}\s*$/)) {
      content = content.replace(/<\/main>\s*\n\}\s*$/, '</main>\n  );\n}\n');
    }
    
    // If it ends with `</Layout>\n}`, fix that
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/Layout>\s*\n\}\s*$/)) {
      content = content.replace(/<\/Layout>\s*\n\}\s*$/, '</Layout>\n  );\n}\n');
    }

    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
