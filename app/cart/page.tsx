"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  const deliveryThreshold = 5000
  const deliveryCost = totalPrice >= deliveryThreshold ? 0 : 299
  const remainingForFreeDelivery = deliveryThreshold - totalPrice

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Корзина</h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Корзина пуста</h2>
              <p className="text-muted-foreground mb-6">Добавьте товары, чтобы оформить заказ</p>
              <Button asChild>
                <Link href="/catalog">Перейти в каталог</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Free delivery progress */}
                {remainingForFreeDelivery > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm mb-2">
                      До бесплатной доставки осталось{" "}
                      <span className="font-semibold">{remainingForFreeDelivery.toLocaleString()} ₽</span>
                    </p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min((totalPrice / deliveryThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Items list */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                    >
                      <Link
                        href={`/product/${item.product.id}`}
                        className="w-24 h-32 relative rounded-md overflow-hidden bg-muted flex-shrink-0"
                      >
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">{item.product.brand}</p>
                            <Link href={`/product/${item.product.id}`} className="font-medium hover:underline">
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">Размер: {item.size}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => removeFromCart(item.product.id, item.size)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{(item.product.price * item.quantity).toLocaleString()} ₽</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {item.product.price.toLocaleString()} ₽/шт
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
                  Очистить корзину
                </Button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-lg font-semibold mb-4">Ваш заказ</h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Товары ({items.length})</span>
                        <span>{totalPrice.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Доставка</span>
                        <span>{deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} ₽`}</span>
                      </div>
                    </div>

                    <div className="border-t border-border my-4" />

                    <div className="flex justify-between text-lg font-semibold mb-6">
                      <span>Итого</span>
                      <span>{(totalPrice + deliveryCost).toLocaleString()} ₽</span>
                    </div>

                    <Button className="w-full" size="lg">
                      Оформить заказ
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Promo code */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="font-medium mb-3">Промокод</h3>
                    <div className="flex gap-2">
                      <Input placeholder="Введите код" />
                      <Button variant="outline" className="bg-transparent">
                        OK
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
