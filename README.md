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

   	+ Load TagData for existing tags
  		=> Problem wenn man lerngruppen hat, die nur Lernobjekte haben?
  		=> Macht aber auch Sinn, wenn man in den Gruppen Dokumente erstellen mag		
  		  
# Future
+ Fragen für die eigne Uni veröffentlichen, um so gemienschaftlich einen Fragenkatalog zu erstellen, der beim lernen hilft
=> public / private Lerngruppen
	+ Fragen aus existierenden Lernobjekten importieren
	+ Ersteller->Moderator
	+ Fragen melden 
	+ Fragen upvoten/downvoten
	+ Diskussion zu fragen
Bedenken: Lernfortschritt pro Nutzer

