const fs = require('fs');

const path = 'src/pages/Admin/resale/report/index.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find the first "function SortIcon" block and remove everything after it until the second "function SortIcon"
const firstSortIconIndex = content.indexOf('function SortIcon');
const secondSortIconIndex = content.indexOf('function SortIcon', firstSortIconIndex + 1);

if (secondSortIconIndex > -1) {
  content = content.substring(0, firstSortIconIndex) + content.substring(secondSortIconIndex);
}

// Now the component definition:
// Let's replace the `export default function AdminResaleReportPage() { ... const [dateTo, setDateTo] = useState('');`
// with the proper missing lines.

content = content.replace(
  /export default function AdminResaleReportPage\(\) \{\s+const \[dateTo, setDateTo\] = useState\(''\);/,
  `export default function AdminResaleReportPage() {
  const { resaleListings } = useData();
  const uniqueMovies = useMemo(() => [...new Set(resaleListings.map(l => l.movieTitle))].filter(Boolean).sort(), [resaleListings]);
  const uniqueCinemas = useMemo(() => [...new Set(resaleListings.map(l => l.cinemaName))].filter(Boolean).sort(), [resaleListings]);
  
  // Filters
  const [filterMovie, setFilterMovie] = useState('all');
  const [filterCinema, setFilterCinema] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed resale report');
