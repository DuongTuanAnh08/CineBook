import { useParams, Link } from 'react-router-dom'
import { useData } from '@/contexts/data-context'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NewsDetail() {
  const { id } = useParams()
  const { news = [] } = useData()
  const article = news.find(n => n.id === id)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
        <Button asChild>
          <Link to="/news">Về trang tin tức</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
        <Link to="/news"><ArrowLeft className="w-4 h-4 mr-2" /> Quay lại</Link>
      </Button>

      <article>
        <h1 className="text-4xl font-bold mb-4 leading-tight">{article.title}</h1>
        <div className="text-muted-foreground mb-8">
          Đăng ngày: {new Date(article.createdAt).toLocaleDateString('vi-VN')}
        </div>
        
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-sm">
          <img 
            src={article.thumbnail || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80'} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div 
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  )
}
