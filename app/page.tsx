"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, RefreshCw, Upload, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createCelebration } from "./confetti-utils"
import { defaultQuotes } from "./quotes"

export default function Home() {
  const [quotes, setQuotes] = useState(defaultQuotes)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [customQuote, setCustomQuote] = useState("")
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [celebrationCount, setCelebrationCount] = useState(0)
  const [showBanner, setShowBanner] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    const timer = setTimeout(() => createCelebration(), 1000)

    return () => {
      window.removeEventListener("resize", updateSize)
      clearTimeout(timer)
    }
  }, [])

  const nextQuote = () => setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)

  const addCustomQuote = () => {
    if (customQuote.trim()) {
      setQuotes([...quotes, customQuote])
      setCustomQuote("")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setCustomImage(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCelebrate = () => {
    if (celebrationCount < 3 || !showBanner) {
      createCelebration()
      setCelebrationCount((prevCount) => (prevCount + 1) % 4)
      setShowBanner(true)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
      <BackgroundSparkles size={size} />
      <div className="z-10 w-full max-w-3xl">
        <Header
          handleCelebrate={handleCelebrate}
          celebrationCount={celebrationCount}
          showBanner={showBanner}
          setShowBanner={setShowBanner}
        />
        <QuoteCard
          customImage={customImage}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          quotes={quotes}
          currentQuoteIndex={currentQuoteIndex}
          nextQuote={nextQuote}
        />
        <AddQuoteDialog customQuote={customQuote} setCustomQuote={setCustomQuote} addCustomQuote={addCustomQuote} />
        <Footer />
      </div>
    </main>
  )
}

const BackgroundSparkles = ({ size }) => (
  <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-pink-300 rounded-full opacity-70"
        initial={{
          x: Math.random() * size.width,
          y: Math.random() * size.height,
          scale: 0,
        }}
        animate={{
          x: Math.random() * size.width,
          y: Math.random() * size.height,
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 4 + Math.random() * 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
)

const Header = ({ handleCelebrate, celebrationCount, showBanner, setShowBanner }) => (
  <header className="text-center mb-8">
    <motion.h1
      className="text-4xl md:text-5xl font-bold text-primary mb-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Shine & Inspire
    </motion.h1>
    <motion.p
      className="text-lg text-secondary-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      Celebrating International Women's Day - March 8
    </motion.p>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}>
      <AnimatePresence>
        {celebrationCount < 3 || !showBanner ? (
          <motion.div
            key="celebrate-button"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleCelebrate}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Celebrate with Fireworks!
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="out-of-fireworks"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setShowBanner(false)}
            className="cursor-pointer"
          >
            <motion.p
              className="mt-4 text-primary font-bold text-xl bg-accent p-4 rounded-lg shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              We're out of fireworks! Please donate to continue the celebration =))
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </header>
)

const QuoteCard = ({ customImage, fileInputRef, handleImageUpload, quotes, currentQuoteIndex, nextQuote }) => (
  <Card className="w-full mb-8 overflow-hidden bg-white/80 backdrop-blur-sm border-secondary shadow-lg">
    <CardContent className="p-0">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          {customImage ? (
            <img
              src={customImage || "/placeholder.svg"}
              alt="Custom uploaded image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[120px] flex items-center"
            >
              <p className="text-lg text-primary italic">"{quotes[currentQuoteIndex]}"</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={nextQuote}
              className="text-white border-none bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Next Quote
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

const AddQuoteDialog = ({ customQuote, setCustomQuote, addCustomQuote }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
        <Plus className="mr-2 h-4 w-4" />
        Add Your Own Inspirational Quote
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Your Own Quote</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Textarea
          placeholder="Enter your inspirational quote..."
          value={customQuote}
          onChange={(e) => setCustomQuote(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          onClick={addCustomQuote}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
        >
          Add Quote
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

const Footer = () => (
  <footer className="mt-8 text-center text-sm text-secondary-foreground">
    <p>Created with ❤️ for International Women's Day</p>
  </footer>
)

