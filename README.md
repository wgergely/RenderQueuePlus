# RenderQueue+


## A handy workflow utility for rendering, reviewing, and managing render outputs.


## About
RenderQueue+ adds simple versioning and methods to review and manage rendered sequences to After Effects. It also enables background rendering so there's no need to interrupt flow to render a comp. For reviewing, it integrates with Deadline's RV, and adds shortcuts to import rendered files back into your project.

## Installation

Place the **RenderQueue+.jsxbin** and the **RenderQueuePlus** folder into the **ScriptUI Panels** folder. It's located at (replace 'CC 2018' with your version):

```
  C:\Program Files\Adobe\Adobe After Effects CC 2018\Support Files\Scripts\ScriptUI Panels
```

After restarting After Effects you should see 'RenderQueue+.jsxbin' at the bottom of the 'Window' menu.

# Features

#### Relative (and absolute) render paths

RenderQueue+ can set relative paths (see the 'Settings' window). This way render outputs will always render to a location relative of the current project. This also mean there's no need to set output paths - RenderQueue+ takes care of that for you.

##### Background and Network Rendering

RenderQueue+ can render output modules in the background so you don't have to stop work to wait for renders to complete.

You can also can save a batch file, allowing you to quickly render a file sequence across multiple computers on a network. This might sometimes be handy for small studios or individuals where a render-farm is not available.

##### RV

If you're a Deadline/RV user you can call RV from the panel to review your rendered files in RV.

##### Versioned outputs
The tool allows you to easily increment the version of the output. This can be handy for comparing different revisions.

##### Restore project used to render the given version
The panel automatically archives a copy of your comp when you start a render: this way, you can always refer back to the project used to render a given version.


# Usage
For it all to work as intended, there are a few house-keeping tips and rules.

##### Name your output comp sensibly
The output comp's name is automatically picked-up and used as the name of the render files.
Make sure it has some sensible name and contains no special characters (or at least bear in mind, these will be removed from the output name).

##### Make sure your output comp starts and ends at the right frames
This might sound strange, but the tool will always render the entirety of the comp. Hence, if your comp starts at frame 1, and finishes at frame 350, it will render all the frames between and including 1 and 350.
This is enforced as a matter of principle to keep myself organised - it's better to be tidy and to make sure the output comp is set-up correctly.

##### ...But, but...I *need* to render a certain range

If you delete frames from an existing sequence of images, those frames will automatically be re-rendered (the panel automatically skips existing files). This allows you to re-render ranges, and specific frames too. RenderQueue+ comes with a little frame manager to help you delete image ranges, and/or specific frames straight from After Effects.


## Limitations

The versioning pattern is hard-corded at the moment and there's no way to customize it. The panel runs on Windows only. Sorry, no mac version folks. :(
Send me an email if you'd like this implemented for macs too.
