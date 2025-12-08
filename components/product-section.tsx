import { ProductCard } from "./product-card"
import type { Product } from "@/lib/products"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ProductSectionProps {
  title: string
  products: Product[]
  href?: string
}

export function ProductSection({ title, products, href }: ProductSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {href && (
            <Button variant="ghost" asChild>
              <Link href={href} className="flex items-center gap-2">
                Смотреть все
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
