"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products, subcategories } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const brands = [...new Set(products.map((p) => p.brand))]
const sizes = [...new Set(products.flatMap((p) => p.sizes))]
const minPrice = Math.min(...products.map((p) => p.price))
const maxPrice = Math.max(...products.map((p) => p.price))

function CatalogContent() {
  const searchParams = useSearchParams()
  const genderParam = searchParams.get("gender")
  const subcategoryParam = searchParams.get("subcategory")
  const saleParam = searchParams.get("sale")
  const newParam = searchParams.get("new")

  const [selectedGender, setSelectedGender] = useState<string | null>(genderParam)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    subcategoryParam ? [subcategoryParam] : [],
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [showSale, setShowSale] = useState(saleParam === "true")
  const [showNew, setShowNew] = useState(newParam === "true")
  const [sortBy, setSortBy] = useState("popular")

  const filteredProducts = useMemo(() => {
    let result = products

    if (selectedGender) {
      result = result.filter((p) => p.gender === selectedGender || p.gender === "unisex")
    }

    if (selectedSubcategories.length > 0) {
      result = result.filter((p) => selectedSubcategories.includes(p.subcategory))
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand))
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)))
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (showSale) {
      result = result.filter((p) => p.isSale)
    }

    if (showNew) {
      result = result.filter((p) => p.isNew)
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "new":
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }

    return result
  }, [selectedGender, selectedSubcategories, selectedBrands, selectedSizes, priceRange, showSale, showNew, sortBy])

  const clearFilters = () => {
    setSelectedGender(null)
    setSelectedSubcategories([])
    setSelectedBrands([])
    setSelectedSizes([])
    setPriceRange([minPrice, maxPrice])
    setShowSale(false)
    setShowNew(false)
  }

  const hasFilters =
    selectedGender ||
    selectedSubcategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    showSale ||
    showNew

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Gender */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Пол
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {[
            { value: "women", label: "Женщинам" },
            { value: "men", label: "Мужчинам" },
          ].map((g) => (
            <label key={g.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedGender === g.value}
                onCheckedChange={(checked) => setSelectedGender(checked ? g.value : null)}
              />
              <span className="text-sm">{g.label}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Subcategories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Категория
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2 max-h-48 overflow-y-auto">
          {subcategories.map((sub) => (
            <label key={sub} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedSubcategories.includes(sub)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSubcategories((prev) => [...prev, sub])
                  } else {
                    setSelectedSubcategories((prev) => prev.filter((s) => s !== sub))
                  }
                }}
              />
              <span className="text-sm">{sub}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Brands */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Бренд
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands((prev) => [...prev, brand])
                  } else {
                    setSelectedBrands((prev) => prev.filter((b) => b !== brand))
                  }
                }}
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Цена
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Slider
            value={priceRange}
            min={minPrice}
            max={maxPrice}
            step={100}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="mb-2"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} ₽</span>
            <span>{priceRange[1].toLocaleString()} ₽</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Размер
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {sizes.slice(0, 12).map((size) => (
              <button
                key={size}
                onClick={() => {
                  if (selectedSizes.includes(size)) {
                    setSelectedSizes((prev) => prev.filter((s) => s !== size))
                  } else {
                    setSelectedSizes((prev) => [...prev, size])
                  }
                }}
                className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                  selectedSizes.includes(size)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Special filters */}
      <div className="space-y-2 pt-4 border-t border-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={showSale} onCheckedChange={(checked) => setShowSale(checked as boolean)} />
          <span className="text-sm">Со скидкой</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={showNew} onCheckedChange={(checked) => setShowNew(checked as boolean)} />
          <span className="text-sm">Новинки</span>
        </label>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
          Сбросить фильтры
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb & Title */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">Главная / Каталог</p>
            <h1 className="text-3xl font-bold">
              {selectedGender === "women" ? "Женщинам" : selectedGender === "men" ? "Мужчинам" : "Каталог"}
            </h1>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSection />
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  {/* Mobile filter button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden bg-transparent">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Фильтры
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Фильтры</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSection />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "товар" : "товаров"}
                  </span>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">По популярности</SelectItem>
                    <SelectItem value="new">Сначала новинки</SelectItem>
                    <SelectItem value="price-asc">Сначала дешевле</SelectItem>
                    <SelectItem value="price-desc">Сначала дороже</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active filters */}
              {hasFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedGender && (
                    <Button variant="secondary" size="sm" onClick={() => setSelectedGender(null)}>
                      {selectedGender === "women" ? "Женщинам" : "Мужчинам"}
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {selectedSubcategories.map((sub) => (
                    <Button
                      key={sub}
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedSubcategories((prev) => prev.filter((s) => s !== sub))}
                    >
                      {sub}
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  ))}
                  {selectedBrands.map((brand) => (
                    <Button
                      key={brand}
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedBrands((prev) => prev.filter((b) => b !== brand))}
                    >
                      {brand}
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  ))}
                </div>
              )}

              {/* Products grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">Товары не найдены</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  )
}
