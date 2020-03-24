Content.makeFrontInterface(969, 700);
Engine.loadFontAs("{PROJECT_FOLDER}LBRITE.ttf", "Lucida Bright");
Engine.loadAudioFilesIntoPool();


//-----------------------  functions -------------------

inline function displayPanels()
{
    VOICESPanel.showControl(VOICESButton.getValue());
    TREMOLOSPanel.showControl(TREMOLOSButton.getValue());
    EFFECTSPanel.showControl(EFFECTSButton.getValue());
    ARPPanel.showControl(ARPButton.getValue());
}


// -------------- Authorisation & Demo ----------------------------

include("Serials.js");

var AuthState = false;
const var AuthoriseInInst = Content.getComponent("AuthoriseInInst");

const var SerialInput = Content.getComponent("SerialInput");
const var Description = Content.getComponent("Description");
// const var SerialStateLabel = Content.getComponent("SerialStateLabel");
const var AuthorisationDialogue = Content.getComponent("AuthorisationDialog");
const var GlobalMute = Synth.getMidiProcessor("GlobalMute");
    
const var MasterContainer = Synth.getChildSynth("Modernist_01");
// demo mode timer....
var engineStartTime = Engine.getUptime();
var timerState = 1;  // 1 = in the initial period, 2 = in the on/off period
var masterByPass = 1;  // used to set the bypass
const var timer = Engine.createTimerObject();




