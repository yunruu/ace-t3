# Ace-T3 (Accessible Tic-Tac-Toe)
A classic game of Tic-Tac-Toe that is designed to be inclusive and accessible to screen reader users.

## Steps to Run the Game

1. Go to the web application [Ace-T3](https://ace-t3.vercel.app/).
2. Register for an account.
3. Login with the account.
4. A game session will be created automatically. Once it finds you an opponent, the tic-tac-toe board will be displayed and you can start playing the game.

Note: Create another tab or use another browser and open the [web app](https://ace-t3.vercel.app/) again to load two instances of the game. You can create as many tabs or browsers and repeat as you like.

## Tech Stack
- NextJS
- Typescript
- TailwindCSS
- Firebase

## API List

### Games Service:

1. `joinGame(user: User): Promise<Game>`
   - Description: Allows a user to join an existing game or create a new one.
   - Input: User object containing user ID and username.
   - Output: Game object representing the joined or created game.
   - Firestore interactions: Reads from and writes to the 'games' collection.

2. `getGame(docId: string): Promise<Game>`
   - Description: Retrieves a game document based on its document ID.
   - Input: Document ID of the game.
   - Output: Game object representing the retrieved game.
   - Firestore interactions: Reads from the 'games' collection.

3. `updateGame(docId: string, game: Game): Promise<Game>`
   - Description: Updates an existing game document with new game data.
   - Input: Document ID of the game and the updated Game object.
   - Output: The updated Game object.
   - Firestore interactions: Writes to the 'games' collection.

4. `listenToGame(gameId: string, callback: (data: Game) => void): () => void`
   - Description: Sets up a real-time listener for changes to a game document.
   - Input: Document ID of the game and a callback function to handle game updates.
   - Output: A function to unsubscribe from the listener.
   - Firestore interactions: Subscribes to changes in the 'games' collection.

5. `makeMove(player: Player, game: Game, move: number): Promise<void>`
   - Description: Updates the game state after a player makes a move.
   - Input: Player object, Game object, and the move (board index).
   - Output: void.
   - Firestore interactions: Reads and writes to the 'games' collection.

### Users Service:

6. `registerUser(username: string, password: string): Promise<User>`
   - Description: Registers a new user with a username and password.
   - Input: Username and password strings.
   - Output: User object representing the registered user.
   - Firestore interactions: Writes to the 'users' collection.

7. `loginUser(username: string, password: string): Promise<User>`
   - Description: Logs in a user with a username and password.
   - Input: Username and password strings.
   - Output: User object representing the logged-in user.
   - Firestore interactions: Reads from the 'users' collection.

## Testing for Persons-With-Disabilities
Development and testing of the app is done concurrently with the help of the in-built Voice-Over on the browser. The development operating system is MacOS. Below is an example of the development and testing using MacOS' Voice-Over.
![image](https://github.com/user-attachments/assets/d695be12-ade1-43bb-8b6e-f437805dcfed)

## Accessibility Considerations
I attempted to incorporate semantic HTML elements and ARIA (Accessible Rich Internet Applications) attributes, such as aria-label, aria-live, and role, to provide meaningful context to screen readers. For instance, game status updates are communicated using aria-live="polite" regions to ensure users relying on assistive technologies are kept informed without interruption. To improve keyboard navigation, all interactive elements like cells and buttons include the tabindex attribute, ensuring proper focus order. This allows users who rely on keyboards to navigate and interact with the game without using a mouse. The UI uses a high-contrast color scheme and large, legible fonts to support users with visual impairments. Game pieces (X and O) are displayed in bold and large text, and the board layout avoids any low-contrast combinations. I also ensured that focus indicators remain visible, and all click targets (like cells) have a large enough hit area, enhancing usability for individuals with motor difficulties. Overall, these decisions were made to not only deliver a smooth gaming experience but also to promote inclusivity, allowing users of varying abilities to enjoy the game.
