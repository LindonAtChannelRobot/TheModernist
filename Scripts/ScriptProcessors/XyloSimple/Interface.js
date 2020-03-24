function validateAuth(){

doingValidation = true;
   reg num1 = parseInt(AuthNumber1.getValue(),10);
   reg num2 = parseInt(AuthNumber2.getValue(),10);
   reg num3 = parseInt(AuthNumber3.getValue(),10);
   reg num4 = parseInt(AuthNumber4.getValue(),10);
   
   reg myText = num1 + "-" + num2 + "-" + num3 + "-" + num4;
   AuthValues.set("text", myText);

   if ((num1 == 12345) && (num2 == 12345)){
       Console.print("match");
       CR_Auth = true;
   }else{
       Console.print("fail:" + num1);
       var flag = FactoryPresetFlag.getValue();
       if (flag == 1){
          Console.print("but factory preset");
          CR_Auth = true;
       }else{
          CR_Auth = false;
       };
   };
   displayAuth();

};

function displayAuth(){
    Console.print("in display..");
    num1 = parseInt(AuthNumber1.getValue(),10);
    num2 = parseInt(AuthNumber2.getValue(),10);
    num3 = parseInt(AuthNumber3.getValue(),10);
    num4 = parseInt(AuthNumber4.getValue(),10);
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
        //so save the init preset
        Engine.saveUserPreset("Factory/Xylophone/Init");
        AuthPanel.showControl(0);
    };
};

Content.makeFrontInterface(635, 310);

const var AuthPanel = Content.getComponent("AuthPanel");
const var AuthInstructions = Content.getComponent("AuthInstructions");
const var AuthNumber1 = Content.getComponent("AuthNumber1");
const var AuthNumber2 = Content.getComponent("AuthNumber2");
const var AuthNumber3 = Content.getComponent("AuthNumber3");
const var AuthNumber4 = Content.getComponent("AuthNumber4");
const var AuthoriseButton = Content.getComponent("AuthoriseButton");
const var FactoryPresetFlag = Content.getComponent("FactoryPresetFlag");
const var AuthValues = Content.getComponent("AuthValues");



var CR_Auth = false;
var doingValidation = false;



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
    Console.print("in on control");
 //   if ((CR_Auth == false) && (doingValidation=false)){
 //       Console.print("onControl validation");
 //     validateAuth();  
 //   };
    
    if (myControl == PresetButton){
        if (myValue == 1){
            Console.print("is ON");
            Content.getComponent("myPresetTile").showControl(1);
        }else{
            Console.print("is OFF");    
            Content.getComponent("myPresetTile").showControl(0);
        }
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
