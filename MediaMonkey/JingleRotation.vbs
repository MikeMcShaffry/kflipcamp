'==========================================================================
'
' NAME: Radio Jingles Rotation
'
' AUTHOR: Peke
' DATE  : 18.08.2006
'
' COMMENT: Teaser Automatization
'
' Added a GET call to IceCast to post current song - Popcorn (aka Mike McShaffry, 2019)
'
'==========================================================================

'Dim SDB
'Set SDB = CreateObject("SongsDB.SDBApplication")


Dim ini
Set ini = SDB.IniFile

Sub OnStartup
  If ini.IntValue("JingleRotation","Timer") < 60 Then
    ini.IntValue("JingleRotation","Timer") = 900
  End If
  'SDB.Objects("JRTimer") = Nothing
  'If ini.BoolValue("JingleRotation","EnableTimer") Then
    Set SDB.Objects("JRTimer") = SDB.CreateTimer(ini.IntValue("JingleRotation","Timer")*1000)
    Script.RegisterEvent SDB.Objects("JRTimer"), "OnTimer", "CheckLastPlayed"
  'Else
  '  ini.BoolValue("JingleRotation","EnableTimer") = False
  'End If
  ini.BoolValue("JingleRotation","TimerExecuted") = False
  ind = SDB.UI.AddOptionSheet( "Automatization Options", Script.ScriptPath, "AInitSheet", "ASaveSheet" , -2)
  ind = SDB.UI.AddOptionSheet( "Jingle Rotation", Script.ScriptPath, "InitSheet", "SaveSheet", ind)
  ini.IntValue("JingleRotation","Counter") = -1
  ini.IntValue("JingleRotation","JingleID") = -1
  If ini.StringValue("JingleRotation","JingleGenre") = "" Then
    ini.StringValue("JingleRotation","JingleGenre") = "Jingles"
  End If

  If ini.StringValue("JingleRotation","IceCastServer") = "" Then
    ini.StringValue("JingleRotation","IceCastServer") = "www.kflipcamp.org:8000"
  End If
  
  If ini.StringValue("JingleRotation","IceCastMountPoint") = "" Then
    ini.StringValue("JingleRotation","IceCastMountPoint") = "kflip_auto"
  End If
  
  Dim SetDef
  Set SetDef = SDB.UI.addMenuItem(SDB.UI.Menu_Pop_Tree,1,-1)
  SetDef.caption = SDB.Localize("Set Jingle Rotation Playlist")
  SetDef.OnClickFunc = "SetDefaultPlaylist"
  SetDef.useScript = Script.ScriptPath
  SetDef.Hint = "Set Jingle Rotation Default Playlist"
  SetDef.Enabled = True

  Call Script.RegisterEvent(SDB, "OnPlay", "OnPlayTrack")
  ini.StringValue("JingleRotation","PlayedAt") = FormatDateTime(Now,0)
End Sub

Sub AInitSheet(Sheet)
End Sub

Sub ASaveSheet(Sheet)
End Sub

