const fs = require('fs');

function fixCinemasIndex() {
  const file = 'src/pages/cinemas/index.jsx';
  if (!fs.existsSync(file)) return;
  
  let content = `import { useData } from '@/contexts/data-context'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const cinemaDetails = [
  { id: '1', rooms: 8, phone: '028 3820 1234', hours: '08:00 – 24:00', maps: 'https://maps.google.com' },
  { id: '2', rooms: 6, phone: '028 3514 5678', hours: '09:00 – 24:00', maps: 'https://maps.google.com' },
  { id: '3', rooms: 10, phone: '024 3560 9012', hours: '08:30 – 23:30', maps: 'https://maps.google.com' },
  { id: '4', rooms: 7, phone: '028 3812 3456', hours: '09:00 – 23:00', maps: 'https://maps.google.com' },
  { id: '5', rooms: 9, phone: '024 3627 7890', hours: '08:00 – 23:30', maps: 'https://maps.google.com' }
];

export default function CinemasPage() {
  const { cinemas } = useData();
  const cities = [...new Set(cinemas.map(c => c.city))];

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Hệ thống Rạp CineBook</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {cinemas.length} chi nhánh trải dài tại {cities.length} thành phố lớn — mang đến trải nghiệm xem phim đẳng cấp
        </p>
      </div>

      <div className="grid gap-10">
        {cities.map(city => (
          <div key={city} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{city}</h2>
              <Badge variant="secondary" className="font-normal">
                {cinemas.filter(c => c.city === city).length} rạp
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cinemas.filter(c => c.city === city).map(cinema => {
                const details = cinemaDetails.find(d => d.id === cinema.id) || cinemaDetails[0];
                return (
                  <Card key={cinema.id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="h-48 overflow-hidden bg-secondary">
                      <img src={cinema.image || 'https://via.placeholder.com/600'} alt={cinema.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <h3 className="font-bold text-lg leading-tight">{cinema.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-start gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cinema.address}</span>
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="w-4 h-4" /> {details.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-4 h-4" /> {details.hours}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button asChild className="flex-1">
                          <Link to="/movies">Đặt vé ngay</Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild title="Xem bản đồ">
                          <a href={details.maps} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;
  fs.writeFileSync(file, content, 'utf8');
}

function fixAdminCinemas() {
  const file = 'src/pages/Admin/cinemas/index.jsx';
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const cities = \[\.\.\.new Set\(cinemas\.map\(c => c\.city\)\)\];/g, '');
  content = content.replace(/const { cinemas } = useData\(\);/, `const { cinemas } = useData();\n  const cities = [...new Set(cinemas.map(c => c.city))];`);
  fs.writeFileSync(file, content, 'utf8');
}

function fixAdminRooms() {
  const file = 'src/pages/Admin/rooms/index.jsx';
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const mockRooms = cinemas\.flatMap\(\(cinema, ci\) => Array\.from\(\{[\s\S]*?\}\)\);/g, '');
  content = content.replace(/const { cinemas } = useData\(\);/, 
  `const { cinemas } = useData();
  const mockRooms = cinemas.flatMap((cinema, ci) => Array.from({
    length: cinema.rooms
  }).map((_, i) => ({
    id: \`\${cinema.id}-\${i + 1}\`,
    cinemaId: cinema.id,
    name: \`Phòng \${i + 1}\`,
    type: i === 0 ? 'imax' : i === 1 ? '4dx' : '2d',
    capacity: i === 0 ? 300 : i === 1 ? 120 : 150,
    status: 'active'
  })));`);
  fs.writeFileSync(file, content, 'utf8');
}

function fixAdminSeats() {
  const file = 'src/pages/Admin/seats/index.jsx';
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const ROOM_OPTIONS = cinemas\.flatMap\(\(c, ci\) => Array\.from\(\{[\s\S]*?\}\)\);/g, '');
  content = content.replace(/const { cinemas } = useData\(\);/,
  `const { cinemas } = useData();
  const ROOM_OPTIONS = cinemas.flatMap((c, ci) => Array.from({
    length: c.rooms
  }).map((_, i) => ({
    id: \`\${c.id}-\${i + 1}\`,
    cinemaId: c.id,
    cinemaName: c.name,
    name: \`Phòng \${i + 1}\`,
    type: i === 0 ? 'IMAX' : '2D'
  })));`);
  fs.writeFileSync(file, content, 'utf8');
}

fixCinemasIndex();
fixAdminCinemas();
fixAdminRooms();
fixAdminSeats();

console.log('Fixed files');
