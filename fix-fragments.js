const fs = require('fs');

function wrapWithFragment(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // We know it starts with `return (\n    <div` or similar
  // We want to replace `return (` with `return (\n    <>`
  content = content.replace(/return \(\s*\n\s*</, 'return (\n    <>\n      <');
  
  // And we want to replace `);\n}` with `</>\n  );\n}`
  content = content.replace(/\);\s*\n\}\s*$/, '    </>\n  );\n}\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Wrapped ${filePath} with Fragment`);
}

wrapWithFragment('src/pages/Admin/resale/index.jsx');
wrapWithFragment('src/pages/my-resale/index.jsx');
