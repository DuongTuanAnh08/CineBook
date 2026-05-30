const fs = require('fs');
const file = 'src/pages/Admin/resale/index.jsx';
let content = fs.readFileSync(file, 'utf8');

// Strip out everything before the LAST 'use client'
const parts = content.split("'use client';");
if (parts.length > 2) {
  content = "'use client';" + parts[parts.length - 1];
}

// Ensure resaleListings is destructured in AdminResalePage
content = content.replace(/export default function AdminResalePage\(\) \{/, 
`export default function AdminResalePage() {
  const { resaleListings, updateResaleStatus } = useData();
  const [search, setSearch] = useState('');
  const [filterMovie, setFilterMovie] = useState('all');
  const [filterCinema, setFilterCinema] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const listings = resaleListings || [];
`);

// Remove any remaining `const uniqueMovies = [...new Set(resaleListings.map(l => l.movieTitle))];` outside
content = content.replace(/const uniqueMovies = \[\.\.\.new Set\(resaleListings\.map\(l => l\.movieTitle\)\)\];/g, '');
content = content.replace(/const uniqueCinemas = \[\.\.\.new Set\(resaleListings\.map\(l => l\.cinemaName\)\)\];/g, '');

// Insert uniqueMovies and uniqueCinemas inside AdminResalePage
content = content.replace(/export default function AdminResalePage\(\) \{/, 
`const uniqueMovies = [...new Set((resaleListings || []).map(l => l.movieTitle))];
const uniqueCinemas = [...new Set((resaleListings || []).map(l => l.cinemaName))];

export default function AdminResalePage() {`);

// Change setListings usage to updateResaleStatus
content = content.replace(/setListings\(prev => prev\.map\(l => l\.id === targetListing\?\.id \? \{([\s\S]*?)\} : l\)\);/g, 
`updateResaleStatus(targetListing?.id, 'hidden', { hiddenReason: hideReason.trim(), hiddenByAdminId: MOCK_ADMIN_ID });`);

content = content.replace(/setListings\(prev => prev\.map\(l => l\.id === id \? \{([\s\S]*?)\} : l\)\);/g, 
`updateResaleStatus(id, 'active', { hiddenReason: undefined, hiddenByAdminId: undefined });`);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed resale admin page');
