[Setup]
#define AppName "TheModernistGlockenspiel"
#define DevDir "ChannelRobot"
AppName={#AppName}
AppVersion=1.0.0

DefaultDirName={pf}\{#DevDir}\{#AppName}
DefaultGroupName={#AppName}
Compression=lzma2
SolidCompression=yes
OutputDir=.\installerbuild
ArchitecturesInstallIn64BitMode=x64
OutputBaseFilename={#AppName} Installer 1.0.0
LicenseFile=".\installerAssets\EULA.txt"
PrivilegesRequired=admin
WizardSmallImageFile=".\installerAssets\CRLogo55x58.bmp"
WizardImageFile=".\installerAssets\CRLogo164x314.bmp"
DisableWelcomePage=no

SetupLogging=yes
ChangesAssociations=no

[Types]
Name: "full"; Description: "Full installation"
Name: "custom"; Description: "Custom installation"; Flags: iscustom

[Dirs]
Name: "{app}\"; Permissions: users-modify powerusers-modify admins-modify system-modify

[Components]
Name: "vst2_32"; Description: "{#AppName} 32-bit VSTi Plugin"; Types: full custom;
Name: "vst2_64"; Description: "{#AppName} 64-bit VSTi Plugin"; Types: full custom; Check: Is64BitInstallMode; 
Name: "samples"; Description: "{#AppName} Sample Set"; Types: full custom;


[Files]

; VST
Source: "Binaries\Compiled\VST\{#AppName} x86.dll"; DestDir: "{code:GetVST2Dir_32}"; Flags: ignoreversion; Components: vst2_32; Check: not Is64BitInstallMode

Source: "Binaries\Compiled\VST\{#AppName} x86.dll"; DestDir: "{code:GetVST2Dir_32}\{#DevDir}"; Flags: ignoreversion; Components: vst2_32; Check: Is64BitInstallMode
Source: "Binaries\Compiled\VST\{#AppName} x64.dll"; DestDir: "{code:GetVST2Dir_64}\{#DevDir}"; Flags: ignoreversion; Components: vst2_64; Check: Is64BitInstallMode

; SAMPLE FILE
Source: "{#AppName}_1_0_0_Samples.hr1"; DestDir: "{code:GetSamplesDir}"; Flags: ignoreversion; Components: samples; 

; MANUAL
 Source: ".\installerAssets\TheModernistCollection_Manual.pdf"; DestDir: "{app}"; Flags: ignoreversion;

; PRESETS
Source: ".\UserPresets\{#AppName}_Factory_Presets.hpa"; DestDir: "{app}"; Flags: ignoreversion;

[Icons]
Name: "{group}\Uninstall {#AppName}"; Filename: "{app}\unins000.exe"    
Name: "{group}\TheModernistCollection_Manual"; Filename: "{app}\TheModernistCollection_Manual.pdf"


[Code]
var
  OkToCopyLog : Boolean;
  VST2DirPage_32: TInputDirWizardPage;
  VST2DirPage_64: TInputDirWizardPage;
  SamplesDirPage: TInputDirWizardPage;

procedure InitializeWizard;

begin

  if IsWin64 then begin
    VST2DirPage_64 := CreateInputDirPage(wpSelectDir,
    'Confirm 64-Bit VST2 Plugin Directory', '',
    'Select the folder in which setup should install the 64-bit VST2 Plugin(you can choose not to install this version later),  then click Next.',
    False, '');
    VST2DirPage_64.Add('');
    VST2DirPage_64.Values[0] := ExpandConstant('{reg:HKLM\SOFTWARE\VST,VSTPluginsPath|{pf}\Steinberg\VSTPlugins}\');

    VST2DirPage_32 := CreateInputDirPage(wpSelectDir,
      'Confirm 32-Bit VST2 Plugin Directory', '',
      'Select the folder in which setup should install the 32-bit VST2 Plugin(you can choose not to install this version later), then click Next.',
      False, '');
    VST2DirPage_32.Add('');
    VST2DirPage_32.Values[0] := ExpandConstant('{reg:HKLM\SOFTWARE\WOW6432NODE\VST,VSTPluginsPath|{pf32}\Steinberg\VSTPlugins}\');

    SamplesDirPage := CreateInputDirPage(wpSelectDir,
      'Confirm Program Directory', '',
      'Select the folder in which setup should install the Samples (you will need to point the plug-in at this later), then click Next.',
      False, '');
    SamplesDirPage.Add('');
    SamplesDirPage.Values[0] := ExpandConstant('{sd}\temp\{#AppName}');
  end else begin
    VST2DirPage_32 := CreateInputDirPage(wpSelectDir,
      'Confirm 32-Bit VST2 Plugin Directory', '',
      'Select the folder in which setup should install the 32-bit VST2 Plugin,  then click Next.',
      False, '');
    VST2DirPage_32.Add('');
    VST2DirPage_32.Values[0] := ExpandConstant('{reg:HKLM\SOFTWARE\VST,VSTPluginsPath|{pf}\Steinberg\VSTPlugins}\');

    SamplesDirPage := CreateInputDirPage(wpSelectDir,
      'Confirm Program Directory', '',
      'Select the folder in which setup should install the Samples (you will need to point the plug-in at this later), then click Next.',
      False, '');
    SamplesDirPage.Add('');
    SamplesDirPage.Values[0] := ExpandConstant('{sd}\temp\{#AppName}');
  end;
end;

function GetVST2Dir_32(Param: String): String;
begin
  Result := VST2DirPage_32.Values[0]
end;

function GetVST2Dir_64(Param: String): String;
begin
  Result := VST2DirPage_64.Values[0]
end;

function GetSamplesDir(Param: String): String;
begin
  Result := SamplesDirPage.Values[0]
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssDone then
    OkToCopyLog := True;
end;

procedure DeinitializeSetup();
begin
  if OkToCopyLog then
    FileCopy (ExpandConstant ('{log}'), ExpandConstant ('{app}\InstallationLogFile.log'), FALSE);
  RestartReplace (ExpandConstant ('{log}'), '');
end;

[UninstallDelete]
Type: files; Name: "{app}\InstallationLogFile.log"
