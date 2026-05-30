const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Admin/movies/index.jsx',
  'src/pages/cinemas/index.jsx',
  'src/pages/MyTickets/index.jsx'
];

files.forEach(filePath => {
  const absolutePath = path.resolve(filePath);
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');
    
    // Replace placeholder for movies (150)
    content = content.replace(/https:\/\/via\.placeholder\.com\/150/g, 'https://placehold.co/150x225/png');
    
    // Replace placeholder for cinemas (600)
    content = content.replace(/https:\/\/via\.placeholder\.com\/600/g, 'https://placehold.co/600x400/png');
    
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Updated placeholders in ${filePath}`);
  }
});
