"use client";

import { AdminLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Bell, Shield, Palette, Globe, Save, Percent } from 'lucide-react';
import { useState } from 'react';
import { useData } from '@/contexts/data-context';
import { useToast } from '@/hooks/use-toast';
export default function AdminSettingsPage() {
  const { settings, updateSettings } = useData();
  const { toast } = useToast();

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [vatPercent, setVatPercent] = useState(settings?.vatPercent ?? 8);
  const [weekendSurcharge, setWeekendSurcharge] = useState(settings?.weekendSurcharge ?? 20);
  const [eveningSurcharge, setEveningSurcharge] = useState(settings?.eveningSurcharge ?? 10);

  const handleSave = () => {
    updateSettings({
      vatPercent: Number(vatPercent),
      weekendSurcharge: Number(weekendSurcharge),
      eveningSurcharge: Number(eveningSurcharge),
    });
    toast({
      title: 'Thành công',
      description: 'Đã lưu thay đổi cài đặt.',
    });
  };
  return (
    <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground mt-1">Quản lý cấu hình và tùy chọn của ứng dụng</p>
        </div>

        {/* General */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle>Thông tin chung</CardTitle>
            </div>
            <CardDescription>Thông tin cơ bản của hệ thống rạp chiếu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cinema-name">Tên hệ thống rạp</Label>
                <Input id="cinema-name" defaultValue="CineBook" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotline">Số điện thoại hotline</Label>
                <Input id="hotline" defaultValue="1900 2099" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ trụ sở chính</Label>
              <Input id="address" defaultValue="72 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" rows={3} defaultValue="CineBook — Hệ thống rạp chiếu phim hàng đầu Việt Nam với trải nghiệm xem phim đẳng cấp." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                <Select defaultValue="VND">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND — Việt Nam Đồng</SelectItem>
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ mặc định</Label>
                <Select defaultValue="vi">
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle>Cài đặt vé</CardTitle>
            </div>
            <CardDescription>Cấu hình giá vé và chính sách đặt chỗ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price-standard">Giá ghế thường (₫)</Label>
                <Input id="price-standard" type="number" defaultValue="75000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-vip">Giá ghế VIP (₫)</Label>
                <Input id="price-vip" type="number" defaultValue="100000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-couple">Giá ghế đôi (₫)</Label>
                <Input id="price-couple" type="number" defaultValue="180000" />
              </div>
            </div>
            <Separator className="bg-border" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hold-time">Thời gian giữ ghế (phút)</Label>
                <Input id="hold-time" type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-seats">Số ghế tối đa mỗi đơn</Label>
                <Input id="max-seats" type="number" defaultValue="8" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">Tự động xác nhận đơn</p>
                <p className="text-xs text-muted-foreground">
                  Tự động xác nhận đơn đặt vé sau khi thanh toán thành công
                </p>
              </div>
              <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Tax settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              <CardTitle>Cấu hình Giá & Thuế</CardTitle>
            </div>
            <CardDescription>Cấu hình % VAT và phụ thu vé theo thời gian</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="vat-percent">Thuế VAT (%)</Label>
                <Input id="vat-percent" type="number" value={vatPercent} onChange={e => setVatPercent(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekend-surcharge">Phụ thu cuối tuần (%)</Label>
                <Input id="weekend-surcharge" type="number" value={weekendSurcharge} onChange={e => setWeekendSurcharge(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evening-surcharge">Phụ thu buổi tối (%)</Label>
                <Input id="evening-surcharge" type="number" value={eveningSurcharge} onChange={e => setEveningSurcharge(e.target.value)} />
                <p className="text-[10px] text-muted-foreground mt-1">Áp dụng từ 18:00 trở đi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Thông báo</CardTitle>
            </div>
            <CardDescription>Kênh thông báo tới khách hàng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[{
            label: 'Thông báo qua Email',
            description: 'Gửi email xác nhận đặt vé và nhắc lịch chiếu',
            value: emailNotif,
            onChange: setEmailNotif
          }, {
            label: 'Thông báo qua SMS',
            description: 'Gửi SMS xác nhận và nhắc lịch trước 2 giờ chiếu',
            value: smsNotif,
            onChange: setSmsNotif
          }].map(item => <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>)}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Giao diện</CardTitle>
            </div>
            <CardDescription>Tùy chỉnh màu sắc và giao diện hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Màu chủ đạo</Label>
              <div className="flex gap-3">
                {['#E50914', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'].map(color => <button key={color} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground transition-colors" style={{
                background: color
              }} title={color} />)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Bảo mật & Bảo trì</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">Chế độ bảo trì</p>
                <p className="text-xs text-muted-foreground">
                  Tạm dừng hệ thống — khách hàng sẽ thấy trang thông báo bảo trì
                </p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} className="data-[state=checked]:bg-destructive" />
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    );
}