// Checks if the serial input is valid and stores the result if successful. //
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
    // GlobalMute.setAttribute(0, 1 - isValid);
    
    if(isValid)
    {
        // Change this to any other visual indication...
        // a valid license...
        AuthorisationDialogue.set("visible", false);
        AuthState = true;
        AuthoriseInInst.showControl(false);
        // make sure we are currently unmuted.
        MasterContainer.setBypassed(0);
    }
    else
    {
        //not a valid license...
        // AuthorisationDialogue.set("visible", true);
        AuthState = false;
        AuthoriseInInst.showControl(true);
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


//  enable for the demo version......


MasterContainer.setBypassed(1 - masterByPass);

AuthorisationDialogue.startTimer(900000);

// timer.startTimer(900000); // in milliseconds



AuthorisationDialogue.setTimerCallback(function()
{
    Console.print(Engine.getUptime() - engineStartTime );
    if (timerState == 1){
        // check is the license valid yet
        if (AuthState == false)
        {
            timerState = 2;
            MasterContainer.setBypassed(masterByPass);
            AuthorisationDialogue.stopTimer();
            AuthorisationDialogue.startTimer(1000);
            AuthoriseInInst.setValue(1);
            AuthoriseInInst.changed();

        }else{
            // authorised so no need for a timer..
            AuthorisationDialogue.stopTimer();
        };
    };
    if (timerState == 2){
        if (AuthState == false)
        {
            masterByPass = 1 - masterByPass;
            MasterContainer.setBypassed(masterByPass);
        }else{
            // authorised so no need for a timer..
            AuthorisationDialogue.stopTimer();
        };
    };
});

// ------------- end auth and demo --------------------------

// -- some UI elements
const var myPresetTile = Content.getComponent("myPresetTile");

const var SettingsPanel = Content.getComponent("SettingsPanel");
const var Settings = Content.getComponent("Settings");


// widgets....
const var VOICESPanel = Content.getComponent("VOICESPanel");
const var TREMOLOSPanel = Content.getComponent("TREMOLOSPanel");
const var EFFECTSPanel = Content.getComponent("EFFECTSPanel");
const var ARPPanel = Content.getComponent("ARPPanel");

const var VOICESButton = Content.getComponent("VOICESButton");
const var TREMOLOSButton = Content.getComponent("TREMOLOSButton");
const var EFFECTSButton = Content.getComponent("EFFECTSButton");
const var ARPButton = Content.getComponent("ARPButton");








const var NUM_VOICES = 4;

var VoiceVolumes = [Content.getComponent("VolumeSliderVoice1"),Content.getComponent("VolumeSliderVoice2"),Content.getComponent("VolumeSliderVoice3"),Content.getComponent("VolumeSliderVoice4")];
var AttackKnobs = [Content.getComponent("AttackVoice1"),Content.getComponent("AttackVoice2"),Content.getComponent("AttackVoice3"),Content.getComponent("AttackVoice4")];
var DecayKnobs = [Content.getComponent("DecayVoice1"),Content.getComponent("DecayVoice2"),Content.getComponent("DecayVoice3"),Content.getComponent("DecayVoice4")];
var SustainKnobs = [Content.getComponent("SustainVoice1"),Content.getComponent("SustainVoice2"),Content.getComponent("SustainVoice3"),Content.getComponent("SustainVoice4")];
var ReleaseKnobs = [Content.getComponent("ReleaseVoice1"),Content.getComponent("ReleaseVoice2"),Content.getComponent("ReleaseVoice3"),Content.getComponent("ReleaseVoice4")];

for (idx=0;idx < NUM_VOICES; idx++ )
{
    AttackKnobs[idx].setControlCallback(onAttackKnob);
    DecayKnobs[idx].setControlCallback(onDecayKnob);
    SustainKnobs[idx].setControlCallback(onSustainKnob);
    ReleaseKnobs[idx].setControlCallback(onReleaseKnob);
}






const var VolumeSliderVoice1 = Content.getComponent("VolumeSliderVoice1");
const var VolumeSliderVoice2 = Content.getComponent("VolumeSliderVoice2");
const var VolumeSliderVoice3 = Content.getComponent("VolumeSliderVoice3");
const var VolumeSliderVoice4 = Content.getComponent("VolumeSliderVoice4");
const var Humaniser = Content.getComponent("Humaniser");
const var WarmthKnob = Content.getComponent("WarmthKnob");
const var ColourKnob1 = Content.getComponent("ColourKnob1");
const var Room1 = Content.getComponent("Room1");
const var Room2 = Content.getComponent("Room2");
const var MicroDelayTimeLeft = Content.getComponent("MicroDelayTimeLeft");
const var MicroDelayTimeRight = Content.getComponent("MicroDelayTimeRight");
const var MicroDelayFeedbackLeft = Content.getComponent("MicroDelayFeedbackLeft");
const var MicroDelayFeedbackRight = Content.getComponent("MicroDelayFeedbackRight");

const var ReleaseVoice1 = Content.getComponent("ReleaseVoice1");
const var ReleaseVoice2 = Content.getComponent("ReleaseVoice2");
const var ReleaseVoice3 = Content.getComponent("ReleaseVoice3");
const var ReleaseVoice4 = Content.getComponent("ReleaseVoice4");
const var Randomise = Content.getComponent("Randomise");

const var SelectorPanel1 = Content.getComponent("SelectorPanel1");
const var SelectorPanel2 = Content.getComponent("SelectorPanel2");
const var SelectorPanel3 = Content.getComponent("SelectorPanel3");
const var SelectorPanel4 = Content.getComponent("SelectorPanel4");

const var SelectorComboBox1 = Content.getComponent("SelectorComboBox1");
const var SelectorComboBox2 = Content.getComponent("SelectorComboBox2");
const var SelectorComboBox3 = Content.getComponent("SelectorComboBox3");
const var SelectorComboBox4 = Content.getComponent("SelectorComboBox4");




// the synths

const var Voice1 = Synth.getChildSynth("Voice1");
const var Voice2 = Synth.getChildSynth("Voice2");
const var Voice3 = Synth.getChildSynth("Voice3");
const var Voice4 = Synth.getChildSynth("Voice4");

const var Voice1Sampler = Synth.getSampler("Voice1");
const var Voice2Sampler = Synth.getSampler("Voice2");
const var Voice3Sampler = Synth.getSampler("Voice3");
const var Voice4Sampler = Synth.getSampler("Voice4");

// --- in line coded version stuff starts here...-----

// ---- the fx definitions
const var Warmth = Synth.getEffect("Warmth");
const var Colour = Synth.getEffect("Colour");
const var ConvolutionReverb1 = Synth.getEffect("Convolution Reverb1");
const var ConvolutionReverb2 = Synth.getEffect("Convolution Reverb2");
const var MicroDelay = Synth.getEffect("MicroDelay");
const var MasterFX = Synth.getEffect("MasterFX");

// ---- the envelopes -----------
var TheEnvelopes = [Synth.getModulator("EnvelopeVoice1"),Synth.getModulator("EnvelopeVoice2"),Synth.getModulator("EnvelopeVoice3"),Synth.getModulator("EnvelopeVoice4")];
const var EnvelopeVoice1 = Synth.getModulator("EnvelopeVoice1");
const var EnvelopeVoice2 = Synth.getModulator("EnvelopeVoice2");
const var EnvelopeVoice3 = Synth.getModulator("EnvelopeVoice3");
const var EnvelopeVoice4 = Synth.getModulator("EnvelopeVoice4");

// --------------------------------------


//variables...

var CR_Auth = false;
var CR_MagicNum1 = 117;
var CR_MagicNum2 = 121;
var positionInstructions = [-1,-1,-1,-1,6,-1,17,-1,12,-1,4,-1,-1,10,14,-1,-1,-1,-1,-1,-1,7,-1,-1,0,-1,-1,15,-1,-1,-1,-1,2,16,13,-1,-1,-1,3,-1,-1,19,1,-1,-1,-1,5,-1,-1,8,-1,-1,18,-1,9,-15,-1,11,-1,-1];

Voice1.asSampler().loadSampleMap("GlockVoice1");
Voice2.asSampler().loadSampleMap("GlockVoice2");
Voice3.asSampler().loadSampleMap("GlockVoice3");
Voice4.asSampler().loadSampleMap("GlockVoice4");

Content.getComponent("myPresetTile").showControl(0);


var mapNames = ["none","GlockVoice1","GlockVoice2","GlockVoice3","GlockVoice4","KalimbaVoice1","KalimbaVoice2","KalimbaVoice3","KalimbaVoice4","MarimbaVoice1","MarimbaVoice2","MarimbaVoice3","MarimbaVoice4","VibesVoice1","VibesVoice2","VibesVoice3","VibesVoice4","XyloVoice1","XyloVoice2","XyloVoice3","XyloVoice4", "Carillionist", "CelestaOne", "CelestaTwo","DrumBells","IceCreamVan","MusicBox","WindChimes","WoodenBells"];

//  ==== the ARP===============
const var Arpeggiator1 = Synth.getMidiProcessor("Arpeggiator1");

// -- some ui call backs  -----

inline function onVOICESButtonControl(component, value)
{
	displayPanels();
};

Content.getComponent("VOICESButton").setControlCallback(onVOICESButtonControl);


inline function onTREMOLOSButtonControl(component, value)
{
	displayPanels();
};

Content.getComponent("TREMOLOSButton").setControlCallback(onTREMOLOSButtonControl);


inline function onEFFECTSButtonControl(component, value)
{
	displayPanels();
};

Content.getComponent("EFFECTSButton").setControlCallback(onEFFECTSButtonControl);

inline function onARPButtonControl(component, value)
{
	displayPanels();
};

Content.getComponent("ARPButton").setControlCallback(onARPButtonControl);





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
	VoiceVolumes[0] = value;
};

