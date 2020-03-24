function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

function encryptAuth(authString){
    Console.print("the raw string is:" + authString);

    var encIdx;
    var tempVal;
    var encryptedString;
    var encryptedArray = [];
    var targetpos = 0;
    for (encIdx = 0; encIdx < positionInstructions.length; encIdx++) {
        if (positionInstructions[encIdx] < 0){
            tempVal = getRandomInt(0,9);
        }else{
            tempVal = authString.charAt(targetpos);
            targetpos++;
            Console.print("at position:" + encIdx + " AUTH value should be" + tempVal);
        };
        encryptedArray[encIdx] = 9 - parseInt(tempVal,10);
    };
    for (encIdx = 0; encIdx < positionInstructions.length; encIdx++){
        Console.print("ENCRYPTION array at pos:" + encIdx + " value is:" + encryptedArray[encIdx]);
        
    };
    encryptedString = encryptedArray.join("");
    // AuthValues.set("text",encryptedString);
    decryptAuthString(encryptedString);
};
function decryptAuthString(decString){
    Console.print("the raw --------encrypted-------- string is:" + decString);

    var decIdx;
    var tempDec;
    var decryptedString;
    var decTarget = 0;
    var myArray = [];
    
    for (decIdx = 0; decIdx < positionInstructions.length; decIdx++) {
        if (positionInstructions[decIdx] > -1){
            Console.print("found somehting at position " + decIdx  + " whos value is:" + decString.charAt(decIdx) );
            myArray[decTarget] = 9 - parseInt(decString.charAt(decIdx),10);
            decTarget++;
        };
    };
    Console.print("hopefully:::::::::::first number is:" + myArray[0] + myArray[1] +myArray[2] +myArray[3] +myArray[4]);
    
    Console.print("hopefully:::::::::::2nd number is:" + myArray[5] + myArray[6] +myArray[7] +myArray[8] +myArray[9]);
    Console.print("hopefully:::::::::::3nd number is:" + myArray[10] + myArray[11] +myArray[12] +myArray[13] +myArray[14]);
    Console.print("hopefully:::::::::::4nd number is:" + myArray[15] + myArray[16] +myArray[17] +myArray[18] +myArray[19]);
};
    
function validateAuth(){

   var num1 = parseInt(AuthNumber1.getValue(),10);
   var num2 = parseInt(AuthNumber2.getValue(),10);
   var num3 = parseInt(AuthNumber3.getValue(),10);
   var num4 = parseInt(AuthNumber4.getValue(),10);
   var myText = num1 + "-" + num2 + "-" + num3 + "-" + num4;
   
//   var magicSet = (CR_MagicNum1 + CR_MagicNum2);
//   var part1 = Math.abs(num1-num2);
//   var part2 = 99999 - Math.abs(part1 - magicSet);
//   Console.print("C part must = " + part2);
//   var twix = (Math.abs(99999 - num2) - magicSet);
//   var part3 = Math.abs(num1 - (Math.abs(twix)));
//   Console.print("D part must = " + part3);

// if ((num3 == part2) && (num4 == part3)){
     if ((num1 == num2) && (num3 == num4)){
       Console.print("match");
       CR_Auth = true;
   }else{
       Console.print("fail:");
       CR_Auth = false;
   };
   displayAuth();

};

function displayAuth(){
    Console.print("in display..");
    var num1 = parseInt(AuthNumber1.getValue(),10);
    var num2 = parseInt(AuthNumber2.getValue(),10);
    var num3 = parseInt(AuthNumber3.getValue(),10);
    var num4 = parseInt(AuthNumber4.getValue(),10);
    if (CR_Auth == false){
        if ((num1== 0) || (num2 == 0) || (num3 == 0) || (num4 == 0)){
            // empty show the welcome message
            AuthInstructions.set("text","Welcome. Please enter your Authorisation Code in the boxes provided and press AUTHORISE");
        }else{
            // something entered - show the "not right" message""
            AuthInstructions.set("text","Hmm. This set of numbers seems to be incorrect - please retry");
        };
        AuthPanel.showControl(1);
    }else{
        //all OK...
        // AuthPanel.showControl(0);
        var myString = "" + AuthNumber1.getValue() + AuthNumber2.getValue() + AuthNumber3.getValue() + AuthNumber4.getValue();
        encryptAuth(myString);
        //AuthValues.set("text",myString);
    };
};

Content.makeFrontInterface(635, 310);

const var myPresetTile = Content.getComponent("myPresetTile");
const var AuthPanel = Content.getComponent("AuthPanel");
const var AuthInstructions = Content.getComponent("AuthInstructions");
const var AuthNumber1 = Content.getComponent("AuthNumber1");
const var AuthNumber2 = Content.getComponent("AuthNumber2");
const var AuthNumber3 = Content.getComponent("AuthNumber3");
const var AuthNumber4 = Content.getComponent("AuthNumber4");
const var AuthoriseButton = Content.getComponent("AuthoriseButton");
const var FactoryPresetFlag = Content.getComponent("FactoryPresetFlag");
const var AuthValues = Content.getComponent("AuthValues");



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

// validateAuth();

Content.getComponent("myPresetTile").showControl(0);


inline function onPostInitPanelControl(component, value)
{
    Console.print("doing the validation dance");
	var d2 = Engine.loadFromJSON("EnryptedAuthCode.js");
    Console.print(d2.Data[0]);
    AuthValues.set("text",d2.Data[0]);
};

Content.getComponent("PostInitPanel").setControlCallback(onPostInitPanelControl);

function onNoteOn()
{
        if (CR_Auth != true){
            Message.ignoreEvent(true);
        }
	
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
    if (myControl == AuthNumber1){
        var myres = parseInt(myValue, 10);
        AuthNumber1.set("text",myres);
    };
    if (myControl == AuthNumber2){
        var myres = parseInt(myValue, 10);
        AuthNumber2.set("text",myres);
    };
    if (myControl == AuthNumber3){
        var myres = parseInt(myValue, 10);
        AuthNumber3.set("text",myres);
    };
    if (myControl == AuthNumber4){
        var myres = parseInt(myValue, 10);
        AuthNumber4.set("text",myres);
    };
    
    if (myControl == AuthoriseButton){
        validateAuth();
    }
}
