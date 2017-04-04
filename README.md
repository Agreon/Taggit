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
        
   REST
    + Delete throws http error but works 
    + remove project from list
      
  + Focus
   + Editor
       + remove focus
   + onMouseHover-focus
      + remove all siblings active

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
      + Snackbar?
      + Messages
        + Username existing
        + doc/project-name existing
             
## General
+ Menü

   + LoadingSpinner
            
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

# Future
+ Fragen für die eigne Uni veröffentlichen, um so gemienschaftlich einen Fragenkatalog zu erstellen, der beim lernen hilft
