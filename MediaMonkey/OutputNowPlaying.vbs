' OutputNowPlaying.vbs
' Write the current playing track and artist to a text file


' [NowPlaying]
' FileName=OutputNowPlaying.vbs
' ProcName=OutputNowPlaying
' Order=40
' DisplayName=Ouputs NowPlaying...
' Description=Ouputs NowPlaying...
' Language=VBScript
' ScriptType=2

option explicit

sub OutputNowPlaying

   dim objFSO, objTextFile, strTextFilePath, strTrack, strArtist, strAlbum

   'SET THIS TO LOCATION OF FILE
   strTextFilePath = "C:\temp\MediaMonkey_NowPlaying.txt"

   'Get the artist/track
   strTrack = SDB.Player.CurrentSong.Title
   strArtist = SDB.Player.CurrentSong.Artist.Name
   strAlbum = SDB.Player.CurrentSong.AlbumName

  If strTrack = "" Then  
	strTrack = "[unknown song]"
	End If

  If strArtist = "" Then  
	strArtist = "[unknown artist]"
	End If

   'Open the file (overwrite=True, unicode=True)
  Set objFSO = CreateObject("Scripting.FileSystemObject")
  Set objTextFile = objFSO.CreateTextFile(strTextFilePath, True, True)
  
  On Error Resume Next
  
	' Write the file
	'If the album name is NOT known, don't show it
  If strAlbum = "" Then  
    objTextFile.Write ": """ & strTrack & """ by " & strArtist & "."
  ElseIf strAlbum = " " Then  
    objTextFile.Write ": """ & strTrack & """ by " & strArtist & "."
  Else 
    objTextFile.Write ": """ & strTrack & """ by " & strArtist & " off *" & strAlbum & "*."
  End If

  
  
  If Err.Number <> 0 Then
'  objTextFile.WriteLine ": Something in unicode! I hate unicode! Eck, pthew!"
  Err.Clear
  End If
	
   'close the file   
   objTextFile.Close
   

end sub
