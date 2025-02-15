'use client'
import { useState , useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card , CardTitle , CardHeader , CardDescription , CardFooter, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {motion , AnimatePresence} from "framer-motion"
import dynamic from "next/dynamic"
import {FaBirthdayCake} from 'react-icons/fa'
import {GiBalloons} from 'react-icons/gi'

type CoffentiProps = {
    width : number ;
    height : number ;

}
const DynamicConfetti = dynamic(() => import('react-confetti'), { ssr: false })

const candleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

const BirthDayWishCard = () => {
    const [candlesLit, setCandlesLit] = useState<number>(0) 
    const [balloonsPoppedCount, setBalloonsPoppedCount] = useState<number>(0) 
    const [showConfetti, setShowConfetti] = useState<boolean>(false) 
    const [windowSize, setWindowSize] = useState<CoffentiProps>({ width: 0, height: 0 }) 
    const [celebrating, setCelebrating] = useState<boolean>(false)


    const totalCandles: number = 5
    const totalBalloons: number = 5

    useEffect(()=>{
        const handleResize = ()=>{
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return ()=> window.removeEventListener("resize" , handleResize)
    },[])
    useEffect(()=>{
        if(candlesLit === totalCandles && balloonsPoppedCount === totalBalloons){
            setCelebrating(true)
            setShowConfetti(true)
        }
    },[candlesLit , balloonsPoppedCount])
// helper functions
const lightCandle = (index: number) =>{
    if(index === candlesLit){
        setCandlesLit(prev=>prev+1)
        return index
    }
}
const popupBallons = (index: number)=>{
    if(index === balloonsPoppedCount){
        setBalloonsPoppedCount(prev=>prev+1)
        return index
    }
}
const celebrate = ():void =>{
    setCelebrating(true)
    setShowConfetti(true)
    const interval = setInterval(() => {
        setCandlesLit(prev => {
            if (prev < totalCandles ) return prev + 1;
            clearInterval(interval);
            return prev;
        })
    }, 500);

}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-300 p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          🎉 Happy Birthday! 🎉
        </CardTitle>
        <CardDescription className="text-center">
          Light the candles and pop the balloons to celebrate!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Candles */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalCandles }).map((_, index) => (
            <motion.div
              key={index}
              className="relative"
              onClick={() => lightCandle(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaBirthdayCake
                className="w-8 h-8 cursor-pointer"
                color={candlesLit > index ? candleColors[index] : "#D3D3D3"}
              />
              {candlesLit > index && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Balloons */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalBalloons }).map((_, index) => (
            <motion.div
              key={index}
              className="relative"
              onClick={() => popupBallons(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GiBalloons
                className="w-8 h-8 cursor-pointer"
                color={balloonsPoppedCount > index ? "#D3D3D3" : balloonColors[index]}
              />
              {balloonsPoppedCount > index && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Celebration Message */}
        {celebrating && (
          <motion.div
            className="text-center text-2xl font-bold text-purple-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🎉 Let's Celebrate! 🎉
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={celebrate} disabled={celebrating}>
          {celebrating ? "Celebrating..." : "Start Celebration"}
        </Button>
      </CardFooter>
    </Card>

    {/* Confetti */}
    <AnimatePresence>
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DynamicConfetti
            width={windowSize.width}
            height={windowSize.height}
            colors={confettiColors}
            recycle={false}
            numberOfPieces={500}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  )
}

export default BirthDayWishCard