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
   + modal
      + focus kann in modal-compo gesetzt werden, allerdings weiß man nicht wohin der foucs gehen soll?
        => Method-param?
      
   + Editor
       + set deactive on shortcut
   
   + onMouseHover-focus
    + maybe hover-variable for setting focus
     
     
  + Tags
    + load
    
    + store
    
    + create
      + how to dynamically add inputs?
    
  + DB
    + check if project/doc-name already exists
      + create
      + rename 
      
   + Responsiveness
      + Documentname breaks
      + scrollbar appears
      + 
## General
+ Menü

  + menu-name-bar center font

  + Modals
     + Beautify 
         
   + LoadingSpinner
         
   + Options-Menu-Slot 
      => Vlt. später in context-menü (bootstrap?)
    + Main-menu options?
    + den parent selectbar machen?   
      + nicht so gut?  
   
   
   + Order Docs/Projects by creationDate  
      
   + toolbar
         + always show 

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
