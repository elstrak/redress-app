import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Camera, Wand2 } from "lucide-react"

export function AIBanner() {
  return (
    <section className="py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm uppercase tracking-widest opacity-80">Новая технология</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">AI-примерка онлайн</h2>
            <p className="text-lg opacity-90 max-w-md">
              Загрузите своё фото и посмотрите, как одежда будет смотреться на вас
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-sm">Загрузите фото</span>
            </div>
            <div className="h-px w-8 bg-primary-foreground/30" />
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Wand2 className="h-6 w-6" />
              </div>
              <span className="text-sm">AI обработка</span>
            </div>
            <div className="h-px w-8 bg-primary-foreground/30" />
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="text-sm">Готово!</span>
            </div>
          </div>

          <Button size="lg" variant="secondary" asChild>
            <Link href="/catalog">Попробовать</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
