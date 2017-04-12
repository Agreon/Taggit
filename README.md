# TODO

## Release 0.1
  + Login/register
    + login works
    + loadbyToken works
    + register works
    + logOut 
      + project-menu still accessible
        => Later from landing page and redirect not a problem
        => SetCurrentProject(null);
      
  Menu 
    + OnCLick slot: this slot should be the only active
        
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

  + Tags
    + load
    + store
    + create
      + how to dynamically add inputs?
    
      + subslots with 
        + create attribute
        + rename/remove attribute
    
    
    
   + Style
     + Responsiveness
        + Documentname breaks
        + scrollbar appears 
      + menu-name-bar center font
      + tag-modal 
        + show tag name in header
        + v-center name of inputs
      
   + Show Error Messages
        + authentication stuff
        + Username existing
       
## General
+ Menü    
   + Order Docs/Projects by creationDate  
      + Better in frontend

+ Landing-Page with Login/Register

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
  
# NiceToHave
+ Search
	+ DragnDrop to order projects/document
	+ Link freigeben (public)
		+ einfach get /id des docs
		+ wenn bool: public, show 
+ Menu
   + MenuToggle
      + Nachschauen welche klassen in admineLte
      + Vorerst Weglassen?
   + Mouse-Animationen
      + OnClick
      +=> in menu-slot 200ms timeout bis das event emittet wird

Snackbar
   + AnimationIn

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

# Future
+ Fragen für die eigne Uni veröffentlichen, um so gemienschaftlich einen Fragenkatalog zu erstellen, der beim lernen hilft
