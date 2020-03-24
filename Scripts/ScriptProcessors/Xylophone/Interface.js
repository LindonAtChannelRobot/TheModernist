Content.makeFrontInterface(635, 500);
Engine.loadFont("{PROJECT_FOLDER}cambria.ttc");

include("Serials.js");

namespace Authorisation
{
    const var SerialInput = Content.getComponent("SerialInput");
    const var Description = Content.getComponent("Description");
    const var SerialStateLabel = Content.getComponent("SerialStateLabel");
    const var AuthorisationDialogue = Content.getComponent("AuthorisationDialog");
    const var GlobalMute = Synth.getMidiProcessor("GlobalMute");
    
    /** Checks if the serial input is valid and stores the result if successful. */
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

const var myPresetTile = Content.getComponent("myPresetTile");
const var PresetButton = Content.getComponent("PresetButton");

const var Voice1 = Synth.getChildSynth("Voice1");
const var Voice2 = Synth.getChildSynth("Voice2");
const var Voice3 = Synth.getChildSynth("Voice3");
const var Voice4 = Synth.getChildSynth("Voice4");

var CR_Auth = false;
var CR_MagicNum1 = 117;
var CR_MagicNum2 = 121;
var positionInstructions = [-1,-1,-1,-1,6,-1,17,-1,12,-1,4,-1,-1,10,14,-1,-1,-1,-1,-1,-1,7,-1,-1,0,-1,-1,15,-1,-1,-1,-1,2,16,13,-1,-1,-1,3,-1,-1,19,1,-1,-1,-1,5,-1,-1,8,-1,-1,18,-1,9,-15,-1,11,-1,-1];

Voice1.asSampler().loadSampleMap("XylophoneVoice1");
Voice2.asSampler().loadSampleMap("XylophoneVoice2");
Voice3.asSampler().loadSampleMap("XylophoneVoice3");
Voice4.asSampler().loadSampleMap("XylophoneVoice4");



Content.getComponent("myPresetTile").showControl(0);






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
