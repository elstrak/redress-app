import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight">STYLEHUB</span>
            <p className="text-sm text-muted-foreground">Ваш персональный стилист с технологией AI-примерки</p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Покупателям</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/delivery" className="hover:text-foreground transition-colors">
                Доставка и оплата
              </Link>
              <Link href="/returns" className="hover:text-foreground transition-colors">
                Возврат
              </Link>
              <Link href="/sizing" className="hover:text-foreground transition-colors">
                Таблица размеров
              </Link>
              <Link href="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Компания</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                О нас
              </Link>
              <Link href="/contacts" className="hover:text-foreground transition-colors">
                Контакты
              </Link>
              <Link href="/careers" className="hover:text-foreground transition-colors">
                Вакансии
              </Link>
              <Link href="/press" className="hover:text-foreground transition-colors">
                Пресса
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Подписка на новости</h4>
            <p className="text-sm text-muted-foreground">Узнавайте первыми о скидках и новинках</p>
            <div className="flex gap-2">
              <Input placeholder="Email" className="flex-1" />
              <Button>OK</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 STYLEHUB. Все права защищены.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