Content.getComponent("VolumeSliderVoice1").setControlCallback(onVolumeSliderVoice1Control);


inline function onVolumeSliderVoice2Control(component, value)
{
	//set the voice level
	Voice2.setAttribute(Voice2.Gain, value);
	VoiceVolumes[1] = value;
};

Content.getComponent("VolumeSliderVoice2").setControlCallback(onVolumeSliderVoice2Control);



inline function onVolumeSliderVoice3Control(component, value)
{
	//set the voice level
	Voice3.setAttribute(Voice3.Gain, value);
	VoiceVolumes[2] = value;
};

Content.getComponent("VolumeSliderVoice3").setControlCallback(onVolumeSliderVoice3Control);



inline function onVolumeSliderVoice4Control(component, value)
{
	//set the voice level
	Voice4.setAttribute(Voice4.Gain, value);
	VoiceVolumes[3] = value;
};

Content.getComponent("VolumeSliderVoice4").setControlCallback(onVolumeSliderVoice4Control);




// ============ ATTACK =============
inline function onAttackKnob(component, value)
{
	//set the envelope release time...
	for(idx= 0; idx < NUM_VOICES; idx++)
    {
        if (component == AttackKnobs[idx])
        {
            TheEnvelopes[idx].setAttribute(TheEnvelopes[idx].Attack, value);
        };
    };
};

