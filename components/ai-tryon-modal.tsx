"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Camera, Check, Sparkles, ImageIcon, X, Loader2 } from "lucide-react"
import type { Product } from "@/lib/products"
import { useTryOn } from "@/lib/tryon-context"

interface AITryOnModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

type Step = "upload" | "processing" | "result"

const steps = [
  { id: "upload", label: "Загрузка фото", icon: Upload },
  { id: "processing", label: "Обработка ИИ", icon: Sparkles },
  { id: "result", label: "Готовое фото", icon: ImageIcon },
]

export function AITryOnModal({ isOpen, onClose, product }: AITryOnModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addResult } = useTryOn()

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const startProcessing = () => {
    setCurrentStep("processing")

    // Simulate AI processing with random duration
    const processingTime = 3000 + Math.random() * 2000
    setTimeout(() => {
      // Use product image as "result" for mock
      setResultImage(product.images[0])
      setCurrentStep("result")

      // Save to context
      if (uploadedImage) {
        addResult({
          product,
          userPhoto: uploadedImage,
          resultPhoto: product.images[0],
        })
      }
    }, processingTime)
  }

  const reset = () => {
    setCurrentStep("upload")
    setUploadedImage(null)
    setResultImage(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const getStepIndex = (step: Step) => {
    return steps.findIndex((s) => s.id === step)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Примерить онлайн</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = step.id === currentStep
              const isComplete = getStepIndex(currentStep) > index

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isComplete ? "bg-primary text-primary-foreground" : ""}
                      ${isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : ""}
                      ${!isComplete && !isActive ? "bg-muted text-muted-foreground" : ""}
                    `}
                  >
                    {isComplete ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Progress line */}
          <div className="absolute top-6 left-12 right-12 h-0.5 bg-muted -z-0">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${(getStepIndex(currentStep) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {/* Upload Step */}
          {currentStep === "upload" && (
            <div className="space-y-6">
              <div className="flex gap-4">
                {/* Product preview */}
                <div className="w-32 flex-shrink-0">
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{product.name}</p>
                </div>

                {/* Upload area */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                  />

                  {!uploadedImage ? (
                    <div
                      className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                        transition-colors h-full flex flex-col items-center justify-center
                        ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                      `}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="font-medium mb-1">Загрузите ваше фото</p>
                      <p className="text-sm text-muted-foreground mb-4">Перетащите или нажмите для выбора</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Выбрать файл
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Ваше фото"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setUploadedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Рекомендации:</strong> Используйте фото в полный рост с хорошим
                  освещением. Желательно в обтягивающей одежде для лучшего результата.
                </p>
              </div>

              <Button className="w-full" size="lg" disabled={!uploadedImage} onClick={startProcessing}>
                <Sparkles className="h-4 w-4 mr-2" />
                Примерить
              </Button>
            </div>
          )}

          {/* Processing Step */}
          {currentStep === "processing" && (
            <div className="py-12 text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <div className="absolute inset-4 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Обработка изображения</h3>
              <p className="text-muted-foreground mb-4">AI подбирает одежду под вашу фигуру...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Это займёт несколько секунд
              </div>
            </div>
          )}

          {/* Result Step */}
          {currentStep === "result" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Original */}
                <div>
                  <p className="text-sm font-medium mb-2">Оригинал</p>
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                    <Image src={uploadedImage || "/placeholder.svg"} alt="Оригинал" fill className="object-cover" />
                  </div>
                </div>

                {/* Result */}
                <div>
                  <p className="text-sm font-medium mb-2">Результат</p>
                  <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={resultImage || "/placeholder.svg"}
                      alt="Результат примерки"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <Sparkles className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Демо-режим</p>
                        <p className="text-xs opacity-80">Реальная AI-примерка в разработке</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Примерка сохранена!</p>
                  <p className="text-sm text-muted-foreground">Вы можете посмотреть все примерки в личном кабинете</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={reset}>
                  Попробовать ещё
                </Button>
                <Button className="flex-1" onClick={handleClose}>
                  Готово
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
