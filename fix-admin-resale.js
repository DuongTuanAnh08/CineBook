const fs = require('fs');

const file = 'src/pages/Admin/resale/index.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the declarations from outside
content = content.replace(/const uniqueMovies = \[\.\.\.new Set\(\(resaleListings \|\| \[\]\)\.map\(l => l\.movieTitle\)\)\];\r?\n?/g, '');
content = content.replace(/const uniqueCinemas = \[\.\.\.new Set\(\(resaleListings \|\| \[\]\)\.map\(l => l\.cinemaName\)\)\];\r?\n?/g, '');

// Insert them inside AdminResalePage right after the useData hook
content = content.replace(/const \{ resaleListings, updateResaleStatus \} = useData\(\);/, 
`const { resaleListings, updateResaleStatus } = useData();
  const uniqueMovies = [...new Set((resaleListings || []).map(l => l.movieTitle))];
  const uniqueCinemas = [...new Set((resaleListings || []).map(l => l.cinemaName))];`);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Admin resale index.jsx');
