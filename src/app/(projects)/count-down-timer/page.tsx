"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
const CountDownTimer = () => {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isActive && !isPaused) {
      timeRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timeRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };
  // helper function

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl ">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Countdown Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <motion.div
            key={timeLeft}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold py-4 text-center"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <Input
            type="number"
            placeholder="Enter duration (seconds)"
            className="text-center text-lg"
            value={duration}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDuration(Number(e.target.value))
            }
          />
          <div className="flex gap-2 mt-4">
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={handleSetDuration}
            >
              Set
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleStart}
              disabled={isActive}
            >
              Start
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={handlePause}
              disabled={!isActive}
            >
              Pause
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountDownTimer;
