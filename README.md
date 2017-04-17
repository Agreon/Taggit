# TODO

## Konzeption
+ TagManagement
  + Auf eigener Page?
  
+ Learning
  + 2 Pages 
     + Settings-Page
        + Wird beim ersten ausführen gezeigt(Oder wenn learntags 0 sind)
     + Learn-Page
        + 
   + Architekturstil
      + Eigtl. sollte das lernen getrennt von den eigentlichen objekten geschehen (abhängigkeiten)
      + Aber andererseits erzeuge ich so redundanz durch die inputs?
      + wenn ich die inputs nicht im learnobj speichere, dann benötige ich allerdings immer 2 db-zugriffe für die lerndaten
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
          
  + Komponenten
    + Statusbar
        + Input: Prozent
    + Karteikarte
      + hat status
        + question/answer 
      + input: LearnTag 
      + learnservice.setsuccess(tag-id, false/true)
    + TagList
      + In: TagName, LearnTag[]
      + template foreach tag 
        + onclick buttons -> (onclick)="setactive(true/false,tag.id)"
    + ablauf
      + service.startLearning(document)
        + db.getLearnObj(doc.id)
        + if not existing
          + create new learnobj 
          + redirect to learn-settings
        + if existing
          + get all data 
          + redirect to learn-page 
          
# Release 0.1      
   REST
    + delete project
      + remove project from list
    + frontend
      + rename project
        + error thrown is 500 and not 403 when existing
      
  + Focus
   + Editor
       + remove focus
   + onMouseHover-focus
      + remove all siblings hovered
    + menu
      + switch with keycombo to editor

   + Show Error Messages
        + authentication stuff
        + Username existing
  + Modal
    + Vlt. AdminLTE-Box nehmen
      + sieht schick aus (form-elements)
   
## Bugs
   + Style
     + Responsiveness
        + Documentname breaks
        + scrollbar appears 
      + menu-name-bar center font
      + tag-modal 
        + show tag name in header
        + v-center name of inputs
    + onMouseHover-focus
      + remove all siblings hovered
   
## General

+ Landing-Page with Login/Register-Modal

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
Snackbar
   + AnimationIn

# Future
+ Fragen für die eigne Uni veröffentlichen, um so gemienschaftlich einen Fragenkatalog zu erstellen, der beim lernen hilft
