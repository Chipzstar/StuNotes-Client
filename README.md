# StuNotes

Master's Dissertation Project - Collaborative Notetaking System for University Students - University of Bath

# Core Tools and Libraries

- Quill: Quill is the WYSIWYG rich text editor we will use as our  editor.
- quill-cursors is an extension that helps us to display cursors of other connected clients to the same editor room.
- Webpack, webpack-cli, and webpack-dev-server are developer utilities, webpack being the bundler that creates a deployable bundle for your application.
- The Y-quill module provides bindings between Yjs and QuillJS with use of the SharedType y.Text. For more information, you can check out the module’s source on Github.
- Y-websocket provides a WebsocketProvider to communicate with Yjs server in a client-server manner to exchange awareness information and data.
- Yjs, this is the CRDT framework which orchestrates conflict resolution between multiple clients