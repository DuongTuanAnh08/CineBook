import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag, Copy, Clock, Ticket, Gift, Star } from 'lucide-react'

const promotions = [
  {
    id: '1',
    code: 'SUMMER24',
    title: 'Ưu đãi mùa hè — Giảm 20%',
    description: 'Giảm ngay 20% cho tất cả các suất chiếu từ Thứ 2 đến Thứ 6. Áp dụng cho đơn hàng từ 200.000₫.',
    discount: '20%',
    minOrder: '200.000₫',
    expires: '31/08/2024',
    tag: 'hot',
    icon: Star,
  },
  {
    id: '2',
    code: 'FIRST50K',
    title: 'Lần đầu đặt vé — Giảm 50.000₫',
    description: 'Chào mừng thành viên mới! Giảm ngay 50.000₫ cho lần đặt vé đầu tiên.',
    discount: '50.000₫',
    minOrder: '150.000₫',
    expires: '31/12/2024',
    tag: 'new',
    icon: Gift,
  },
  {
    id: '3',
    code: 'STUDENT20',
    title: 'Ưu đãi sinh viên — Giảm 20%',
    description: 'Dành riêng cho sinh viên. Giảm 20% khi xuất trình thẻ sinh viên hợp lệ tại quầy.',
    discount: '20%',
    minOrder: '100.000₫',
    expires: '31/12/2024',
    tag: 'edu',
    icon: Tag,
  },
  {
    id: '4',
    code: 'COUPLE2X',
    title: 'Combo cặp đôi — Mua 2 tặng bắp',
    description: 'Mua 2 vé bất kỳ, nhận ngay 1 combo bắp nước miễn phí tại quầy concession.',
    discount: 'Quà tặng',
    minOrder: '2 vé',
    expires: '30/09/2024',
    tag: 'gift',
    icon: Gift,
  },
  {
    id: '5',
    code: 'BDAY30',
    title: 'Ưu đãi sinh nhật — Giảm 30%',
    description: 'Vào ngày sinh nhật của bạn, nhận ưu đãi giảm 30% trên toàn bộ đơn hàng.',
    discount: '30%',
    minOrder: 'Không giới hạn',
    expires: 'Vào ngày sinh nhật',
    tag: 'special',
    icon: Star,
  },
  {
    id: '6',
    code: 'WEEKEND15',
    title: 'Cuối tuần vui — Giảm 15%',
    description: 'Áp dụng vào Thứ 7 và Chủ Nhật cho các suất chiếu từ 8:00 đến 12:00.',
    discount: '15%',
    minOrder: '150.000₫',
    expires: '30/06/2024',
    tag: 'expired',
    icon: Clock,
  },
]

const TAG_CONFIG: Record<string, { label: string; className: string }> = {
  hot: { label: 'Hot', className: 'bg-red-500/20 text-red-500' },
  new: { label: 'Mới', className: 'bg-green-500/20 text-green-500' },
  edu: { label: 'Sinh viên', className: 'bg-blue-500/20 text-blue-400' },
  gift: { label: 'Quà tặng', className: 'bg-pink-500/20 text-pink-400' },
  special: { label: 'Đặc biệt', className: 'bg-yellow-500/20 text-yellow-500' },
  expired: { label: 'Hết hạn', className: 'bg-secondary text-muted-foreground' },
}

export default function PromotionsPage() {
  const active = promotions.filter((p) => p.tag !== 'expired')
  const expired = promotions.filter((p) => p.tag === 'expired')

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Khuyến mãi & Ưu đãi</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tiết kiệm hơn với các mã giảm giá và chương trình ưu đãi hấp dẫn từ CineBook
          </p>
        </div>

        {/* Active promotions */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" /> Đang áp dụng
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((promo) => {
              const tag = TAG_CONFIG[promo.tag]
              const Icon = promo.icon
              return (
                <Card key={promo.id} className="bg-card border-border hover:border-primary/40 transition-colors overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <CardHeader className="pb-2 pl-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base leading-tight">{promo.title}</CardTitle>
                          <Badge className={`mt-1 text-xs ${tag.className}`}>{tag.label}</Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-primary">{promo.discount}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-6 space-y-3">
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Đơn tối thiểu: <strong className="text-foreground">{promo.minOrder}</strong></span>
                      <span>Hết hạn: <strong className="text-foreground">{promo.expires}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-center font-mono font-bold text-sm bg-secondary rounded-lg px-3 py-2 tracking-widest">
                        {promo.code}
                      </code>
                      <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
                        <Copy className="w-3.5 h-3.5" />
                        Sao chép
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Expired */}
        {expired.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" /> Đã hết hạn
            </h2>
            <div className="grid gap-4 md:grid-cols-2 opacity-60">
              {expired.map((promo) => {
                const Icon = promo.icon
                return (
                  <Card key={promo.id} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-base leading-tight line-through">
                            {promo.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">Hết hạn: {promo.expires}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
