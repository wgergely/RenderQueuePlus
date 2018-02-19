# RenderQueue+

RenderQueue+ is a handy workflow utility for rendering, reviewing, and managing render outputs.

## Background and Network Rendering

RenderQueue+ allows you to render output modules in the background so you don't have to stop work to wait for renders to complete.

You can also can save a batch file, allowing you to quickly render a file sequence across multiple computers. Sometimes handy for small studios or individuals rendering across multiple computers on a network!



# Using RenderQueue+


I find the Render Queue in After Effects somewhat cumbersome - do you ever find it frustrating having all those finished jobs you have to scroll through so that you can duplicate that last rendered job, rename? Then repeat, again. And again. And what about image sequences? What if I need to re-render frames 1, 5, and 130-140? And what about versioning my outputs?

Wouldn't it be nicer to queue a comp once and let a tool take care of all the rest?

Well, RenderQueue+ can help you. It supposes we don't use the Render Queue to render - we merely queue our comps and set the right output format. Setting the output path, version number (!) and rendering is done via the tool.

There are a few house-keeping tips/rules.

#### Start your comp at frame '1'
This is not enforced but it is a show of good manners to start your output at frame 1 (as opposed to frame 0).
 with 4 leading zeros. It's my personal preference,

#### Name your output comp sensibly
The output comp's name is automatically picked-up and used as the name of our render files.
Make sure it has some sensible format and no special characters (these will be removed).

#### Make sure your output comp starts and ends where it should
This might sound strange, but the tool will always render the entirety of the comp. Hence, if your comp starts at frame 1, and finishes at frame 350, it will render all the frames between 1 and 350.

I decided to enforce this as a matter of principle - it's better to be organised and make sure the output comp is set-up correctly.

#### ...But, but I need to render only a certain range...

If you delete frames from an existing range, those frames will always be re-rendered.
Hence, assuming your output comp starts and ends at the right time, you can always use the tool to remove frames that



## Limitations

Currently, Windows only. Sorry folks. :(
Send me an email if you'd like this implemented for macs too.
