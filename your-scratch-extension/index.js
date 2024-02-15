class ScratchFetch {
    constructor() {
    }
    
    getInfo() {
        return {
            "id": "Hello",
            "name": "Hello",
            "blocks": [
                    {
                        // function where your code logic lives
                        opcode: 'myFirstBlock',
                
                        // type of block
                        blockType: BlockType.REPORTER,
                
                        // label to display on the block
                        text: 'Title for ISBN book [BOOK_NUMBER]',
                
                        // arguments used in the block
                        arguments: {
                          BOOK_NUMBER: {
                            defaultValue: 1718500564,
                
                            // type/shape of the parameter
                            type: ArgumentType.NUMBER
                          }
                        }
                      }
                ],
        };
    }
    
     myFirstBlock ({ BOOK_NUMBER }) {
      return fetch('https://openlibrary.org/isbn/' + BOOK_NUMBER + '.json')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          else {
            return { title: 'Unknown' };
          }
        })
        .then((bookinfo) => {
          return bookinfo.title;
        });
    }

}

Scratch.extensions.register(new ScratchFetch())
