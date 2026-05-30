import { useState } from 'react';
import { useData } from '@/contexts/data-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNews() {
  const { news = [], addNews, updateNews, deleteNews } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    thumbnail: '',
    status: 'published'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      thumbnail: '',
      status: 'published'
    });
    setEditingNews(null);
  };

  const handleOpenDialog = (article = null) => {
    if (article) {
      setEditingNews(article);
      setFormData({
        title: article.title,
        summary: article.summary,
        content: article.content,
        thumbnail: article.thumbnail,
        status: article.status
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    if (editingNews) {
      updateNews(editingNews.id, formData);
      toast.success('Cập nhật tin tức thành công');
    } else {
      addNews(formData);
      toast.success('Thêm tin tức thành công');
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deleteNews(id);
      toast.success('Xóa tin tức thành công');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Tin tức</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Thêm bài viết
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">Chưa có bài viết nào</TableCell>
              </TableRow>
            ) : (
              news.map(article => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="line-clamp-1">{article.title}</div>
                  </TableCell>
                  <TableCell>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(article)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Sửa bài viết' : 'Thêm bài viết mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ảnh đại diện (URL)</Label>
              <Input 
                value={formData.thumbnail}
                onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Tóm tắt</Label>
              <Textarea 
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                placeholder="Tóm tắt ngắn gọn nội dung"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Nội dung (hỗ trợ HTML)</Label>
              <Textarea 
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="<p>Nội dung bài viết...</p>"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({...formData, status: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button type="submit">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
