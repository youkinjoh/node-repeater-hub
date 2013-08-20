node-repeater-hub
=================

The node-repeater-hub can simple network like with repeater hub.
It is possible to connect a flexible WebSocket server/client.

##example

```
node app -p 3001
node app -p 3002 -p 3003
node app -p 3004 -u ws://localhost:3001/
node app -u ws://localhost:3001/ -u ws://localhost:3002/
```

```
+--------------------------+
|  S port 3004             |
|                          |
|  C ws://localhost:3001/  |
+--------------------------+
   :
   :
   :
+--------------------------+
|  S port 3001             |
+--------------------------+
   :
   :
   :
+--------------------------+
|  C ws://localhost:3001/  |
|                          |
|  C ws://localhost:3002/  |
+--------------------------+
   :
   :
   :
+--------------------------+
|  S port 3002             |
+--------------------------+
```

##attention

 * It should not be connected in a ring shape.
 * It should not be connected two or more echo server/client.