// ============ DECAY =============
inline function onDecayKnob(component, value)
{
	//set the envelope release time...
	for(idx= 0; idx < NUM_VOICES; idx++)
    {
        if (component == DecayKnobs[idx])
        {
            TheEnvelopes[idx].setAttribute(TheEnvelopes[idx].Decay, value);
        };
    };
};

// ============ SUSTAIN =============
inline function onSustainKnob(component, value)
{
	//set the envelope release time...
	for(idx= 0; idx < NUM_VOICES; idx++)
    {
        if (component == SustainKnobs[idx])
        {
            TheEnvelopes[idx].setAttribute(TheEnvelopes[idx].Sustain, value);
        };
    };
};
// ============ RELEASE =============

inline function onReleaseKnob(component, value)
{
	//set the envelope release time...
	for(idx= 0; idx < NUM_VOICES; idx++)
    {
        if (component == ReleaseKnobs[idx])
        {
            TheEnvelopes[idx].setAttribute(TheEnvelopes[idx].Release, value);
        };
    };
};



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

inline function onArpBypassControl(component, value)
{
	//bypass the arp
	Arpeggiator1.setAttribute(Arpeggiator1.BypassButton, value);
};

Content.getComponent("ArpBypass").setControlCallback(onArpBypassControl);

inline function onArpTempoControl(component, value)
{
	//set the arp tempo
	Arpeggiator1.setAttribute(Arpeggiator1.SpeedKnob, value);
	
};

Content.getComponent("ArpTempo").setControlCallback(onArpTempoControl);



inline function onSettingsControl(component, value)
{
	//
    myPresetTile.showControl(false);
	SettingsPanel.showControl(value);
};

Content.getComponent("Settings").setControlCallback(onSettingsControl);



inline function onAuthoriseInInstControl(component, value)
{
    //
    if (AuthState == false){
    AuthorisationDialogue.set("visible", value);
    };
};

Content.getComponent("AuthoriseInInst").setControlCallback(onAuthoriseInInstControl);



inline function onRandomiseControl(component, value)
{
    local counterz;
	//random stuff...
	if (value)
    {
        VolumeSliderVoice1.setValue(Math.random());
        VolumeSliderVoice2.setValue(Math.random());
        VolumeSliderVoice3.setValue(Math.random());
        VolumeSliderVoice4.setValue(Math.random());
        VolumeSliderVoice1.changed();
        VolumeSliderVoice2.changed();
        VolumeSliderVoice3.changed();
        VolumeSliderVoice4.changed();
        ByPassVoice1.setValue(Math.floor(Math.random()*2));
        ByPassVoice2.setValue(Math.floor(Math.random()*2));
        ByPassVoice3.setValue(Math.floor(Math.random()*2));
        ByPassVoice4.setValue(Math.floor(Math.random()*2));
        ByPassVoice1.changed();
        ByPassVoice2.changed();
        ByPassVoice3.changed();
        ByPassVoice4.changed();
    
        counterz =  ByPassVoice1.getValue()+ByPassVoice2.getValue()+ByPassVoice3.getValue()+ByPassVoice4.getValue();

        // if all 4 voices are bypassed
        if(counterz > 3)
        {
            ByPassVoice1.setValue(0);
            ByPassVoice1.changed();
        }
        
        SelectorComboBox1.setValue(1 + Math.floor(Math.random()*20));
        SelectorComboBox2.setValue(1 + Math.floor(Math.random()*20));
        SelectorComboBox3.setValue(1 + Math.floor(Math.random()*20));
        SelectorComboBox4.setValue(1 + Math.floor(Math.random()*20));
        
        SelectorComboBox1.changed();
        SelectorComboBox2.changed();
        SelectorComboBox3.changed();
        SelectorComboBox4.changed();
        Humaniser.setValue(Math.random());
        WarmthKnob.setValue(Math.random());
        ColourKnob1.setValue(100 + (Math.random() * 1200));
        WarmthKnob.changed();
        ColourKnob1.changed();

        Room1.setValue(1 + (Math.random()*100) * -1);
        Room2.setValue(1 + (Math.random()*100) * -1);
        Room1.changed();
        Room2.changed();

        MicroDelayOnOff.setValue(Math.floor(Math.random()*2));
        MicroDelayOnOff.changed();
        MicroDelayTimeLeft.setValue(Math.floor(Math.random()*19));
        MicroDelayTimeLeft.changed();
        MicroDelayTimeRight.setValue(Math.floor(Math.random()*19));
        MicroDelayTimeRight.changed();
        MicroDelayFeedbackLeft.setValue(Math.random()*0.899);
        MicroDelayFeedbackLeft.changed();
        MicroDelayFeedbackRight.setValue(Math.random()*0.899);
        MicroDelayFeedbackRight.changed();

        ReleaseVoice1.setValue(5+ (Math.random()*1100));
        ReleaseVoice1.changed();
        ReleaseVoice2.setValue(5+ (Math.random()*1100));
        ReleaseVoice2.changed();
        ReleaseVoice3.setValue(5+ (Math.random()*1100));
        ReleaseVoice3.changed();
        ReleaseVoice4.setValue(5+ (Math.random()*1100));
        ReleaseVoice4.changed();
        Randomise.setValue(0);
    };
    
        Console.print(Randomise.getValue());
};

