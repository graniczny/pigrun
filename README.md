# PigRun - Pure JavaScript 2D platform game

PigRun is a small 2D platform game, which I develop in my free time. External libraries and frameworks are not used intentionaly,
main idea standing behind this is that I wanted this project to by my challange. The game is still not finished, many features are still yet to come.
Repository contains also basic map creator, which is also written in pure HTML/JS.

Please use Chrome or Mozzila to run the Pig ;) (not tested on any other browsers)

# PigRun keymap

- A - move left
- D - move right
- Space - jump

# Map creator instructions

To add fields to the map, select cells on "pig world matrix", by clicking on them. Than click on the graphic that you want to put in those cells.
When both cell and graphic is selected, click green "+" button, or hit Enter on a keyboard.
When you want to delete a field from map, select it and click red "x" button, or hit Delete on a keyboard.

To edit already existing map, you must load it from a external file, to do it hit select file on the top-right corner. After selection, hit "Add" button.

To download generated map, hit grey "download" button, which is just next to the Delete button.

Downloaded map needs to be inserted in game folder and called "scene.json"

Tips to make map creation faster and easier:

- You can also select cells by arrow keys on a keyboard, to do so, any cell on the map must be already selected.
- To cancel selection hit Escape on a keyboard.
- Zoom option is not included yet in the script, but you can use your browser zoom options.

# TODO

- refactor
- add background items that pig doesn't collide with
- add interactive objects (food etc.)
- add time/score/bonuses
- score system
- add user interface
- loading external maps
- and more...
