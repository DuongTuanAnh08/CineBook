const fs = require('fs');

function fixAdminRooms() {
  const file = 'src/pages/Admin/rooms/index.jsx';
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('const [selectedCinema, setSelectedCinema]')) {
    content = content.replace(/status: 'active'\r?\n\s*\}\)\)\);\r?\n\s*\{\/\* Header \*\/\}/,
`status: 'active'
  })));
  
  const [selectedCinema, setSelectedCinema] = useState('all');
  const filtered = mockRooms.filter(r => selectedCinema === 'all' || r.cinemaId === selectedCinema);
  const activeCount = filtered.filter(r => r.status === 'active').length;
  const maintenanceCount = filtered.filter(r => r.status === 'maintenance').length;

  return (
    <div className="space-y-6">
        {/* Header */}`);
  }

  // Remove the duplicates
  content = content.replace(/const \{ cinemas \} = useData\(\);\s*const mockRooms = cinemas\.flatMap[\s\S]*?status: 'active'\r?\n\s*\}\)\)\);/, '');
  
  fs.writeFileSync(file, content, 'utf8');
}

function fixAdminSeats() {
  const file = 'src/pages/Admin/seats/index.jsx';
  let content = fs.readFileSync(file, 'utf8');
  
  // Clean duplicates by keeping the first occurrence and wiping the second one which might be exactly the same
  content = content.replace(/const \{ cinemas \} = useData\(\);[\s\S]*?const \{ cinemas \} = useData\(\);/, 'const { cinemas } = useData();');
  content = content.replace(/const ROOM_OPTIONS = cinemas\.flatMap\([\s\S]*?\)\);[\s\S]*?const ROOM_OPTIONS = cinemas\.flatMap\([\s\S]*?\)\);/, 
  `const ROOM_OPTIONS = cinemas.flatMap((c, ci) => Array.from({
    length: [8, 6, 10, 7, 9][ci] ?? 6
  }, (_, i) => ({
    id: \`\${c.id}-\${i + 1}\`,
    label: \`\${c.name} - Phòng \${i + 1}\`,
    cinemaId: c.id,
    type: i % 3 === 0 ? 'IMAX' : i % 3 === 1 ? '3D' : '2D'
  })));`);
  
  fs.writeFileSync(file, content, 'utf8');
}

fixAdminRooms();
fixAdminSeats();
console.log('Fixed duplicates correctly');
