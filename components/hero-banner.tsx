import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <section className="relative h-[70vh] min-h-[500px] bg-muted overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/fashion-model-elegant-clothing-editorial.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl space-y-6">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Новая коллекция</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">Весна-Лето 2025</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Откройте для себя актуальные тренды сезона. Примерьте онлайн с помощью AI.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/catalog?gender=women">Женщинам</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/catalog?gender=men">Мужчинам</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