Content.getComponent("Randomise").setControlCallback(onRandomiseControl);



inline function onSelectorComboBox1Control(component, value)
{
	//load the vice into the sampler..
	Voice1Sampler.loadSampleMap(mapNames[value]);
};

Content.getComponent("SelectorComboBox1").setControlCallback(onSelectorComboBox1Control);



inline function onSelectorComboBox2Control(component, value)
{
	//load the vice into the sampler..
	Voice2Sampler.loadSampleMap(mapNames[value]);
};

Content.getComponent("SelectorComboBox2").setControlCallback(onSelectorComboBox2Control);


inline function onSelectorComboBox3Control(component, value)
{
	//load the vice into the sampler..
	Voice3Sampler.loadSampleMap(mapNames[value]);
};

Content.getComponent("SelectorComboBox3").setControlCallback(onSelectorComboBox3Control);


inline function onSelectorComboBox4Control(component, value)
{
	//load the vice into the sampler..
	Voice4Sampler.loadSampleMap(mapNames[value]);
};

Content.getComponent("SelectorComboBox4").setControlCallback(onSelectorComboBox4Control);




const var PresetFrame = Content.getComponent("PresetFrame");
const var myPresetName = Content.getComponent("myPresetName");
const var Presets = Content.getComponent("Presets");


PresetFrame.setTimerCallback(function()
{
    if (Engine.getCurrentUserPresetName() == "")
    {
        myPresetName.set("text","---");
    }else{
        myPresetName.set("text", Engine.getCurrentUserPresetName());
    };
    Presets.setValue(0);    
}
);

inline function onPresetsControl(component, value)
{
  //show - hide the preset panel...
  if (value){
    myPresetTile.showControl(true);
    // start the timer for displaying preset changes...
    PresetFrame.startTimer(500);
    Console.print("starting timer");
  }else{
    myPresetTile.showControl(true);
    PresetFrame.stopTimer();
  };
  myPresetName.set("text",Engine.getCurrentUserPresetName());
};

Content.getComponent("Presets").setControlCallback(onPresetsControl);



inline function onNextUserPresetControl(component, value)
{
	//Add your custom logic here...
	if (value == 1){
	    Engine.loadNextUserPreset(false);
	    myPresetName.set("text", Engine.getCurrentUserPresetName());
	};
};

Content.getComponent("NextUserPreset").setControlCallback(onNextUserPresetControl);


