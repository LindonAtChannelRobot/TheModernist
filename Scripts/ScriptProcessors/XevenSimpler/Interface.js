Content.makeFrontInterface(635, 310);

const var AuthPanel = Content.getComponent("AuthPanel");
const var AuthInstructions = Content.getComponent("AuthInstructions");
const var AuthNumber1 = Content.getComponent("AuthNumber1");
const var AuthNumber2 = Content.getComponent("AuthNumber2");
const var AuthNumber3 = Content.getComponent("AuthNumber3");
const var AuthNumber4 = Content.getComponent("AuthNumber4");
const var AuthValues = Content.getComponent("AuthValues");



reg CR_Auth = false;
reg doingValidation = false;
var userPresetCallBack = false;
var userPresetCallBackCompleteFlag = -99;
var callBackChecker;

const var timer = Engine.createTimerObject();

timer.startTimer(1000); // in milliseconds
timer.callback = function()
{
    if (userPresetCallBack == true){
	    Console.print("call back executing");
	    callBackChecker = AuthNumber1.getValue();
	    if (callBackChecker > -99){
	        
	        Console.print("-----Data Available");
	        reg num1 = parseInt(AuthNumber1.getValue(),10);
            reg num2 = parseInt(AuthNumber2.getValue(),10);
            reg num3 = parseInt(AuthNumber3.getValue(),10);
            reg num4 = parseInt(AuthNumber4.getValue(),10);
            Console.print("num1:" + num1);
            reg myText = "LD:" + num1 + "-" + num2 + "-" + num3 + "-" + num4;
            AuthValues.set("text", myText); 
	        userPresetCallBack = false;
	    };

        
    };
	
};function onNoteOn()
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
    if ((CR_Auth == false) && (doingValidation == false)){
        Console.print("in validation in onControl");
        doingValidation = true;
        AuthNumber1.setValue(-99);
        userPresetCallBack = true;
        Engine.loadUserPreset("Factory/Xylophone/Init");
    };
    
    if (myControl == AuthNumber1){
        var myres = parseInt(myValue, 10);
        if ((myres < 0) || (myres > 99999)){
            myres = 0;
        };
        AuthNumber1.set("text",myres);
    };
    if (myControl == AuthNumber2){
        var myres = parseInt(myValue, 10);
        if ((myres < 0) || (myres > 99999)){
            myres = 0;
        };
        AuthNumber2.set("text",myres);
    };
    if (myControl == AuthNumber3){
        var myres = parseInt(myValue, 10);
        if ((myres < 0) || (myres > 99999)) {
            myres = 0;
        };
        AuthNumber3.set("text",myres);
    };
    if (myControl == AuthNumber4){
        var myres = parseInt(myValue, 10);
        if ((myres < 0) || (myres > 99999)){
            myres = 0;
        };
        AuthNumber4.set("text",myres);
    };
    
}
