import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Платья",
    href: "/catalog?subcategory=Платья",
    image: "/elegant-dress-fashion.png",
  },
  {
    name: "Костюмы",
    href: "/catalog?subcategory=Костюмы",
    image: "/business-suit-fashion.jpg",
  },
  {
    name: "Верхняя одежда",
    href: "/catalog?subcategory=Пальто",
    image: "/coat-outerwear-fashion.jpg",
  },
  {
    name: "Джинсы",
    href: "/catalog?subcategory=Джинсы",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg md:text-xl font-semibold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
