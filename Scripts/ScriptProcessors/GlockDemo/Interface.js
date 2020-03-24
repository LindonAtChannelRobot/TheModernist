Content.makeFrontInterface(635, 500);
Engine.loadFontAs("{PROJECT_FOLDER}cambria.ttc", "cam");
Engine.loadAudioFilesIntoPool();
include("Serials.js");
/* ---- authorisation : disable for the demo version... 
namespace Authorisation
{
    const var SerialInput = Content.getComponent("SerialInput");
    const var Description = Content.getComponent("Description");
    // const var SerialStateLabel = Content.getComponent("SerialStateLabel");
    const var AuthorisationDialogue = Content.getComponent("AuthorisationDialog");
    const var GlobalMute = Synth.getMidiProcessor("GlobalMute");
    
    // Checks if the serial input is valid and stores the result if successful. 
    inline function onSubmitButtonControl(component, value)
    {
        if(!value) // Just execute once
            return;
    
        local v = SerialInput.getValue();
        Console.print(v);
	
        // Checks if it's in the input
        if(serials.Data.contains(v))
        {
            Console.print("Serial number found");
        
            local data = 
            {
                "Serial": v
            };
        
            // Stores the file to the hard drive. In HISE it will be the project folder
            // but in the compiled plugin it will use the parent directory to the 
            // user preset directory (which is usually the app data folder).
            Engine.dumpAsJSON(data, "../RegistrationInfo.js");
            
            setValidLicense(true);
        }
        else
        {
            Console.print("Invalid serial number");
            Description.set("text", "Invalid serial number. The number you supplied does not match");
            
            setValidLicense(false);
        }
    };

    Content.getComponent("SubmitButton").setControlCallback(onSubmitButtonControl);


    inline function setValidLicense(isValid)
    {
        // Do whatever you want to do here. I suggest a MIDI muter...
        GlobalMute.setAttribute(0, 1 - isValid);
    
        if(isValid)
        {
            // Change this to any other visual indication...
            //SerialStateLabel.set("bgColour", Colours.greenyellow);
            AuthorisationDialogue.set("visible", false);
        }
        else
        {
            //SerialStateLabel.set("bgColour", Colours.red);
            AuthorisationDialogue.set("visible", true);
        }
    }

    inline function checkOnLoad()
    {
        // Clear the input
        SerialInput.set("text", "");
        
        // Load the serial from the stored file
        local pData = Engine.loadFromJSON("../RegistrationInfo.js");
        Console.print("Checking serial");
    
        if(pData)    
        {
            local v = pData.Serial;
            Console.print("Restored serial: " + v);
        
            if(serials.Data.contains(v))
            {
                setValidLicense(true);
                return;
            }
        }else{
            Description.set("text", "Please enter your serial number below.");
        }
    
        setValidLicense(false);
    }

    // Call this on startup
    checkOnLoad();

};
*/

//  /* enable for the demo version......

// demo mode timer....
const var ModernistMaster = Synth.getChildSynth("ModernistMaster");
var engineStartTime = Engine.getUptime();
var timerState = 1;  // 1 = in the initial period, 2 = in the on/off period
var masterByPass = 1;  // used to set the bypass
ModernistMaster.setBypassed(1 - masterByPass);
const var timer = Engine.createTimerObject();

timer.startTimer(120000); // in milliseconds
timer.callback = function()
{
	Console.print(Engine.getUptime() - engineStartTime );
	if (timerState == 1){
	     timerState = 2;
	     ModernistMaster.setBypassed(masterByPass);
	     timer.stopTimer();
	     timer.startTimer(1000);
	};
	if (timerState == 2){
	    masterByPass = 1 - masterByPass;
	    ModernistMaster.setBypassed(masterByPass);
	};
};

//    */

// -- some UI elements
const var myPresetTile = Content.getComponent("myPresetTile");
const var PresetButton = Content.getComponent("PresetButton");

// the synths

const var Voice1 = Synth.getChildSynth("Voice1");
const var Voice2 = Synth.getChildSynth("Voice2");
const var Voice3 = Synth.getChildSynth("Voice3");
const var Voice4 = Synth.getChildSynth("Voice4");

// --- in line coded version stuff starts here...-----

