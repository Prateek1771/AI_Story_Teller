'use client'

import React, { useState } from 'react'
import { Textarea } from './ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'
import { Button } from './ui/button'
import { Frame } from '@gptscript-ai/gptscript'
import renderEventMessage from '@/lib/renderEventMessage'

const storiesPath = 'public/stories';

function StoryWriter() { 

    const [story, setStory] = useState<string>('');
    const [pages, setPages] = useState<number | null>(null);
    const [progress, setProgress] = useState('');
    const [runStarted, setRunStarted] = useState<boolean>(false);
    const [runFinished, setRunFinished] = useState<boolean | null>(null);
    const [currentTool, setCurrentTool] = useState('');
    const [events, setEvents] = useState<Frame[]>([]);

    async function runScript() {
        setRunStarted(true);
        setRunFinished(false);

        const response = await fetch('/api/run-script',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({ story, pages, path: storiesPath}),
        });

        if(response.ok && response.body){
            //handle streams
            console.log('streaming Started');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            handleStream(reader, decoder)
        }
        else{
            setRunFinished(true);
            setRunStarted(false);
            console.error('Failed to start streaming')
        }
    }

    async function handleStream(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) {
        while(true){
            const {done, value} = await reader.read();

            if(done) break; //breaks the loop

            // decoder is used to decode the unit8arry into a string
            const chunk = decoder.decode(value, {stream: true});

            // we split the chunks into events by splitting it by the event: keyword.
            const eventData = chunk
            .split('\n\n')
            .filter((line) => line.startsWith('event: '))
            .map((line) => line.replace(/^event: /, ''));

            // we parse the JSON data and update the state accordingly.
            eventData.forEach(data => {
                try {
                    const parsedData = JSON.parse(data);
                    console.log(parsedData)

                    if(parsedData.type ==='callProgress'){
                        setProgress(
                            parsedData.output[parsedData.output.length - 1].Content
                        )

                        setCurrentTool(parsedData.tool?.description || '');
                    }
                    
                    else if (parsedData.type === 'callStart'){
                        setCurrentTool(parsedData.tool?.description || '');
                    }
                    
                    else if (parsedData.type === 'runFinished'){
                        setRunFinished(true);
                        setRunStarted(false);
                    }

                    else {
                        setEvents((prevEvents) => [...prevEvents, parsedData]);
                    }
                } catch (error) {
                    console.error('failed to parse JSON', error)
                }
            })
        }
    }

  return (
    <div className='text-zinc-900 flex flex-col container p-5 pt-2'>
        <section className='flex-1 flex flex-col border border-purple-500 rounded-md p-5 space-y-2'>
            <Textarea 
                placeholder='Write a story about...' 
                className='text-md flex-1 text-zinc-900' 
                value={story}
                onChange={(e) => setStory(e.target.value)}
            />

            <div>
                <Select onValueChange={(value) => setPages(parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder='How many pages should the story be?'></SelectValue>
                    </SelectTrigger>

                    <SelectContent className='w-full'>
                        {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button disabled={!story || !pages || runStarted} className='w-full bg-purple-600' size='lg'
            onClick={runScript}
            >Generate Story 🚀</Button>
        </section>

        <section className='flex-1 pb-3 mt-5'>
            <div className='flex flex-col-reverse w-full space-y-2 bh-gray-800 rounded-md text-green-500 font-mono p-10 h-96 overflow-y-scroll border border-purple-500'>
                <div>
                    {runFinished === null && (
                        <>
                        <p className='animate-pulse mr-5'>I'm waiting for you to Generate a story above...</p>
                        <br />
                        </>
                    )}

                    <span className='mr-5'>{">>"}</span>
                </div>
                {progress}
            </div>

            {currentTool && (
                <div className='py-10'>
                    <span className='mr-5'>{"--- [Current Tool] ---"}</span>
                    {currentTool}
                </div>
            )}

            {/* Render events */}
            <div className="space-y-5">
                {events.map((event, index) => (
                    <div key={index}>
                        <span className="mr-5">{">>"}</span>
                        {renderEventMessage(event)}
                    </div>
                ))}
            </div>

            {runStarted && (
                <div>
                    <span className="mr-5 animate-in">
                        {'--- [AI Storyteller has started] ---'}
                    </span>
                </div>
            )}

        </section>
    </div>
  )
}

export default StoryWriter