Sub InitSheet(Sheet)
  Dim ini, edt, ui, tint, tstr, tbool
  Set ini = SDB.IniFile
  Set UI=SDB.ui

  Set Edt = UI.NewLabel(Sheet)
  Edt.Common.SetRect 5, 10, 75, 20
  Edt.Caption = "Rotate Jingles after:"
  Edt.Autosize = False
  Edt.Alignment = 1

  Set Edt = UI.NewSpinEdit(Sheet)
  Edt.Common.SetRect 105, 7, 50, 20
  Edt.Common.ControlName = "JROnEverytrack"
  edt.MinValue = 0
  edt.MaxValue = 100
  edt.Value =  ini.IntValue("JingleRotation","JingleEvery")

  Set Edt = UI.NewLabel(Sheet)
  Edt.Common.SetRect 5, 35, 75, 20
  Edt.Caption = "Default playlist:"
  Edt.Autosize = False
  Edt.Alignment = 1 
  
  Set Edt = UI.NewEdit(Sheet)
  Edt.Common.SetRect 85, 32, 150, 20
  Edt.Common.ControlName = "JRJingleGenre"
  edt.Text = ini.StringValue("JingleRotation","JingleGenre")
  If edt.Text = "" Then
    If SDB.PlaylistByTitle(SDB.Localize("Favorites - Top 50")).ID = 0 Then
      edt.Text = SDB.PlaylistByTitle("").ChildPlaylists.Item(0).Title
    Else
      edt.Text = SDB.Localize("Favorites - Top 50")
    End If
  End If

  Set edt = UI.NewCheckBox(Sheet)
  edt.Common.SetRect 5, 83, 150, 20
  edt.Caption = "Enable Jingle Rotation"
  edt.Common.ControlName = "JREnable"
  edt.Common.Enabled = True
  edt.Checked = ini.BoolValue("JingleRotation","EnableTimer")

  Set Edt = UI.NewLabel(Sheet)
  Edt.Common.SetRect 5, 60, 75, 20
  Edt.Caption = "Max Time NotPlayed:"
  Edt.Autosize = False
  Edt.Alignment = 1

  Set Edt = UI.NewSpinEdit(Sheet)
  Edt.Common.SetRect 105, 57, 50, 20
  Edt.Common.ControlName = "JRMaxTimeNotPlayed"
  edt.MinValue = 60
  edt.MaxValue = 3600
  edt.Value =  ini.IntValue("JingleRotation","Timer")
  edt.Common.Enabled = True

  Set Edt = UI.NewLabel(Sheet)
  Edt.Common.SetRect 5, 110, 75, 20
  Edt.Caption = "IceCast Server:"
  Edt.Autosize = False
  Edt.Alignment = 1
  
  Set Edt = UI.NewEdit(Sheet)
  Edt.Common.SetRect 85, 107, 150, 20
  Edt.Common.ControlName = "JRIceCastServer"
   Edt.Text = ini.StringValue("JingleRotation","IceCastServer")
   If Edt.Text = "" Then
       Edt.Text = "www.kflipcamp.org:8000"
   End If 
  Edt.Common.Enabled = True
  
  Set Edt = UI.NewLabel(Sheet)
  Edt.Common.SetRect 5, 135, 75, 20
  Edt.Caption = "IceCast MountPoint:"
  Edt.Autosize = False
  Edt.Alignment = 1

  Set Edt = UI.NewEdit(Sheet)
  Edt.Common.SetRect 105, 133, 150, 20
  Edt.Common.ControlName = "JRIceCastMountPoint"
  Edt.Text = ini.StringValue("JingleRotation","IceCastMountPoint")
  If Edt.Text = "" Then
      Edt.Text = "kflip"
  End If 
  Edt.Common.Enabled = True
  Set ini = Nothing
End Sub

Sub SaveSheet(Sheet)
  Dim ini
  Set ini = SDB.IniFile
  If Not (SDB.Objects("JRTimer") Is Nothing) Then
    Script.UnregisterEvents SDB.Objects("JRTimer")
    SDB.Objects("JRTimer") = Nothing
  End If
  ini.IntValue("JingleRotation","JingleEvery") = Sheet.Common.ChildControl( "JROnEverytrack").Value
  Ini.StringValue("JingleRotation","JingleGenre") = Sheet.Common.ChildControl( "JRJingleGenre").Text
  ini.BoolValue("JingleRotation","EnableTimer") = Sheet.Common.ChildControl("JREnable").Checked
  ini.IntValue("JingleRotation","Timer") = Sheet.Common.ChildControl( "JRMaxTimeNotPlayed").Value
  If (SDB.Objects("JRTimer") Is Nothing) And (ini.BoolValue("JingleRotation","EnableTimer"))  Then
    Set SDB.Objects("JRTimer") = SDB.CreateTimer(ini.IntValue("JingleRotation","Timer")*1000)
    Script.RegisterEvent SDB.Objects("JRTimer"), "OnTimer", "CheckLastPlayed"
  Else
    ini.BoolValue("JingleRotation","EnableTimer") = False
  End If
  Ini.StringValue("JingleRotation","IceCastServer") = Sheet.Common.ChildControl( "JRIceCastServer").Text
  Ini.StringValue("JingleRotation","IceCastMountPoint") = Sheet.Common.ChildControl( "JRIceCastMountPoint").Text
  
  Set ini = Nothing
