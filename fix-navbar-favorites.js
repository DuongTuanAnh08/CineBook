const fs = require('fs');
const path = 'components/layout/navbar.jsx';
let content = fs.readFileSync(path, 'utf8');

// Remove the Heart icon from lucide-react import
content = content.replace(/\bHeart,\s*/, '');

// Remove the DropdownMenuItem for favorites
content = content.replace(/<DropdownMenuItem asChild>\s*<Link to="\/favorites" className="cursor-pointer">\s*<Heart className="mr-2 h-4 w-4" \/>\s*.*?Phim.*?<\/Link>\s*<\/DropdownMenuItem>/is, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed navbar');
