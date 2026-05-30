const fs = require('fs');

const file = 'src/pages/resale/index.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const uniqueMovies = \[\.\.\.new Set\(activeListings\.map[\s\S]*?\];/g, '');
content = content.replace(/const uniqueCinemas = \[\.\.\.new Set\(activeListings\.map[\s\S]*?\];/g, '');

content = content.replace(/export default function ResaleTicketPage\(\) \{/, 
`export default function ResaleTicketPage() {
  const { resaleListings } = useData();
  const activeListings = (resaleListings || []).filter(l => l.status === 'active');
  const uniqueMovies = [...new Set(activeListings.map(l => l.movieTitle))];
  const uniqueCinemas = [...new Set(activeListings.map(l => l.cinemaName))];`);

// Remove any lingering multiple useData / activeListings declarations
content = content.replace(/const \{ resaleListings \} = useData\(\);\s*const \{ resaleListings \} = useData\(\);/g, 'const { resaleListings } = useData();');
content = content.replace(/const activeListings = \(resaleListings \|\| \[\]\)\.filter\(l => l\.status === 'active'\);\s*const activeListings = \(resaleListings \|\| \[\]\)\.filter\(l => l\.status === 'active'\);/g, "const activeListings = (resaleListings || []).filter(l => l.status === 'active');");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed resale index.jsx');
