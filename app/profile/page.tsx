"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useTryOn } from "@/lib/tryon-context"
import {
  User,
  ShoppingBag,
  Heart,
  Sparkles,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  Package,
  Clock,
  ChevronRight,
  Trash2,
} from "lucide-react"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-2025-001",
    date: "15 января 2025",
    status: "delivered",
    statusText: "Доставлен",
    total: 24990,
    items: [
      {
        name: "Пальто прямого кроя",
        brand: "ZARINA",
        size: "M",
        image: "/beige-wool-coat-women-elegant.jpg",
      },
    ],
  },
  {
    id: "ORD-2025-002",
    date: "20 января 2025",
    status: "shipping",
    statusText: "В доставке",
    total: 15980,
    items: [
      {
        name: "Платье миди с поясом",
        brand: "LOVE REPUBLIC",
        size: "S",
        image: "/emerald-green-midi-dress-elegant.jpg",
      },
      {
        name: "Блуза с бантом",
        brand: "SELA",
        size: "S",
        image: "/white-silk-blouse-with-bow.jpg",
      },
    ],
  },
]

// Mock favorites
const mockFavorites = [
  {
    id: 1,
    name: "Пальто прямого кроя",
    brand: "ZARINA",
    price: 12990,
    image: "/beige-wool-coat-women-elegant.jpg",
  },
  {
    id: 6,
    name: "Куртка кожаная",
    brand: "MANGO",
    price: 15990,
    image: "/black-leather-jacket-women-biker.jpg",
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { items: cartItems } = useCart()
  const { results: tryOnResults, removeResult } = useTryOn()

  const menuItems = [
    { id: "profile", label: "Профиль", icon: User },
    { id: "orders", label: "Мои заказы", icon: Package, badge: mockOrders.length },
    { id: "cart", label: "Корзина", icon: ShoppingBag, badge: cartItems.length },
    { id: "favorites", label: "Избранное", icon: Heart, badge: mockFavorites.length },
    { id: "tryons", label: "AI-примерки", icon: Sparkles, badge: tryOnResults.length },
    { id: "addresses", label: "Адреса", icon: MapPin },
    { id: "payments", label: "Способы оплаты", icon: CreditCard },
    { id: "notifications", label: "Уведомления", icon: Bell },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 mb-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Гость</p>
                    <p className="text-sm text-muted-foreground">guest@example.com</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors
                          ${activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        {item.badge ? (
                          <Badge variant={activeTab === item.id ? "secondary" : "outline"} className="ml-auto">
                            {item.badge}
                          </Badge>
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>

              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <LogOut className="h-4 w-4 mr-3" />
                Выйти
              </Button>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Личные данные</CardTitle>
                    <CardDescription>Управляйте вашей персональной информацией</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя</Label>
                        <Input id="firstName" placeholder="Введите имя" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input id="lastName" placeholder="Введите фамилию" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" type="tel" placeholder="+7 (999) 999-99-99" />
                      </div>
                    </div>
                    <Button>Сохранить изменения</Button>
                  </CardContent>
                </Card>
              )}

              {/* Orders */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Мои заказы</h2>
                  {mockOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {order.date}
                            </p>
                          </div>
                          <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                            {order.statusText}
                          </Badge>
                        </div>
                        <div className="flex gap-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="w-16 h-20 relative rounded-md overflow-hidden bg-muted">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="text-sm">
                                <p className="text-muted-foreground">{item.brand}</p>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground">Размер: {item.size}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <span className="font-semibold">{order.total.toLocaleString()} ₽</span>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Подробнее
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Cart */}
              {activeTab === "cart" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Корзина</h2>
                    <Button asChild>
                      <Link href="/cart">Перейти в корзину</Link>
                    </Button>
                  </div>
                  {cartItems.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Корзина пуста</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {cartItems.map((item) => (
                        <Card key={`${item.product.id}-${item.size}`}>
                          <CardContent className="p-4 flex gap-4">
                            <div className="w-20 h-24 relative rounded-md overflow-hidden bg-muted">
                              <Image
                                src={item.product.images[0] || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Размер: {item.size} · Кол-во: {item.quantity}
                              </p>
                              <p className="font-semibold mt-1">
                                {(item.product.price * item.quantity).toLocaleString()} ₽
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Favorites */}
              {activeTab === "favorites" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Избранное</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mockFavorites.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4 flex gap-4">
                          <Link
                            href={`/product/${item.id}`}
                            className="w-24 h-32 relative rounded-md overflow-hidden bg-muted"
                          >
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </Link>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                            <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                              {item.name}
                            </Link>
                            <p className="font-semibold mt-2">{item.price.toLocaleString()} ₽</p>
                            <Button size="sm" className="mt-2">
                              В корзину
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Try-ons */}
              {activeTab === "tryons" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">AI-примерки</h2>
                  {tryOnResults.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">У вас пока нет AI-примерок</p>
                        <Button asChild>
                          <Link href="/catalog">Перейти в каталог</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {tryOnResults.map((result) => (
                        <Card key={result.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-3 mb-4">
                              <div className="w-20 h-24 relative rounded-md overflow-hidden bg-muted">
                                <Image
                                  src={result.userPhoto || "/placeholder.svg"}
                                  alt="Ваше фото"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="w-20 h-24 relative rounded-md overflow-hidden bg-muted">
                                <Image
                                  src={result.resultPhoto || "/placeholder.svg"}
                                  alt="Результат"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                  <Sparkles className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">{result.product.brand}</p>
                                <p className="font-medium">{result.product.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {result.createdAt.toLocaleDateString("ru-RU")}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeResult(result.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses */}
              {activeTab === "addresses" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Адреса доставки</CardTitle>
                    <CardDescription>Управляйте адресами для доставки заказов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-dashed border-border rounded-lg p-8 text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground mb-3">У вас пока нет сохранённых адресов</p>
                      <Button variant="outline" className="bg-transparent">
                        Добавить адрес
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payments */}
              {activeTab === "payments" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Способы оплаты</CardTitle>
                    <CardDescription>Управляйте сохранёнными картами</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-dashed border-border rounded-lg p-8 text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground mb-3">У вас пока нет сохранённых карт</p>
                      <Button variant="outline" className="bg-transparent">
                        Добавить карту
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                    <CardDescription>Настройте получение уведомлений</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Статус заказа", desc: "Уведомления о изменении статуса заказа" },
                      { label: "Акции и скидки", desc: "Информация о распродажах и специальных предложениях" },
                      { label: "Новинки", desc: "Уведомления о новых поступлениях" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-3 border-b border-border">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Включено
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
