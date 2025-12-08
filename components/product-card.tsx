"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
            {product.isSale && discount > 0 && <Badge className="bg-accent text-accent-foreground">-{discount}%</Badge>}
          </div>

          {/* Like button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-accent text-accent" : ""}`} />
          </Button>

          {/* Quick view on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs">
              Размеры: {product.sizes.slice(0, 5).join(", ")}
              {product.sizes.length > 5 && "..."}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm font-medium text-foreground line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{product.price.toLocaleString()} ₽</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{product.oldPrice.toLocaleString()} ₽</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