End Sub

Sub SetDefaultPlaylist(arg)
  Dim res
  If SDB.PlaylistByTitle(SDB.MainTree.CurrentNode.Caption).ID > 0 Then
    SDB.IniFile.StringValue("JingleRotation","JingleGenre") = SDB.MainTree.CurrentNode.Caption
  Else
    res = SDB.MessageBox( SDB.Localize("You must select Playlist!"), mtError, Array(mbOk))
 End If
End Sub

Public Function URLEncode( StringVal )
  Dim i, CharCode, Char, Space
  Dim StringLen

  StringLen = Len(StringVal)
  ReDim result(StringLen)

  Space = "+"
  'Space = "%20"

  For i = 1 To StringLen
    Char = Mid(StringVal, i, 1)
    CharCode = AscW(Char)
    If 97 <= CharCode And CharCode <= 122 _
    Or 64 <= CharCode And CharCode <= 90 _
    Or 48 <= CharCode And CharCode <= 57 _
    Or 45 = CharCode _
    Or 46 = CharCode _
    Or 95 = CharCode _
    Or 126 = CharCode Then
      result(i) = Char
    ElseIf 32 = CharCode Then
      result(i) = Space
    Else
      result(i) = "%" & Hex(CharCode)
    End If
  Next
  URLEncode = Join(result, "")
End Function


Sub SendSongToIceCast
	Dim restReq, url, userName, password, song, title, artist, metadata
	Dim server, mountpoint
	' Set ini = SDB.IniFile

	song = "&song=unknown"
	If (Len(SDB.Player.CurrentSong.Title) > 0) Then
		song = "&song=" + UrlEncode(SDB.Player.CurrentSong.Title)
	End If

	title = "&title=unknown"
	if (Len(SDB.Player.CurrentSong.AlbumName) > 0) Then
		title = "&title=" + UrlEncode(SDB.Player.CurrentSong.AlbumName)
	End If
	
	artist = "&artist=unknown"
	if (Len(SDB.Player.CurrentSong.ArtistName) > 0) Then
		song =  "&song=" + UrlEncode(SDB.Player.CurrentSong.ArtistName) + "+-+" + UrlEncode(SDB.Player.CurrentSong.Title)
		artist = UrlEncode(SDB.Player.CurrentSong.ArtistName) 
	End If
	
	metadata = song + title + artist

    server = ini.StringValue("JingleRotation","IceCastServer")  
    mountpoint = ini.StringValue("JingleRotation","IceCastMountPoint")

	url = "http://" + server + "/admin/metadata?mount=/" + mountpoint + "&mode=updinfo" + metadata	

	On Error Resume Next
	Err.Clear
	Set restReq = CreateObject("Microsoft.XMLHTTP")
    If (Err.Number = 0) Then

      'MsgBox "About to send " + url
	  userName = "admin"
	  password = "RaspberryCider"

      Error.Clear
	  restReq.open "GET", url, false, userName, password
	  Error.Clear
	  restReq.send
	  	
	  'MsgBox "Received " + restReq.responseText
    End If

End Sub


Sub OnPlayTrack
   CheckJingle ini.IntValue("JingleRotation","Counter"),ini.IntValue("JingleRotation","JingleEvery")
   SendSongToIceCast
End Sub

