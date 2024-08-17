import React from 'react'
import Link from 'next/link'
import { BookOpen, FilePen } from 'lucide-react'

function Header() {
  return (
    <header className='relative p-10 text-center bg-zinc-900'>
        <Link href='/'>
            <h1 className='text-5xl text-zinc-200 font-black'>StoryTeller AI</h1>
            <div className='flex justify-center whitespace-nowrap space-x-5 lg:text-4xl'>
                <h2 className='text-zinc-200'>Bringing your stories</h2>
                <div className="relative">
                    <div className="absolute bg-purple-500 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1" />
                    
                    <p className="relative text-white">To life!</p>
                </div>
            </div>
        </Link>
        
        {/* Nav Icons */}
        <div className='absolute flex right-5 -top-5 space-x-2'>
            <Link href='/'>
                <FilePen className='w-8 h-8 lg:w-10 lg:h-10 mx-auto text-purple-500 mt-10 border border-purple-500 p-2 rounded-md  hover:opacity-50 cursor-pointer'
            />
            </Link>
            
            <Link href='/stories'>
                <BookOpen className='w-8 h-8 lg:w-10 lg:h-10 mx-auto text-purple-500 mt-10 border border-purple-500 p-2 rounded-md hover:opacity-50 cursor-pointer'
                />
            </Link>
        </div>
    </header>
  )
}

export default Header