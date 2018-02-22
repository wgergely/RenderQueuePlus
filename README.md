# RenderQueue+: A handy workflow utility for rendering, reviewing, and managing render outputs.


RenderQueue+ adds ***output versioning, background renders, relative output paths, image-sequence review and editing*** utilities to your After Effects toolset. And more!

There's no need to leave After Effects as RenderQueue+ can easily import your rendered sequence back into the project, or remove and re-rendered existing files from After Effects.

The panel loosely integrates with ***Deadline's RV*** that can be used for reviewing your output. Also, using FFMpeg, it's possible to automatically generate mp4s from your sequence outputs giving you a wider gamut to interact with your rendered image-sequences.


## Installation

Place the **RenderQueue+.jsxbin** and the **RenderQueuePlus** folder into the **ScriptUI Panels** folder. It's located here (replace 'CC 2018' with your After Effects version name):

```
C:\Program Files\Adobe\Adobe After Effects CC 2018\Support Files\Scripts\ScriptUI Panels
```

After restarting After Effects you should see a 'RenderQueue+.jsx' menu item at the bottom of the 'Window' menu.


## Features

#### Relative (and absolute) render paths

RenderQueue+ can set your output paths to be relative to your current project.
I tend to work so that my comps are in a ***comps*** folder, and my respective renders go in a folder called ***renders***:

```
./comps/My After Effects Project.aep
./renders/
```

For my outputs to go automatically to the ***renders*** folder I can put
```
../renders
```
into the 'Set Output Path' field in the Settings panel. All new output modules that have version control enabled will point to that folder. Simple!

#### Version Control

You can enable versioning for any of your output modules by selecting 'Set Version Control' from the 'Versions' drop-down menu. You have options to increment and reset your version, and also, to toggle between the existing versions. Eg. This can be handy for comparing different revisions.

##### Background and Network Rendering

RenderQueue+ can render output modules in the background so you don't have to stop work to wait for renders to complete.
You can also can make a batch file that can be launched across multiple computers on a network. This might sometimes be handy for small studios or individuals where a render-farm solution is not available.

##### RV

If you're a Deadline/RV user you can call RV from the panel to review your rendered files in RV.



##### Restore project used to render the given version

The panel automatically archives a copy of your comp when you start a render: this way, you can always refer back to the project used to render a given version.


## Tips & Rules
For it all to work as intended, there are a few house-keeping tips and rules.

##### Name your output comp sensibly
The output comp's name is automatically picked-up and used as the name of the render files.
Make sure it has some sensible name and contains no special characters (or at least bear in mind, these will be removed from the output name).

##### Make sure your output comp starts and ends at the right frames
This might sound strange, but the tool always renders the entirety of your output comp. Hence, if your comp starts at frame 1, and finishes at frame 350, it will render all the frames between and including 1 and 350.
This is enforced as a matter of principle to keep things, but chiefly, myself, organised. It is sometimes nice to have restrictions and it's better to be tidy and to make sure the output comp is set-up correctly.

##### ...But, but...I *need* to render a certain range

If you delete frames from an existing sequence of images, those frames will automatically be re-rendered (the panel automatically set sequences to skip existing files). This allows you to re-render ranges, and specific frames too. RenderQueue+ comes with a little frame manager to help you delete image ranges, and/or specific frames straight from After Effects.


## Limitations

* This one is a biggie: The panel doesn't support Mac OS. Sorry folks!
Please send me an email if you'd like to see this change.
* The versioning pattern is hard-corded and there's no way to customize it at the moment.
* Panel has been tested in a limited environment, bugs are possible and likely!
