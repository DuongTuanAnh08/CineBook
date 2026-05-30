const fs = require('fs');

function fixAdminRooms() {
  const file = 'src/pages/Admin/rooms/index.jsx';
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Find "export default function"
  const exportIdx = content.indexOf('export default function');
  if (exportIdx === -1) return;
  
  // Strip out "const mockRooms = cinemas.flatMap..."
  content = content.replace(/const mockRooms = cinemas\.flatMap\([\s\S]*?\)\);/, '');
  
  // Inject mockRooms inside the component
  content = content.replace(/export default function AdminRoomsPage\(\) \{/, 
`export default function AdminRoomsPage() {
  const { cinemas } = useData();
  const mockRooms = cinemas.flatMap((cinema, ci) => Array.from({
    length: [8, 6, 10, 7, 9][ci] ?? 6
  }, (_, i) => ({
    id: \`\${cinema.id}-\${i + 1}\`,
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    name: \`Phòng \${i + 1}\`,
    type: i % 3 === 0 ? 'IMAX' : i % 3 === 1 ? '3D' : '2D',
    capacity: i % 3 === 0 ? 300 : i % 3 === 1 ? 120 : 150,
    status: 'active'
  })));`);
  
  fs.writeFileSync(file, content, 'utf8');
}

function fixAdminSeats() {
  const file = 'src/pages/Admin/seats/index.jsx';
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/const ROOM_OPTIONS = cinemas\.flatMap\([\s\S]*?\)\);/, '');
  
  content = content.replace(/export default function AdminSeatsPage\(\) \{/, 
`export default function AdminSeatsPage() {
  const { cinemas } = useData();
  const ROOM_OPTIONS = cinemas.flatMap((c, ci) => Array.from({
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
console.log('Fixed rooms and seats');
