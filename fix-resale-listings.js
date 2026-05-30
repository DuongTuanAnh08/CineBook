const fs = require('fs');

function replaceMockResaleListings(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace `{ mockResaleListings } = useData()` with `{ resaleListings } = useData()`
  content = content.replace(/const \{.*?mockResaleListings.*?\} = useData\(\);/g, match => {
    return match.replace('mockResaleListings', 'resaleListings');
  });

  // Replace usage of mockResaleListings with resaleListings
  content = content.replace(/mockResaleListings/g, 'resaleListings');

  // Handle specific outside-component constants
  if (file.includes('Admin/resale/report/index.jsx')) {
    content = content.replace(/const uniqueMovies = \[\.\.\.new Set\(resaleListings\.map[\s\S]*?\];/g, '');
    content = content.replace(/const uniqueCinemas = \[\.\.\.new Set\(resaleListings\.map[\s\S]*?\];/g, '');
    
    // Inject them into the component
    content = content.replace(/export default function ResaleReportPage\(\) \{/, 
`export default function ResaleReportPage() {
  const { resaleListings } = useData();
  const uniqueMovies = [...new Set((resaleListings || []).map(l => l.movieTitle))];
  const uniqueCinemas = [...new Set((resaleListings || []).map(l => l.cinemaName))];`);
  }

  if (file.includes('my-resale/CreateResale.jsx')) {
    content = content.replace(/const hasActiveListing = \(bookingId, seat\) => resaleListings\.some\([\s\S]*?\);/g, '');
    content = content.replace(/export default function CreateResalePage\(\) \{/,
`export default function CreateResalePage() {
  const { movies, resaleListings, bookings } = useData();
  const hasActiveListing = (bookingId, seat) => (resaleListings || []).some(l => l.bookingId === bookingId && l.seatNumber === seat && l.status === 'active');`);
  }

  if (file.includes('resale/index.jsx') && !file.includes('Admin') && !file.includes('my-resale')) {
    content = content.replace(/const activeListings = resaleListings\.filter\(l => l\.status === 'active'\);/g, '');
    content = content.replace(/export default function MarketplacePage\(\) \{/,
`export default function MarketplacePage() {
  const { resaleListings } = useData();
  const activeListings = (resaleListings || []).filter(l => l.status === 'active');`);
  }

  // Fallback cleanup if the context had duplicate destructurings
  content = content.replace(/const \{.*?resaleListings.*?\} = useData\(\);\s*const \{.*?resaleListings.*?\} = useData\(\);/g, `const { resaleListings } = useData();`);
  
  // Clean up any remaining multiple useData declarations inside functions
  // A bit complex with regex, just hope there are no duplicates.

  fs.writeFileSync(file, content, 'utf8');
}

[
  'src/pages/Admin/resale/report/index.jsx',
  'src/pages/my-resale/CreateResale.jsx',
  'src/pages/my-resale/index.jsx',
  'src/pages/resale/ResaleDetail.jsx',
  'src/pages/resale/index.jsx'
].forEach(replaceMockResaleListings);

console.log('Fixed resaleListings in all files');
