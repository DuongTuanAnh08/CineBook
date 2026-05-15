import { MainLayout } from '@/components/layout/main-layout'
import { cinemas } from '@/lib/mock-data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const cinemaDetails = [
  { id: '1', rooms: 8, phone: '028 3820 1234', hours: '08:00 – 24:00', maps: 'https://maps.google.com' },
  { id: '2', rooms: 6, phone: '028 3514 5678', hours: '09:00 – 24:00', maps: 'https://maps.google.com' },
  { id: '3', rooms: 10, phone: '024 3560 9012', hours: '08:30 – 23:30', maps: 'https://maps.google.com' },
  { id: '4', rooms: 7, phone: '028 3812 3456', hours: '09:00 – 23:00', maps: 'https://maps.google.com' },
  { id: '5', rooms: 9, phone: '024 3627 7890', hours: '08:00 – 23:30', maps: 'https://maps.google.com' },
]

const cities = [...new Set(cinemas.map((c) => c.city))]

export default function CinemasPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Hệ thống Rạp CineBook</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {cinemas.length} chi nhánh trải dài tại {cities.length} thành phố lớn — mang đến trải nghiệm xem phim đẳng cấp
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
          {[
            { value: cinemas.length, label: 'Chi nhánh' },
            { value: cities.length, label: 'Tỉnh/thành' },
            { value: cinemaDetails.reduce((a, c) => a + c.rooms, 0), label: 'Phòng chiếu' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* By city */}
        {cities.map((city) => (
          <div key={city}>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{city}</h2>
              <Badge variant="secondary">
                {cinemas.filter((c) => c.city === city).length} rạp
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {cinemas
                .filter((c) => c.city === city)
                .map((cinema) => {
                  const detail = cinemaDetails.find((d) => d.id === cinema.id)
                  return (
                    <Card key={cinema.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold">{cinema.name}</h3>
                            <div className="flex items-start gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                              <p className="text-sm text-muted-foreground">{cinema.address}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {detail?.rooms} phòng
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{detail?.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{detail?.hours}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" asChild className="flex-1">
                            <Link href={`/movies?cinema=${cinema.id}`}>Xem lịch chiếu</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={detail?.maps} target="_blank" rel="noreferrer">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
}
