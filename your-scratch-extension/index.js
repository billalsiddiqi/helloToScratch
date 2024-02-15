class ScratchFetch {
    constructor() {
    }
    
    getInfo() {
        return {
            "id": "Hello",
            "name": "Hello",
            "blocks": [
                   {
                        "opcode": "jsonExtract",
                        "blockType": "reporter",
                        "text": "extract [name] from [data]",
                        "arguments": {
                            "name": {
                                "type": "string",
                                "defaultValue": "temperature"
                            },
                            "data": {
                                "type": "string",
                                "defaultValue": '{"temperature": 12.3}'
                            },
                        }
                    },
                ],
        };
    }

}

Scratch.extensions.register(new ScratchFetch())
