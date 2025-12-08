import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryGrid } from "@/components/category-grid"
import { ProductSection } from "@/components/product-section"
import { AIBanner } from "@/components/ai-banner"
import { products } from "@/lib/products"

export default function HomePage() {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4)
  const saleProducts = products.filter((p) => p.isSale).slice(0, 4)
  const recommendedProducts = products.slice(0, 8)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <CategoryGrid />
        <ProductSection title="Новинки" products={newProducts} href="/catalog?new=true" />
        <AIBanner />
        <ProductSection title="Рекомендуем" products={recommendedProducts} href="/catalog" />
        <ProductSection title="Распродажа" products={saleProducts} href="/catalog?sale=true" />
      </main>
      <Footer />
    </div>
  )
}
