# HoverManyPosition

## Liste des arguments

* divMaskContainer, svgMaskNode et svgStarNodes, sont nodes html qui permettront de gerer l'animation
* OrderDisplayedStars est une fonction qui retourne l'ordre d'appararition des étoiles
* DXYStars sont les décalages de position dans un espace [X,Y]
* gsapAnimationStarConfiguration, est une fonction qui retourne :
  * Le delais de l'animation entre chaque étoile
  * Les états de départ de la node "from"
  * Les états intermédiaire de la node et de la durée de l'animation "to"
  * Et les états finaux de la node et la durée de l'animation
* gsapMaskNodeConfiguration, doit retourner :
  * From : Les états de débuts
  * To : Les états de fins
* configuration, permet :
  * Functions : Permet de définir si une animation doit etre suspendu ou non.

    * stop.start :Gerer l'arret de la fonction d'animation des étoiles
  * Optimised : Donner les animations à optimiser quand leurs valeurs par défault est trigger.
  * default : Permet de donner la valeur à mettre par défault au lieu de la fonction. Cette valeur est attribué quand la valeur est trigger.
    Trigger est définit dans ./functions/configurations.js
* farestConfiguration : Permet de définir si l'on prend ou non toujours le même coté. Si l'attribue n'est pas définit alors cela calculera le coté le plus lointain
* mouseEventType : Voir la section portant ce nom
* ElementSelectedListener : Function permettant de savoir quand un elements a été selectionné.
* OnClickElementSelected : Function permettant de savoir quand un elements a été clické.

# MouseEventType

Enumération qui permet de choisir entre différentes type d'animations de selection d'elements de la liste :

* AlwaysFollowMouse, le mask suit toujours la sourie, quand un element est cliqué alors il le lock jusqu'a ce que la sourie sort de l'elements selection, la sourie doit dépasser d'une demi div supplémentaire.
* ClickFollow, le mask ne change de div que lors d'un click sur un autre elements
* FollowMouse, le mask ne peut se mettre que sur les elements selectionner et non intermédiairement.