Sub CheckJingle (Played, OnEveryTrack)
  If (OnEveryTrack > 0) Then
    If Played = 0 Then
      If SDB.Player.CurrentSong.ID = ini.IntValue("JingleRotation","JingleID") Then
        SDB.Player.PlaylistDelete(SDB.Player.CurrentSongIndex)
        ini.IntValue("JingleRotation","JingleID") = -1
        Played = -1
      End If
    ElseIf Played = -1 Then
      Played = 0
    End If
    Played = Played+1
    If (Played = OnEveryTrack) Then
      Dim RndSong
      Randomize
      RndSong = Int((SDB.PlaylistByTitle(ini.StringValue("JingleRotation","JingleGenre")).Tracks.Count+1) * Rnd)
      If SDB.PlaylistByTitle(ini.StringValue("JingleRotation","JingleGenre")).Tracks.Count = RndSong Then
        RndSong = RndSong-1
      End If
      Call SDB.Player.PlaylistAddTrack(SDB.PlaylistByTitle(ini.StringValue("JingleRotation","JingleGenre")).Tracks.Item(RndSong))
      Call SDB.Player.PlaylistMoveTrack(SDB.Player.PlaylistCount-1, SDB.Player.CurrentSongIndex+1)
      ini.IntValue("JingleRotation","JingleID") = SDB.Player.CurrentPlaylist.Item(SDB.Player.CurrentSongIndex+1).ID
      Played = 0
      ini.StringValue("JingleRotation","PlayedAt") = FormatDateTime(Now,0)
      If ini.BoolValue("JingleRotation","TimerExecuted") Then 
        ini.BoolValue("JingleRotation","TimerExecuted") = False
      End If
    End If
    ini.IntValue("JingleRotation","Counter") = Played
  Else
    If SDB.Player.CurrentSong.ID = ini.IntValue("JingleRotation","JingleID") Then
      SDB.Player.PlaylistDelete(SDB.Player.CurrentSongIndex)
      ini.IntValue("JingleRotation","JingleID") = -1
      ini.IntValue("JingleRotation","Counter") = 0
      ini.StringValue("JingleRotation","PlayedAt") = FormatDateTime(Now,0)
      ini.BoolValue("JingleRotation","TimerExecuted") = False
    End If
  End If
End Sub 

Sub CheckLastPlayed(Timer)
  Dim Res
  If (((SDB.Player.isPlaying) And (not SDB.Player.isPaused)) and (not ini.BoolValue("JingleRotation","TimerExecuted"))) And (ini.IntValue("JingleRotation","JingleID") < 0) Then
    'res = SDB.MessageBox( SDB.Localize(ini.StringValue("JingleRotation","PlayedAt")&";"), mtError, Array(mbOk))
    If ((DateDiff("s",CDate(ini.StringValue("JingleRotation","PlayedAt")),Now) => ini.IntValue("JingleRotation","Timer")) And (ini.IntValue("JingleRotation","Counter") > 0)) Or (ini.IntValue("JingleRotation","JingleEvery") = 0)Then
      If ((SDB.Player.CurrentSong.SongLength > ini.IntValue("JingleRotation","Timer") Or (ini.IntValue("JingleRotation","Counter") > 0)) Or (SDB.Player.PlaybackTime => ini.IntValue("JingleRotation","Timer"))) Or (ini.IntValue("JingleRotation","JingleEvery") = 0) Then
        Dim RndSong
        Randomize
        RndSong = Int((SDB.PlaylistByTitle(ini.StringValue("JingleRotation","JingleGenre")).Tracks.Count+1) * Rnd)
        If SDB.PlaylistByTitle(ini.StringValue("JingleRotation","JingleGenre")).Tracks.Count = RndSong Then
          RndSong = RndSong-1
        End If
        Call SDB.Player.PlaylistAddTrack(SDB.PlaylistByTitle(ini.StringValue("JingleRotation","JingleGenre")).Tracks.Item(RndSong))
        Call SDB.Player.PlaylistMoveTrack(SDB.Player.PlaylistCount-1, SDB.Player.CurrentSongIndex+1)
        ini.IntValue("JingleRotation","JingleID") = SDB.Player.CurrentPlaylist.Item(SDB.Player.CurrentSongIndex+1).ID
        Played = 0
        ini.StringValue("JingleRotation","PlayedAt") = FormatDateTime(Now,0)
        ini.IntValue("JingleRotation","Counter") = Played
        ini.BoolValue("JingleRotation","TimerExecuted") = True
      End If
    End If
  Else
    ini.StringValue("JingleRotation","PlayedAt") = FormatDateTime(Now,0)
  End If
End Sub