inline function onPrevUserPresetControl(component, value)
{
	//Add your custom logic here...
		if (value == 1){
	    Engine.loadPreviousUserPreset(false) ;
	    myPresetName.set("text", Engine.getCurrentUserPresetName());
	};
};

Content.getComponent("PrevUserPreset").setControlCallback(onPrevUserPresetControl);




inline function onMicroDelayMixControl(component, value)
{
	//
	MicroDelay.setAttribute(MicroDelay.Mix, value);
};

Content.getComponent("MicroDelayMix").setControlCallback(onMicroDelayMixControl);



if (Engine.isPlugin())
{
  Settings.showControl(false);  
};

VoiceVolumes[0] = VolumeSliderVoice1.getValue();
VoiceVolumes[1] = VolumeSliderVoice2.getValue();
VoiceVolumes[2] = VolumeSliderVoice3.getValue();
VoiceVolumes[3] = VolumeSliderVoice4.getValue();function onNoteOn()
{
    local calcValue;
    local rangeVal;
    
	if (Humaniser.getValue() > 0)
    {
        
	    //randomise voice 1
	    if (VoiceVolumes[0] > 0)
        {
            // if its playing...
            rangeVal = ((Math.random() * 0.1) * Humaniser.getValue());
            calcValue = (rangeVal) * (Math.floor(Math.random()*3) - 1);
            // apply to the slider and the voice but DONT call the slider call back 
            // as it resets the stored value
            if ((VoiceVolumes[0]+ calcValue) < 0)
                VolumeSliderVoice1.setValue(0);
            else
                VolumeSliderVoice1.setValue(VoiceVolumes[0]+ calcValue);
            Voice1.setAttribute(Voice1.Gain, VoiceVolumes[0]+ calcValue);
        };
	    //randomise voice 2
	    if (VoiceVolumes[1] > 0)
        {
            // if its playing...
            rangeVal = ((Math.random() * 0.1) * Humaniser.getValue());
            calcValue = (rangeVal) * (Math.floor(Math.random()*3) - 1);
            // apply to the slider and the voice but DONT call the slider call back 
            // as it resets the stored value
            if ((VoiceVolumes[1]+ calcValue) < 0)
                VolumeSliderVoice2.setValue(0);
            else
                VolumeSliderVoice2.setValue(VoiceVolumes[1]+ calcValue);
            Voice2.setAttribute(Voice2.Gain, VoiceVolumes[1]+ calcValue);
        };
	    //randomise voice 3
	    if (VoiceVolumes[2] > 0)
        {
            // if its playing...
            rangeVal = ((Math.random() * 0.1) * Humaniser.getValue());
            calcValue = (rangeVal) * (Math.floor(Math.random()*3) - 1);
            // apply to the slider and the voice but DONT call the slider call back 
            // as it resets the stored value
            if ((VoiceVolumes[2]+ calcValue) < 0)
                VolumeSliderVoice3.setValue(0);
            else
                VolumeSliderVoice3.setValue(VoiceVolumes[2]+ calcValue);
            Voice3.setAttribute(Voice3.Gain, VoiceVolumes[2]+ calcValue);
        };
	    //randomise voice 4
	    if (VoiceVolumes[3] > 0)
        {
            // if its playing...
            rangeVal = ((Math.random() * 0.1) * Humaniser.getValue());
            calcValue = (rangeVal) * (Math.floor(Math.random()*3) - 1);
            // apply to the slider and the voice but DONT call the slider call back 
            // as it resets the stored value
            if ((VoiceVolumes[3]+ calcValue) < 0)
                VolumeSliderVoice4.setValue(0);
            else
                VolumeSliderVoice4.setValue(VoiceVolumes[3]+ calcValue);
            Voice4.setAttribute(Voice4.Gain, VoiceVolumes[3]+ calcValue);
        };
    }else{
        // set everyone back to their user selectied values
        VolumeSliderVoice1.setValue(VoiceVolumes[0]);
        VolumeSliderVoice2.setValue(VoiceVolumes[1]);
        VolumeSliderVoice3.setValue(VoiceVolumes[2]);
        VolumeSliderVoice4.setValue(VoiceVolumes[3]);
    };
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



}
