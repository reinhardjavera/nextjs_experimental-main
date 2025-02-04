"use client"

import Link from 'next/link'
import { useEffect } from 'react';

import * as wxgantt from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";

export default function Home() {

  useEffect(() => {
    import("wx-react-gantt").then(x => {
      console.log("Gantt", x);
    });
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Welcome to My Next.js App</h1>
      </header>
      
      <main>
        <p className="mb-4">This is a basic Next.js page using the App Router.</p>
        <Link href="/about" className="text-blue-500 hover:underline">
          Learn more about us
        </Link>
      </main>
      
      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; 2025 My Next.js App. All rights reserved.</p>
      </footer>
    </div>
  )
}

