var RenderQueuePlus = (function ( thisObj ) {

    //Extensions
    var sep = (function (){if (File.fs === 'Windows') { return '\\'};if (File.fs === 'Macintosh') { return '/' }}());
    
    var SettingsWindow = (function ( thisObj ) {
    //Settings Object
    {
     
        var settings = {};
        
        settings.lastmodified = '02/02/2016';
        settings.version = '0.1.8';
        settings.name = settings.scriptname;
        settings.author = 'Gergely Wootsch';
        settings.email = 'hello@gergely-wootsch.com';
        settings.website = 'http://gergely-wootsch.com';
        settings.description = '';
        settings.help = '';
        
        settings.scriptname = 'Render Queue+';
        
        settings.platform = File.fs;
        settings.version = parseFloat( app.version );
        settings.tempFolder = new Folder ( Folder.temp.fullName + '/' + settings.scriptname );
        settings.tempPath = settings.tempFolder.fsName;
        
        settings.player = 'rv';
        
        settings.rv = {};
        settings.rv.rv_usepush = null;
        settings.rv.rv_help = (new String("-c\r\n                Use region frame cache\r\n-l\r\n                Use look-ahead cache\r\n-nc\r\n                Use no caching\r\n-s float\r\n                Image scale reduction\r\n-stereo string\r\n                Stereo mode (hardware, checker, scanline, anaglyph, left, right, pair, mirror, hsqueezed, vsqueezed)\r\n-vsync int\r\n                Video Sync (1 = on, 0 = off, default = 0)\r\n-comp string\r\n                Composite mode (over, add, difference, replace, default=replace)\r\n-layout string\r\n                Layout mode (packed, row, column, manual)\r\n-over\r\n                Same as -comp over -view defaultStack\r\n-diff\r\n                Same as -comp difference -view defaultStack\r\n-tile\r\n                Same as -comp tile -view defaultStack\r\n-wipe\r\n                Same as -over with wipes enabled\r\n-view string\r\n                Start with a particular view\r\n-noSequence\r\n                Don't contract files into sequences\r\n-inferSequence\r\n                Infer sequences from one file\r\n-autoRetime int\r\n                Automatically retime conflicting media fps in sequences and stacks (1 = on, 0 = off, default = 1)\r\n-rthreads int\r\n                Number of reader threads (default = 1)\r\n-renderer string\r\n                Default renderer type (Composite or Direct)\r\n-fullscreen\r\n                Start in fullscreen mode\r\n-present\r\n                Start in presentation mode (using presentation device)\r\n-presentAudio int\r\n                Use presentation audio device in presentation mode (1 = on, 0 = off)\r\n-presentDevice string\r\n                Presentation mode device\r\n-presentVideoFormat string\r\n                Presentation mode override video format (device specific)\r\n-presentDataFormat string\r\n                Presentation mode override data format (device specific)\r\n-screen int\r\n                Start on screen (0, 1, 2, ...)\r\n-noBorders\r\n                No window manager decorations\r\n-geometry int int [ int int ]\r\n                Start geometry x, y, w, h\r\n-init string\r\n                Override init script\r\n-nofloat\r\n                Turn off floating point by default\r\n-maxbits int\r\n                Maximum default bit depth (default=32)\r\n-gamma float\r\n                Set display gamma (default=1)\r\n-sRGB\r\n                Display using linear -> sRGB conversion\r\n-rec709\r\n                Display using linear -> Rec 709 conversion\r\n-floatLUT int\r\n                Use floating point LUTs (requires hardware support, 1=yes, 0=no, default=platform-dependant)\r\n-dlut string\r\n                Apply display LUT\r\n-brightness float\r\n                Set display relative brightness in stops (default=0)\r\n-resampleMethod string\r\n                Resampling method (area, linear, cube, nearest, default=area)\r\n-eval string\r\n                Evaluate expression at every session start\r\n-nomb\r\n                Hide menu bar on start up\r\n-play\r\n                Play on startup\r\n-fps float\r\n                Overall FPS\r\n-cli\r\n                Mu command line interface\r\n-vram float\r\n                VRAM usage limit in Mb, default = 64.000000\r\n-cram float\r\n                Max region cache RAM usage in Gb\r\n-lram float\r\n                Max look-ahead cache RAM usage in Gb\r\n-noPBO\r\n                Prevent use of GL PBOs for pixel transfer\r\n-prefetch\r\n                Prefetch images for rendering\r\n-bwait float\r\n                Max buffer wait time in cached seconds, default 5.0\r\n-lookback float\r\n                Percentage of the lookahead cache reserved for frames behind the playhead, default 25\r\n-yuv\r\n                Assume YUV hardware conversion\r\n-volume float\r\n                Overall audio volume\r\n-noaudio\r\n                Turn off audio\r\n-audiofs int\r\n                Use fixed audio frame size (results are hardware dependant ... try 512)\r\n-audioCachePacket int\r\n                Audio cache packet size in samples (default=512)\r\n-audioMinCache float\r\n                Audio cache min size in seconds (default=0.300000)\r\n-audioMaxCache float\r\n                Audio cache max size in seconds (default=0.600000)\r\n-audioModule string\r\n                Use specific audio module\r\n-audioDevice int\r\n                Use specific audio device (default=-1)\r\n-audioRate float\r\n                Use specific output audio rate (default=ask hardware)\r\n-audioPrecision int\r\n                Use specific output audio precision (default=16)\r\n-audioNice int\r\n                Close audio device when not playing (may cause problems on some hardware) default=0\r\n-audioNoLock int\r\n                Do not use hardware audio/video syncronization (use software instead default=0)\r\n-audioGlobalOffset int\r\n                Global audio offset in seconds\r\n-bg string\r\n                Background pattern (default=black, grey18, grey50, checker, crosshatch)\r\n-formats\r\n                Show all supported image and movie formats\r\n-cmsTypes\r\n                Show all available Color Management Systems\r\n-debug string\r\n                Debug category\r\n-cinalt\r\n                Use alternate Cineon/DPX readers\r\n-exrcpus int\r\n                EXR thread count (default=2)\r\n-exrRGBA\r\n                EXR use basic RGBA interface (default=false)\r\n-exrInherit\r\n                EXR guesses channel inheritance (default=false)\r\n-exrIOMethod int [int]\r\n                EXR I/O Method (0=standard, 1=buffered, 2=unbuffered, 3=MemoryMap, 4=AsyncBuffered, 5=AsyncUnbuffered, default=0) and optional chunk size (default=61440)\r\n-jpegRGBA\r\n                Make JPEG four channel RGBA on read (default=no, use RGB or YUV)\r\n-jpegIOMethod int [int]\r\n                JPEG I/O Method (0=standard, 1=buffered, 2=unbuffered, 3=MemoryMap, 4=AsyncBuffered, 5=AsyncUnbuffered, default=0) and optional chunk size (default=61440)\r\n-cinpixel string\r\n                Cineon/DPX pixel storage (default=RGB8_PLANAR)\r\n-cinchroma\r\n                Cineon pixel storage (default=RGB8_PLANAR)\r\n-cinIOMethod int [int]\r\n                Cineon I/O Method (0=standard, 1=buffered, 2=unbuffered, 3=MemoryMap, 4=AsyncBuffered, 5=AsyncUnbuffered, default=3) and optional chunk size (default=61440)\r\n-dpxpixel string\r\n                DPX pixel storage (default=RGB8_PLANAR)\r\n-dpxchroma\r\n                Use DPX chromaticity values (for default reader only)\r\n-dpxIOMethod int [int]\r\n                DPX I/O Method (0=standard, 1=buffered, 2=unbuffered, 3=MemoryMap, 4=AsyncBuffered, 5=AsyncUnbuffered, default=3) and optional chunk size (default=61440)\r\n-tgaIOMethod int [int]\r\n                TARGA I/O Method (0=standard, 1=buffered, 2=unbuffered, 3=MemoryMap, 4=AsyncBuffered, 5=AsyncUnbuffered, default=2) and optional chunk size (default=61440)\r\n-tiffIOMethod int [int]\r\n                TIFF I/O Method (0=standard, 1=buffered, 2=unbuffered, 3=MemoryMap, 4=AsyncBuffered, 5=AsyncUnbuffered, default=2) and optional chunk size (default=61440)\r\n-lic string\r\n                Use specific license file\r\n-noPrefs\r\n                Ignore preferences\r\n-resetPrefs\r\n                Reset preferences to default values\r\n-qtcss string\r\n                Use QT style sheet for UI\r\n-qtstyle string\r\n                Use QT style, default=\"\"\r\n-qtdesktop\r\n                QT desktop aware, default=1 (on)\r\n-xl\r\n                Aggressively absorb screen space for large media\r\n-mouse int\r\n                Force tablet/stylus events to be treated as a mouse events, default=0 (off)\r\n-network\r\n                Start networking\r\n-networkPort int\r\n                Port for networking\r\n-networkHost string\r\n                Alternate host/address for incoming connections\r\n-networkConnect string [int]\r\n                Start networking and connect to host at port\r\n-networkPerm int\r\n                Default network connection permission (0=Ask, 1=Allow, 2=Deny, default=0)\r\n-reuse int\r\n                Try to re-use the current session for incoming URLs (1 = reuse session, 0 = new session, default = 1; OS X only)\r\n-nopackages\r\n                Don't load any packages at startup (for debugging)\r\n-encodeURL\r\n                Encode the command line as an rvlink URL, print, and exit\r\n-bakeURL\r\n                Fully bake the command line as an rvlink URL, print, and exit\r\n-flags string\r\n                Arbitrary flags (flag, or 'name=value') for use in Mu code\r\n-strictlicense\r\n                Exit rather than consume an rv license if no rvsolo licenses are available\r\n-prefsPath string\r\n                Alternate path to preferences directory\r\n-registerHandler\r\n                Register this executable as the default rvlink protocol handler (OS X only)\r\n-scheduler string\r\n                Thread scheduling policy (may require root, linux only)\r\n-priorities int int\r\n                Set display and audio thread priorities (may require root, linux only)\r\n-version\r\n                Show RV version number\r\n                \r\n                \r\n-pa float\r\n                Set the Pixel Aspec Ratio\r\n-ro int\r\n                Shifts first and last frames in the source range (range offset)\r\n-rs int\r\n                Sets first frame number to argument and offsets the last frame number\r\n-fps float\r\n                FPS override\r\n-ao float\r\n                Audio Offset. Shifts audio in seconds (audio offset)\r\n-so float\r\n                Set the Stereo Eye Relative Offset\r\n-volume float\r\n                Audio volume override (default = 1)\r\n-flut filename\r\n                Associate a file LUT with the source\r\n-llut filename\r\n                Associate a look LUT with the source\r\n-pclut filename\r\n                Associate a pre-cache software LUT with the source\r\n-cmap channels\r\n                Remap color channesl for this source (channel names separated by commas)\r\n-select selectType selectName\r\n                Restrict loaded channels to a single view/layer/channel. selectType must be one of view, layer, or channel. selectName is a comma-separated list of view name, layer name, channel name.\r\n-crop x0 y0 x1 y1\r\n                Crop image to box (all integer arguments)\r\n-uncrop width height x y\r\n                Inset image into larger virtual image (all integer arguments)\r\n-in int\r\n                Cut-in frame for this source in default EDL\r\n-out int\r\n                Cut-out frame for this source in default EDL\r\n-noMovieAudio\r\n                Disable source movie's baked-in audio (aka \u00E2\u0080\u009C-nma\u00E2\u0080\u009D)"))
        settings.rv.rv_bin = null;
        settings.rv.rvpush_bin = null;
        settings.rv.rv_call = null;
        settings.rv.rvpush_call = null;
        
        settings.djv = {};
        settings.djv.djv_help = (new String("http://djv.sourceforge.net/djv_view.html\r\n\r\n\r\nUsage:\r\n\r\ndjv_view [image]... [option]...\r\nimage\tOne or more images, image sequences, or movies\r\noption\tAdditional options (see below)\r\n\r\nOptions:\r\n\r\n-combine\tCombine multiple command line arguments into a single sequence.\r\n-seq, -q (value)\tSet command line file sequencing. Options = Off, Sparse, Range. Default = Range.\r\n-auto_seq (value)\tAutomatically detect sequences when opening files. Options = False, True. Default = True.\r\n\r\nFile options:\r\n\r\n-file_layer (value)\tSet the input layer. Default = 0.\r\n-file_proxy (value)\tSet the proxy scale. Options = None, 1/2, 1/4, 1/8.\r\n-file_cache (value)\tSet whether the file cache is enabled. Options = False, True.\r\nWindow options:\r\n\r\n-window_full_screen\tSet the window full screen.\r\n\r\nPlayback options:\r\n\r\n-playback (value)\tSet the playback. Options = Reverse, Stop, Forward.\r\n-playback_frame (value)\tSet the playback frame.\r\n-playback_speed (value)\tSet the playback speed. Options = 1, 3, 6, 12, 15, 16, 18, 23.976, 24, 25, 29.97, 30, 50, 59.94, 60, 120.\r\n\r\n\r\n\r\n-----------------------\r\nUser Interface:\r\n\r\n-reset_prefs\tDo not load the preference at start up.\r\nOpenGL\r\n\r\n-render_filter (zoom out) (zoom in)\tSet the render filter. Options = Nearest, Linear, Box, Triangle, Bell, B-Spline, Lanczos3, Cubic, Mitchell. Default = Linear, Nearest.\r\n-render_filter_high\tSet the render filter to high quality settings (Lanczos3, Mitchell).\r\n\r\nGeneral\r\n\r\n-time_units (value)\tSet the time units. Options = Timecode, Frames. Default = Frames.\r\n-default_speed (value)\tSet the global speed. Options = 1, 3, 6, 12, 15, 16, 18, 23.976, 24, 25, 29.97, 30, 50, 59.94, 60, 120. Default = 24.\r\n-max_sequence_frames (value)\tSet the maximum number of frames a sequence can hold. Default = 172800.\r\n-debug_log\tPrint debug log messages.\r\n-help, -h\tShow the help message.\r\n-info\tShow the information message.\r\n-about\tShow the about message.\r\n\r\n\r\n------------------------\r\nFormat Specific Options:\r\n\r\nCineon\r\n\r\nThis plugin provides support for the Kodak Cineon image file format. Cineon is a specialized image file format for working with motion picture film.\r\n\r\nFile extensions: .cin\r\n\r\nSupported features:\r\n\r\n10-bit RGB (the most common variety)\r\nInterleaved channels only\r\nReferences:\r\n\r\nKodak, \"4.5 DRAFT - Image File Format Proposal for Digital Pictures\"\r\nCommand line options:\r\n\r\n-cineon_input_color_profile (value)\tSet the color profile used when loading Cineon images. Options = Auto, None, Film Print. Default = Auto.\r\n-cineon_input_film_print (black) (white) (gamma) (soft clip)\tSet the film print values used when loading Cineon images. Default = 95, 685, 1.7, 0.\r\n-cineon_output_color_profile (value)\tSet the color profile used when saving Cineon images. Options = False, True. Default = False.\r\n-cineon_output_film_print (black) (white) (gamma) (soft clip)\tSet the film print values used when saving Cineon images. Default = Auto, None, Film Print.\r\n-cineon_convert (value)\tSet whether the pixel data is converted to 8-bits when loading Cineon images. Options = Film Print. Default = 95, 685, 1.7.\r\n\r\n\r\nDPX\r\n\r\nThis plugin provides support for the SMPTE Digital Picture Exchange (DPX) image file format. DPX is a specialized image file format for working with motion picture film. DPX is the successor to the Cineon file format with support for additional image and meta data.\r\n\r\nFile extensions: .dpx\r\n\r\nSupported features:\r\n\r\n10-bit RGB type \"A\" packing (the most common variety); 8-bit, 16-bit, Luminance, RGB, RGBA\r\nInterleaved channels only\r\nReferences:\r\n\r\nSMPTE, \"SMPTE 268M-2003\"\r\nCinesite, \"Conversion of 10-bit Log Film Data To 8-bit Linear or Video Data\"\r\nCommand line options:\r\n\r\n-dpx_input_color_profile (value)\tSet the color profile used when loading DPX images. Options = Auto, None, Film Print. Default = Auto.\r\n-dpx_input_film_print (black) (white) (gamma) (soft clip)\tSet the film print values used when loading DPX images. Default = 95, 685, 1.7, 0.\r\n-dpx_output_color_profile (value)\tSet the color profile used when saving DPX images. Options = False, True. Default = Auto, None, Film Print.\r\n-dpx_output_film_print (black) (white) (gamma) (soft clip)\tSet the film print values used when saving DPX images. Default = Film Print.\r\n-dpx_convert (value)\tSet whether the pixel data is converted to 8-bits when loading DPX images. Options = 95, 685, 1.7. Default = False.\r\n-dpx_version (value)\tSet the file format version used when saving DPX images. Options = 1.0, 2.0. Default = 2.0.\r\n-dpx_type (value)\tSet the pixel type used when saving DPX images. Options = Auto, U10. Default = U10.\r\n-dpx_endian (value)\tSet the endian used when saving DPX images. Setting the endian to \"Auto\" will use the endian of the current hardware. Options = Auto, MSB, LSB. Default = MSB.\r\n\r\n\r\nIFF\r\n\r\nThis plugin provides support for the Generic Interchange File Format (IFF).\r\n\r\nFile extensions: .iff, .z\r\n\r\nSupported features:\r\n\r\n8-bit, 16-bit, Luminance, Luminance Alpha, RGB, RGBA\r\nFile compression\r\nReferences:\r\n\r\nAffine Toolkit - (Thomas E. Burge), riff.h and riff.c\r\nAutodesk Maya documentation, \"Overview of Maya IFF\"\r\nImplementation:\r\n\r\nMikael Sundell, mikael.sundell@gmail.com\r\nCommand line options:\r\n\r\n-iff_compression (value)\tSet the file compression used when saving IFF images. Options = None, RLE. Default = RLE.\r\nIFL\r\n\r\nThis plugin provides support for the Autodesk Image File List (IFL) format. IFL is a file format for creating sequences or playlists of other image files. An IFL file simply consists of a list of image file names, one per line.\r\n\r\nFile extensions: .ifl\r\n\r\nSupported features:\r\n\r\nRead only\r\n\r\n\r\n\r\nJPEG\r\n\r\nThis plugin provides support for the Joint Photographic Experts Group (JPEG) image file format.\r\n\r\nFile extensions: .jpeg, .jpg, .jfif\r\n\r\nSupported features:\r\n\r\n8-bit, Luminance, RGBA\r\nFile compression\r\nCommand line options:\r\n\r\n-jpeg_quality (value)\tSet the quality used when saving JPEG images. Default = 90.\r\n\r\n\r\n\r\nLUT\r\n\r\nThis plugin provides support for two-dimensional lookup table file formats.\r\n\r\nFile extensions: .lut, .1dl\r\n\r\nSupported features:\r\n\r\nInferno and Kodak formats\r\n8-bit, 16-bit, Luminance, Luminance Alpha, RGB, RGBA; 10-bit RGB\r\nCommand line options:\r\n\r\n-lut_type (value)\tSet the pixel type used when loading LUTs. Options = Auto, U8, U10, U16. Default = Auto.\r\n\r\n\r\n\r\nOpenEXR\r\n\r\nThis plugin provides support for the Industrial Light and Magic OpenEXR image file format.\r\n\r\nFile extensions: .exr\r\n\r\nSupported features:\r\n\r\n16-bit float, 32-bit float, Luminance, Luminance Alpha, RGB, RGBA\r\nImage layers\r\nDisplay and data windows\r\nFile compression\r\nCommand line options:\r\n\r\n-exr_threads_enable (value)\tSet whether threading is enabled. Default = True.\r\n-exr_thread_count (value)\tSet the maximum number of threads to use. Default = 4.\r\n-exr_input_color_profile (value)\tSet the color profile used when loading OpenEXR images. Options = None, Gamma, Exposure. Default = Gamma.\r\n-exr_input_gamma (value)\tSet the gamma values used when loading OpenEXR images. Default = 2.2.\r\n-exr_input_exposure (value) (defog) (knee low) (knee high)\tSet the exposure values used when loading OpenEXR images. Default = 0, 0, 0, 5.\r\n-exr_channels (value)\tSet how channels are grouped when loading OpenEXR images. Options = None, Known, All. Default = Known.\r\n-exr_compression (value)\tSet the file compression used when saving OpenEXR images. Options = None, RLE, ZIPS, ZIP, PIZ, PXR24, B44, B44A, DWAA, DWAB. Default = None.\r\n-exr_dwa_compression_level (value)\tSet the DWA compression level used when saving OpenEXR images. Default = 45.\r\n\r\n\r\n\r\nPIC\r\n\r\nThis plugin provides support for the Softimage image file format.\r\n\r\nFile extensions: .pic\r\n\r\nSupported features:\r\n\r\n8-bit, RGB, RGBA, RGB plus Alpha\r\nFile compression\r\nRead only\r\nReferences:\r\n\r\nSoftimage, \"INFO: PIC file format\"\r\n\r\n\r\n\r\nPNG\r\n\r\nThis plugin provides support for the Portable Network Graphics (PNG) image file format.\r\n\r\nFile extensions: .png\r\n\r\nSupported features:\r\n\r\n8-bit, 16-bit, Luminance, RGB, RGBA\r\nFile compression\r\n\r\n\r\n\r\nPPM\r\n\r\nThis plugin provides support for the NetPBM image file format.\r\n\r\nFile extensions: .ppm, pnm, .pgm, .pbm\r\n\r\nSupported features:\r\n\r\n1-bit, 8-bit, 16-bit, Luminance, RGB\r\nBinary and ASCII data\r\nCommand line options:\r\n\r\n-ppm_type (value)\tSet the file type used when saving PPM images. Options = Auto, U1. Default = Auto.\r\n-ppm_data (value)\tSet the data type used when saving PPM images. Options = ASCII, Binary. Default = Binary.\r\nFFmpeg\r\n\r\nThis plugin provides support for the FFmmpeg library.\r\n\r\nFile extensions: .avi, .dv, .gif, .flv, .mkv, .mov, .mpg, .mpeg, .mp4, .m4v, .mxf\r\n\r\nSupported features:\r\n\r\nFile compression\r\nCommand line options:\r\n\r\n-ffmpeg_format (value)\tSet the format used when saving FFmpeg movies. Options = MPEG4, ProRes, MJPEG. Default = MPEG4.\r\n-ffmpeg_quality (value)\tSet the quality used when saving FFmpeg movies. Options = Low, Medium, High. Default = High.\r\n\r\n\r\n\r\nRLA\r\n\r\nThis plugin provides support for the Wavefront RLA image file format.\r\n\r\nFile extensions: .rla, .rpf\r\n\r\nSupported features:\r\n\r\n8-bit, 16-bit, 32-bit float, Luminance, Luminance Alpha, RGB, RGBA\r\nFile compression\r\nRead only\r\n\r\n\r\n\r\n\r\nSGI\r\n\r\nThis plugin provides support for the Silicon Graphics image file format.\r\n\r\nFile extensions: .sgi, .rgba, .rgb, .bw\r\n\r\nSupported features:\r\n\r\n8-bit, 16-bit, Luminance, Luminance Alpha, RGB, RGBA\r\nFile compression\r\nReferences:\r\n\r\nPaul Haeberli, \"The SGI Image File Format, Version 1.00\"\r\nCommand line options:\r\n\r\n-sgi_compression (value)\tSet the file compression used when saving SGI images. Options = None, RLE. Default = None.\r\n\r\n\r\n\r\n\r\nTarga\r\n\r\nThis plugin provides support for the Targa image file format.\r\n\r\nFile extensions: .tga\r\n\r\nSupported features:\r\n\r\n8-bit Luminance, Luminance Alpha, RGB, RGBA\r\nFile compression\r\nReferences:\r\n\r\nJames D. Murray, William vanRyper, \"Encyclopedia of Graphics File Formats, Second Edition\"\r\nCommand line options:\r\n\r\n-targa_compression (value)\tSet the file ompression used when saving Targa images. Options = None, RLE. Default = None.\r\n\r\n\r\n\r\n\r\nTIFF\r\n\r\nThis plugin provides support for the Tagged Image File Format (TIFF).\r\n\r\nFile extensions: .tiff, .tif\r\n\r\nSupported features:\r\n\r\n8-bit, 16-bit, 32-bit float, Luminance, Luminance Alpha, RGB, RGBA\r\nInterleaved channels only\r\nFile compression\r\nCommand line options:\r\n\r\n-tiff_compression (value)\tSet the file compression used when saving TIFF images. Options = None, RLE, LZW. Default = None.\r\n"))
        settings.djv.djv_bin = null;
        settings.djv.djv_call = null;
        
        settings.aerender = {};
        settings.aerender.aerender_bin = null;
        settings.aerender.aerender_serverroot = null;
        settings.aerender.instances = null;
        settings.aerender.dialog = null;
        
        settings.pathcontrol = {};
        settings.pathcontrol.pathcontrol_help
        settings.pathcontrol.basepattern = '';
        settings.pathcontrol.fsName = '';
    }
    // Window Definition
    {
        var palette = thisObj instanceof Panel ? thisObj : new Window( 'palette', settings.scriptname + ': Settings', undefined, {
                resizeable:false
            });
        if (palette == null) return;
        palette.margins = 30
        palette.spacing = 30;
    }
    // Events
    {
        function pickRVButton_onClick() {
            var file = new File('/');
            file = file.openDlg('Where is  \'rv.exe\' located?','Windows exe files:*.exe');
            
            settings.rv.rv_bin = file.fsName;
            internal.set( 'rv_bin', settings.rv.rv_bin );
            
            internal.setstring( 'rvPickString', 'File Set: \'' + internal.get( 'rv_bin' ) + '\'' );
            
        };
        function pickRVPushButton_onClick() {
            var file = new File('/');
            file = file.openDlg('Where is \'rvpush.exe\' located?','Windows exe files:*.exe');
            
            settings.rv.rvpush_bin = file.fsName;
            internal.set( 'rvpush_bin', settings.rv.rvpush_bin );
            
            internal.setstring( 'rvpushPickString', 'File Set: \'' + internal.get( 'rvpush_bin' ) + '\'' );
        };
        function pickDJVPushButton_onClick(){
            var file = new File('/');
            file = file.openDlg('Where is \'djv_view.exe\' located?','Windows exe files:*.exe');
            
            settings.djv.djv_bin = file.fsName;
            internal.set( 'djv_bin', settings.djv.djv_bin );
            
            internal.setstring( 'djvPickString', 'File Set: \'' + internal.get( 'djv_bin' ) + '\'' );
        };
        function rvCheckbox_onClick(){
            
            //UI
            palette.findElement('djvPanel').enabled = !this.value;
            palette.findElement('rvPanel').enabled = this.value;
            palette.findElement('djvCheckbox').value = !this.value;
            
            //Internal
            if (this.value){
                settings.player = 'rv'
            } else {
                settings.player = 'djv'
            }
            
            //Set
            app.settings.saveSetting( settings.scriptname, 'player', settings.player )
            
        }
        function rvPushCheckbox_onClick(){
            settings.rv.rv_usepush = this.value;
            internal.set( 'rv_usepush', settings.rv.rv_usepush );
        }
        function djvCheckbox_onClick(){
            
            //UI
            palette.findElement('rvPanel').enabled = !this.value;
            palette.findElement('djvPanel').enabled = this.value;
            palette.findElement('rvCheckbox').value = !this.value;
            
            //Internal
            if (this.value){
                settings.player = 'djv'
            } else {
                settings.player = 'rv'
            }
            
            //Set
            app.settings.saveSetting( settings.scriptname, 'player', settings.player )
        }
        function rvHelpButton_onClick(){
            function alert_scroll (title, input){
               var w = new Window ("dialog", title);
               var list = w.add ("edittext", undefined, input, {multiline: true, scrolling: true});
               list.maximumSize.height = w.maximumSize.height-100;
               list.minimumSize.width = 550;
               w.add ("button", undefined, "Close", {name: "ok"});
               list.size = [500,500];
               w.show ();
            }
            alert_scroll('Help: RV Command Line Switches', settings.rv.rv_help);
        }
        function djvHelpButton_onClick(){
            function alert_scroll (title, input){
               var w = new Window ("dialog", title);
               var list = w.add ("edittext", undefined, input, {multiline: true, scrolling: true});
               list.maximumSize.height = w.maximumSize.height-100;
               list.minimumSize.width = 550;
               w.add ("button", undefined, "Close", {name: "ok"});
               list.size = [500,500];
               w.show ();
            }
            alert_scroll('Help: DJV View Command Line Switches', settings.djv.djv_help);
        }
        function pathcontrolPickButton_onClick(){
            var folder = new Folder( settings.pathcontrol.fsName );
            folder = folder.selectDlg('Select new render folder location');
            
            if (folder) {
                basepath = folder.fsName;
                settings.pathcontrol.fsName = folder.fsName;
                settings.pathcontrol.basepattern = settings.pathcontrol.fsName;
                
                internal.set( 'pathcontrol_fsName', settings.pathcontrol.fsName );
                internal.set( 'pathcontrol_basepattern', settings.pathcontrol.fsName );
                internal.setstring( 'pathcontrol_fsName', settings.pathcontrol.fsName );
                internal.setstring( 'pathcontrol_basepattern', settings.pathcontrol.fsName );   
            }  
        }
        function pathcontrolExploreButton_onClick(){
            var folder = new Folder( settings.pathcontrol.fsName );
            if ( folder.exists ) {
                folder.execute();
            } else {
                if ( folder.parent.exists ) {
                    folder.parent.execute();
                } else {
                    if ( folder.parent.parent.exists ) {
                        folder.parent.parent.execute();
                    }
                }
            }
        }
        function rvCallString_onChanged(){
            settings.rv.rv_call = this.text;
            app.settings.saveSetting( settings.scriptname, 'rv_call', settings.rv.rv_call )
        }
        function djvCallString_onChanged(){
            settings.djv.djv_call = this.text;
            app.settings.saveSetting( settings.scriptname, 'djv_call', settings.djv.djv_call )
        }
        function pathcontrol_basepattern_onChanged(){            
            settings.pathcontrol.basepattern = this.text;
            internal.set( 'pathcontrol_basepattern', this.text);
            internal.setbasepath();
            
            var folder = new Folder( settings.pathcontrol.fsName );
            
            if ( !folder.exists ) {
                if ( folder.displayName.match(/tmp0000/) ) {
                    settings.pathcontrol.fsName = Folder.desktop.fsName;
                    internal.set( 'pathcontrol_fsName', settings.pathcontrol.fsName);
                } else {
                    var prompt = confirm('\'' + folder.fsName + '\'' + ' doesn\'t exists.\n\nDo you want to create it now?','New Render Location Set');
                    if (prompt) {
                        folder.create();
                    }   
                }
            }
        }
    }
    // UI
    {
        //Header
        {
            
        }
        
        var binGroup = palette.add('group',undefined,{
                name: 'binGroup'
            });
            binGroup.orientation = 'column';
        
        //Pathcontrol
        {
            var pathcontrolPanel = binGroup.add('panel',undefined,'Set Default Render Location', {
                borderstyle: 'gray',
                name: 'pathcontrolPanel'
            });
            pathcontrolPanel.alignChildren = ['fill','fill'];
            
            {
                var pathcontrol_basepatternGroup = pathcontrolPanel.add('group',undefined,{
                    name: 'pathcontrol_basepatternGroup'
                });
                
                var pathcontrol_basepatternHeader = pathcontrol_basepatternGroup.add('statictext',undefined,'Type/pick folder path:',{
                    name: 'pathcontrol_basepatternHeader'
                });
                    pathcontrol_basepatternHeader.size = [150,25];
                    var pathcontrol_basepattern = pathcontrol_basepatternGroup.add('edittext',undefined,'',{
                        name: 'pathcontrol_basepattern'
                    })
                    pathcontrol_basepattern.size = [290,25];
                    pathcontrol_basepattern.onChange = pathcontrol_basepattern.onChanged = pathcontrol_basepattern_onChanged;
                    
                    var pathcontrolBrowseButton = pathcontrol_basepatternGroup.add('button', undefined,'Reveal',{
                        name: 'pathcontrolExploreButton'
                    });
                    pathcontrolBrowseButton.size = [70,25];
                    pathcontrolBrowseButton.onClick = pathcontrolExploreButton_onClick;
                
                    var pathcontrolHelpButton = pathcontrol_basepatternGroup.add('button',undefined,'Pick New',{
                        name: 'pathcontrolPickButton'
                    });
                    pathcontrolHelpButton.size = [70,25];
                    pathcontrolHelpButton.onClick = pathcontrolPickButton_onClick;
            }
            
            {
                var pathcontrolResultGroup = pathcontrolPanel.add('group',undefined,{
                    name: 'pathcontrol_basepatternGroup'
                });
                
                var pathcontrol_fsNameLabel = pathcontrolResultGroup.add('statictext',undefined,'Use ./ or ../ to set a path relative to the active project.',{
                    name: 'pathcontrol_fsNameLabel',
                    multiline: true
                });
                    pathcontrol_fsNameLabel.size = [150,25];
                
                var pathcontrol_fsName = pathcontrolResultGroup.add('statictext',undefined,'No pattern has been set.',{
                    name: 'pathcontrol_fsName'
                });
                    pathcontrol_fsName.size = [450,25];
            }
        }
        
        //RV
        {
            var rvPanel = binGroup.add('panel',undefined,'RV', {
                borderStyle: 'gray',
                name: 'rvPanel'
            });
            rvPanel.alignChildren = ['fill','fill'];

            {
                var rvCheckboxGroup = rvPanel.add('group',undefined,{
                    name: 'rvCheckboxGroup'
                });
                var rvCheckbox = rvCheckboxGroup.add('checkbox',undefined,'Use RV for Playback',{
                    name: 'rvCheckbox'
                });
                rvCheckbox.onClick = rvCheckbox_onClick;
                
                var rvPushCheckbox = rvCheckboxGroup.add('checkbox',undefined,'Use RV Push',{
                    name: 'rvPushCheckbox'
                });
                rvPushCheckbox.onClick = rvPushCheckbox_onClick;
            }

            {
                var rvCallStringGroup = rvPanel.add('group',undefined,{
                    name: 'rvCallStringGroup'
                });
                rvCallStringGroup.orientation = 'row';

                var rvCallStringHeader = rvCallStringGroup.add('statictext',undefined,'RV Custom Switches:',{
                    name: 'rvCallStringHeader'
                });
                rvCallStringHeader.size = [150,25];
                
                var rvCallString = rvCallStringGroup.add('edittext',undefined,'',{
                   name: 'rvCallString'                                      
                });
                rvCallString.size = [290,25];
                rvCallString.onChange = rvCallString.onChanged = rvCallString_onChanged

                var rvHelpButton = rvCallStringGroup.add('button',undefined,'RV Help',{
                    name: 'rvHelpButton'
                });
                rvHelpButton.size = [150,25];
                rvHelpButton.onClick = rvHelpButton_onClick;
            }

            {
                var rvGroup = rvPanel.add('group',undefined,{
                    name: 'rvGroup'
                });
                rvGroup.orientation = 'row';

                var pickRVButton = rvGroup.add('button',undefined,'Set RV Path',{
                    name: 'pickRVButton'
                });
                pickRVButton.size = [150,25];
                pickRVButton.onClick = pickRVButton_onClick;
                
                var rvPickString = rvGroup.add('statictext',undefined,'path not set',{
                    name: 'rvPickString'
                });
                rvPickString.enabled = false;
                rvPickString.graphics.foregroundColor = rvPickString.graphics.newPen (palette.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7], 1);
                rvPickString.alignment = 'right';
                rvPickString.size = [450,25];
            }

            {
                var rvpushCallStringGroup = rvPanel.add('group',undefined,{
                    name: 'rvpushCallStringGroup'
                });
                rvpushCallStringGroup.orientation = 'row';

                var rvpushCallStringHeader = rvpushCallStringGroup.add('statictext',undefined,'RVPush Custom Switches:',{
                    name: 'rvpushCallStringHeader'
                });
                rvpushCallStringHeader.size = [150,25];

                var rvpushCallString = rvpushCallStringGroup.add('edittext',undefined,'',{
                   name: 'rvpushCallString'                                      
                });
                rvpushCallString.size = [260,25];
            }
            
            {
                var rvpushGroup = rvPanel.add('group',undefined,{
                    name: 'rvpushGroup'
                });
                rvpushGroup.orientation = 'row';
                var pickRVPushButton = rvpushGroup.add('button',undefined,'Set RVPush Path',{
                    name: 'pickRVPushButton'
                 });
                pickRVPushButton.size = [150,25];
                pickRVPushButton.onClick = pickRVPushButton_onClick;
                
                var rvpushPickString = rvpushGroup.add('statictext',undefined,'path not set',{
                    name: 'rvpushPickString'
                });
                rvpushPickString.enabled = false;
                rvpushPickString.graphics.foregroundColor = rvpushPickString.graphics.newPen (palette.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7], 1);
                rvpushPickString.alignment = 'right';
                rvpushPickString.size = [450,25];
            }
        }

        //DJV
        {
            var djvPanel = binGroup.add('panel',undefined,'DJV View', {
                borderStyle: 'gray',
                name: 'djvPanel'
            });
            djvPanel.alignChildren = ['fill','fill'];


            {
                var djvCheckboxGroup = djvPanel.add('group',undefined,{
                    name: 'djvCheckboxGroup'
                });
                var djvCheckbox = djvCheckboxGroup.add('checkbox',undefined,'Use DJV View for Playback',{
                    name: 'djvCheckbox'
                });
                djvCheckbox.onClick = djvCheckbox_onClick
            }

           {
                var djvCallStringGroup = djvPanel.add('group',undefined,{
                    name: 'djvCallStringGroup'
                });
                djvCallStringGroup.orientation = 'row';

                var djvCallStringHeader = djvCallStringGroup.add('statictext',undefined,'DJV Custom Switches:',{
                    name: 'djvCallStringHeader'
                });
                djvCallStringHeader.size = [150,25];
                
                var djvCallString = djvCallStringGroup.add('edittext',undefined,'',{
                   name: 'djvCallString'                                      
                });
                djvCallString.size = [290,25];
                djvCallString.onChange = djvCallString.onChanged = djvCallString_onChanged

                var djvHelpButton = djvCallStringGroup.add('button',undefined,'djv Help',{
                    name: 'djvHelpButton'
                });
                djvHelpButton.size = [150,25];
                djvHelpButton.onClick = djvHelpButton_onClick;
            }

            {
                var djvGroup = djvPanel.add('group',undefined,{
                    name: 'djvGroup'
                });
                djvGroup.orientation = 'row';
                var pickDJVButton = djvGroup.add('button',undefined,'Set DJV Path',{
                    name: 'pickDJVButton'
                 });
                pickDJVButton.size = [150,25];
                pickDJVButton.onClick = pickDJVPushButton_onClick;
                var djvPickString = djvGroup.add('statictext',undefined,'djv path not yet set',{
                    name: 'djvPickString'
                });
                djvPickString.graphics.foregroundColor = djvPickString.graphics.newPen (palette.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7], 1);
                djvPickString.alignment = 'right';
                djvPickString.size = [450,25];
            }
        }
        
        //Footer
        {
            var closeBtn = palette.add ("button", undefined, "Close", {name: "ok"});
            closeBtn.onClick = function () {
                palette.hide();
            }
        }
        
    }
    // Internals
    {
        var internal = {};
        internal.set = function ( keyName, value ) {
            var s = app.settings;
            s.saveSetting( settings.scriptname, keyName, value )
            return s.getSetting( settings.scriptname, keyName )
        }
        internal.get = function ( keyName ) {
            var s = app.settings;
            if ( s.haveSetting( settings.scriptname, keyName ) ) {
                return s.getSetting( settings.scriptname, keyName )   
            } else {
                return null
            }
        }
        internal.setstring = function( inName, inText ){
            palette.findElement( inName ).text = inText;
        }
        internal.setbasepath = function() {
            var saved = true,
                folder = new Folder ('/')
                errorString = 'Project is not saved. Unable to set path relative to project location.';
            
            try {app.project.file.exists} catch(e) { saved = false };
            
            if ( settings.pathcontrol.basepattern ) {
                if (saved) {
                    if ( settings.pathcontrol.basepattern.match(/^\.\.\/|^\.\.\\/gi) ) {
                        settings.pathcontrol.fsName = (app.project.file.parent.parent.fsName + sep + settings.pathcontrol.basepattern.slice(3)).replace(/\/\\/gi,sep).replace(/\/|\\/gi,sep);
                    } else {
                        if ( settings.pathcontrol.basepattern.match(/^\.\/|^\.\\/gi) ) {
                            settings.pathcontrol.fsName = app.project.file.parent.fsName + sep + settings.pathcontrol.basepattern.slice(2).replace(/\/|\\/gi,sep);
                        } else {
                            settings.pathcontrol.fsName = settings.pathcontrol.basepattern.replace(/\/|\\/gi,sep);
                        }
                    }
                } else {             
                    if ( settings.pathcontrol.basepattern.match(/^\./gi) ) {
                        settings.pathcontrol.fsName = '';
                    } else {
                        settings.pathcontrol.fsName = settings.pathcontrol.basepattern.replace(/\/|\\/gi,sep);
                    }
                }
                
            //SET RESULT
                folder.changePath( settings.pathcontrol.fsName );
                internal.set( 'pathcontrol_fsName', folder.fsName );
                
                if (settings.pathcontrol.fsName === '') {
                    folder.changePath('');
                    settings.pathcontrol.fsName = Folder.desktop.fsName;
                    internal.set( 'pathcontrol_fsName', settings.pathcontrol.fsName);
                    internal.setstring( 'pathcontrol_fsName',  errorString );
                } else {
                    internal.setstring( 'pathcontrol_fsName',  folder.fsName );
                }
            } else {
                folder.changePath('');
                settings.pathcontrol.fsName = Folder.desktop.fsName;
                internal.set( 'pathcontrol_fsName', settings.pathcontrol.fsName);
            }
            settings.pathcontrol.fsName = internal.get('pathcontrol_fsName');
        }//
        internal.maketempfolder = (function (){
            settings.tempFolder.create();
        }());
        internal.setaerenderpath = (function(){
            
        }());
    }
    // Set Settings from Saved Preferences    
    {
        settings.init = (function (){
            
            settings.player = internal.get( 'player' );
            
            settings.rv.rv_bin = internal.get( 'rv_bin' );
            settings.rv.rv_usepush = internal.get( 'rv_usepush' );
            settings.rv.rvpush_bin = internal.get( 'rvpush_bin' );
            settings.rv.rv_call = internal.get( 'rv_call' );
            if ( !settings.rv.rv_call ) {
                settings.rv.rv_call = '';
                internal.set( 'rv_call','' )
            }
            
            settings.rv.rvpush_call = internal.get( 'rvpush_call' );
            
            settings.djv.djv_bin = internal.get( 'djv_bin' );
            settings.djv.djv_call = internal.get( 'djv_call' );
            if ( !settings.djv.djv_call ) {
                settings.djv.djv_call = '';
                internal.set( 'djv_call','' )
            }
            
            settings.aerender.aerender_bin = (function (){
                var version = parseFloat( app.version ),
                    aerender = new File ( '/' ),
                    string;

                if (File.fs == 'Windows') {    
                    if ( version >= 14.5 && version < 15 ) { aerender.changePath( 'C:\\Program Files\\Adobe\\Adobe After Effects CC 2017\\Support Files\\aerender.exe' )};   
                    if ( version >= 14 && version < 14.5 ) { aerender.changePath( 'C:\\Program Files\\Adobe\\Adobe After Effects CC 2016\\Support Files\\aerender.exe' )};   
                    if ( version >= 13.5 && version < 14 ) { aerender.changePath( 'C:\\Program Files\\Adobe\\Adobe After Effects CC 2015\\Support Files\\aerender.exe' )};            
                    if ( version >= 13 && version < 13.5 ) { aerender.changePath( 'C:\\Program Files\\Adobe\\Adobe After Effects CC 2014\\Support Files\\aerender.exe' )};          
                    if ( version >= 12 && version < 13   ) { aerender.changePath( 'C:\\Program Files\\Adobe\\Adobe After Effects CC\\Support Files\\aerender.exe' )};           
                    if ( version >= 11 && version < 12   ) { aerender.changePath( 'C:\\Program Files\\Adobe\\Adobe After Effects CS6\\Support Files\\aerender.exe' )};
                }
                if (File.fs == 'Macintosh') {
                    if ( version >= 14.5 && version < 15 ) { aerender.changePath( '/Applications/Adobe After Effects 2017/aerender' ) };
                    if ( version >= 14 && version < 14.5 ) { aerender.changePath( '/Applications/Adobe After Effects 2016/aerender' ) };
                    if ( version >= 13.5 && version < 14 ) { aerender.changePath( '/Applications/Adobe After Effects 2015/aerender' ) };            
                    if ( version >= 13 && version < 13.5 ) { aerender.changePath( '/Applications/Adobe After Effects 2014/aerender' ) };           
                    if ( version >= 12 && version < 13   ) { aerender.changePath( '/Applications/Adobe After Effects CC/aerender' ) };            
                    if ( version >= 11 && version < 12   ) { aerender.changePath( '/Applications/Adobe After Effects CS6/aerender' ) };
                }

                if (aerender.exists) {
                    string = aerender.fsName;
                } else {
                    var prompt = confirm( 'aerender couldn\'t be located.\n\nDo you want to manually select it\'s location?','aerender');
                    if (prompt) {
                        aerender = aerender.OpenDlg('Select the Location of aerender(.exe)');
                        if (aerender) { string = aerender.fsName } else { string = null };
                    } else {
                        string = null;
                    }
                }
                //Set Application-wide setting
                internal.set( 'aerender_bin', string );
                return string
            }());
            settings.aerender.aerender_serverroot = internal.get( 'aerender_serverroot' );
            settings.aerender.aerender_instances = internal.get( 'aerender_instances' );
            settings.aerender.aerender_dialog = internal.get( 'aerender_dialog' );
            
            settings.pathcontrol.basepattern = internal.get( 'pathcontrol_basepattern' );
            if ( !settings.pathcontrol.basepattern ) {
                settings.pathcontrol.basepattern = '';
                internal.set( 'pathcontrol_basepattern','' )   
            }
            
            settings.pathcontrol.fsName = internal.get( 'pathcontrol_fsName' );
        }());
    }
    var cls = function () {
        this.show = function() {
            //Set UI According to Settings
            // settings.player
            {
                if ( settings.player == 'rv' ) {
                    palette.findElement('djvPanel').enabled = false;
                    palette.findElement('rvPanel').enabled = true;
                    palette.findElement('rvCheckbox').value = true;
                    palette.findElement('djvCheckbox').value = false;
                }
                if ( settings.player == 'djv' ) {
                    palette.findElement('djvPanel').enabled = true;
                    palette.findElement('rvPanel').enabled = false;
                    palette.findElement('rvCheckbox').value = false;
                    palette.findElement('djvCheckbox').value = true;
                }
            }
            // settings.rv.rv_usepush
            {
                if (!internal.get( 'rv_usepush' )) {
                    if ( internal.get( 'rv_usepush' ) === 'true' ) {
                        palette.findElement('rvPushCheckbox').value = true;
                    } else {
                        palette.findElement('rvPushCheckbox').value = false;
                    }
                }
            }
            // settings.rv.rv_bin
            {
                if ( !internal.get( 'rv_bin' ) ) {
                    internal.setstring( 'rvPickString', 'Path not set.' );
                } else {
                    internal.setstring( 'rvPickString', '\'' + internal.get( 'rv_bin' ) + '\'' );
                }
            }
            // settings.rv.rvpush_bin
            {
                if ( !internal.get( 'rvpush_bin' ) ) {
                    internal.setstring( 'rvpushPickString', 'Path not set.' );
                } else {
                    internal.setstring( 'rvpushPickString', '\'' + internal.get( 'rvpush_bin' ) + '\'' );
                }
            }
            // settings.rv.rv_call
            {
                if ( !internal.get( 'rv_call' ) ) {
                    internal.setstring( 'rvCallString', '' );
                } else {
                    internal.setstring( 'rvCallString', internal.get( 'rv_call' ) );
                }
            }
            // settings.djv.djv_bin
            {
                if ( !internal.get( 'djv_bin' ) ) {
                    internal.setstring( 'djvPickString', 'Path not set.' );
                } else {
                    internal.setstring( 'djvPickString', '\'' + internal.get( 'djv_bin' ) + '\'' );
                }
            }
            // settings.djv.djv_call
            {
                if ( !internal.get( 'djv_call' ) ) {
                    internal.setstring( 'djvCallString', '' );
                } else {
                    internal.setstring( 'djvCallString', internal.get( 'djv_call' ) );
                }
            }
            // settings.pathcontrol.basepattern
            {
                
                if ( !(internal.get( 'pathcontrol_basepattern' ) === '') ) {
                    internal.setstring( 'pathcontrol_basepattern', internal.get( 'pathcontrol_basepattern' ) );
                } else {
                    internal.setstring( 'pathcontrol_basepattern', '' );
                }
            }
            // settings.pathcontrol.basepattern
            {
                if ( !(internal.get( 'pathcontrol_fsName' ) === '')  ) {
                    internal.setstring( 'pathcontrol_fsName', internal.get( 'pathcontrol_fsName' ) );
                } else {
                    internal.setstring( 'pathcontrol_fsName', 'No valid pattern has been set.' );
                }
            }
            
            palette.layout.layout(true);
            palette.layout.resize();
            if (!(palette instanceof Panel)) palette.show();
        };
        this.setSetting = function( inKeyValue, inValue ){
            app.settings.setSetting( sectionName)
        };
        this.getSetting = function( inKeyValue ){
            return internal.get( inKeyValue )
        };
        this.haveSettings = function( inKeyValue ){
            var value = app.settings.haveSettings( sectionName, inKeyValue );
            return value;
        };
        this.aerender_bin = (function (){

            
        }());
        this.setbasepath = function() {
            internal.setbasepath();
        }
        this.tempFolder = (function(){
            return settings.tempFolder
        }());
        this.platform = (function(){
            return settings.platform
        }());
        this.version = (function(){
            return settings.version
        }());
        this.scriptname = (function(){
            return settings.scriptname;
        }());
    }
    return cls
})(this); 
    var settings = new SettingsWindow;
    settings.setbasepath();
    
    //Resources
    {   
        //ListWindow_StartRender
        {
            var ListWindow_StartRender_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:B1C97D97A25911E580CD8B4215FCE7FD\" xmpMM:DocumentID=\"xmp.did:B1C97D98A25911E580CD8B4215FCE7FD\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:B1C97D95A25911E580CD8B4215FCE7FD\" stRef:documentID=\"xmp.did:B1C97D96A25911E580CD8B4215FCE7FD\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00C3\u0099 \x0B\x00\x00\x02=IDATx\u00DA\u00AC\u0094KH\u0094Q\x18\u0086\u00CFiLI\u00CA\u00A8,\u00BA(T\u00D4\x18\x15F\u00B4j\x13\u0086\u00AB\u00A0\u00ECF\x14T$\x06\u00C1l\"\u0088 \u0082Z\u00B6(\b\u008AZD\u008B.v\u0081\u00C8 \u0082\u00E8\u00B2\u0088\x16m\u00BAB\x17\u00D3T\x10\u00E9\"Bf\u00D9\u0090\u00A5\u00C3\u00EF\u00F39\u00AF\u00C3\u00E1\x1F\u009B6~\u00F0\u00CC\x7F8\u0097\u00F7\u00CC\u00F9n>\u008A\"7\u009EVd?=\u0083}\u00EEu\x7F\u0087K\u00F8\t\u00F1\u00F5IP\x05\u00F3\u00C0\u00C3\x17h\u0085t\u00B8)\x13e\\\u00F5\u00E4\u0085nN\u00F1\u00F4\u00AC\u00A0\u0089\u00A5Z\u00CE\u00B8\u00D2D\u00C9\u00E8\u009E\u0099p\x00\u00EAan\u00EC\u0092nh\u0084S\x1A\u00BBtf\u00C0\u009DN\u00A6\\]\u00F9\u00EA\u00AC`\u0091O\u008C\u0088I\u00B0\x06\u00AE@%\u00B4\u00E9`3\u0098o\u0096\u00C0\x068\x04\u00BBu\u00E1\u0083\u0088\u00A5\x04\x1A\u00B9'\x07\u00B6\u00C66\u00E8\u00F0>\u00B8\x04\u0083\u00B1=G`'\u009C\u0083{\u00B0\x0E\x1Ez-\u0086N\u009B\x01\u00D7\u00CD%P\x0B\x17$fW/\u0086$L\u0084!\u00B8\fk\u00E5\u00CB\u00AB0\u00DB\u008D!xP\u00CE\u00DF\x0FO5\u00B7\x05^\u00C2{\u00F1\nvh\u00ED9\u00A4\u00E4\u00EF\u00C3qA\u008B\u00E6^\u00E8\u0080\u008B\u009A\u00DB\x04M\u00B0B\u00FF\u00CC\u00DC\u00B3\x1Cn\x04\u00A2\u00D7t\u0091\u00F9\u00B2,\x144g\u00CF\u0082\u00DBzr1\x1C/\u0090n\u00B6V\u00AA\u00F1-\u0098\n\u00CBB\u00C1\n}?\u00E8;_\u0097\u00FC\u00CB\x16\u00C0\u00A2\u00D8\u0099\u00CA\u00B8\x0F\u009D\u00A2\u00EB\u0094\u00C4\u00FE?E\u00E1\u00C78\u0093\x13\u00FC\x1C<\u00DD\u00AC\x13>\x16\x10\u00EB\u0082v\u008D\u00AB\u00F4\u00FD\x14\nZ9}\u0083\u00CD\u009A\u00FB\x03G\x0B\b\x1E\x0B\u00CAo+\u00F4\u00C3\u00BBP0\u00AD\u00E8Z\u00AE\u00ED\u00D2\u00DCM\u008D[\u0082gY\u00E54(\x0F\u00CD\u00B6)\x0B\u00AC\x14\x7F\u00C4+\u00E5\u00A4\u00CA\u00E9\u00ACJ\u00ED\u0085\u00D2\u00A2I\u0089\u00ED%\u00F8[\u00FB\u00AB\u00E1<|\x0F3\"\fJ\u008F\x04-\x1D\x1E\u00EB\u00DF\u00D9\u00FA\x00\u00BC\u00857\u0081\u00D8vx\x02\u00D3`O\x10\u0083\u00BCZ~\x04\u00EB\u00F5\u00A4F5\u0081;AjX\x00\u00EA`%\u00F4\u00C2F\u00B8\u009B\u00D7\x0F\u0087\u00E8g\u00D6\u0082\u00A2\u00AC\u00AB\u00EE\u00EB\u00C0hG\u0089\x07\u00A7O\u008D\u00E1\u0084\u00A2\u00ED~q\u00D64Fr\u00C7:\u00F6\u00D7\u00BF\u00BD\u00EE\u00D9\u00CFV\u00DAX^\u0083\u00B5rZ\u00AA\u00C4\u00F7zZ\u00B3Dsfb\u00AB\u00A6$]EIyVp<mX\u0080\x01\x00z,\u009C&[\u0087\x1D\u009F\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_StartRender = new File ( settings.tempFolder.fullName + '/ListWindow_StartRender.png' );
            ListWindow_StartRender.encoding = 'BINARY';
            ListWindow_StartRender.open('w'); ListWindow_StartRender.write( ListWindow_StartRender_bin ); ListWindow_StartRender.close();
        }    
        //ListWindow_SaveRender
        {
            var ListWindow_SaveRender_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03\u0084iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmpMM:OriginalDocumentID=\"xmp.did:205354a3-a8e2-2e4f-a470-4d196285b6bd\" xmpMM:DocumentID=\"xmp.did:D35785D4A25C11E5B462F5979B260F83\" xmpMM:InstanceID=\"xmp.iid:D35785D3A25C11E5B462F5979B260F83\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:668bef5b-3366-0547-99fb-af27e3fc79cb\" stRef:documentID=\"adobe:docid:photoshop:6df296a4-a25a-11e5-9888-b7a720a9a998\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>f\x7F\u00FBu\x00\x00\x01\u00EFIDATx\u00DA\u00A4S=/\x04Q\x14}wf\x18d\x11\u00EB\u00FB#\u008B\u0090\b\r\u00ADf7\"\u0091h4\u00A2 D\u00A2\u00DD\u00DEo\u00D0i44*\u00C96H\u00B6\u00A0\u00E3G\u00A0Q\u00D0\u0088\u00AFD\u00D8lv\u0097e\u00E69w\u00BD\u00C7\u00EC\u00CC.\u008B\u009B\u009C\u009C;w\u00DE\u00BB\u00EF\u00DC{\u00DF\u00B3\x12\u0089\u0084`#\"!\u00A5,0\u009B\u00F6\x7F\x13c\u00B3D\u00B1\u0085\u0080\x15\u00A0\u0097\u00CF\u00E0\u00F5*\u00AE\u00FD4\u00B0\x0E\u00A4D\x19\u00B3\u00F4I\u008A7\u00C0\u00CB\u00FA\u00A7\u00EF\u009F\u00F6'@3\u00E0\u0094\x7F\x1D\u009B\u00C1R\x15L`\n8\x05\u00BA\u0081N\u0085\x0E\u0085>\u00E0\x10\u0088\x02I\u00A0\u00D1\u00B3\u00F7\x13^\u0085\u00A4\u00F8\x11t]F\u00E1,\u00FC]\u00F048\u00C9J\u00B9\u00FC\"\u0085\u00BE\x16p\u009FLQ\u00DEr\u009C\x14\u00E0dQ\u00C5M\u00DE\x05F)\u00D9? \x07\u00CC\x01{\u00AA\u00FC\x1D\u00D5\u00AE@\u00C9\u00A5\x06P.\u0096\x07\u00CF\u0083O\u0081q\u00F8U`\u00A70e}\x7F\u00F4\u009D\u00F2\u00FB\u00DF\u00C4\u00F2\u00C0=\u00FC&\u00EF\u00BF\u00BF*\u00D4l\x07\u00AE\u008D\u00F8\u009F\x05\u00F6W^\u00B2\u00F7\u00DDx\u0096i\u00FFO%\u00F3n\u00F2\u00BCES\x1A\u009CI\u00BC\u00D1\u00D7\u00DB\u00AEX\u00A1\u0085\u00CDw\u00D5\x19q\u00D0v^\u008B\u00AD\u00ABH>\x19z\u00B3\u0087\x07\u00B2\u00E1\u0087\u00A7\u00AA\u00E7\u00D7\u00D8C_\u00E1\u00C0\u008A\x15\u0092K\u00E2\u00D5p\u00E8\u00AA&\u00B5\u0089\u00E8\x12\u00C7]$8\x0B\u00DD\u009B\u0083\u00D9p\u00CC\x10\u00C6\u0091Kn\u00A0\u00A9\u00A4\u00EFS\u00C0>r\u00F7@\u00E9\"\u00ABeTK\x13\u00CF\u008AlCP\u009CJ\fE*\u00BF\x19\u00E8\u0087\u00EF\x14\u0095\u00CE\u00FD\u00934,Yp\u00F0\u00B8z\u00EE\u00A5\u00BFdNp\f^\x00_\u00F8Kv\u00B0\u00B8=\x1F\x12\u0091\\\u00A3\u00B8\u00AC{,(\u00D4\x03\x07\u00F6\u00F9\x18^\u00E7\x1FJ\x1Ct\x02D\u00E0\u0093W!\u00CA\u00C2{sd\u00D7K\u0083{c\u00A7\u00C7\u00F09\u008A\u00E1f\u00C1\u00DBH\u00BE%\u00B5B\u009F\u00F4'`\u00ADT\x0B\u00A5*{(\u00D3\"F\u00D2\u00AD\u00ACf\x00\u00A1\u008C+\u00E5\u00AD--\u00E1\u00D0\u00C7\u0095|\x17`\x00\x18i^\u00CB/U\u00C53\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_SaveRender = new File ( settings.tempFolder.fullName + '/ListWindow_SaveRender.png' );
            ListWindow_SaveRender.encoding = 'BINARY';
            ListWindow_SaveRender.open('w'); ListWindow_SaveRender.write( ListWindow_SaveRender_bin ); ListWindow_SaveRender.close();
        }   
        //redIcon
        {
            var redIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x05\x00\x00\x00\x10\b\x02\x00\x00\x00Q\x16\"\u009A\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:E21BCDBD9E9011E5B743A727569589FD\" xmpMM:DocumentID=\"xmp.did:E21BCDBE9E9011E5B743A727569589FD\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:E21BCDBB9E9011E5B743A727569589FD\" stRef:documentID=\"xmp.did:E21BCDBC9E9011E5B743A727569589FD\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00E2\u00FF\u00FFv\x00\x00\x00\x14IDATx\u00DAb\u00FC\u00CF\u00C4\u00C4\u0080\x04\x18G\x18\x1F \u00C0\x00\u0092\u00E8\x10A\u0094\x16\u0097\u009B\x00\x00\x00\x00IEND\u00AEB`\u0082"))
            var redIcon = new File ( settings.tempFolder.fullName + '/redIcon.png' );
            redIcon.encoding = 'BINARY';
            redIcon.open('w'); redIcon.write( redIcon_bin ); redIcon.close();
        }   
        //orangeIcon
        {
            var orangeIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x04\x00\x00\x00\x10\b\x02\x00\x00\x00\u00BE\u00D4I\u00A4\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:078F3F4D9E9211E5AB69BE24CB9B72AB\" xmpMM:DocumentID=\"xmp.did:078F3F4E9E9211E5AB69BE24CB9B72AB\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:078F3F4B9E9211E5AB69BE24CB9B72AB\" stRef:documentID=\"xmp.did:078F3F4C9E9211E5AB69BE24CB9B72AB\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00B119/\x00\x00\x00\x17IDATx\u00DAb<\u00D5k\u00CE\x00\x03L\fH`hr\x00\x02\f\x00N\u00B6\x01\u00AEi\u008A\u008C\u00B9\x00\x00\x00\x00IEND\u00AEB`\u0082"))
            var orangeIcon = new File ( settings.tempFolder.fullName + '/orangeIcon.png' );
            orangeIcon.encoding = 'BINARY';
            orangeIcon.open('w'); orangeIcon.write( orangeIcon_bin ); orangeIcon.close();
        }        
        //greenIcon
        {
            var greenIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x04\x00\x00\x00\x10\b\x02\x00\x00\x00\u00BE\u00D4I\u00A4\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:6E97E52D9E9211E5929BCEF8DDA3F74A\" xmpMM:DocumentID=\"xmp.did:6E97E52E9E9211E5929BCEF8DDA3F74A\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:6E97E52B9E9211E5929BCEF8DDA3F74A\" stRef:documentID=\"xmp.did:6E97E52C9E9211E5929BCEF8DDA3F74A\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>%\u00B5YI\x00\x00\x00\x17IDATx\u00DAb4=\u0099\u00C3\x00\x03L\fH`hr\x00\x02\f\x000\u00F4\x01\u008A\u00B8\u00F9\u00D5j\x00\x00\x00\x00IEND\u00AEB`\u0082"))
            var greenIcon = new File ( settings.tempFolder.fullName + '/greenIcon.png' );
            greenIcon.encoding = 'BINARY';
            greenIcon.open('w'); greenIcon.write( greenIcon_bin ); greenIcon.close();
        }        
        //grayIcon
        {
            var grayIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x04\x00\x00\x00\x10\b\x02\x00\x00\x00\u00BE\u00D4I\u00A4\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:77FB278D9E9211E5889FE6D4CE4F4041\" xmpMM:DocumentID=\"xmp.did:77FB278E9E9211E5889FE6D4CE4F4041\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:77FB278B9E9211E5889FE6D4CE4F4041\" stRef:documentID=\"xmp.did:77FB278C9E9211E5889FE6D4CE4F4041\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\b\u00D6\u00E0\u00EC\x00\x00\x00\x17IDATx\u00DAb422b\u0080\x01&\x06$049\x00\x01\x06\x00\u0086\u0084\x00\u00B6\x16=9A\x00\x00\x00\x00IEND\u00AEB`\u0082"))
            var grayIcon = new File ( settings.tempFolder.fullName + '/grayIcon.png' );
            grayIcon.encoding = 'BINARY';
            grayIcon.open('w'); grayIcon.write( grayIcon_bin ); grayIcon.close();
        }
        //Folder PNG
        {
            var folderPNG_binary = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x06\x00\x00\x00szz\u00F4\x00\x00\x00\u0098IDATX\u0085\u00ED\u00D0\u00B1\r\u00830\x10\u0085a6\u00C9X\f\x01A\u00A9\u00C9\u0085\x02D\x04\u00DE\u0081\u00C8\u0091\u00BC[6\u00A0\u00BD\u00E85\x16\x1DV\x04\u00BE\x14\u00AF\u00F8\x1B7\u00EF\u00F3\x15\u00AAZXf:\u00FE?\u0080\x10\u00C2\u00E5\u00B5,\u00B7\u00BD\u00DE\u00DE\u0097\u00A7\x00Dd\u00AD\u00EAZS\x02\u00E4p@\u00EA8\x1A\u00C7\u00E7'\u00E5Z{\u00E1\u00EA?\x01\u008E\nW7\x05\u00A0\b\u00B86\u008D\u00CA\u00A3\u00D3\u00BE\x1F\u00B2\u00D4\u00DEE\u00B1\x19\x01xt\u00CEe\r\x1F\u008E\u0080\u00DC\u00E3h\u009Af[\x00\"\u0080\x00\x02\b \u0080\x00\x02\u00B6\x00o\x00\u00F0\x11`\x19\x01\x04|\x01k\u00E2\u00C8\u00A6t\x1C\u009Ct\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var folderPNG = new File ( settings.tempFolder.fullName + '/folder.png' );
            folderPNG.encoding = 'BINARY';
            folderPNG.open('w'); folderPNG.write( folderPNG_binary ); folderPNG.close();
        }
        //Redbin PNG
        {
            var redbin_binary = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00\x18\b\x06\x00\x00\x00\u009BS\u00FF4\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00A\u00F3iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c067 79.157747, 2015/03/30-23:40:42        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:photoshop=\"http://ns.adobe.com/photoshop/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\"\n            xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\"\n            xmlns:tiff=\"http://ns.adobe.com/tiff/1.0/\"\n            xmlns:exif=\"http://ns.adobe.com/exif/1.0/\">\n         <xmp:CreatorTool>Adobe Photoshop CC 2015 (Windows)</xmp:CreatorTool>\n         <xmp:CreateDate>2015-05-25T20:25:14+02:00</xmp:CreateDate>\n         <xmp:ModifyDate>2015-10-24T03:19:58+02:00</xmp:ModifyDate>\n         <xmp:MetadataDate>2015-10-24T03:19:58+02:00</xmp:MetadataDate>\n         <dc:format>image/png</dc:format>\n         <photoshop:ColorMode>3</photoshop:ColorMode>\n         <xmpMM:InstanceID>xmp.iid:219128b6-8218-9242-86e2-02c1c509ad9d</xmpMM:InstanceID>\n         <xmpMM:DocumentID>adobe:docid:photoshop:46e524b0-79ed-11e5-830c-a9c38e600ee3</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:f8517903-d2a1-da4c-9738-56f7a8a1f6b6</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:f8517903-d2a1-da4c-9738-56f7a8a1f6b6</stEvt:instanceID>\n                  <stEvt:when>2015-05-25T20:25:14+02:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe Photoshop CC 2015 (Windows)</stEvt:softwareAgent>\n               </rdf:li>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>converted</stEvt:action>\n                  <stEvt:parameters>from image/png to application/vnd.adobe.photoshop</stEvt:parameters>\n               </rdf:li>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>saved</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:5b388805-7d85-dc4d-ba67-ee06e949f8a6</stEvt:instanceID>\n                  <stEvt:when>2015-10-24T03:13:54+02:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe Photoshop CC 2015 (Windows)</stEvt:softwareAgent>\n                  <stEvt:changed>/</stEvt:changed>\n               </rdf:li>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>saved</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:059e78ef-36c1-6848-bc41-e02bc69f5a57</stEvt:instanceID>\n                  <stEvt:when>2015-10-24T03:19:58+02:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe Photoshop CC 2015 (Windows)</stEvt:softwareAgent>\n                  <stEvt:changed>/</stEvt:changed>\n               </rdf:li>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>converted</stEvt:action>\n                  <stEvt:parameters>from application/vnd.adobe.photoshop to image/png</stEvt:parameters>\n               </rdf:li>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>derived</stEvt:action>\n                  <stEvt:parameters>converted from application/vnd.adobe.photoshop to image/png</stEvt:parameters>\n               </rdf:li>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>saved</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:219128b6-8218-9242-86e2-02c1c509ad9d</stEvt:instanceID>\n                  <stEvt:when>2015-10-24T03:19:58+02:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe Photoshop CC 2015 (Windows)</stEvt:softwareAgent>\n                  <stEvt:changed>/</stEvt:changed>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n         <xmpMM:DerivedFrom rdf:parseType=\"Resource\">\n            <stRef:instanceID>xmp.iid:059e78ef-36c1-6848-bc41-e02bc69f5a57</stRef:instanceID>\n            <stRef:documentID>xmp.did:f8517903-d2a1-da4c-9738-56f7a8a1f6b6</stRef:documentID>\n            <stRef:originalDocumentID>xmp.did:f8517903-d2a1-da4c-9738-56f7a8a1f6b6</stRef:originalDocumentID>\n         </xmpMM:DerivedFrom>\n         <tiff:Orientation>1</tiff:Orientation>\n         <tiff:XResolution>720000/10000</tiff:XResolution>\n         <tiff:YResolution>720000/10000</tiff:YResolution>\n         <tiff:ResolutionUnit>2</tiff:ResolutionUnit>\n         <exif:ColorSpace>65535</exif:ColorSpace>\n         <exif:PixelXDimension>32</exif:PixelXDimension>\n         <exif:PixelYDimension>24</exif:PixelYDimension>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                            \n<?xpacket end=\"w\"?>$\u00B1_\u00F2\x00\x00\x00 cHRM\x00\x00z%\x00\x00\u0080\u0083\x00\x00\u00F9\u00FF\x00\x00\u0080\u00E9\x00\x00u0\x00\x00\u00EA`\x00\x00:\u0098\x00\x00\x17o\u0092_\u00C5F\x00\x00\f(IDATx\x01\x00\x18\f\u00E7\u00F3\x01\u00FF\u00FF\u00FF\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x01\x01\u00D9\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00DD$$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00#\u00DC\u00DC\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00#\u00DC\u00DC\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00DD$$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00D0\"\"\x00\r\x02\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00F3\u00FE\u00FE\x000\u00DE\u00DE\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x02\x02\x00#\u00DC\u00DC\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00DD$$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00D0\"\"\x00\r\x02\x02\x00\x00\x00\x00\x00\u00DD$$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00DD$$\x00\u00F3\u00FE\u00FE\x000\u00DE\u00DE\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x02\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x02\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00#\u00DC\u00DC\x00\u0091\u00EE\u00EE\x00#\u00DC\u00DC\x00\u0091\u00EE\u00EE\x00#\u00DC\u00DC\x00\u0091\u00EE\u00EE\x00#\u00DC\u00DC\x00\u0091\u00EE\u00EE\x00#\u00DC\u00DC\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00o\x12\x12\x00\x00\x00\x00\x00o\x12\x12\x00\x00\x00\x00\x00o\x12\x12\x00\x00\x00\x00\x00o\x12\x12\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00A6\x1B\x1B\x00\x00\x00\x00\x00\u00A6\x1B\x1B\x00\x00\x00\x00\x00\u00A6\x1B\x1B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00F3\u00FE\u00FE\x007\t\t\x00\x00\x00\x00\x007\t\t\x00\x00\x00\x00\x007\t\t\x00\u00F3\u00FE\u00FE\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x000\u00DE\u00DE\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00DD$$\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\u00FF\u00FF\u00FF\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x01\x01\u00D9\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\u00FF\u00FF\u00FF\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\u00FF\u00FF%\u00CAJW\u00B4\u0091\x03K\x00\x00\x00\x00IEND\u00AEB`\u0082"))
            var redbinPNG = new File ( settings.tempFolder.fullName + '/redbin.png' );
            redbinPNG.encoding = 'BINARY';
            redbinPNG.open('w'); redbinPNG.write( redbin_binary ); redbinPNG.close();
        }    
        //ListWindow_PlayIcon
        {
            var ListWindow_PlayIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:87706BBEA25511E59589D58681CE60F7\" xmpMM:DocumentID=\"xmp.did:87706BBFA25511E59589D58681CE60F7\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:87706BBCA25511E59589D58681CE60F7\" stRef:documentID=\"xmp.did:87706BBDA25511E59589D58681CE60F7\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u0095\u00AC\u00C2\u00A0\x00\x00\x00\u009AIDATx\u00DAb\u00FC\u00FF\u00FF?\x035\x01\x13\x03\u0095\u00C1\u00E07\u0090\x05\u0097\u00C4\u00CA\u0095+\u00F3\u00A0\x16N\u00C0g@xx8\u00D1.\u00D4\x03\u00E2~ ^\x0F\u00C4\u00DC\u00D4\u00F0\u00F2/(\x1D\x00\u00C4\u009F\u00808\u008E\u009Aa\bR\u00B7\x10\u0088O\x01\u00B145#\u00C5\x14\u0088\u009F\x00q%\u00B5c\u00B9\r\u0088\u00FF\x01\u00B1\x075\u0093\r#\x10\u00B3R\u00CB\u00C0\x16\u00A8\u0081\u009B\u0089N\u00878\u00C0E \x0E\x04\u00E2\u00FB\u00D4\b\u00C3\f 6\u00C0g\x18!\x17\u00B2A\u00E9\u009D@\x1C\x05\u00C4\u00EF(M\u00877\u0081\u00B8\n\x1A\u0093\u00EF\u0088\u008E\u00A9\u00D1\u00F2\u0090b\x00\x10`\x00i\u00E9\x1Cd\x17\u00C3\u0098\u00CE\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_PlayIcon = new File ( settings.tempFolder.fullName + '/ListWindow_PlayIcon.png' );
            ListWindow_PlayIcon.encoding = 'BINARY';
            ListWindow_PlayIcon.open('w'); ListWindow_PlayIcon.write( ListWindow_PlayIcon_bin ); ListWindow_PlayIcon.close();
        }        
        //ListWindow_RevealIcon
        {
            var ListWindow_RevealIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:E113E8F6A25611E5B474DA1916D962C9\" xmpMM:DocumentID=\"xmp.did:E113E8F7A25611E5B474DA1916D962C9\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:E113E8F4A25611E5B474DA1916D962C9\" stRef:documentID=\"xmp.did:E113E8F5A25611E5B474DA1916D962C9\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>-\u00BD7\x0B\x00\x00\x00\u00A7IDATx\u00DAb\u00FC\u00FF\u00FF?\x035\x01\x13\x03\u0095\x01\u00D5\rd\x01\x11+W\u00AE\x04Qq@\x1C\x0B\u00C4\x1F\u0080\u00F8\x1FT^\f\u00887\x03q\x1F1\u0086\u0085\u0087\u0087C\f\x04\u0082\" \u00EE\u00C5\u00A1\u00CE\x01\u0088\u00B9\u0080\u00B8\x05\u0088\u0099\u0081\u0098\x11M\x1E\x14\t\x7F\u00D1\u00BD\u00ACB\u00C0\u00F2& ~\x0F\u00C4\u00AF\u00D1\u00F0\x1B \u00FE\x03\u00C4[\u0080X\u0096\u00940\x04\u00B9J\x00\u0088\x05\u00A14\f\u00F3C\u00E5\u00BD\u0081\u00B8\u0080\u00DA\u0091\u00C2Mm\x03\u00FF\x0F\u008Dt8j \u00F5\f\u00BCO\x05\u00B3\u009E\u00C0\x0B\x07 \u00E8\x06\u00E2\u008F@\x1C\n-\x1C\u00FE\u0093\u0098\u00836\x00\u00F1L\u00B0\u00C0\u00C8+`\x01\x02\f\x00u\u00B8!\u00F1Kh\u00B3\u00A4\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_RevealIcon = new File ( settings.tempFolder.fullName + '/ListWindow_RevealIcon.png' );
            ListWindow_RevealIcon.encoding = 'BINARY';
            ListWindow_RevealIcon.open('w'); ListWindow_RevealIcon.write( ListWindow_RevealIcon_bin ); ListWindow_RevealIcon.close();
        }        
        //ListWindow_RefreshIcon
        {
            var ListWindow_RefreshIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:9FE73CFEA25511E5BE8E8BE825652B7D\" xmpMM:DocumentID=\"xmp.did:9FE73CFFA25511E5BE8E8BE825652B7D\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:9FE73CFCA25511E5BE8E8BE825652B7D\" stRef:documentID=\"xmp.did:9FE73CFDA25511E5BE8E8BE825652B7D\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00E6\u00E4\u009B\u0084\x00\x00\x01<IDATx\u00DAb\u00FC\u00FF\u00FF?\x035\x01\x13\x03\u0095\x01\u00D5\rdA\u00E6\u00AC\\\u00B9\x12]^\x0B\u0088\u0083\u0080\u00D8\x18\u0088\x19\u0081\u00F8\x1C\x10\u00AF\x03\u00E2+Hj\u008C\u00C2\u00C3\u00C3\u00CFa5\x10\r,\x00\u00E2x41\x7F n\u0084\u00CA%\x02\u00F1t v\x04b\rB^>\x035l?\x10{\x03\u00B18\x10\u008B\x01\u00B1'\x10\u00EF\x03\u00E2\x04 \u00BE\x0F\u00C4\x19@|\x07\u00A7\u0097\u00A1`\x19\u00D4\u008B \u00974\u00A0\u00C9\u00ED\u0080\u00E2\u00BD@\u00EC\x04\x15\u00FB\u008C/R\u0094\u00818\x12\u0088\u008Fa1\f\x06\u00CA\u0081\u00D8\x01\u0089\u00CF\u0086\u00CF\u0085\u0089P\u00BA\fG\u008A\u00E8\x02\u00E2b4qn|\x06\u009A@\u00E9\x0B8\f<\f\u00C4\u00AB\u0081\u00F8\x0FT\f\x14\u00F3\u00EF\u00F0\x19\u00C8\b\u00A5\u00B1e\x1F\u0090!\x1BIM\u00D8\u00B0\u00F4\u00A4GD\x1A\u00E6\x03\u00E2@ \u00D6\u00C6g\u00E0|(\u00DDN\u0084\u0081\u00DB\u00A0\u0089\\\x10\u009F\u0081\u00B7\u0080x=4\x16\u00CB\u00F1\x18V\x02\u00C4\u00D6P\u00B5G\b\u00E5ePV\u00BB\n\u00C4\x1D@\u00BC\x19j8/\x10\u00F3\x00\u00B1\x1D\x10o\x00\u00E2n\u00A8\u009A \u00BCy\x19\t\u00E8\u0082\u00B26\x10\u0087\x02\u00B1\x0F\x16\u00F95@\x1CF\u00B0p@\x02\u00FF\u00A1\x1A\u008C\u00A1\x01\u00AF\x07M\x01\u0097\u00A1\u00E1v\x06WX0\u008E\u00BC\x02\x16 \u00C0\x00\u00D6M<Ad\u00AA\u00EC\u00BA\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_RefreshIcon = new File ( settings.tempFolder.fullName + '/ListWindow_RefreshIcon.png' );
            ListWindow_RefreshIcon.encoding = 'BINARY';
            ListWindow_RefreshIcon.open('w'); ListWindow_RefreshIcon.write( ListWindow_RefreshIcon_bin ); ListWindow_RefreshIcon.close();
        }       
        //ListWindow_FilesIcon
        {
            var ListWindow_FilesIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:2E526677A25911E5AF76E58B9A0C535D\" xmpMM:DocumentID=\"xmp.did:2E526678A25911E5AF76E58B9A0C535D\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:2E526675A25911E5AF76E58B9A0C535D\" stRef:documentID=\"xmp.did:2E526676A25911E5AF76E58B9A0C535D\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u0082\u0096%0\x00\x00\x02)IDATx\u00DA\u00B4U=k\u00DBP\x14}\u0092%\u00D9\u00A9\x05\u00A2\u0083\r.\u00C4Y\f\x1DM\u00FE\u0080!\u00F5\u009E\u00A1c\x06\x17\f\x01C\u00F6\u00FE\u0086\u0096\x10gp\u0087\u00C6\u0093\x17\u0083\u00EDI\u00F8\u00AF\x14<x\u00D0P\b\u00D4q\u00DDZ!\u0096\u0089\u00AD\u008F\u009C\x1B\u00E9\x05IH\u00B1;\u00F4\u00C0\u00E5I\u00F7\u00EA~\u009C{\u00DF{\u0092\x06\u0083\x01#\b\u0082\u00C0<\u00CF{^\t\u00FC\u00F9_t\x04\u0089E\u00A1\u00C2\u00D8\u0084\x1C\u00FA9\u00FC\x0F!n\u00E0`A\u00AE!&\u00D9DQd\u00B6mG\x02H<S\u00B0~\u0083|Z\u00AF\u00D7\u00CCu\u00DD\u0097\u00CC\u00D9l\u0096I\u0092\u009F\x1B\u00FA\x13\u00E8O\u00B7\u00DB\u00ADiY\x16\u00D34-\x1A\u0090\u0097\nddY\u00FE`\x18\u00C6\u00AC\u00DB\u00ED^R\x0ER\u00C2q\u00DBl6[\u00EF\u0081\u00E5ry_(\x14j\u00A8jl\u009A\u00E6\u00E9d21\u00EB\u00F5:\u00DBl6/\u0094E\u00AA\"\x10\x01\x14\\d\u00B5\u00E6\u00F3\u00F9\x1D\u009C\u00FF\u0092\x00\x7F\x1C\u00C7\u00B1\u00E1 \u00F4z\u00BD\u00EFH\u00F83\u0097\u00CB\u00D5\u0090|\u00AC\u00AA\u00AA\u00C6{\u00C8E\u008C\u00F5\u0090\u0094\"\u00E8I\u0099\x10HM\u0094\x17\u008B\u00C5\u00EFN\u00A7s\u0085\u00A0\u00B7\u00C5b\u00B1V\u00ADV\u00C7 \u00F06\u00EC/\x06Mg!\u00EA\u0089 ;\x18df\u00B3\u00D9\u00AFv\u00BB\u00FDu:\u009D\x1A\u00E8m\r\u00A6>l\x19\x1E#>\u0094DP;@\u00915\x1A\u008Ds\u00F4\u00EB\u0091\u00FA\u008A\u00E02\r\x0E8&3V'>\u0094T\u00ACV\u00AB\x07\u0088U.\u0097\u008F\x10\u00E8\u0099\x15\u0082\u00D9\u0088\u00EB\u00E1\u00F51\u00CCpg\u0085\u00A8L\x19\u008DF}]\u00D7e\u00EE\x14\x04tZ\u00AD\u00D6\u00E7J\u00A5\u00A2\u0084\u00F7\u00A2\u00B4\u00AB:J\u0084}I\u00C3\u00F7\u00C2\u00FD\u00A4\u0080\x04\u00D8\u00A5\u00B4}\u0098\n\u00A2\x19\x1FP\u00C0H\u00E0\u00EF{S\u00DE\x07a\u00DF\u00BD*\u00DC\u0085\u00FF[aB6\x17S\u00B3\u00E9\u00C4x)\u00E5\u00D31\u00A4mC\u00DF\u00D2\x1D\u00906\x14\x0F\x1F\u00898\u009F\x07\u00A5R\u00E9\x1D9\u00A5U\x1D\u009C\x1A!\u009F\u00CF\u00BF\u00A1i{>\u00FCj\u0087\u00C3a\u00F8\u0082\u00EDc=\u00C3\u0086\u008D\\_I\u0097)\x1Dq:\u00DFx\u00D6\u00A1\u00FB\u00C8#F\u0086\u0082\u00E7\x0B\x18\x7F(\u008Ar\u00C8+|\u00E5\u00C6\u00A6\x18\u00B7\u0090\x1B\u00DF\u0094|c/a\u00F8\u00C2\u00A7\u00B6\u00CF/ \u008E'\x01\x06\x0092\u0098\u00EC\u00DB\"%\u009E\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_FilesIcon = new File ( settings.tempFolder.fullName + '/ListWindow_FilesIcon.png' );
            ListWindow_FilesIcon.encoding = 'BINARY';
            ListWindow_FilesIcon.open('w'); ListWindow_FilesIcon.write( ListWindow_FilesIcon_bin ); ListWindow_FilesIcon.close();
        }       
        //ListWindow_SettingsIcon
        {
            var ListWindow_SettingsIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:A6279BB4A25E11E5BA7EA07E4CE239CC\" xmpMM:DocumentID=\"xmp.did:A6279BB5A25E11E5BA7EA07E4CE239CC\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:A6279BB2A25E11E5BA7EA07E4CE239CC\" stRef:documentID=\"xmp.did:A6279BB3A25E11E5BA7EA07E4CE239CC\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00CBkX~\x00\x00\x01\u00C3IDATx\u00DA\u00E4\u0094=H\x03A\x10\u00857\u0089$\x1Ei.\n\x16\u0081\u0080\u00A2\u00A0\u0082\u0088\b\x06\x13\u00C1BD\u00C1\u00C2\u00DAN\x10\x1B\u00B1\u00B6\u00B3\u00D1NK+A\u00ECm\u00C5\u00C2\x1FHe!h\u008C\u00AD\u0085H0`\u00AB!g\u008A\u0098\\\u00FCF\u00E6\u00E0\x02\u00C9\u00D9\u00A4\u00F3\u00E0\u00F1\u00DE\u00DE03;\u00BB3\x1Bj6\u009B\u00A6\u009B_\u00D8t\u00F9\u00EBz\u00C0\x1E\u00FF\u00A2R\u00A9\u0098b\u00B1h\u00C2\u00E1\u0096<K \u00AD\u00FA\x0E\u00E4<C\u00A3\u00D10\u00A9T\u00CA$\x12\u0089\u00F6\x01\u00CB\u00E5\u00B2)\x14\n&\x12\u0089\u00FC\u00AEC\u00A1\u0090\u00E1\u008Cw\u00E0EY\u00A3\u00CF\u00D199w\u00B1\u00D5j5cYV\u00E7\u0080\u00B2\u00B3h4\x1A'\u00E0\x1A\u00CB+\u009C\u00FAp\x1E\x17g\r8\u0089\x1E\u0083\x1Dx\u0099_g\u00F8|u,Y\u009D\u00B6\u00C1\x01\u00F2\x13\u00C4\u00D0\u0096\u00CF6\x04\u00E5\u00E1o\u00D8\u0086\u00FB\u00E1\u00C3\u00A0K\x19\"\u00F3\u00BE\u00EC\b\u00D8\u00C0R\u009D\x07\x0F\u00AA\u00E3j\x13\u00BD\u0087\u00CF`P\u00C0:Y\u009F\u00E4\u008C\x14\u00F2m\u0081\x19\u0090\x06\u009B\u00C0\u00F5\u00D9\u00F3\u00F8\u00D4\u0082\x02\u0096\u00C8:\x0F\u009Eu\x07\x05p\u00ACZp\n\u00EEU\u00BF\u0082\x05|\u00DE\u00FF\u00EA\u00C3\u00BA\\\u00B0wlm\u00EC\u00DE?\x17D\u00FEj\u00EC\x01\u00CA\u00B8\x01\u00A3Z\u00D2\u00B4\u0096\u00E9\u0095\u00B8\u00AE\u00A5\u008B\x1E\x01\u00D2\u0097\x13A\u00B7\x1C\u00A3\u008C9\u00AFM`Ix\x02o\u00E8\u00CE\u00B2>\u009B`\n\u00D9\x1Bx\u0086d\u00DD\u00D5\x1D8\u00A0\u00AA:\x03\u00B2\u00AA\x1B\u00E0C\u00F5\u0091\u00B4Q`\x1F\u00EA%T\u0091\u00D7\u00B0d\u00BF\u0080\u0087\u00D5\u00FC\u0089^\u0085_\u00E0\x15p\x118\u00CB\u00AE\u00EB\u00CA8U\u0099\u0094c\u00DF\u00E8=z\x01\u00D1o\u00E8[\x1D\u00BDS\x19=\u00F1i\u00D9\u0090\u00FF=t\x1C\u00C7\u0094J%\u00E3?'\u00EC\u00B3pF\x03J;]z\u00B3,\u008FC2\u00994\u00B6m\u00B7\x0F\u00F8?\x1E\u00D8\x1F\x01\x06\x00 w\rw$!\u00F07\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_SettingsIcon = new File ( settings.tempFolder.fullName + '/ListWindow_SettingsIcon.png' );
            ListWindow_SettingsIcon.encoding = 'BINARY';
            ListWindow_SettingsIcon.open('w'); ListWindow_SettingsIcon.write( ListWindow_SettingsIcon_bin ); ListWindow_SettingsIcon.close();
        }       
        //ListWindow_IncrementIcon
        {
            var ListWindow_IncrementIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:3B5B2A02A31711E59319ECB261E6DDB6\" xmpMM:DocumentID=\"xmp.did:3B5B2A03A31711E59319ECB261E6DDB6\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:3B5B2A00A31711E59319ECB261E6DDB6\" stRef:documentID=\"xmp.did:3B5B2A01A31711E59319ECB261E6DDB6\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00E6/W\u0086\x00\x00\x01WIDATx\u00DA\u00ECT\u00BBJ\u00C4@\x14\u009DG\x1E,\x12\x15\x15A{k\x0B\x1B!\u00DAX\u00FA1\u00FE\u0085V[j\u00B3\u00B0? Z\u00FA\r\x16vAkA\r\x16A\x14\u0089\x12\u00D7<<W\u00EF\u00C8\u00B0&\u00D9 [Xx\u00E1p\u00EE<rr\u00E7\u00CEIdUUb\u009A\u00A1\u00C4\u0094\u00E3\u00EF\x0B:\u00F6 \u008A\"\x11\u00C7\u00B1p\x1CGPo\u00A5\u0094\u00DFL\u00C1\u00F9\"x\u00BD,\u00CB\u00ED \b\u0096\u00C30\u00DC\u00C3RQ+\u0098\u00A6\u00A9H\u0092D\u00B8\u00AE\u00DB$\u00E8!?\x07\u00AFAP\x14Eq\u008D\u00E9\u00B2\u00B1B\u00A5\u0094\u00D0Z\x7F\x02\x0F\u00AD\u00E2\u00E1M\u00F0\x05\u00F8\u00D6\u00AAp\x00\u00BE\x01\x1F`_9\u00B1\u0087T\rc\x0B8\x05v\u00AC\u00B9\x11\u00D0\x07\u008E\u0081Wl\u00D7\u00AD=4U0\u00DEx<\u00B2\u00D7\u00AC=j\u00E2\u00A5 f\u00F0f\u0097{6\u00CB\x1C\u0080\u00E7y\u00FD\x1D\u00F9\u008B9I\x17\u00DB\x1C\x01\u00F7\u008C!\u00CF\x1D\u00D6\u00CCu\u00B3\r\u00E2\x12GY\u00AA\u00BEb\x05\u00E3\r\u00F0\x15\u00F8\u008E\u008AB\x1E\u00D9m\u00E9\"\u00D8\u00E7\u00A6S\u00BE\x0B>\x03\u00EF\u0083O\u00ECKk;\u00B23~!\u00E4/\x02\u00F2\x1E\u00FB\u00B07fl\u00B3O\x13Z\x05\u00E9\x0B\u00F1}\u00DF\x18\u009B,\u00F2\x04\u00CE\x1A\x04\x1F=\u00CF\u00CB~\u00D8\u00CE\u00EEE\u009E\u00E7\u00E4~3\u00F4\u00819\u00E0\x19\u00C8jN\u00B7\x00q\t\u00D1\u0087F\u00C1\u00FF\u00FF\u00E1\u00AF\u00E2C\u0080\x01\x00\x1B\x04\u00C4JwI9\u00D2\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_IncrementIcon = new File ( settings.tempFolder.fullName + '/ListWindow_IncrementIcon.png' );
            ListWindow_IncrementIcon.encoding = 'BINARY';
            ListWindow_IncrementIcon.open('w'); ListWindow_IncrementIcon.write( ListWindow_IncrementIcon_bin ); ListWindow_IncrementIcon.close();
        }     
        //ListWindow_ResetIcon
        {
            var ListWindow_ResetIcon_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:A37C7EABA25611E5802CBE7CBFD9523D\" xmpMM:DocumentID=\"xmp.did:A37C7EACA25611E5802CBE7CBFD9523D\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:A37C7EA9A25611E5802CBE7CBFD9523D\" stRef:documentID=\"xmp.did:A37C7EAAA25611E5802CBE7CBFD9523D\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u009BT\u00E9W\x00\x00\x00\u00D5IDATx\u00DAb\u00FC\u00FF\u00FF?\x035\x01\x13\x03\u0095\u00C1\b4\u0090\x05\u009B\u00E0\u00CA\u0095+e\u0080T\n\x10w\x03\u00F1W,z\u00AA\u0080xYxx\u00F8\x1Db]\x18\x02\u00C4\u00F5 MX\u00E4\x16\x02q#\x10\u0087\u0093\u00E2\u00E5\t@\u00BC\n\u0088\u00FD\u0080x\x1D\u0092\u00F8\" \u008E\x02\u00E2\u00AD@\u00DCJ\u00B4\u0097\u00A1\x00\u00E4\u0082\u009F@\x1C\x0B\u00C4\x13\u0081\u00F8\x07\u0094\u00BD\x1E\u0088\u0083H\nC$\x10\x07\u00C4\u00CF\u0081\u00B8\f\u00CA\u009F\x06\u00C4\u00D9\u0094\u00C6\u00F2?\x1Cl\u00B2\\\u00B8\x10\u00EA\u00CAI@\u00FC\x1D\u0088\u00CB\u0081X\n\u0088\u0083\u00C91p\x054\x1C7\x00q>TL\x1A\u0088c\u0080x3\x10\u00FB\u0092\u00E2\u00E5\\\u00A8a \u008D\u0081H\u00E2\u00A0HY\x0E\u00C4>@\\I\u008A\x0BA\u00AE\x12\x03\u00E2N,r\u00F1@|\x1B\u0088\u00D7`\u00D3\u00C88Z|\r>\x03\x01\x02\f\x00\u008E7+\u009EB\u00ACD8\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_ResetIcon = new File ( settings.tempFolder.fullName + '/ListWindow_ResetIcon.png' );
            ListWindow_ResetIcon.encoding = 'BINARY';
            ListWindow_ResetIcon.open('w'); ListWindow_ResetIcon.write( ListWindow_ResetIcon_bin ); ListWindow_ResetIcon.close();
        }   
        //ListWindow_Sep
        {
            var ListWindow_Sep_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x14\b\x06\x00\x00\x00L\x0EW\u00A1\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\" xmpMM:InstanceID=\"xmp.iid:4C0DAB8FA26B11E59995DF5BFC5581AA\" xmpMM:DocumentID=\"xmp.did:4C0DAB90A26B11E59995DF5BFC5581AA\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:4C0DAB8DA26B11E59995DF5BFC5581AA\" stRef:documentID=\"xmp.did:4C0DAB8EA26B11E59995DF5BFC5581AA\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>:\x1F\u00B1\\\x00\x00\x00\x15IDATx\u00DAb\u00F8\u00FF\u00FF?\x03\x13\x03\x10\u00D0\u008E\x00\b0\x00,\u00B9\x03$n\u00E0\u00C8\u00A9\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var ListWindow_Sep = new File ( settings.tempFolder.fullName + '/ListWindow_Sep.png' );
            ListWindow_Sep.encoding = 'BINARY';
            ListWindow_Sep.open('w'); ListWindow_Sep.write( ListWindow_Sep_bin ); ListWindow_Sep.close();
        }   
        //FrameWindow_File
        {  
            var FrameWindow_File_bin = (new String("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\b\x06\x00\x00\x00\x1F\u00F3\u00FFa\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03\u0084iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c111 79.158325, 2015/09/10-01:10:20        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmpMM:OriginalDocumentID=\"xmp.did:205354a3-a8e2-2e4f-a470-4d196285b6bd\" xmpMM:DocumentID=\"xmp.did:D42BF683A31911E58A5FE1A9CC95C17C\" xmpMM:InstanceID=\"xmp.iid:D42BF682A31911E58A5FE1A9CC95C17C\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:24a4849a-af88-044c-9ebb-e9e7f21a9730\" stRef:documentID=\"adobe:docid:photoshop:225677d6-a259-11e5-9888-b7a720a9a998\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>/\x14\u0094\u00AC\x00\x00\x01\u00A1IDATx\u00DA\u00A4S=K\u00C3P\x14m^j\x12(\x12\u00AC\u00AD\u0090.\u00D5\u00A1\u0083\u00C5I\u00FA\x17:\u0088P\u0084H)\u009D\u00FC\x0B.\u0099tp\u00F6\u008Ft-\bY\u00ACE\u00E9 E\u00B0s\u00C1\u00C1-\x10B]$M\u009B\u00E4ynmJL\u0083\x1Fx\u00E0\u00F1.\u00F7\u00DD{\u00DE=\u00F7\u00DD't:\u009D\fA\x10\u0084\u00CC_\u00C09_\u00EC\u00D9\u0098o\u009B1v.\u00CBr\x19v@\u008E\u00F9|\u00EE\x07A\u00C0`\u00BE \u00E1\x1A\u00FB,I\u0094\u008Dn\x16E\u00F1h2\u0099\u00D4{\u00BD\u00DE-\u00928VP\u00AB\u00D5\u00F6+\u0095J\x191\u0087 P\u00C30\u00BC\u0084\u00ED}!\u0088\f\x10\u00E4\x1C\u00C7\u00B1L\u00D3\u00BCC\x10\u009BN\u00A7\u00B3R\u00A9\u00B4\u0099\u00CF\u00E7\u0095\u00C1`\u00F0\u00AC\u00EB\u00FA\u0089\u00EF\u00FB\x02H.\u00E2$q\t!%*\u008A\"\u00D3\u008E%d\x01\u00DA\u00BB\u00DD\u00EE\u0083\u00EB\u00BA\u00B3V\u00AB\u00A5C&\u008A\u00E1W\u0088\x7F\u00A7$\x16/'\u00D9H\u008ADO\u00A4j\u00B5\u00BA7\x1E\u008F_\u0087\u00C3\u00E1#*=\u00C6\u0091\u009EV\u00C1\x1A\u00A8\x0F\u00C5bq\u00CB0\u008C3\u00E2\u00A3\u00A6\x02.\u00EC\u00DC\u008F\x04\u0092$m\u00F4\u00FB\u00FD\u00A7\u00D1h4\u00E6\u009FX\u00F8\u00DB\u00ED\u00F6\u00A9\u00A6i\fD\u00DF\x13@+\u00B3m\u00FB\u00CD\u00B2,\u0087\u00D4E\x04\u00D4\\\x1C\t\u00BF\u0091\u00C0\u00A1\u0097\u00D1\u008A\x0F\u00CE2\u0099\u00AF.\u00CA\u00FC\x13,m<\x7F3\u00C2i\x12\u00E8\u0081C\u00BC\u00B7\u00B7\u009C\u0083\u00B5D\u00F2-\u00BB\u00C9\u00D6\b\u00F0bn\u00A1P\u00D0\x1A\u008DF\x1D\u00D3\u00C6\u00D3\b\u00A8\x1F\u0098\u00CC\x1D\u008A]\x11D%\u00C1i\u00AA\u00AAz\u00D0l6w\u00A3\u00CF\u0094\x02\u00D1\u00F3\u00BC{\u00C4\u00DE\u00A4\u00FDF\x1B7\x1B\u0090 \u00C6\u00BB\u009C\u0080\u0090$\u00FF\x10`\x00\u00D0\u00C0\u00D2\u00B7\u00B8C\u00D8\x05\x00\x00\x00\x00IEND\u00AEB`\u0082"));
            var FrameWindow_File = new File ( settings.tempFolder.fullName + '/FrameWindow_File.png' );
            FrameWindow_File.encoding = 'BINARY';
            FrameWindow_File.open('w'); FrameWindow_File.write( FrameWindow_File_bin ); FrameWindow_File.close();
        }
    }    
    
    var FrameWindow = ( function ( thisObj, inTitle, inNumColumns, columnTitles, columnWidths ) {
        
        var itemIndex = null;
        
        //Window Definition
        {
            var palette = new Window('palette', inTitle, undefined, {
                resizeable: false,
                maximumSize: ['', 400],
                margins: 10,
                spacing: 10
            });
            palette.alignChildren = "left";
            if (palette == null) return;
        }

        //cls
        {
            var cls = function( ){
                this.setItemIndex = function ( index ) {
                    itemIndex = index;
                    return itemIndex;
                };
                this.getItemIndex = function ( ) {
                    return itemIndex;
                };
                this.show = function () {
                    
                    listItem.size.width = listGroup.size.width = (function (){
                        var num = 0;
                        for (var i = 0; i < columnWidths.length; i++) {
                            num += columnWidths[i];
                        }
                        return num + 10
                    }());
                    
                    columnWidths;
                    listItem.size.height = listGroup.size.height = 500;

                    palette.layout.layout(true);
                    palette.layout.resize();

                    palette.show();
                };
                this.hide = function () {
                    if (!(palette instanceof Panel)) palette.hide();
                }
                this.disable = function ( ){
                    button_copy.enabled = false;
                    palette.update();
                    palette.layout.layout();
                }
                this.setlist = function ( inColumn1,inColumn2,inColumn3, inColumn4, inColumn5, inColumn6 ){
                    function ellipsis( inString ) {
                        if ( inString ) {
                            if (inString.length > 100) {
                                return inString.substr(0, 0) + '...' + inString.substr(inString.length - 100, inString.length);
                            }
                            return inString;
                        } else {
                            return '-'
                        }
                    }
                    var item;
                    
                    if (inColumn1.length > 0) {
                        for (var i = 0; i < inColumn1.length; i++) {
                            item = listItem.add('item', inColumn1[i]);
                            item.image = FrameWindow_File;
                            
                            if ( inNumColumns >= 2 ) { item.subItems[0].text = ellipsis( inColumn2[i] ) };
                            if ( inNumColumns >= 3 ) { item.subItems[1].text = ellipsis( inColumn3[i] ) };
                            if ( inNumColumns >= 4 ) { item.subItems[2].text = ellipsis( inColumn4[i] ) };
                            if ( inNumColumns >= 5 ) { item.subItems[3].text = ellipsis( inColumn5[i] ) };
                            if ( inNumColumns >= 6 ) { item.subItems[4].text = ellipsis( inColumn6[i] ) };

                            if (inColumn2[i] === 'Invalid destination folder selected.' ) { break }
                        }
                    } else {
                        item = listItem.add('item', 'No render files found.');
                        //item.image = FrameWindow_File;
                        item.enabled = false;
                        if ( inNumColumns >= 2 ) { item.subItems[0].text = '-' };
                    }
                    palette.layout.layout(true);
                    palette.layout.resize();
                }
                this.clear = function () {
                    var item = '';
                    for (var i = listItem.items.length-1; i > -1; i--) {
                        listItem.remove( listItem.items[i] );
                    }
                }
            }
        }
        //cls.prototype
        {
            cls.prototype = {
                clear: function () {
                    var item = '';
                    for (var i = listItem.items.length-1; i > -1; i--) {
                        listItem.remove( listItem.items[i] );
                    }
                },
                setlist: function ( inColumn1,inColumn2,inColumn3, inColumn4, inColumn5, inColumn6 ){
                    function ellipsis( inString ) {
                        if ( inString ) {
                            if (inString.length > 100) {
                                return inString.substr(0, 0) + '...' + inString.substr(inString.length - 100, inString.length);
                            }
                            return inString;
                        } else {
                            return ''
                        }
                    }
                    if (inColumn1.length > 0) {
                        var item = '';
                        for (var i = 0; i < inColumn1.length; i++) {
                            item = listItem.add('item', inColumn1[i]);
                            if ( inNumColumns >= 2 ) { item.subItems[0].text = ellipsis( inColumn2[i] ) };
                            if ( inNumColumns >= 3 ) { item.subItems[1].text = ellipsis( inColumn3[i] ) };
                            if ( inNumColumns >= 4 ) { item.subItems[2].text = ellipsis( inColumn4[i] ) };
                            if ( inNumColumns >= 5 ) { item.subItems[3].text = ellipsis( inColumn5[i] ) };
                            if ( inNumColumns >= 6 ) { item.subItems[4].text = ellipsis( inColumn6[i] ) };

                            if (inColumn2[i] === 'Invalid destination folder selected.' ) { break }
                        }
                    } else {
                        var ln1 = listItem.add('item', '-');
                        ln1.subItems[0].text = '-';
                    }
                    palette.layout.layout(true);
                    palette.layout.resize();
                }
            }
        }
  
        //Event Functions
        {
            function button_cancel_onClick() {
                palette.hide();
                cls.clear()
            };
            function deleteButton_onClick()  {
                if ( listItem.selection ) {
                    
                    var indexes = listItem.selection,
                        file = new File ('/c/temp01234.tmp'),
                        fsPath, result = false, changePath;
                    
                    var choice = confirm( 'Are you sure you want to delete the selected files?\n\nThis cannot be undone.', true, 'Confirm Delete' ) 
                    
                    if (choice) {
                        for (var i = 0; i < indexes.length; i++) {
                            fsPath = collect.item( itemIndex ).exists.fsNames[ indexes[i].index ]
                            
                            // Ugly workaround for the async file.changePath
                            while ( !file.changePath( fsPath )) {
                                indexes[i].text = 'Updating...'
                            }
                            
                            if ( file.exists ){
                                result = file.remove();
                                if ( result ) {
                                    indexes[i].enabled = false;
                                    indexes[i].text = 'Deleted.'
                                }
                            }
                        }
                    }
                } else {
                    alert ('Select an item from the list below before continuing.')
                }
            };
            function browseButton_onClick()  {
                collect.item( itemIndex ).file.parent.execute();
            };
            function refreshButton_onClick() {
                
                collect = new Collect;
                
                var currentSelection = listWindow.getSelection();
                listWindow.setlist( collect.compnames, collect.filenames, collect.rendered.frames, collect.missing.frames, collect.incomplete.frames, collect.rendered.sizes );
                listWindow.setSelection( currentSelection );
                
                cls.clear();
                cls.setlist( collect.item( itemIndex ).exists.names, collect.item( itemIndex ).exists.dates, collect.item( itemIndex ).exists.sizes );
                settings.setbasepath();
                
            };
        }
        //UI
        {
            var elemSize = 20;
            // Header bar
            {
                var controlsGroup = palette.add('group',undefined,{
                    name: 'headerGroup',
                    orientation: 'row',
                    spacing: 10
                });
                
                var deleteButton = controlsGroup.add('iconbutton',undefined,redbinPNG,{
                    name: 'deleteButton'
                });
                    deleteButton.size = [elemSize*1.5,elemSize];
                    deleteButton.onClick = deleteButton_onClick;
                                
                var sep = controlsGroup.add('iconbutton',undefined, ListWindow_Sep,{
                    style: 'toolbutton'
                });
                    sep.enabled = false;
                    sep.size = [1,elemSize];
                
                var browseButton = controlsGroup.add('iconbutton',undefined, ListWindow_RevealIcon, {
                    name: 'browseButton',
                    style: 'toolbutton'
                });
                    browseButton.onClick = browseButton_onClick;
                    browseButton.size = [elemSize,elemSize];
                
                var refreshButton = controlsGroup.add('iconbutton',undefined, ListWindow_RefreshIcon,{
                    name: 'refreshButton',
                    style: 'toolbutton'
                });
                    refreshButton.onClick = refreshButton_onClick;
                    refreshButton.size = [elemSize,elemSize];
            }
            // List
            {
                var listGroup = palette.add('group', undefined, {
                    name: 'listGroup',
                    orientation: 'row',
                    spacing: 10,
                    margins: 10
                });
                var listItem = listGroup.add('listbox',undefined, '', {
                    spacing: 0,
                    margins: 0,
                    name: 'listItem',
                    multiselect: true,
                    numberOfColumns: inNumColumns,
                    showHeaders: true,
                    columnTitles: columnTitles,
                    columnWidths: columnWidths
                });
                listItem.onDoubleClick = function () { app.project.renderQueue.showWindow( true ) }
            }
            // Footer
            {
                var footerGroup = palette.add('group',undefined,{
                    alignChildren: ['left','top'],
                    orientation: 'row',
                    spacing: 0,
                    margins: 0
                });
                var button_cancel = footerGroup.add('button',undefined,'Close',{
                    name: 'button_cancel'
                });
                    button_cancel.onClick = button_cancel_onClick;
            }
        }
   
    return cls
    }(thisObj, 'Render Items', 3, ['Name','Date','Size'], [300,130,86]));
    var framesWindow = new FrameWindow;

    var Directory = ( function ( inPath ) {
        
        /*

        Directory Object
        ----------------

        Represents the name, last modified time, date and size of windows file system objects as provided by windows's 'dir' command.
        Constructor template via http://stackoverflow.com/questions/1114024/constructors-in-javascript-objects


        Usage

        var directory = new Directory( ExtendScript Folder Object );
        var files = directory.files();
        var folders = directory.folders();
        var itemsize = files.item( index ).size;


        Object Methods

        All methods return an array of stat objects or an array of 1 item if File or Path is invalid.

        Directory.files()           --- Returns array of Stat Objects of visible files.        
        Directory.folders()         --- Returns folders only.
        Directory.hidden()          --- Returns all hidden items.
        Directory.hiddenFiles()     --- Returns idden files only.
        Directory.hiddenFolders()   --- Hidden folders only.


        Properties

        Method().names              --- Array of all item names.  
        Method().times              --- Array of all items' last modified time.    
        Method().dates              --- Array of all items' last modified date.    
        Method().sizes              --- Array of all item  items' last modified time.
        Method().items              --- Array of stat objects.  
        Method().item(index)        --- Get stat object by index.  
        Method().count              --- Number of items found.

        Method().item(0).name       --- Filename
        Method().item(0).size       --- Filesize in bytes. Folders return '<dir>'
        Method().item(0).date       --- Date of last modified
        Method().item(0).time       --- Time of last modified

        */

        // private static
        var nextId = 1;
        
        //Extensions
        Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(a){"use strict";if(void 0===this||null===this)throw new TypeError;var b,c,d=Object(this),e=d.length>>>0;if(0===e)return-1;for(b=e-1,arguments.length>1&&(b=Number(arguments[1]),b!=b?b=0:0!=b&&b!=1/0&&b!=-(1/0)&&(b=(b>0||-1)*Math.floor(Math.abs(b)))),c=b>=0?Math.min(b,e-1):e-Math.abs(b);c>=0;c--)if(c in d&&d[c]===a)return c;return-1});
        
        // constructor
        var cls = function ( inPath ) {
            // private
            var id = nextId++;
            var pathFile = new File ( inPath );

            // public (this instance only)
            this.getID = function () { return id; };
            this.changePath = function ( inPath ) {
                pathFile.changePath( inPath );
            }
            this.all = function () {
                var args;
                if (File.fs === 'Macintosh') {
                    args = '*';
                }
                if (File.fs === 'Windows') {
                    args = '/o:n';                
                }
                return this.callSystem( pathFile.fsName, args )
            };
            this.files = function ( mask ) {
                var args;
                if (File.fs === 'Macintosh') {
                    args = '*.*';
                    if (mask) {
                        return this.callSystem( pathFile.fsName, mask )
                    } else {
                        return this.callSystem( pathFile.fsName, args )
                    }
                }
            
                if (File.fs === 'Windows') {
                    args = '/o:n /a:-d-h';
                    if (mask) {
                        return this.callSystem( pathFile.fsName + '\\' + mask, args )
                    } else {
                        return this.callSystem( pathFile.fsName, args )
                    }
                }
            };
            this.folders = function () {
                var args;
                if (File.fs === 'Macintosh') {
                    args = '*/';
                }
                if (File.fs === 'Windows') {
                    args = '/o:n /a:d-h';                
                }
                return this.callSystem( pathFile.fsName, args );
            };
            this.hiddenFiles = function () {
                if (File.fs === 'Macintosh') {
                    
                }
                if (File.fs === 'Macintosh') {
                    args = '/o:n /a:h-d';
                }
                
                return this.callSystem( pathFile.fsName, args );
            };
            this.hiddenFolders = function () {
                var args = '/o:n /a:hd';
                return this.callSystem( pathFile.fsName, args );
            }
            this.hidden = function () {
                var args = '/o:n /a:h';
                return this.callSystem( pathFile.fsName, args );
            }
        };

        // public static
        cls.get_nextId = function () {
            return nextId;
        };

        // public (shared across instances)
        cls.prototype = {
            callSystem: function ( inPath, args ) {
                
                /* A helper function to extend the return of callSystem with addittional stats and methods. */
                var returnObject = function ( inArr ) {
                    var returnObj = {};
                        returnObj.items = inArr;
                        returnObj.item = function ( index ) {
                            return inArr[ index ] };
                        returnObj.count = inArr.length;
                        returnObj.names = (function ()
                        {
                            var returnArr = [];
                            for (var i = 0; i < inArr.length; i++ ){
                                returnArr.push( inArr[i].name );
                            }
                            return returnArr
                        })();
                        returnObj.dates = (function ()
                        {
                            var returnArr = [];
                            for (var i = 0; i < inArr.length; i++ ){
                                returnArr.push( inArr[i].date );
                            }
                            return returnArr
                        })();
                        returnObj.times = (function ()
                        {
                            var returnArr = [];
                            for (var i = 0; i < inArr.length; i++ ){
                                returnArr.push( inArr[i].time );
                            }
                            return returnArr
                        })();
                        returnObj.sizes = (function ()
                        {
                            var returnArr = [];
                            for (var i = 0; i < inArr.length; i++ ){
                                returnArr.push( inArr[i].size );
                            }
                            return returnArr
                        })();
                    return returnObj                            
                } // extend return
                
                var cmd, stat = {}, stats = [], splitln, lines, invalidFile, noPath, noFile1, noFile2;
                
                if (File.fs === 'Macintosh') {
                    cmd = 'ls -odpH ' + ' -- ' + inPath.replace(/\s/g,'\\ ') + '/' + args;
                    try { var raw = system.callSystem( cmd.replace(/\/\//g,'/') ); } catch (e){ var raw = 'Error whilst calling the system.'; return null }
                    try {
                        
                        noPath = raw.indexOf('No such file or directory');
                        
                        if ( noPath < 0 ) {
                            var lines = raw.split('\n');
                            stats=[];
                            for (var i = 0; i < ( lines.length - 1 ); i++) {
                                splitLn = lines[i].split(/^((?:\S+\s+){4})/g);
                                splitLn2 = splitLn[2].split(/^((?:\S+\s+){3})/g)[2]
                                stat = {    
                                    date: splitLn[2].split(/^((?:\S+\s+){3})/g)[1],
                                    time: '',
                                    size: parseInt( lines[i].split(/^((?:\S+\s+){3})/g)[2].split(/^((?:\S+\s+){1})/g)[1], 10),
                                    name: (function(){
                                        var namestring = splitLn2.replace(/\/\//g, '/');
                                        if ( namestring[namestring.length-1] == '/' ) {
                                            $.writeln( namestring.slice(0,-1).slice( namestring.slice(0,-1).lastIndexOf('/') + 1) )
                                            return namestring.slice(0,-1).slice( namestring.slice(0,-1).lastIndexOf('/') + 1);
                                        } else {
                                            return namestring.slice( namestring.lastIndexOf('/') + 1)
                                        }
                                    }())
                                
                                }
                                stats.push( stat );
                            }
                            
                            return returnObject( stats )
                        }
                        if ( noPath >= 0 ) {
                            stat = {
                                    date: 'n/a',
                                    time: 'n/a',
                                    size: 'n/a',
                                    name: 'The system cannot find the file specified.',
                                    raw: raw
                            }
                            stats = [];
                            stats.push( stat );
                            return returnObject( stats )
                        }
                    } catch(e) {
                        stat = {
                            date: 'n/a',
                            time: 'n/a',
                            size: 'n/a',
                            name: 'Error.',
                            raw: raw
                        }
                        stats = [];
                        stats.push( stat );
                        return returnObject( stats )
                    }
                } // End of Macintosh
            
                if (File.fs === 'Windows') {             
                    cmd = 'cmd /c "' + 'dir ' + '\"' + inPath + '\"' + ' ' + args + '"';
                    try { var raw = system.callSystem( cmd ); } catch (e){ var raw = 'Error whilst calling the system.'; return null };
                    try {   
                        invalidFile = raw.indexOf('File Not Found');
                        noPath = raw.indexOf('The system cannot find the file specified.');
                        noFile1 = raw.indexOf('The system cannot find the path specified.');
                        noFile2 = raw.indexOf('File Not Found');

                        if ( ( noPath < 0 ) && ( noFile1 < 0 ) && ( noFile2 < 0 ) ) {
                            lines = raw.split('\n').slice(5).slice(0,-3);
                            stats = [];
                            for (var i = 0; i < lines.length; i++) {
                                splitLn = lines[i].split(/^((?:\S+\s+){3})/g);
                                stat = {    
                                    date: splitLn[1].split(/\s+/g)[0].replace(/\r|\n/g,''),
                                    time: splitLn[1].split(/\s+/g)[1].replace(/\r|\n/g,''),
                                    size: parseInt( splitLn[1].split(/\s+/g)[2].replace(/\r|\n/g,'').replace(/\,/gi,''), 10 ),
                                    name: splitLn[2].replace(/\r|\n/g,'')
                                }
                                stats.push( stat );
                            }
                            return returnObject( stats )
                        }
                        // Return when dir cannot find the file but the path is valid.
                        if ( noFile1 >= 0 || noFile2 >= 0 ) {

                            stat = {
                                    date: 'n/a',
                                    time: 'n/a',
                                    size: 0,
                                    name: 'The system cannot find the file specified.',
                                    raw: raw
                            }
                            stats = [];
                            stats.push( stat );
                            return returnObject( stats )
                        }
                        // Return when dir cannot find the path specified.
                        if ( noPath >= 0 ) {
                            stat = {
                                    date: 'n/a',
                                    time: 'n/a',
                                    size: 0,
                                    name: 'The system cannot find the path specified.',
                                    raw: raw
                            }
                            stats = [];
                            stats.push( stat );
                            return returnObject( stats )
                        }
                    } catch (e) {
                        stat = {
                            date: 'n/a',
                            time: 'n/a',
                            size: 'n/a',
                            name: 'Error.',
                            raw: raw
                        }
                        stats = [];
                        stats.push( stat );
                        return returnObject( stats )
                    }
                }//windows
            } // callSystem
        }; // prototype
        return cls;
    }());
    var Collect = ( function () {
        
        /*
        
        Collect Object:
        
        Usage:
        var collect = new Collect;
        var items = collect.items;
        
        
        This Collection Will return these properties:
        
        collect.items               -- All items returned by this collector.
        collect.item(index)         -- Return an item from the collection (zero based index).
        
        collect.files               -- Array of Output Module File Objects.
        collect.compnames           -- Array of Render Queue item comp names.
        collect.sequencenames       -- Array of Render Queue item sequence names: 'filename_[from-to].extension'
        collect.filenames           -- Array of platform specific Output Module Filenames.
        collect.durations           -- Array of the durations of the existing Render Queue items.
        
        collect.rendered.frames     -- Array of the number of rendered frames of each out.
        collect.rendered.names      --
        collect.rendered.fsNames    --
        collect.rendered.sizes       -- Size of the rendered sequence ( bytes )
        collect.rendered.counts     --
        
        collect.missing.frames      -- All results collected into one array.
        collect.missing.names       --
        collect.missing.fsNames     --
        collect.missing.counts      --
        
        collect.incomplete.frames   --
        collect.incomplete.names    --
        collect.incomplete.fsNames  --
        collect.incomplete.counts   --
        collect.incomplete          --
        
        
        Item Properties
        
        item.comp               -- CompItem of the RenderQueue Item.
        item.compname           -- CompItem name.
        item.file               -- File Object of the output module.
        item.filename           -- Platform specific path.
        item.sequencename       -- Filename to display with sequence range included.
        item.ext                -- Extension of the output module file.
        item.padding            -- Number of padding of the sequence item.
        item.startframe         -- Start frame.
        item.endframe           -- End frame.
        item.duration           -- Duration.
        item.status             -- Status string
        
        item.rendered.frames    -- String representing the rendered frames: 0,1,2-10,55-65.
        item.rendered.names     -- Array of filenames.
        item.rendered.fsNames   -- Array of full paths.
        item.rendered.size      -- Array of full paths.
        item.rendered.count     -- Number of rendered frame. 
        
        item.missing.frames     -- String representing the rendered frames: 0,1,2-10,55-65.
        item.missing.names      -- Array of filenames.
        item.missing.fsNames    -- Array of full paths.
        item.missing.count      -- Number of rendered frame.   
        
        item.incomplete.frames  -- String representing the rendered frames: 0,1,2-10,55-65.
        item.incomplete.names   -- Array of filenames.
        item.incomplete.fsNames -- Array of full paths.
        item.incomplete.count   -- Number of rendered frame.
        
        */
        
        var nextId = 1;
        
        //Globals
        {
            var om = {};
            var items;
        }
        
        //Extensions
        {
            function getPadding(n){var e=decodeURI(n).match(/\[#\]|\[##\]|\[###\]|\[####\]|\[#####\]|\[######\]/g);return e?e[0].length-2:null}
            function pad(a,b){for(var c=a+"";c.length<b;)c="0"+c;return c}
            //http://stackoverflow.com/questions/2270910/how-to-convert-sequence-of-numbers-in-an-array-to-range-of-numbers:
            function getRanges(c){if(c.length==0){return ['-']}for(var b=[],a,d=0;d<c.length;)b.push((a=c[d])+(function(b){for(;++a===c[++d];);return--‌​a===b}(a)?"":"-"+a));return b}
            //http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
            function formatBytes(a,b){if(0==a)return"0 Byte";var c=1024,d=b+1||3,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return(a/Math.pow(c,f)).toPrecision(d)+" "+e[f]}         
            //Array.indexOf Polyfill - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
            Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){var c;if(null==this)throw new TypeError('"this" is null or not defined');var d=Object(this),e=d.length>>>0;if(0===e)return-1;var f=+b||0;if(Math.abs(f)===1/0&&(f=0),f>=e)return-1;for(c=Math.max(f>=0?f:e-Math.abs(f),0);e>c;){if(c in d&&d[c]===a)return c;c++}return-1});
        }
        
        //Constructor
        var cls = function (){
            
            var id = nextId++;
            
            //main
            this.items = (function() {
                var rqItem, omItem, parent = null, objs = [];
                //Collect Info
                for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
                    for (var j = 1; j <= app.project.renderQueue.item(i).numOutputModules; j++) {
                        omItem = app.project.renderQueue.item(i).outputModule(j);
                        rqItem = app.project.renderQueue.item(i); 
                        
                        // Obj Definition
                        {
                            obj = {};
                            obj.rqItem = rqItem;
                            obj.omItem = omItem;
                            obj.comp = rqItem.comp;
                            obj.compname = rqItem.comp.name;
                            obj.rqindex = i;
                            obj.file = ( function () {
                                if ( omItem.file ) {
                                    return  omItem.file
                                } else {
                                    return null
                                }
                            })();
                            obj.filename = (function () {
                                if ( omItem.file ) {
                                    return sep + decodeURI (  omItem.file.parent.name ) + sep + decodeURI ( omItem.file.name )
                                } else {
                                    var string = 'File not yet specified.'
                                    return  string
                                }
                            })();

                            obj.sequencename = null;
                            obj.ext = null;
                            obj.padding = null;
                            obj.startframe = null;
                            obj.endframe = null;
                            obj.duration = null;

                            obj.status = false;

                            obj.exists = {
                                frames: null,
                                names: null,
                                fsNames: null,
                                size: null,
                                sizes: null,
                                dates: null,
                                count: null
                            };
                            obj.rendered = {
                                frames: null,
                                names: null,
                                fsNames: null,
                                size: null,
                                sizes: null,
                                dates: null,
                                count: null
                            };
                            obj.missing = {
                                frames: null,
                                names: null,
                                fsNames: null,
                                size: null,
                                sizes: null,
                                dates: null,
                                count: null
                            };
                            obj.incomplete = {
                                frames: null,
                                names: null,
                                fsName: null,
                                size: null,
                                sizes: null,
                                dates: null,
                                count: null
                            };
                        }
                        // Set Obj Properties
                        obj.set = (function () {

                            var oneframe = rqItem.comp.frameDuration;    
                            obj.startframe = Math.round((rqItem.timeSpanStart / oneframe) + (rqItem.comp.displayStartTime / oneframe)),
                            obj.endframe = Math.round((rqItem.timeSpanStart + rqItem.timeSpanDuration) /  oneframe) + (rqItem.comp.displayStartTime / oneframe) - 1,
                            obj.duration = obj.endframe - obj.startframe + 1; 

                            var stat, count;
                            
                            if ( omItem.file ){
                                obj.padding = getPadding( omItem.file.name );
                                obj.ext = omItem.file.name.slice(-3);
                                if( !obj.padding ) {
                                    obj.sequencename = decodeURI( decodeURI(omItem.file.name)) + ' ' + '[' + pad(obj.startframe, obj.padding) + '-' + pad(obj.endframe, obj.padding) + ']';
                                } else {
                                    obj.sequencename = decodeURI( decodeURI(omItem.file.name).slice(0, ((obj.padding + 2 + 4) * (-1)) )) + '[' + pad(obj.startframe, obj.padding) + '-' + pad(obj.endframe, obj.padding) + ']' + '.' + obj.ext;
                                }

                                var stat = new Directory ( omItem.file.parent );
                                var files;
                                
                                if ( obj.padding > 0 ) {
                                    files = stat.files( '*' + obj.ext );
                                } else {
                                    files = stat.files( omItem.file.displayName );
                                }
                                
                                var set = (function () {
                                    var frame, name, names, dates, times, fsName, index,
                                        notmissingNames = [], notmissingFrames = [], notmissingfsNames = [], notmissingSizes = [], notmissingDates = [],
                                        existsNames = [], existsFrames = [], existsfsNames = [], existsSizes = [], existsDates = [],
                                        missingNames = [], missingFrames = [], missingfsNames = [],
                                        partialNames = [], partialFrames = [], partialfsNames = [], partialSizes = [], partialDates = [],
                                        size = 0;
                                    
                                    if ( !(( files.item(0).name === 'The system cannot find the path specified.') )) {
                                        
                                        names = files.names;
                                        dates = files.dates;
                                        times = files.times;
                                        
                                        if ( obj.padding > 0) {
                                            //SEQUENCE
                                            for (var i = 0; i < parseInt( obj.duration, 10 ); i++ ) {
                                                frame = pad(obj.startframe + i, obj.padding);
                                                name = decodeURI(omItem.file.name).slice(0, (obj.padding + 2 + 4) * (-1) ) + frame + '.' + obj.ext;
                                                index = names.indexOf( name );
                                                fsName = omItem.file.parent.fsName + sep + name;
                                                if ( index >= 0) {
                                                        notmissingNames.push( name );
                                                        notmissingFrames.push( parseInt(frame, 10) );
                                                        notmissingfsNames.push( fsName );
                                                        notmissingSizes.push( formatBytes( files.item( index ).size, 2) );
                                                        notmissingDates.push( files.item( index ).date + ' ' + files.item( index ).time );
                                                    if ( files.sizes[ index ] > 50 ) {
                                                        existsNames.push( name );
                                                        existsFrames.push( parseInt(frame, 10) );
                                                        existsfsNames.push( fsName );
                                                        existsSizes.push( formatBytes( files.item( index ).size, 2) );
                                                        existsDates.push( files.item( index ).date + ' ' + files.item( index ).time );
                                                        size += files.item( index ).size ;
                                                    } else {
                                                        partialNames.push( name );
                                                        partialFrames.push( parseInt(frame, 10) );
                                                        partialfsNames.push( fsName );
                                                        partialSizes.push( formatBytes( files.item( index ).size, 2) );
                                                        partialDates.push( files.item( index ).date + ' ' + files.item( index ).time );
                                                    }
                                                }
                                                if ( index == -1 ) {
                                                    missingNames.push( name );
                                                    missingFrames.push( parseInt(frame, 10) );
                                                    missingfsNames.push( fsName );
                                                }
                                            } // end of loop
                                            obj.exists = {
                                                frames: getRanges( notmissingFrames ),
                                                names: notmissingNames,
                                                fsNames: notmissingfsNames,
                                                size: formatBytes(size,2),
                                                sizes: notmissingSizes,
                                                dates: notmissingDates,
                                                count: notmissingFrames.length
                                            };
                                            obj.rendered = {
                                                frames: getRanges( existsFrames ),
                                                names: existsNames,
                                                fsNames: existsfsNames,
                                                size: formatBytes(size,2),
                                                sizes: existsSizes,
                                                dates: existsDates,
                                                count: existsNames.length
                                            };
                                            
                                            obj.missing = {
                                                frames: getRanges( missingFrames ),
                                                names: missingNames,
                                                fsNames: missingfsNames,
                                                size: 0,
                                                sizes: [],
                                                dates: [],
                                                count: missingNames.length
                                            };
                                            obj.incomplete = {
                                                frames: getRanges( partialFrames ),
                                                names: partialNames,
                                                fsName: partialfsNames,
                                                size: 0,
                                                sizes: partialSizes,
                                                dates: partialDates,
                                                count: partialNames.length
                                            };
                                        //NON SEQUENCE ITEMS
                                        } else {
                                            frame = 1;
                                            name = decodeURI(omItem.file.name);
                                            index = names.indexOf( name );
                                            fsName = omItem.file.parent.fsName + sep + name;

                                            if ( index >= 0) {
                                                    notmissingNames.push( name );
                                                    notmissingFrames.push( parseInt(frame, 10) );
                                                    notmissingfsNames.push( fsName );
                                                    notmissingSizes.push( formatBytes( files.item( index ).size, 2) );
                                                    notmissingDates.push( files.item( index ).date + ' ' + files.item( index ).time );
                                                if ( files.sizes[ index ] > 50 ) {
                                                    existsNames.push( name );
                                                    existsFrames.push( parseInt(frame, 10) );
                                                    existsfsNames.push( fsName );
                                                    existsSizes.push( formatBytes( files.item( index ).size, 2) );
                                                    existsDates.push( files.item( index ).date + ' ' + files.item( index ).time );
                                                    size += files.item( index ).size ;
                                                } else {
                                                    partialNames.push( name );
                                                    partialFrames.push( parseInt(frame, 10) );
                                                    partialfsNames.push( fsName );
                                                    partialSizes.push( formatBytes( files.item( index ).size, 2) );
                                                    partialDates.push( files.item( index ).date + ' ' + files.item( index ).time );
                                                }
                                            }
                                            if ( index == -1 ) {
                                                missingNames.push( name );
                                                missingFrames.push( parseInt(frame, 10) );
                                                missingfsNames.push( fsName );
                                            }
                                            
                                            obj.exists = {
                                                frames: 1,
                                                names: [files.items[0].name],
                                                fsNames: notmissingfsNames,
                                                size: formatBytes(size,2),
                                                sizes: notmissingSizes,
                                                dates: notmissingDates,
                                                count: notmissingFrames.length
                                            };
                                            obj.rendered = {
                                                frames: getRanges( existsFrames ),
                                                names: existsNames,
                                                fsNames: existsfsNames,
                                                size: formatBytes(size,2),
                                                sizes: existsSizes,
                                                dates: existsDates,
                                                count: existsNames.length
                                            };
                                            obj.missing = {
                                                frames: getRanges( missingFrames ),
                                                names: missingNames,
                                                fsNames: missingfsNames,
                                                size: 0,
                                                sizes: [],
                                                dates: [],
                                                count: missingNames.length
                                            };
                                            obj.incomplete = {
                                                frames: getRanges( partialFrames ),
                                                names: partialNames,
                                                fsName: partialfsNames,
                                                size: 0,
                                                sizes: partialSizes,
                                                dates: partialDates,
                                                count: partialNames.length
                                            };
                                        }
                                    } else {
                                        obj.exists = {
                                            frames: '-',
                                            names: [],
                                            fsNames: [],
                                            size: formatBytes(0,2),
                                            sizes: [formatBytes(0,2)],
                                            dates: [],
                                            count: 0
                                        };
                                        obj.rendered = {
                                            frames: '-',
                                            names: [],
                                            fsNames: [],
                                            size: formatBytes(0,2),
                                            sizes: [formatBytes(0,2)],
                                            dates: [],
                                            count: 0
                                        };
                                        obj.missing = {
                                            frames: '-',
                                            names: [],
                                            fsNames: [],
                                            size: formatBytes(0,2),
                                            sizes: [formatBytes(0,2)],
                                            dates: [],
                                            count: 0
                                        };
                                        obj.incomplete = {
                                            frames: '-',
                                            names: [],
                                            fsNames: [],
                                            size: formatBytes(0,2),
                                            sizes: [formatBytes(0,2)],
                                            dates: [],
                                            count: 0
                                        }
                                    }
                                })();
                            } else {
                                obj.sequencename = 'File not yet specified.';
                                obj.ext = null;
                                obj.padding = null;
                                
                                obj.exists = {
                                    frames: '-',
                                    names: ['No files rendered.'],
                                    fsNames: [],
                                    size: formatBytes(0,2),
                                    sizes: [],
                                    dates: [],
                                    count: 0
                                };
                                obj.rendered = {
                                    frames: '-',
                                    names: ['No files rendered.'],
                                    fsNames: [],
                                    size: formatBytes(0,2),
                                    sizes: [],
                                    dates: [],
                                    count: 0
                                };
                                obj.missing = {
                                    frames: '-',
                                    names: ['No files rendered.'],
                                    fsNames: [],
                                    size: formatBytes(0,2),
                                    sizes: [],
                                    dates: [],
                                    count: 0
                                };
                                obj.incomplete = {
                                    frames: '-',
                                    names: ['No files rendered.'],
                                    fsNames: [],
                                    size: formatBytes(0,2),
                                    sizes: [],
                                    dates: [],
                                    count: 0
                                };
                            }
                        })();
                        //PUSH IT PUSH PUSH IT REAL HARD
                        objs.push( obj );
                    }
                }
                items = objs;
                return objs
            }());
            //..
            this.item = function ( index ) {
                return items[ index ]
            }
            this.files = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = []
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        arr.push( items[i].file );
                    }
                    return arr
                }
            }());
            this.rqItems = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = []
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        arr.push( items[i].rqItem );
                    }
                    return arr
                }
            }());
            this.omItems = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = []
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        arr.push( items[i].omItem );
                    }
                    return arr
                }
            }());
            this.compnames = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = ['No active output modules found.']
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        arr.push( items[i].compname );
                    }
                    return arr
                }
            }());
            this.rqindexes = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = []
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        arr.push( items[i].rqindex );
                    }
                    return arr
                }
            }());
            this.sequencenames = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = ['No active output modules found.']
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        arr.push( items[i].sequencename );
                    }
                    return arr
                }
            }());
            this.filenames = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = ['No active output modules found.']
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].file) {
                            arr.push( decodeURI( items[i].file.parent.name ) + sep + items[i].sequencename );
                        } else {
                            arr.push( 'No output file has been set for this module.' );  
                        }
                    }
                    return arr
                }
            }());
            this.durations = (function() {
                var arr = [];
                if ( items.length === 0 ) {
                    arr = ['No active output modules found.']
                    return arr
                } else {
                    for (var i = 0; i < items.length; i++) {
                        arr.push( items[i].duration );
                    }
                    return arr
                }
            }());
            this.rendered = (function() {
                var returnObj = {
                    frames: [], names: [], fsNames: [], sizes: [], counts: []
                }
                
                if ( items.length === 0 ) {
                    return returnObj
                } else {
                    for (var i = 0; i < items.length; i++) {
                        returnObj.frames.push( items[i].rendered.frames );
                        returnObj.names.push( items[i].rendered.names );
                        returnObj.fsNames.push( items[i].rendered.fsNames );
                        returnObj.sizes.push( items[i].rendered.size );
                        returnObj.counts.push( items[i].rendered.count );
                    }                    
                    return returnObj
                }
            }());
            this.missing = (function() {
                var returnObj = {
                    frames: [],
                    names: [],
                    fsNames: [],
                    counts: []
                }
                var frames = [], names = [], fsNames = [], counts = [];
                if ( items.length === 0 ) {
                    return returnObj
                } else {
                    for (var i = 0; i < items.length; i++) {
                        frames.push( items[i].missing.frames );
                        names.push( items[i].missing.names );
                        fsNames.push( items[i].missing.fsNames );
                        counts.push( items[i].missing.count );
                    }
                    returnObj.frames = frames;
                    returnObj.names = names;
                    returnObj.fsNames = fsNames;
                    returnObj.counts = counts;
                    
                    return returnObj
                }
            }());
            this.incomplete = (function() {
                var returnObj = {
                    frames: [],
                    names: [],
                    fsNames: [],
                    counts: []
                }
                var frames = [], names = [], fsNames = [], counts = [];
                if ( items.length === 0 ) {
                    return returnObj
                } else {
                    for (var i = 0; i < items.length; i++) {
                        frames.push( items[i].incomplete.frames );
                        names.push( items[i].incomplete.names );
                        fsNames.push( items[i].incomplete.fsNames );
                        counts.push( items[i].incomplete.count );
                    }
                    returnObj.frames = frames;
                    returnObj.names = names;
                    returnObj.fsNames = fsNames;
                    returnObj.counts = counts;
                    
                    return returnObj
                }
            }());
            this.exists = (function() {
                var returnObj = {
                    frames: [],
                    names: [],
                    fsNames: [],
                    counts: []
                }
                var frames = [], names = [], fsNames = [], counts = [];
                if ( items.length === 0 ) {
                    return returnObj
                } else {
                    for (var i = 0; i < items.length; i++) {
                        frames.push( items[i].exists.frames );
                        names.push( items[i].exists.names );
                        fsNames.push( items[i].exists.fsNames );
                        counts.push( items[i].exists.count );
                    }
                    returnObj.frames = frames;
                    returnObj.names = names;
                    returnObj.fsNames = fsNames;
                    returnObj.counts = counts;
                    
                    return returnObj
                }
            }());
        }
        return cls
    }());
    var Pathcontrol = ( function ( omItem, rqItem ) {
        
        //Extensions
        function pad(a,b){for(var c=a+"";c.length<b;)c="0"+c;return c};
        function getPadding(n){var e=decodeURI(n).match(/\[#\]|\[##\]|\[###\]|\[####\]|\[#####\]|\[######\]/g);return e?e[0].length-2:null};
        
        //Properties
        {
        var props = {};
            props.extension = null;
            props.versionString = function() { return 'v' + pad( props.version, 3) };
            props.paddingString = function() {
                if ( props.padding == 0 ){ return '' };
                if ( props.padding == 1 ){ return '[#]' };
                if ( props.padding == 2 ){ return '[##]' };
                if ( props.padding == 3 ){ return '[###]' };
                if ( props.padding == 4 ){ return '[####]' };
                if ( props.padding == 5 ){ return '[#####]' };
            };
            props.version = null;
            props.padding = null;
            props.basepath = null;
            props.template = null;
            props.om = function () {
                return ({
                    'Output File Info': {
                        'Base Path': props.basepath,
                        'File Template':  props.template
                    }
                })
            };
        }

        //Methods
        var cls = function( omItem, rqItem ) {
            this.setOMItem = function( inOMItem ){
                omItem = inOMItem;
                return omItem;
            }
            this.setRQItem = function (inRQItem) {
                rqItem = inRQItem;
                return rqItem;
            }
            this.setVersion = function( inNum ){ props.version = inNum; return props.version};
            this.setPadding = function( inString ){ props.padding = inString; return props.padding };
            this.setBasepath = function( inString ){ props.basepath = inString; return props.basepath };
            
            //Get version and padding from current path        
            this.parsePath = (function() {
                var settings = omItem.getSettings( GetSettingsFormat.STRING_SETTABLE );
                var template = settings['Output File Info']['File Template'];
                var padding = getPadding( template );
                var version = getVersion ( template );

                function getVersion (inString) {
                    var match = inString.match( /(v\d\d\d)/ig );
                    if (match) { return parseInt( match[0].slice(1),10 ) } else { return null }
                }

                if (!padding) { padding = 0 }
                props.padding = padding;
                props.version = version;

                var returnObj = {}
                returnObj.padding = padding
                returnObj.version = version;
                return returnObj
            })()

            this.getVersionString = function() { return 'v' + pad( props.version, 3) };
            this.getVersion = function() { return props.version };
            this.getPaddingString = function() { return props.paddingString() };
            this.getPadding = function() { return props.padding };
            this.getBasepath = function() { return props.basepath };
            this.getVersions = function() {
                var baseFolder,
                    subFolders,
                    versionFolders = [];

                if (props.basepath) {
                    baseFolder = new Folder( props.basepath );
                    if (baseFolder.exists){
                        
                        var subFolders = baseFolder.getFiles ( function ( elem ) { if (elem instanceof Folder){ return true } else { return false } });
                        for (var i = 0; i < subFolders.length; i++) {
                            if (subFolders[i].displayName.match(/v\d\d\d/gi) ) {
                                versionFolders.push ( subFolders[i] )  
                            }
                        }               
                        return versionFolders
                    } else {
                        return versionFolders
                    }
                } else {
                    return versionFolders
                }
            }
            this.getOM = function() { return props.om() };
            this.getOMItem = function() { return omItem };
            this.getRQItem = function() { return RQItem };
            this.apply = function () {
                var foldersOK = false;
                
                if ( settings.getSetting('pathcontrol_fsName') ) {
                    var rendersBase = new Folder ( settings.getSetting('pathcontrol_fsName') );
                    var compBase = new Folder ( pathcontrol.getBasepath() );
                    try { rendersBase.create(); compBase.create(); foldersOK = true; } catch (e) { foldersOK = false; alert('Sorry, Unable to create folders:\n\n\n'+e,'Version Control: Error') }
                } else {
                    alert('The output base path has not been set.\nCheck the panel preferences if you have a valid pattern set.\n\nNote: You can still set the destination manually in the Render Queue.','No basepath set.');
                }
                
                if ( foldersOK ) {
                    if (props.padding > 0) {
                        props.template = props.versionString() + '/' + '[compName]' + '_' + props.versionString() + '_' + props.paddingString() + '.[fileExtension]';
                    }
                    if (props.padding == 0) {                        
                        props.template = props.versionString() + '/' + '[compName]' + '_' + props.versionString() + '.[fileExtension]';
                    }
                }

                //Queued or Unqueued
                try {
                   var set = omItem.setSettings( props.om() ); 
                } catch(e) {
                    alert( 'Sorry, unable to set output module path.\n\nMake sure the module is queued and ready to render in the Render Queue.','Invalid Render Queue Item Status.')
                }
            }
        };
        return cls
    }());
    var ListWindow = ( function ( thisObj, inTitle, inNumColumns, columnTitles, columnWidths ) {
        //cls - Public
        var cls = function() {
            this.setSelection = function ( index ) {
                return cls.prototype.setSelection( index );
            };
            this.getSelection = function () {
                return cls.prototype.getSelection();
            };
            this.palette = (function (){
                return palette;
            }());
            this.show = function () {
                return cls.prototype.show();
            };
            this.hide = function () {
                return cls.prototype.hide();
            };
            this.cleardropdown = function( ){
                return cls.prototype.cleardropdown();
            };
            this.setlist = function ( inColumn1,inColumn2,inColumn3,inColumn4,inColumn5,inColumn6 ){
                return cls.prototype.setlist( inColumn1,inColumn2,inColumn3,inColumn4,inColumn5,inColumn6 );
            };
            this.setdropdown = function ( inArr ){
                return cls.prototype.setdropdown( inArr );
            };
            this.disable = function (){
                return cls.prototype.disable();
            };
            this.clear = function () {
                return cls.prototype.clear();
            };
        }
        //cls.prototype - Private
        cls.prototype = {
            show: function() {
                //Context Switch
                if (palette instanceof Window){
                    listItem = palette.findElement('listItem');
                    listGroup = palette.findElement('listGroup');
                }
                
                listItem.size.width = ( function () {
                    var width = 0;
                    for (var i = 0; i < inNumColumns; i++) {
                        width += parseInt ( columnWidths[i], 10 )
                    }
                    // Extra padding to avoid scrollbar
                    return width + 66
                })();
                
                if ( listItem.size[1] > 500 ) {
                    listItem.size.height = 500;
                }
                
                //Set width and //height
                var listItemWidth = 1236;
                var margin = 15;

                if ( palette instanceof Panel ) {
                    var width = listItemWidth + ( palette.size.width - listItemWidth - margin);
                    
                    listGroup.size[0] = listItem.size[0] = listItemWidth + ( palette.size.width - listItemWidth - margin);
                    listGroup.size[1] = listItem.size[1] = palette.size[1] - 45;
                    
                    palette.layout.layout(true);
                    palette.layout.resize();
                    
                    palette.onResizing = palette.onResize = function () {
                        listGroup.size[0] = listItem.size[0] = listItemWidth + ( palette.size.width - listItemWidth - margin);
                        listGroup.size[1] = listItem.size[1] = palette.size[1] - 45;
                        palette.layout.layout(true);
                        palette.layout.resize();
                    }
                }
                
                if (!(palette instanceof Panel)) {
                    var width = listItemWidth + ( palette.size.width - listItemWidth - margin);
                    
                    palette.size.width = listItemWidth + 15;
                    palette.size.height = 45 + 350;
                    
                    listGroup.size[0] = listItem.size[0] = listItemWidth - ( margin );
                    listGroup.size[1] = listItem.size[1] = palette.size.height - 65;
                    
                    
                    palette.onResizing = palette.onResize = function () {
                        
                        listGroup.size[0] = listItem.size[0] = listItemWidth + ( palette.size.width - listItemWidth - margin - 15 );
                        listGroup.size[1] = listItem.size[1] = palette.size[1] - 65;
                    }
                    palette.show()
                };
            },
            hide: function() {
                if (!(palette instanceof Panel)) palette.hide();
            },
            clear: function() {
                var item = '';
                for (var i = listItem.items.length-1; i > -1; i--) {
                    listItem.remove( listItem.items[i] );
                }
            },
            setlist: function ( inColumn1,inColumn2,inColumn3,inColumn4,inColumn5,inColumn6 ){
                //Extensions
                function ellipsis( inString ) {
                    if ( inString ) {
                        if (inString.length > 100) {
                            return inString.substr(0, 0) + '...' + inString.substr(inString.length - 100, inString.length);
                        }
                        return inString;
                    } else {
                        return '-'
                    }
                }
                
                //Context Switch
                if (palette instanceof Window){
                    listItem = palette.findElement('listItem');
                    listGroup = palette.findElement('listGroup');
                }
                
                function statuscolor( index ){
                    if ( (collect.item( index ).rendered.count === collect.item( index ).duration) && (collect.item( index ).incomplete.count === 0) ) {
                       return greenIcon 
                    }
                    if ( (collect.item( index ).rendered.count === collect.item( index ).duration) && (collect.item( index ).incomplete.count > 0) ) {
                       return orangeIcon 
                    }
                    if ( (collect.item( index ).rendered.count < collect.item( index ).duration) && (collect.item( index ).rendered.count > 0) ) {
                        return orangeIcon;
                    }
                    if ( collect.item( index ).incomplete.count > 0 ) {
                        return orangeIcon;
                    }
                    if ( collect.item( index ).missing.count === collect.item( index ).duration ) {
                        return redIcon;
                    }
                    return grayIcon
                }
                
                if (inColumn1.length > 0 && !(inColumn1[0] === 'No active output modules found.') ) {
                    var item = '';
                    for (var i = 0; i < inColumn1.length; i++) {
                        item = listItem.add('item', inColumn1[i]);
                        item.image = statuscolor( i );
                        
                        if ( inNumColumns >= 2 ) { item.subItems[0].text = ellipsis( inColumn2[i] ) };
                        if ( inNumColumns >= 3 ) { item.subItems[1].text = ellipsis( inColumn3[i] ) };
                        if ( inNumColumns >= 4 ) { item.subItems[2].text = ellipsis( inColumn4[i] ) };
                        if ( inNumColumns >= 5 ) { item.subItems[3].text = ellipsis( inColumn5[i] ) };
                        if ( inNumColumns >= 6 ) { item.subItems[4].text = ellipsis( inColumn6[i] ) };

                        if (inColumn2[i] === 'Invalid destination folder selected.' ) { break }
                    }
                } else {
                    item = listItem.add('item', inColumn1[0]);
                    item.enabled = false;
                }
            },
            disable: function() {
                button_copy.enabled = false;
                palette.update();
                palette.layout.layout();
            },
            setdropdown: function ( inArr ){
                if (inArr.length > 0) {
                    var item;                
                    for (var i = 0; i < inArr.length; i++) {
                        if (inArr[i].displayName == ('No rendered versions found' || 'Set Version Control') ) {
                            item = versionsDropdown.add('item', inArr[i].displayName);
                            item.enabled = false;   
                        } else {
                            item = versionsDropdown.add('item', inArr[i].displayName);

                        }
                    }
                }
            },
            cleardropdown: function (){
                 versionsDropdown.removeAll();
            },
            aerender: function ( promptForFile ) {
                var saved;
                try { saved = app.project.file.exists } catch(e) { saved = false };

                if ( listItem.selection && saved ) {

                    var index = listItem.selection.index;
                    var aerenderPath = settings.getSetting( 'aerender_bin' );

                    if ( !promptForFile ) {
                        app.project.save();
                    }
                    if(pathcontrol){
                        if ( settings.getSetting('pathcontrol_fsName') ) {
                            var rendersBase = new Folder ( settings.getSetting('pathcontrol_fsName') );
                            var compBase = new Folder ( pathcontrol.getBasepath() );
                            rendersBase.create();
                            compBase.create();

                            if ( !promptForFile ) {
                                var comparchive = new Folder ( settings.getSetting('pathcontrol_fsName') + sep + '.aeparchive' + sep + collect.item( index ).compname + sep + pathcontrol.getVersionString() );
                                comparchive.create();
                                try { app.project.file.copy( comparchive.fsName + sep + collect.item( index ).compname + '_' + pathcontrol.getVersionString() + '_' + app.project.file.displayName )} catch(e) { alert(e) };
                            }
                        } else {
                            alert('The output base path has not been set.\nCheck the panel preferences if you have a valid pattern set.\n\nNote: You can still set the destination manually in the Render Queue.','No basepath set.');
                        }
                    }
                    var filename = app.project.file.displayName + '-' + collect.item( index ).compname + ".bat";
                    var bat = new File( settings.tempFolder.fullName + "/" + filename );
                    if ( promptForFile ) {
                        bat.changePath( app.project.file.parent.fullName + "/" + filename );
                        bat = bat.openDlg();
                    }

                    if ( bat ) {
                        var cmd = '"' + aerenderPath + '"' +
                                ' -project "' + app.project.file.fsName + '"' +
                                ' -rqindex ' + collect.item( index ).rqindex +
                                ' -s ' + parseInt( collect.item( index ).startframe, 10) +
                                ' -e ' + parseInt( collect.item( index ).endframe, 10) +
                                ' -sound ON -continueOnMissingFootage';
                        var start = 'start \"' + 'Rendering ' + collect.item( index ).compname + ' of ' + app.project.file.displayName+ '\" ' + cmd;

                        bat.open('w');
                        bat.write(start);
                        bat.close();
                        bat.execute();
                    }
                }
                if (!saved) {
                    alert('Project is not saved.\nYou must save it before continuing.','Project is not yet saved.')
                }
            },
            setSelection: function( index ) {
                if (palette instanceof Window) {
                    listItem = palette.findElement('listItem');
                };
                listItem.selection = index;
                return listItem.selection
            },
            getSelection: function( index ) {
                if (palette instanceof Window){
                    listItem = palette.findElement('listItem');
                }
                var s;
                try { s = listItem.selection.index } catch(e) { s = null; }
                return s;
            },
            refresh: function() {
                collect = new Collect;

                var cs = cls.prototype.getSelection();

                cls.prototype.clear();
                cls.prototype.setlist( collect.compnames, collect.filenames, collect.rendered.frames, collect.missing.frames, collect.incomplete.frames, collect.rendered.sizes );
                cls.prototype.show();
                settings.setbasepath();

                cls.prototype.setSelection( cs ); 
            }
        }
        //Window Definition
        {
            var palette = thisObj instanceof Panel ? thisObj : new Window('palette', inTitle, undefined, {
                borderless: false,
                resizeable: true,
                orientation: 'row'
            });
            palette.size = [0,0];
        }
        //Event Functions
        {
            function playButton_onClick() {
                if ( listItem.selection ) {
                    
                    var player = settings.getSetting('player');
                    var index = listItem.selection.index,
                        //RV
                        rvPath = settings.getSetting('rv_bin'),
                        rvCall = settings.getSetting('rv_call'),
                        //RVPush
                        rvUsePush = settings.getSetting('rv_usepush'),
                        rvpushPath = settings.getSetting('rvpush_bin'),
                        rvpushCall = settings.getSetting('rvpush_call'),
                        //DJV
                        djvPath = settings.getSetting('djv_bin'),
                        djvCall = settings.getSetting('djv_call'),
                        item = collect.item( index ),
                        sequencePath = item.file.fsName,
                        file = new File ( settings.tempFolder.fullName + '/_playercall.bat' ),
                        cmd;
                    
                    if (player === 'rv'){
                        if (rvPath == 'null' || rvpushPath == 'null') { alert('RV or RV Push path is not set. Check preferences.'); return false;}
                        if (item.exists.fsNames[0]){
                            if (pathcontrol.getPadding() > 0) {
                                var rvSequencePath = sequencePath.slice(0,-4).slice(0, -1*(item.padding + 2) ) + '%%0' + item.padding + 'd' + '.' + item.ext;
                                var rvRange = item.startframe + '-' + item.endframe;
                                if (rvUsePush == 'false' ) {
                                    cmd = '\"' + rvPath + '\"' + ' ' + '\"' + rvSequencePath + '\"' + ' ' + rvRange + ' ' + rvCall;
                                }
                                if (rvUsePush == 'true' || rvpushPath){
                                    cmd = '\"' + rvpushPath + '\"' + ' set ' + '\"' + rvSequencePath + '\"' + ' ' + rvRange + ' ' + rvCall;
                                }
                            }
                            if (pathcontrol.getPadding() === 0) {
                                if (rvUsePush == 'false') {
                                    cmd = '\"' + rvPath + '\"' + ' ' + '\"' + sequencePath + '\"' + ' ' + rvCall;
                                }
                                if (rvUsePush == 'true'){
                                    cmd = '\"' + rvpushPath + '\"' + ' set ' + '\"' + sequencePath + '\"' + ' ' + rvCall;
                                }
                            }
                        } else {
                            cmd = null;
                        }
                    }//eof RV
                    if (player === 'rv_push') {
                        
                    }
                    
                    if (player === 'djv') {
                        if (item.exists.fsNames[0]) {
                            var djvSequencePath = item.exists.fsNames[0];
                            if (pathcontrol.getPadding() > 0) {
                                cmd = '\"' + djvPath + '\"' + ' ' + '\"' + djvSequencePath + '\"' + ' -seq Range -playback_speed ' + Math.round( 1 / item.comp.frameDuration ) + ' ' + djvCall;
                            }
                            if (pathcontrol.getPadding() === 0) {
                                cmd = '\"' + djvPath + '\"' + ' ' + '\"' + djvSequencePath + '\"' + ' ' + djvCall;
                            }
                        } else {
                            cmd = null;
                        }
                    }
                    
                    if (cmd) {
                        var string;
                        
                        if (File.fs === 'Windows') {
                            string = '@echo off\n' +
                                    'start "" ' + cmd + '\n'+
                                    'exit /b';
                            
                            file.open('w');
                            file.write(string);
                            file.close();
                            file.execute();
                        }
                        
                        if (File.fs === 'Macintosh') {
                            string = cmd;
                            alert('This function is not yet implemented.')
                        }
                    }
                }
            }
            function browseButton_onClick() {
                if ( listItem.selection ) {
                    var index = listItem.selection.index;
                    //Parent
                    if ( collect.item( index ).file.parent.exists ) {
                         collect.item( index ).file.parent.execute() 
                    } else {
                        //Grandparent
                       if ( collect.item( index ).file.parent.parent.exits ) {
                            collect.item( index ).file.parent.parent.execute()
                       } else {
                           //Great grandparent
                           if ( collect.item( index ).file.parent.parent.parent.exists ) {
                                collect.item( index ).file.parent.parent.parent.execute()
                           } else {
                               // etc...
                               if ( collect.item( index ).file.parent.parent.parent.parent.exists) {
                                    collect.item( index ).file.parent.parent.parent.parent.execute()
                               } else {
                                   if ( collect.item( index ).file.parent.parent.parent.parent.parent.exists ) {
                                        collect.item( index ).file.parent.parent.parent.parent.parent.execute()
                                   }
                               }
                           }
                       }
                    }
                    
                }
            }
            function settingsButton_onClick() {
                settings.setbasepath();
                settings.show();
            }
            function refreshButton_onClick() {
                return cls.prototype.refresh();
            };           
            function framesButton_onClick() {
                if ( listItem.selection ) {
                    var index = listItem.selection.index;                        
                    framesWindow.clear();
                    framesWindow.setItemIndex( index );
                    framesWindow.setlist( collect.item( index ).exists.names, collect.item( index ).exists.dates, collect.item( index ).exists.sizes )
                    framesWindow.show();
                }
            }            
            function aerenderButton_onClick() {
                cls.prototype.aerender( false );
            }    
            function batchButton_onClick(){
                cls.prototype.aerender( true );
            }    
            function versionsIncrement_onClick() {
                
                var selection = listItem.selection;
                
                pathcontrol.setVersion( pathcontrol.getVersion() + 1 );
                pathcontrol.apply()
                
                collect = new Collect;
                listWindow.clear();
                listWindow.setlist( collect.compnames, collect.filenames, collect.rendered.frames, collect.missing.frames, collect.incomplete.frames, collect.rendered.sizes );
                settings.setbasepath();
                
                listItem.selection = selection;
            }    
            function versionsReset_onClick() {
                var selection = listItem.selection;
                
                pathcontrol.setVersion( 1 );
                pathcontrol.apply()
                
                collect = new Collect;
                listWindow.clear();
                listWindow.setlist( collect.compnames, collect.filenames, collect.rendered.frames, collect.missing.frames, collect.incomplete.frames, collect.rendered.sizes );
                settings.setbasepath();
                
                listItem.selection = selection;
            }
            function versionsDropdown_onChange(){
                
                if ( versionsDropdown.selection.text === 'Set Version Control' ) {
                    pathcontrol = new Pathcontrol( collect.item( listItem.selection.index ).omItem, collect.item( listItem.selection.index ).rqItem );
                    if (!pathcontrol.getVersion() ) {
                        pathcontrol.setVersion(1);
                        cls.prototype.cleardropdown();
                        if (settings.getSetting('pathcontrol_fsName')[settings.getSetting('pathcontrol_fsName').length-1] == '/' || settings.getSetting('pathcontrol_fsName')[settings.getSetting('pathcontrol_fsName').length-1] == '\\') {
                            pathcontrol.setBasepath ( settings.getSetting('pathcontrol_fsName') + collect.item( listItem.selection.index ).compname );
                        } else {
                            pathcontrol.setBasepath ( settings.getSetting('pathcontrol_fsName') + sep + collect.item( listItem.selection.index ).compname )
                        }
                        cls.prototype.setdropdown( pathcontrol.getVersions() )
                        pathcontrol.apply();
                    }
                } else {
                    pathcontrol.setVersion( parseInt(versionsDropdown.selection.text.slice(1),10));
                    
                    if (settings.getSetting('pathcontrol_fsName')[settings.getSetting('pathcontrol_fsName').length-1] == '/' || settings.getSetting('pathcontrol_fsName')[settings.getSetting('pathcontrol_fsName').length-1] == '\\') {
                        pathcontrol.setBasepath ( settings.getSetting('pathcontrol_fsName') + collect.item( listItem.selection.index ).compname );
                    } else {
                        pathcontrol.setBasepath ( settings.getSetting('pathcontrol_fsName') + sep + collect.item( listItem.selection.index ).compname )
                    }
                    
                    pathcontrol.apply();
                }
                
                //Refresh list
                collect = new Collect;
                
                var s = listWindow.getSelection();
                listWindow.clear();
                listWindow.setlist( collect.compnames, collect.filenames, collect.rendered.frames, collect.missing.frames, collect.incomplete.frames, collect.rendered.sizes );
                settings.setbasepath();
                listWindow.setSelection( s );
            }
            function listItem_onChange() {
                if (listItem.selection){
                    aerenderButton.enabled = true;
                    playButton.enabled = true;
                    batchButton.enabled = true;
                    browseButton.enabled = true;
                    framesButton.enabled = true;
                    versionsIncrement.enabled = true;
                    versionsReset.enabled = true;
                    versionsDropdown.enabled = true;

                    //Versions
                    pathcontrol = new Pathcontrol( collect.item( listItem.selection.index ).omItem, collect.item( listItem.selection.index ).rqItem );
                    cls.prototype.cleardropdown();
                    if ( pathcontrol.getVersion() ) {
                        if (settings.getSetting('pathcontrol_fsName')[settings.getSetting('pathcontrol_fsName').length-1] == '/' || settings.getSetting('pathcontrol_fsName')[settings.getSetting('pathcontrol_fsName').length-1] == '\\') {
                            pathcontrol.setBasepath ( settings.getSetting('pathcontrol_fsName') + collect.item( listItem.selection.index ).compname );
                        } else {
                            pathcontrol.setBasepath ( settings.getSetting('pathcontrol_fsName') + sep + collect.item( listItem.selection.index ).compname )
                        }
                        if ( pathcontrol.getVersions().length > 0 ) {
                            cls.prototype.setdropdown( pathcontrol.getVersions() )
                        } else {
                            var noVersions = new Folder ('No rendered versions found');
                            cls.prototype.setdropdown(  [noVersions] );
                        }

                    } else {
                        var setVersionControl = new Folder('Set Version Control');
                        cls.prototype.setdropdown( [setVersionControl] )
                        pathcontrol.setBasepath( null );
                        versionsIncrement.enabled = false;
                        versionsReset.enabled = false;
                    }

                } else {
                    aerenderButton.enabled = false;
                    playButton.enabled = false;
                    batchButton.enabled = false;
                    browseButton.enabled = false;
                    framesButton.enabled = false;
                    versionsIncrement.enabled = false;
                    versionsReset.enabled = false;
                    versionsDropdown.enabled = false;

                }
            };
            function listItem_onDoubleClick() { 
                app.project.renderQueue.showWindow(true)
            }
        }
        //UI
        {
            // Header bar
            {
                var elemSize = 20,
                    UIsep,
                    UIsepWidth = 10;
                
                var controlsGroup = palette.add('group');
                controlsGroup.alignment = ['fill','fill'];
                controlsGroup.orientation = 'row';
                
                var controlsGroup1 = controlsGroup.add('group', undefined, {
                    name: 'controlsGroup1'
                });
                controlsGroup1.spacing = 10;
                controlsGroup1.alignment = ['left','top'];
                controlsGroup1.preferredSize = [300,''];
                
                var controlsGroup3 = controlsGroup.add('group');
                controlsGroup3.alignment = ['fill','fill'];
                
                var controlsGroup2 = controlsGroup.add('group', [0,0,0,0], {
                    name: 'controlsGroup2',
                });
                controlsGroup2.spacing = 5;
                controlsGroup2.alignment = ['right','top'];
                controlsGroup2.preferredSize = [300,''];
                
                //Grp1
                {
                    var aerenderButton = controlsGroup1.add('iconbutton', undefined, ListWindow_StartRender, {
                        name: 'aerenderButton',
                        style: 'toolbutton'
                    });
                        aerenderButton.onClick = aerenderButton_onClick;
                        aerenderButton.size = [(elemSize*1.5),elemSize];
                        aerenderButton.alignment = 'left';
                        aerenderButton.enabled = false;

                    var batchButton = controlsGroup1.add('iconbutton',undefined, ListWindow_SaveRender,{
                        name: 'aerenderButton',
                        style: 'toolbutton'
                    });
                        batchButton.onClick = batchButton_onClick;
                        batchButton.size = [elemSize,elemSize];
                        batchButton.alignment = 'left';
                        batchButton.enabled = false;

                    UIsep = controlsGroup1.add('iconbutton', undefined, ListWindow_Sep, {
                        name: 'aerenderButton',
                        style: 'toolbutton',
                         enabled: false
                    });
                    UIsep.size = [UIsepWidth,elemSize];
                    UIsep.enabled = false;

                    var playButton = controlsGroup1.add('iconbutton',undefined, ListWindow_PlayIcon,{
                        name: 'playButton',
                        style: 'toolbutton'
                    });
                        playButton.onClick = playButton_onClick;
                        playButton.size = [elemSize,elemSize];
                        playButton.alignment = 'left';
                        playButton.enabled = false;


                    var browseButton = controlsGroup1.add('iconbutton',undefined,ListWindow_RevealIcon,{
                        name: 'browseButton',
                        style: 'toolbutton'
                    });
                        browseButton.onClick = browseButton_onClick;
                        browseButton.size = [elemSize,elemSize];
                        browseButton.enabled = false;

                    var framesButton = controlsGroup1.add('iconbutton',undefined,ListWindow_FilesIcon,{
                        name: 'framesButton',
                        style: 'toolbutton'
                    });
                        framesButton.onClick = framesButton_onClick; 
                        framesButton.size = [elemSize,elemSize];
                        framesButton.enabled = false;

                    var refreshButton = controlsGroup1.add('iconbutton',undefined,ListWindow_RefreshIcon,{
                        name: 'refreshButton',
                        style: 'toolbutton'
                    });
                        refreshButton.onClick = refreshButton_onClick;
                        refreshButton.size = [elemSize,elemSize];

                    var settingsButton = controlsGroup1.add('iconbutton',undefined,ListWindow_SettingsIcon,{
                        name: 'settingsButton',
                        style: 'toolbutton'
                    });
                        settingsButton.onClick = settingsButton_onClick; 
                        settingsButton.size = [elemSize,elemSize];
                        settingsButton.alignment = 'right';

                    UIsep = controlsGroup1.add('iconbutton', undefined, ListWindow_Sep, {
                        name: 'aerenderButton',
                        style: 'toolbutton',
                         enabled: false
                    });
                    UIsep.size = [UIsepWidth,elemSize];
                    UIsep.enabled = false;
                    
                    UIsep = controlsGroup1.add('iconbutton', undefined, ListWindow_Sep, {
                        name: 'aerenderButton',
                        style: 'toolbutton',
                        enabled: false
                    });
                    UIsep.size = [UIsepWidth,elemSize];
                    UIsep.enabled = false;        
                }
                //grp2
                {
                    var versionsLabel = controlsGroup2.add('statictext',undefined,'Version Control:',{
                       name: 'versionsLabel'                                   
                    });

                    var versionsDropdown = controlsGroup2.add('dropdownlist',undefined,[],{
                        name: 'versionsDropdown'
                    });
                        versionsDropdown.size = [60,elemSize];
                        versionsDropdown.enabled = false;
                        versionsDropdown.onChange = versionsDropdown_onChange;

                    var versionsIncrement = controlsGroup2.add('iconbutton',undefined,ListWindow_IncrementIcon,{
                        name: 'versionsIncrement',
                        style: 'toolbutton'
                    });
                        versionsIncrement.onClick = versionsIncrement_onClick;
                        versionsIncrement.size = [elemSize,elemSize];
                        versionsIncrement.alignment = 'left';
                        versionsIncrement.enabled = false;

                    var versionsReset = controlsGroup2.add('iconbutton',undefined,ListWindow_ResetIcon,{
                        name: 'versionsReset',
                        style: 'toolbutton'
                    });
                        versionsReset.onClick = versionsReset_onClick;
                        versionsReset.size = [elemSize,elemSize];
                        versionsReset.alignment = 'left';
                        versionsReset.enabled = false;
                }
            }
            // List
            {
                var listGroup = palette.add('group', undefined, {
                    name: 'listGroup',
                    orientation: 'row',
                    spacing: 10,
                    margins: 10
                });
                    listGroup.size = [0,0];
                    listGroup.alignChildren = 'left';
                    listGroup.alignment = 'left';
                
                var listItem = listGroup.add('listbox',undefined, '', {
                    spacing: 0,
                    margins: 0,
                    name: 'listItem',
                    multiselect: false,
                    numberOfColumns: inNumColumns,
                    showHeaders: true,
                    columnTitles: columnTitles,
                    columnWidths: columnWidths
                });
                listItem.size = [0,0];
                listItem.onChange = listItem.onChanging = listItem_onChange;
                listItem.onDoubleClick = listItem_onDoubleClick;
            }
        }
        return cls
    }( thisObj, settings.scriptname, 6, ['Composition','Path','ΔComplete','ΔMissing','ΔIncomplete','Size'], [250,550,100,100,100,70] ));

    var collect = new Collect;
    var listWindow = new ListWindow;
    
    listWindow.setlist( collect.compnames, collect.filenames, collect.rendered.frames, collect.missing.frames, collect.incomplete.frames, collect.rendered.sizes );
    listWindow.show();
    return this;
    
})(this);