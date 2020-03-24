Content.makeFrontInterface(635, 310);

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
function onControl(PresetButton, presetValue)
{
    if (presetValue == 1){
        Console.print("is ON");
        Content.getComponent("myPresetTile").showControl(1);
    }else{
        Console.print("is OFF");
        Content.getComponent("myPresetTile").showControl(0);
    }
}
