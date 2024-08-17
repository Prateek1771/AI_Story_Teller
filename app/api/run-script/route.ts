import { NextRequest } from 'next/server';
import { RunEventType, RunOpts } from '@gptscript-ai/gptscript';
import g from 'gptScriptInstances'

export async function POST(request: NextRequest){
    const { story, pages, path } = await request.json();

    //Example CLI Command: gptscript ./story-book.gpt --story "a robot and human greating artworks" --pages 5 --path ./stories

    const opts: RunOpts = {
        disableCache: true,
        //
        input: '--story ${story} --pages ${pages} --paths ${path}'
    };

    try{
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller){
                try{
                    const run =  await g
                }
                catch (error){
                    controller.error(error);
                    console.error('Error',error);
                }
            }
        })
    }
    catch (error){
        return new Response(JSON.stringify({ error : error }), {
            status: 500,
        })
    }
}