// ---- the fx definitions
const var Warmth = Synth.getEffect("Warmth");
const var Colour = Synth.getEffect("Colour");
const var ConvolutionReverb1 = Synth.getEffect("Convolution Reverb1");
const var ConvolutionReverb2 = Synth.getEffect("Convolution Reverb2");
const var MicroDelay = Synth.getEffect("MicroDelay");
const var MasterFX = Synth.getEffect("MasterFX");

// ---- the envelopes -----------
const var EnvelopeVoice1 = Synth.getModulator("EnvelopeVoice1");
const var EnvelopeVoice2 = Synth.getModulator("EnvelopeVoice2");
const var EnvelopeVoice3 = Synth.getModulator("EnvelopeVoice3");
const var EnvelopeVoice4 = Synth.getModulator("EnvelopeVoice4");

// --------------------------------------

var CR_Auth = false;
var CR_MagicNum1 = 117;
var CR_MagicNum2 = 121;
var positionInstructions = [-1,-1,-1,-1,6,-1,17,-1,12,-1,4,-1,-1,10,14,-1,-1,-1,-1,-1,-1,7,-1,-1,0,-1,-1,15,-1,-1,-1,-1,2,16,13,-1,-1,-1,3,-1,-1,19,1,-1,-1,-1,5,-1,-1,8,-1,-1,18,-1,9,-15,-1,11,-1,-1];

Voice1.asSampler().loadSampleMap("GlockVoice1");
Voice2.asSampler().loadSampleMap("GlockVoice2");
Voice3.asSampler().loadSampleMap("GlockVoice3");
Voice4.asSampler().loadSampleMap("GlockVoice4");

Content.getComponent("myPresetTile").showControl(0);

// -- some ui call backs  -----

// ============ WARMTH ============

inline function onWarmthKnobControl(component, value)
{
	//set the warmth
    Warmth.setAttribute(Warmth.Mix, value);
};

Content.getComponent("WarmthKnob").setControlCallback(onWarmthKnobControl);


// ============ COLOUR =============

inline function onColourKnob1Control(component, value)
{
	//set the colour
	Colour.setAttribute(Colour.Freq, value);
};

Content.getComponent("ColourKnob1").setControlCallback(onColourKnob1Control);


// ============ FADERS =============

inline function onVolumeSliderVoice1Control(component, value)
{
	//set the voice level
	Voice1.setAttribute(Voice1.Gain, value);
};

Content.getComponent("VolumeSliderVoice1").setControlCallback(onVolumeSliderVoice1Control);


inline function onVolumeSliderVoice2Control(component, value)
{
	//set the voice level
	Voice2.setAttribute(Voice2.Gain, value);
};

Content.getComponent("VolumeSliderVoice2").setControlCallback(onVolumeSliderVoice2Control);



inline function onVolumeSliderVoice3Control(component, value)
{
	//set the voice level
	Voice3.setAttribute(Voice3.Gain, value);
};

Content.getComponent("VolumeSliderVoice3").setControlCallback(onVolumeSliderVoice3Control);



inline function onVolumeSliderVoice4Control(component, value)
{
	//set the voice level
	Voice4.setAttribute(Voice4.Gain, value);
};

Content.getComponent("VolumeSliderVoice4").setControlCallback(onVolumeSliderVoice4Control);


// ============ BYPASS =============

inline function onByPassVoice1Control(component, value)
{
	//voice bypass
	Voice1.setBypassed(value);
};

Content.getComponent("ByPassVoice1").setControlCallback(onByPassVoice1Control);

inline function onByPassVoice2Control(component, value)
{
	//voice bypass
	Voice2.setBypassed(value);
};

Content.getComponent("ByPassVoice2").setControlCallback(onByPassVoice2Control);

inline function onByPassVoice3Control(component, value)
{
	//voice bypass
	Voice3.setBypassed(value);
};

Content.getComponent("ByPassVoice3").setControlCallback(onByPassVoice3Control);

inline function onByPassVoice4Control(component, value)
{
	//voice bypass
	Voice4.setBypassed(value);
};

Content.getComponent("ByPassVoice4").setControlCallback(onByPassVoice4Control);


// ============ RELEASE =============

