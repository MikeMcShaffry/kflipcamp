'==========================================================================
'
' NAME: SoundBoard
'
' AUTHOR: GigaMatt
' DATE  : 15-Sep-2019
'
' COMMENT: Set up and play predefined audio files.
'	Set audio clips in Tools > Options > SoundBoard Options.
'	View/Hide SoundBoard from View > Show SoundBoard.
'
'==========================================================================

Dim ini
Set ini = SDB.IniFile

Dim Mnu, Pnl, QueueId, IsBoardTrack, IsPlaying

'Number of buttons supported. Should be divisible by 2.
const SoundCount = 8

Dim Btn(), Path()

'Initialize Options screen, Panel, and callback functions
Sub OnStartup
	'Used by OnPlaybackEnd. Is this a SoundBoard track?
	IsBoardTrack = False
	
	'Set up Options screen
	ind = SDB.UI.AddOptionSheet( "SoundBoard Options", Script.ScriptPath, "InitSheet", "SaveSheet" , -2)

	'Initialize Panel for sound buttons.
	Set Pnl = SDB.UI.NewDockablePersistentPanel("SoundBoard") 
	if Pnl.IsNew then 
		Pnl.DockedTo = 2 
		Pnl.Common.Width = 250 
	end if 
	Pnl.Caption = "SoundBoard" 
	Script.RegisterEvent Pnl, "OnClose", "PnlClose" 

	redim Btn(SoundCount)
	redim Path(SoundCount)
	x = 20
	y = 1
	For i = 1 to SoundCount
		
		Set Btn(i) = SDB.UI.NewButton(Pnl) 
		Btn(i).Caption = ini.StringValue("SoundBoard","Name" & i)
		'x=20 for buttons 1,3,5,... and 140 for buttons 2,4,6...
		Btn(i).Common.SetRect x, y*45, 100, 40
		Btn(i).Common.Hint = ini.StringValue("SoundBoard","Path" & i)
		'Script.RegisterEvent Btn(i), "OnClick", "BtnClicked" 
		' Use deprecated callback so we get a Control object back
		Btn(i).UseScript = Script.ScriptPath
		Btn(i).OnClickFunc = "BtnClicked"

		If x = 20 Then
			x = 140
		Else
			x = 20
			y = y + 1
		End If
	Next
	
	' Add View menu item that shows panel if it's closed 
	Set Sep = SDB.UI.AddMenuItemSep(SDB.UI.Menu_View,0,0) 
	Set Mnu = SDB.UI.AddMenuItem(SDB.UI.Menu_View,0,0) 
	Mnu.Caption = "Show SoundBoard" 
	Mnu.Checked = Pnl.Common.Visible 

	'Setup for other callback funcs
	Script.RegisterEvent Mnu, "OnClick", "ShowPanel" 
	Script.RegisterEvent SDB, "OnPlaybackEnd", "OnPbEnd" 
	
End Sub

'Toggle SoundBoard panel display
Sub ShowPanel(Item) 
	Pnl.Common.Visible = not Pnl.Common.Visible 
	Mnu.Checked = Pnl.Common.Visible 
End Sub 

'Panel close button
Sub PnlClose( Item) 
	Mnu.Checked = false 
End Sub 

'Load Options
Sub InitSheet(Sheet)
	Dim Edt, Browse

	for i = 1 to SoundCount
		'Sound Button Name
		Set Edt = SDB.UI.NewEdit(Sheet)
		Edt.Common.SetRect 10, 10+(i*30), 80, 20
		Edt.Common.ControlName = "Name" & i
		'Read Name from INI file
		Edt.Text = ini.StringValue("SoundBoard","Name" & i)
		
		'Sound Button File Path
		Set Path(i) = SDB.UI.NewEdit(Sheet)
		Path(i).Common.SetRect 100, 10+(i*30), 300, 20
		Path(i).Common.ControlName = "Path" & i
		'Read Path from INI file
		Path(i).Text = ini.StringValue("SoundBoard","Path" & i)
		
		'Button to bring up file browser for file path
		Set Browse = SDB.UI.NewButton(Sheet)
		Browse.Caption = "Browse"
		Browse.Common.SetRect 410, 10+(i*30), 60, 25
		'Save button number in the object so we can update the Path after browsing
		Browse.Common.Hint = i
		Browse.UseScript = Script.ScriptPath
		Browse.OnClickFunc = "BtnBrowse"
	Next
End Sub

'Save Options
Sub SaveSheet(Sheet)
	Dim Edt

	for i = 1 to SoundCount
		'Save Button Name to INI
		Set Edt = Sheet.Common.ChildControl("Name" & i)
		ini.StringValue("SoundBoard","Name" & i) = Edt.Text
		
		'Update Panel button Name
		Btn(i).Caption = Edt.Text

		'Save Button Path to INI
		Set Edt = Sheet.Common.ChildControl("Path" & i)
		ini.StringValue("SoundBoard","Path" & i) = Edt.Text
		
		'Update Panel button Path
		Btn(i).Common.Hint = Edt.Text
	Next
End Sub

'Open Windows file browser dialog
Sub BtnBrowse(Ctrl)
	Set wShell=CreateObject("WScript.Shell")
	Set oExec=wShell.Exec("mshta.exe ""about:<input type=file id=FILE><script>FILE.click();new ActiveXObject('Scripting.FileSystemObject').GetStandardStream(1).WriteLine(FILE.value);close();resizeTo(0,0);</script>""")
	'Update Path option with dialog result. Ctrl.Common.Hint contains the button number.
	Path(Ctrl.Common.Hint).Text = oExec.StdOut.ReadLine
End Sub

'Sound button clicked. Play something!
Sub BtnClicked(Ctrl)
	'Are we already in the middle of playing a SoundBoard button track?
	If IsBoardTrack = False Then
		'Lookup the track in the MM DB by path. Note that paths are stored without the first character (drive letter.)
		Set Iter = SDB.Database.QuerySongs("SongPath = '" & Mid(Ctrl.Common.Hint, 2) & "'")
		'If we didn't find a track, don't play one!
		If Iter.EOF = False Then
			QueueId = SDB.Player.CurrentSongIndex + 1
			'Insert SoundBoard track after currently playing track
			call SDB.Player.PlaylistInsertTrack(QueueId, Iter.Item)
			'Advance to SoundBoard track
			SDB.Player.Next()
			IsPlaying = SDB.Player.IsPlaying
			'If we were paused, start Playing track
			If IsPlaying = False Then
				SDB.Player.Play()
			End If
			SDB.Player.StopAfterCurrent = True
			'Flip the flag for the OnPlaybackEnd callback
			IsBoardTrack = True
		End If
		Set Iter = Nothing ' Avoid locking errors
	End If
End Sub

'Callback for track completing or being skipped over
Sub OnPbEnd()
	'Do nothing if it isn't our track
	If IsBoardTrack = True Then
		IsBoardTrack = False
		'Remove the SoundBoard track
		call SDB.Player.PlaylistDelete(QueueId)
		'If we were paused before, back up to the track we were on before
		If IsPlaying = False Then
			SDB.Player.Previous()
		End If
	End If
End Sub
