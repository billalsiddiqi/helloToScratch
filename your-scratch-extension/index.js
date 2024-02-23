class MQTTExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.host = 'test.mosquitto.org';
        this.port = 8081;
        this.topic = '/scratchExtensionTopic';
        this.useTLS = true;
        this.username = null;
        this.password = null;
        this.state = { status: 1, msg: 'loaded' };
        this.mqtt = null;
        this.reconnectTimeout = 2000;
        this.messagePayload = '';
        this.newMessage = false;
    }

    getInfo() {
        return {
            id: 'mqtt',
            name: 'MQTT Extension',
            blocks: [
                {
                    opcode: 'sendMessage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send message %s to topic %s',
                    arguments: {
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'message'
                        },
                        TOPIC: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'topic'
                        }
                    }
                },
                {
                    opcode: 'getMessage',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'message'
                },
                {
                    opcode: 'whenMessageArrived',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when message arrived'
                },
                {
                    opcode: 'isMessageArrived',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'message arrived'
                },
                {
                    opcode: 'setTLS',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'secure connection %m.secureConnection',
                    arguments: {
                        SECURE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'secureConnection',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'setHost',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Host %s',
                    arguments: {
                        HOST: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test.mosquitto.org'
                        }
                    }
                },
                {
                    opcode: 'setTopic',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Subscribe to topic %s',
                    arguments: {
                        TOPIC: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '/scratchExtensionTopic'
                        }
                    }
                },
                {
                    opcode: 'setPort',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Port %n',
                    arguments: {
                        PORT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '8081'
                        }
                    }
                },
                {
                    opcode: 'connect',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'connect'
                }
            ],
            menus: {
                secureConnection: ['true', 'false']
            }
        };
    }

    sendMessage(args) {
        if (this.mqtt) {
            this.mqtt.send(args.TOPIC, args.MESSAGE);
            console.log('message published');
        }
    }

    getMessage() {
        return this.messagePayload;
    }

    whenMessageArrived() {
        return this.newMessage;
    }

    isMessageArrived() {
        return this.newMessage;
    }

    setTLS(args) {
        this.useTLS = args.SECURE === 'true';
    }

    setHost(args) {
        this.host = args.HOST;
    }

    setTopic(args) {
        this.topic = args.TOPIC;
    }

    setPort(args) {
        this.port = args.PORT;
    }

    connect() {
        this.MQTTconnect();
    }

    MQTTconnect() {
        if (typeof path === 'undefined') {
            path = '/mqtt';
            console.log('path=' + path);
        }

        this.mqtt = new Paho.MQTT.Client(
            this.host,
            this.port,
            'web_' + parseInt(Math.random() * 100, 10)
        );

        var options = {
            timeout: 3,
            useSSL: this.useTLS,
            cleanSession: true,
            onSuccess: this.onConnect.bind(this),
            onFailure: this.onConnectionLost.bind(this)
        };

        this.mqtt.onConnectionLost = this.onConnectionLost.bind(this);
        this.mqtt.onMessageArrived = this.onMessageArrived.bind(this);

        if (this.username !== null) {
            options.userName = this.username;
            options.password = this.password;
        }

        console.log(
            'Host=' +
                this.host +
                ', port=' +
                this.port +
                ', path=' +
                path +
                ' TLS = ' +
                this.useTLS +
                ' username=' +
                this.username +
                ' password=' +
                this.password
        );
        this.mqtt.connect(options);
    }

    onConnect() {
        console.log('trying to connect');
        this.state = { status: 1, msg: 'connecting ...' };
        console.log('Connected to ' + this.host + ':' + this.port + path);
        this.mqtt.subscribe(this.topic, { qos: 0 });
        this.state = { status: 2, msg: 'connected' };
    }

    onMessageArrived(message) {
        console.log('message arrived ' + message.payloadString);
        this.messagePayload = message.payloadString;
        this.newMessage = true;
    }

    onConnectionLost(response) {
        this.state = { status: 1, msg: 'connecting ...' };
        setTimeout(this.MQTTconnect.bind(this), this.reconnectTimeout);
        console.log(
            'connection lost: ' + response.errorMessage + '. Reconnecting'
        );
    }
}

Scratch.extensions.register(new MQTTExtension());