inline function onReleaseVoice1Control(component, value)
{
	//set the envelope release time...
	EnvelopeVoice1.setAttribute(EnvelopeVoice1.Release, value);
};

Content.getComponent("ReleaseVoice1").setControlCallback(onReleaseVoice1Control);

inline function onReleaseVoice2Control(component, value)
{
	//set the envelope release time...
	EnvelopeVoice2.setAttribute(EnvelopeVoice2.Release, value);
};

Content.getComponent("ReleaseVoice2").setControlCallback(onReleaseVoice2Control);

inline function onReleaseVoice3Control(component, value)
{
	//set the envelope release time...
	EnvelopeVoice3.setAttribute(EnvelopeVoice3.Release, value);
};

Content.getComponent("ReleaseVoice3").setControlCallback(onReleaseVoice3Control);

inline function onReleaseVoice4Control(component, value)
{
	//set the envelope release time...
	EnvelopeVoice4.setAttribute(EnvelopeVoice4.Release, value);
};

Content.getComponent("ReleaseVoice4").setControlCallback(onReleaseVoice4Control);


// ============ ROOMS =============

inline function onRoom1Control(component, value)
{
	//set the reverb amount
	ConvolutionReverb1.setAttribute(ConvolutionReverb1.WetGain, value);
};

Content.getComponent("Room1").setControlCallback(onRoom1Control);

inline function onRoom2Control(component, value)
{
	//set the reverb amount
	ConvolutionReverb2.setAttribute(ConvolutionReverb2.WetGain, value);
};

Content.getComponent("Room2").setControlCallback(onRoom2Control);

// ============ DELAY =============

inline function onMicroDelayOnOffControl(component, value)
{
	//delay on off
	MicroDelay.setBypassed(value);
};

Content.getComponent("MicroDelayOnOff").setControlCallback(onMicroDelayOnOffControl);

inline function onMicroDelayTimeLeftControl(component, value)
{
	//set the delay time left
	MicroDelay.setAttribute(MicroDelay.DelayTimeLeft, value);
};

Content.getComponent("MicroDelayTimeLeft").setControlCallback(onMicroDelayTimeLeftControl);


inline function onMicroDelayTimeRightControl(component, value)
{
	//set the delay time right
	MicroDelay.setAttribute(MicroDelay.DelayTimeRight, value);
};

Content.getComponent("MicroDelayTimeRight").setControlCallback(onMicroDelayTimeRightControl);


inline function onMicroDelayFeedbackLeftControl(component, value)
{
	//set the feedback - left
	MicroDelay.setAttribute(MicroDelay.FeedbackLeft, value);
};

Content.getComponent("MicroDelayFeedbackLeft").setControlCallback(onMicroDelayFeedbackLeftControl);


inline function onMicroDelayFeedbackRightControl(component, value)
{
	//set the feedback - right
	MicroDelay.setAttribute(MicroDelay.FeedbackRight, value);
};

Content.getComponent("MicroDelayFeedbackRight").setControlCallback(onMicroDelayFeedbackRightControl);




// ===========  MASTER ==========

inline function onInstrumentGainControl(component, value)
{
	//set the master Gain level
	MasterFX.setAttribute(MasterFX.Gain, value);
};

Content.getComponent("InstrumentGain").setControlCallback(onInstrumentGainControl);


inline function onInstrumentPanControl(component, value)
{
	//set the overall pan position
	MasterFX.setAttribute(MasterFX.Balance, value);
};

Content.getComponent("InstrumentPan").setControlCallback(onInstrumentPanControl);

//--  ok lets try and see if we can force the issue...

const var MicroDelayTimeLeftFix = Content.getComponent("MicroDelayTimeLeft");

MicroDelayTimeLeftFix.changed();



function onNoteOn()
{
	
}
function onNoteOff()
{
	
}
function onController()
{
	
}
function onTimer()
{
	
}
function onControl(myControl, myValue)
{

    if (myControl == PresetButton){
        if (myValue == 1){
            Console.print("is ON");
            Content.getComponent("myPresetTile").showControl(1);
        }else{
            Console.print("is OFF");    
            Content.getComponent("myPresetTile").showControl(0);
        };
    };

}
