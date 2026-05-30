const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/forgot-password/index.jsx',
  'src/pages/Profile/index.jsx',
  'src/pages/my-resale/index.jsx',
  'src/pages/Admin/index.jsx',
  'src/pages/Admin/showtimes/index.jsx',
  'src/pages/Admin/cinemas/index.jsx',
  'src/pages/Admin/promotions/index.jsx',
  'src/pages/Admin/resale/index.jsx',
  'src/pages/Admin/resale/report/index.jsx',
  'src/pages/Admin/bookings/index.jsx',
  'src/pages/Admin/customers/index.jsx',
  'src/pages/Admin/analytics/index.jsx',
  'src/pages/Admin/settings/index.jsx'
];

filesToFix.forEach(filePath => {
  const absolutePath = path.resolve(filePath);
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');

    // 1. Fix the `return \n <div` issue
    content = content.replace(/return\s*\n\s*</g, 'return (\n    <');

    // Fix trailing `</div>\n}` without the semicolon
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/div>\s*\n\}\s*$/)) {
      content = content.replace(/<\/div>\s*\n\}\s*$/, '</div>\n  );\n}\n');
    }
    
    // Fix `</main>\n}`
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/main>\s*\n\}\s*$/)) {
      content = content.replace(/<\/main>\s*\n\}\s*$/, '</main>\n  );\n}\n');
    }
    
    // Fix `</AdminLayout>\n}`
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/AdminLayout>\s*\n\}\s*$/)) {
      content = content.replace(/<\/AdminLayout>\s*\n\}\s*$/, '</AdminLayout>\n  );\n}\n');
    }
    
    // Fix `</Layout>\n}`
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/Layout>\s*\n\}\s*$/)) {
      content = content.replace(/<\/Layout>\s*\n\}\s*$/, '</Layout>\n  );\n}\n');
    }
    
    // Fix `</Card>\n}`
    if (!content.match(/\);\s*\n\}\s*$/) && content.match(/<\/Card>\s*\n\}\s*$/)) {
      content = content.replace(/<\/Card>\s*\n\}\s*$/, '</Card>\n  );\n}\n');
    }

    // Fix if it ends with `; \n}`
    content = content.replace(/;\s*\n\}\s*$/, ');\n}\n');

    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Fixed ASI in ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
