# RenderQueue+: A handy After Effects workflow utility for rendering, reviewing, and managing render outputs.


RenderQueue+ adds ***output versioning, background rendering, relative output paths, image-sequence review and editing*** utilities to your After Effects toolset. And more!

The panel loosely integrates with ***Shotgun's RV*** that can be used for reviewing your output. Using FFmpeg, it automatically generates movies from your sequence outputs giving you a wider gamut to interact and review your rendered image-sequences.

## Limitations

* **The script does not support Mac OS**.
Please send me an email if you'd like to see this change.
* The versioning pattern is hard-coded and there's no way to customize it.
* FFmpeg output could do with more presets.
* Panel has been tested but bugs are possible.
It would be greatly appreciated if you reported any that you spot.

## Installation


Place the **RenderQueue+.jsxbin** and the **RenderQueuePlus** folder into the **ScriptUI Panels** folder.

```
ScriptUI Panels\RenderQueue+.jsxbin
ScriptUI Panels\RenderQueuePlus\
```

It's located here (replace 'CC 2018' with your After Effects version name):

```
C:\Program Files\Adobe\Adobe After Effects CC 2018\Support Files\Scripts\ScriptUI Panels
```

After restarting After Effects you should see a 'RenderQueue+.jsxbin' menu-item at the bottom of the 'Window' menu.

On first the first launch, you will be prompted to enter the email address used for the purchase and the licence key you received from Gumroad. Check your email if you don't have it!

## Features

##### Background and Network Rendering

RenderQueue+ can render output modules in the background so you don't have to stop work to wait for renders to complete.
You can also make a batch file that can be launched across multiple computers on a network. This might sometimes be handy for small studios or individuals where a render-farm solution is not available.


#### Version Control

You can enable versioning for any of your output modules by setting 'Version Control' (from the 'Versions' drop-down menu). You have options to increment and reset the version, and also, to toggle between the existing versions via the drop-down menu. This can be handy when comparing revisions, or generally, to keep things neat and tidy.

#### Relative (and absolute) render paths

RenderQueue+ can set your output paths to be relative to the current project.
For example, let's assume your project files are in the ***comps*** folder, and we want the renders to be placed in the folder called ***renders*** in the same folder as the ***comps*** folder.

```
C:/work/comps/My After Effects Project.aep
C:/work/renders/
```

We can point to the ***renders*** folder by entering the following in Settings:

```
././renders
```

The output path will be set once we select 'Set Version Control' for the item. Simple!


##### RV

If you're a Deadline/RV user you can call RV from the panel to review your rendered files in RV.
There's also an option to specify custom switches.


##### Frame Manager

You can delete rendered images (or movies) from the app via the Frame Manager.
Here you can filter your files by sequence patterns, eg you can enter in the filter box '1-20, 30-40' displaying only frames 1-20 and 30-40. This makes it easy to remove specific image-ranges if you need to re-render only a section of your comp.


##### Restore project used to render the given version

The panel automatically archives a copy of your comp when you start a render: this means, you can always refer back to the project used to render a given version.

## Tips

##### Name your output comp sensibly
The output composition names are automatically picked-up and used in the name of the render files.
Make sure they have sensible names and contain no special characters (or at least bear in mind, these will be removed from the output name).

##### Make sure your output comp starts and ends at the right frames
This might sound strange, but the tool always renders the entirety of your output comp.

Hence, if your comp starts at frame 1, and finishes at frame 350, it will render all the frames between and including 1 and 350.
This is enforced as a matter of principle to keep things, but chiefly, the author of this script organised. It is sometimes nice to have restrictions and it's better to be tidy and to make sure the output comp is set-up correctly.

##### ...But, but...I *have* to render a range

If you delete frames from an existing sequence of images, those frames will automatically be re-rendered (the panel automatically sets sequences to skip existing files when you set Version Control). This allows you to re-render ranges, and specific frames too. RenderQueue+ comes with a frame manager to help you delete image ranges, and/or specific frames straight from After Effects.

#### About
Copyright (c) 2018 Gergely Wootsch
hello@gergely-wootsch.com
http://gergely-wotsch.com

#### Support and contact
http://gergely-wootsch.com/renderqueueplus
hello@gergely-wootsch.com
