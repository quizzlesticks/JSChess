Castling works.
En passant doesn't send the move over the network and so it breaks.
Did not add piece upgrading. I think there is the client code for selecting an upgrade to a pawn but it doesn't send it over the network.

In index.js remove the comment at the bottom and change the IP to let people around the world play with you.

In game.js change 'one_dimension' to true to render the board in a line.
