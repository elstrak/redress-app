"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { AITryOnModal } from "@/components/ai-tryon-modal"
import { ProductCard } from "@/components/product-card"
import { Heart, Share2, Truck, RotateCcw, Shield, Sparkles, Check, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string

  const product = products.find((p) => p.id === Number(id))
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Загрузка...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
            <Button asChild>
              <Link href="/catalog">Вернуться в каталог</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const isLiked = isFavorite(product.id)

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.subcategory === product.subcategory)
    .slice(0, 4)

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, selectedSize)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  // Create multiple images for gallery (mock)
  const productImages = [product.images[0], product.images[0], product.images[0]]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Главная
            </Link>
            {" / "}
            <Link href="/catalog" className="hover:text-foreground">
              Каталог
            </Link>
            {" / "}
            <Link href={`/catalog?subcategory=${product.subcategory}`} className="hover:text-foreground">
              {product.subcategory}
            </Link>
            {" / "}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={productImages[selectedImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
                  {product.isSale && discount > 0 && (
                    <Badge className="bg-accent text-accent-foreground">-{discount}%</Badge>
                  )}
                </div>

                {/* Navigation arrows */}
                {productImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={() => setSelectedImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-[3/4] w-20 rounded-md overflow-hidden bg-muted ${
                      selectedImageIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image src={img || "/placeholder.svg"} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="space-y-6">
              {/* Brand & Name */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{product.brand}</p>
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{product.price.toLocaleString()} ₽</span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString()} ₽
                  </span>
                )}
              </div>

              {/* Colors */}
              <div>
                <p className="text-sm font-medium mb-3">Цвет: {product.colors[0]}</p>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${index === 0 ? "border-primary" : "border-transparent"}`}
                      style={{
                        backgroundColor:
                          color === "Чёрный"
                            ? "#000"
                            : color === "Белый"
                              ? "#fff"
                              : color === "Бежевый"
                                ? "#d4b896"
                                : color === "Изумрудный"
                                  ? "#50c878"
                                  : color === "Тёмно-синий"
                                    ? "#1a237e"
                                    : color === "Серый"
                                      ? "#9e9e9e"
                                      : "#ccc",
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Размер</p>
                  <Link href="/sizing" className="text-sm text-muted-foreground hover:text-foreground underline">
                    Таблица размеров
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        min-w-12 h-10 px-4 rounded-md border text-sm font-medium transition-colors
                        ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-foreground"
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button className="flex-1 h-12" size="lg" disabled={!selectedSize} onClick={handleAddToCart}>
                    {addedToCart ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Добавлено
                      </>
                    ) : (
                      "Добавить в корзину"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 bg-transparent"
                    onClick={() => toggleFavorite(product)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-accent text-accent" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* AI Try-On Button */}
                <Button
                  variant="secondary"
                  className="w-full h-12 bg-primary/10 hover:bg-primary/20 text-primary"
                  onClick={() => setIsTryOnOpen(true)}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Примерить онлайн
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Бесплатная доставка от 5000 ₽</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Возврат в течение 14 дней</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Гарантия подлинности</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">
                    Описание
                  </TabsTrigger>
                  <TabsTrigger value="composition" className="flex-1">
                    Состав
                  </TabsTrigger>
                  <TabsTrigger value="care" className="flex-1">
                    Уход
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </TabsContent>
                <TabsContent value="composition" className="pt-4">
                  <p className="text-muted-foreground">{product.composition}</p>
                </TabsContent>
                <TabsContent value="care" className="pt-4">
                  <p className="text-muted-foreground">{product.care}</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Похожие товары</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      {/* AI Try-On Modal */}
      <AITryOnModal isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} product={product} />
    </div>
  )
}
