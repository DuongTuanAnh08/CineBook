"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ShoppingCart, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const TYPE_LABELS = {
  drink: 'Đồ uống',
  popcorn: 'Bỏng ngô',
  combo: 'Combo'
};

const TYPE_COLORS = {
  drink: 'bg-blue-500/20 text-blue-400',
  popcorn: 'bg-amber-500/20 text-amber-400',
  combo: 'bg-purple-500/20 text-purple-400'
};

const EMPTY_FORM = {
  name: '',
  price: '',
  type: 'drink',
  image: '',
  description: '',
  status: 'active'
};

export default function AdminConcessionsPage() {
  const { concessions, addConcession, updateConcession, deleteConcession } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    navigate('/admin', { replace: true });
    return null;
  }

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filtered = concessions.filter(item => {
    const matchType = filterType === 'all' || item.type === filterType;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || (item.description ?? '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = item => {
    setEditingItem(item);
    setForm({ ...item, price: item.price.toString() });
    setFormErrors({});
    setDialogOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Tên không được để trống';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errors.price = 'Giá phải là số lớn hơn 0';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      price: Number(form.price)
    };
    if (editingItem) {
      updateConcession(editingItem.id, payload);
    } else {
      addConcession(payload);
    }
    setDialogOpen(false);
  };

  const toggleStatus = id => {
    const item = concessions.find(c => c.id === id);
    if (item) {
      updateConcession(id, { status: item.status === 'active' ? 'inactive' : 'active' });
    }
  };

  const handleDelete = id => {
    deleteConcession(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bắp & Nước</h1>
          <p className="text-muted-foreground mt-1">Quản lý các mặt hàng đồ ăn thức uống tại rạp</p>
        </div>
        <Button onClick={openAdd} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Thêm mặt hàng
        </Button>
      </div>

      {/* Stats/Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {[{
          label: 'Tổng số món',
          value: concessions.length
        }, {
          label: 'Đồ uống',
          value: concessions.filter(i => i.type === 'drink').length
        }, {
          label: 'Bỏng ngô',
          value: concessions.filter(i => i.type === 'popcorn').length
        }, {
          label: 'Combo',
          value: concessions.filter(i => i.type === 'combo').length
        }].map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table & Filters */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'drink', 'popcorn', 'combo'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setFilterType(t)} 
                  className={cn('px-3 py-1.5 rounded-full text-sm font-medium transition-colors', filterType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground')}
                >
                  {t === 'all' ? 'Tất cả' : TYPE_LABELS[t]}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm tên món..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-16">Ảnh</TableHead>
                <TableHead>Tên mặt hàng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow key={item.id} className={cn('border-border', item.status === 'inactive' && 'opacity-60')}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    {item.description && <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('font-normal', TYPE_COLORS[item.type])}>
                      {TYPE_LABELS[item.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.price.toLocaleString('vi-VN')}₫</TableCell>
                  <TableCell>
                    <button 
                      onClick={() => toggleStatus(item.id)} 
                      className={cn('flex items-center gap-1.5 text-sm font-medium transition-colors', item.status === 'active' ? 'text-green-400 hover:text-green-300' : 'text-muted-foreground hover:text-foreground')} 
                      title={item.status === 'active' ? 'Click để tạm dừng' : 'Click để kích hoạt'}
                    >
                      {item.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {item.status === 'active' ? 'Đang bán' : 'Tạm dừng'}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)} title="Chỉnh sửa">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteConfirmId(item.id)} title="Xóa">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy mặt hàng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Chỉnh sửa mặt hàng' : 'Thêm mặt hàng mới'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên mặt hàng <span className="text-destructive">*</span></Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={formErrors.name ? 'border-destructive' : ''} />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Đơn giá (VNĐ) <span className="text-destructive">*</span></Label>
                <Input id="price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={formErrors.price ? 'border-destructive' : ''} />
                {formErrors.price && <p className="text-xs text-destructive">{formErrors.price}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Phân loại</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drink">Đồ uống</SelectItem>
                    <SelectItem value="popcorn">Bỏng ngô</SelectItem>
                    <SelectItem value="combo">Combo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">URL Hình ảnh</Label>
              <Input id="image" placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="desc">Mô tả chi tiết</Label>
              <Input id="desc" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editingItem ? 'Lưu thay đổi' : 'Thêm mặt hàng'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={open => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xóa mặt hàng này?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Hành động này không thể hoàn tác. Mặt hàng sẽ bị xóa vĩnh viễn khỏi menu hệ thống.
          </p>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
