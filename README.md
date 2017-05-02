# Intro

Taggit - A multifunctional Learning Tool


# Shortcuts

## Menu
* Enter: Select MenuItem
* ctrl: show options of MenuItem
* escape: cancel
* x: Switch to Editor
 
## Editor
* ctrl+<Tag-Number>: Insert Tag at caret; If somethign is selected, it will be put in the first tag-input
* alt+w: Focus Menu / Editor


# TODO


## Konzeption
+ TagManagement
  + Auf eigener Page?
  
+ Learning
        + TagLevel und TagActive in DocTags?
        + DocProgress in Doc?
      + wie würde so ein ablauf aussehen?
        + get document-tags
        + get learnobject with doc.id
        + foreach document.tag 
          + if in id = learnobject.tag.id
            + learnobject.tag : name, inputs,
        + setTags 
          + learnobject.tags
        + set active/progress
          + einfach db-set-learnobject tag 
	+ Learn-Content is escaped.    
   	+ Load TagData for existing tags
  		=> Problem wenn man lerngruppen hat, die nur Lernobjekte haben?
  		=> Macht aber auch Sinn, wenn man in den Gruppen Dokumente erstellen mag		
  		
  		 	
   	+ add new tags onload
   	
   	+ calculate learnobject-progress
  	+ show level-labels in diffrent colors
   
  
  
# Release 0.1      
   REST
    + frontend
      + rename project
        + error thrown is 500 and not 403 when existing
      
    + delete document by id and not active
      
  + Focus
  	+ OnStartup focus Menu 
  	
  + key-combinations
  	
  + OnQuestion-Tag
  	+ Inputs
  		=> Als TextBox
  		=> Oder definierbar
  	
   + Editor
   		=> Look for Angular2 Integration-page!
       + remove focus imperatively
       + ctrl-alt-w is activating options in Menu
		+ => TagModal on MainEditor not working 
## Bugs
	+ constant Sitereload when no connection to server
		
	+ AutoFocus not working
		+ Aber nur aus Editor heraus, von menü klappts
	
	+ Switch from site to MainEditor 2. time 
		=> editor undefined error
		
	
	+ Seite wird 2x geladen
		+ oder zumindest die projekte
	
	+ Style
     + Responsiveness
        + scrollbar in editor appears wenn page-height kleiner als erwartet
 
      + tag-modal 
        + v-center name of inputs
+ Menu    
    + onMouseHover-focus
      + remove all siblings hovered
   
## General

+ Editor
  + Markdown view?
  + set cursor at the end of the document?
  + TagButtons
    + Vlt. in MenuButton -> Tags mit collaps
    + Collapse-Button
    + Tooltips wieder rein?
  
+ Code-Quali
  + observable.complete()
  + " or '      
  + projects/documents get by _id not name
 
+ Security
  + Authenticate Client, so that no brute force can be applied to server to get tokens
  
## Learn	
	=> Wenn man neue tags hinzugefügt hat, werden sie automatisch mit eingefügt?

  + Design
    + Bei Start auswahl von Tags
    + im karteikarten-stil
    + mit großen buttons und tasten-steuerung
    + Nach frage-beantworten 
      + karteikarte dreht sich
      + antwort fährt nach unten aus
      + Vlt. auch Antwort wo hin schreiben, um abgleichen zu können
  + Architektur 
    + Jede Dokument und Porjekt muss den fortschritt der jeweiligen tags speichern und anzeigen können
      + Pro Tag-ID einen Treffer-wert
      + extra tabelle?
    + LearnService
      + startLearning(project/document)
      + getRandomTag()
      + setTagSuccess(bool)
     
# NiceToHave    

  + Modal
    + Vlt. AdminLTE-Box nehmen
      + sieht schick aus (form-elements)
+ Rewrite editor
  + hover-highlighting of what text is part of a taginput

+ charts for learn-progress 
  + @see admin-lte - dashboard
+ Search
	+ DragnDrop to order projects/document
	+ Link freigeben (public)
		+ einfach get /id des docs
		+ wenn bool: public, show 
+ Menu
   + Order Docs/Projects by creationDate  
      + Better in frontend
   + MenuToggle
      + Nachschauen welche klassen in admineLte
      + Vorerst Weglassen?
   + Mouse-Animationen
      + OnClick
      +=> in menu-slot 200ms timeout bis das event emittet wird
+ Snackbar
   + AnimationIn

+ LearnSettings
	+ Order-Questions by Level

# Future
+ Fragen für die eigne Uni veröffentlichen, um so gemienschaftlich einen Fragenkatalog zu erstellen, der beim lernen hilft
=> public / private Lerngruppen
	+ Fragen aus existierenden Lernobjekten importieren
	+ Ersteller->Moderator
	+ Fragen melden 
	+ Fragen upvoten/downvoten
	+ Diskussion zu fragen
Bedenken: Lernfortschritt pro Nutzer

