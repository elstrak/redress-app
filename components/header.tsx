"use client"

import Link from "next/link"
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

export function Header() {
  const { totalItems } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navLinks = [
    { href: "/catalog?gender=women", label: "Женщинам" },
    { href: "/catalog?gender=men", label: "Мужчинам" },
    { href: "/catalog", label: "Все товары" },
    { href: "/catalog?sale=true", label: "Sale", accent: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      {/* Top bar */}
      <div className="hidden md:block border-b border-border bg-muted">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Бесплатная доставка от 5000 ₽</span>
            <div className="flex items-center gap-4">
              <Link href="/about" className="hover:text-foreground transition-colors">
                О компании
              </Link>
              <Link href="/delivery" className="hover:text-foreground transition-colors">
                Доставка
              </Link>
              <Link href="/contacts" className="hover:text-foreground transition-colors">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium ${link.accent ? "text-accent" : "text-foreground"} hover:text-muted-foreground transition-colors`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold tracking-tight">STYLEHUB</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${link.accent ? "text-accent" : "text-foreground"} hover:text-muted-foreground transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <Input placeholder="Поиск..." className="w-48 h-9" autoFocus />
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Поиск</span>
                </Button>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Избранное</span>
            </Button>

            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Профиль</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Корзина</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
