var dealerData = {
  "contractName": "Dealer",
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "ceiling",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "pitboss",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "winner",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "cashout",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "overflow",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "kill",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x6060604052341561000f57600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506104438061005e6000396000f30060606040526004361061006c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680624264c3146100bc57806341c0e1b5146100d1578063753ed1bd146100e6578063a026348c1461010f578063b7b172b314610164575b3373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a2005b34156100c757600080fd5b6100cf6101a6565b005b34156100dc57600080fd5b6100e46102b2565b005b34156100f157600080fd5b6100f9610347565b6040518082815260200191505060405180910390f35b341561011a57600080fd5b610122610353565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561016f57600080fd5b6101a4600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610378565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561020157600080fd5b6703782dace9d900003073ffffffffffffffffffffffffffffffffffffffff163111151561022e57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6703782dace9d900003073ffffffffffffffffffffffffffffffffffffffff1631039081150290604051600060405180830381858888f1935050505015156102b057600080fd5b565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561030d57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b6703782dace9d9000081565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103d357600080fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561041357600080fd5b50505600a165627a7a7230582072d5fb7cf1c74f03d1760bd4b366d996df8b455dae32738cdfaed0373e64047f0029",
  "deployedBytecode": "0x60606040526004361061006c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680624264c3146100bc57806341c0e1b5146100d1578063753ed1bd146100e6578063a026348c1461010f578063b7b172b314610164575b3373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a2005b34156100c757600080fd5b6100cf6101a6565b005b34156100dc57600080fd5b6100e46102b2565b005b34156100f157600080fd5b6100f9610347565b6040518082815260200191505060405180910390f35b341561011a57600080fd5b610122610353565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561016f57600080fd5b6101a4600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610378565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561020157600080fd5b6703782dace9d900003073ffffffffffffffffffffffffffffffffffffffff163111151561022e57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6703782dace9d900003073ffffffffffffffffffffffffffffffffffffffff1631039081150290604051600060405180830381858888f1935050505015156102b057600080fd5b565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561030d57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b6703782dace9d9000081565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103d357600080fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561041357600080fd5b50505600a165627a7a7230582072d5fb7cf1c74f03d1760bd4b366d996df8b455dae32738cdfaed0373e64047f0029",
  "sourceMap": "25:703:0:-;;;180:60;;;;;;;;223:10;213:7;;:20;;;;;;;;;;;;;;;;;;25:703;;;;;;",
  "deployedSourceMap": "25:703:0:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;289:10;281:30;;;301:9;281:30;;;;;;;;;;;;;;;;;;25:703;514:134;;;;;;;;;;;;;;654:71;;;;;;;;;;;;;;76:41;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;48:22;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;405:103;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;514:134;375:7;;;;;;;;;;;361:21;;:10;:21;;;353:30;;;;;;;;107:10;570:4;:12;;;:22;561:32;;;;;;;;601:7;;;;;;;;;;;:16;;:40;107:10;618:4;:12;;;:22;601:40;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;514:134::o;654:71::-;375:7;;;;;;;;;;;361:21;;:10;:21;;;353:30;;;;;;;;710:7;;;;;;;;;;;697:21;;;76:41;107:10;76:41;:::o;48:22::-;;;;;;;;;;;;;:::o;405:103::-;375:7;;;;;;;;;;;361:21;;:10;:21;;;353:30;;;;;;;;478:6;:15;;:23;494:6;478:23;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;405:103;;:::o",
  "source": "pragma solidity ^0.4.0;\n\ncontract Dealer {\n\n    address public pitboss;\n    uint public constant ceiling = 0.25 ether;\n\n    event Deposit(address indexed _from, uint _value);\n\n    function Dealer() public {\n      pitboss = msg.sender;\n    }\n\n    function () public payable {\n      Deposit(msg.sender, msg.value);\n    }\n\n    modifier pitbossOnly {\n      require(msg.sender == pitboss);\n      _;\n    }\n\n    function cashout(address winner, uint amount) public pitbossOnly {\n      winner.transfer(amount);\n    }\n\n    function overflow() public pitbossOnly {\n      require (this.balance > ceiling);\n      pitboss.transfer(this.balance - ceiling);\n    }\n\n    function kill() public pitbossOnly {\n      selfdestruct(pitboss);\n    }\n\n}\n",
  "sourcePath": "/home/bohendo/all/Documents/bjtj/contracts/Dealer.sol",
  "ast": {
    "absolutePath": "/home/bohendo/all/Documents/bjtj/contracts/Dealer.sol",
    "exportedSymbols": {
      "Dealer": [
        92
      ]
    },
    "id": 93,
    "nodeType": "SourceUnit",
    "nodes": [
      {
        "id": 1,
        "literals": [
          "solidity",
          "^",
          "0.4",
          ".0"
        ],
        "nodeType": "PragmaDirective",
        "src": "0:23:0"
      },
      {
        "baseContracts": [],
        "contractDependencies": [],
        "contractKind": "contract",
        "documentation": null,
        "fullyImplemented": true,
        "id": 92,
        "linearizedBaseContracts": [
          92
        ],
        "name": "Dealer",
        "nodeType": "ContractDefinition",
        "nodes": [
          {
            "constant": false,
            "id": 3,
            "name": "pitboss",
            "nodeType": "VariableDeclaration",
            "scope": 92,
            "src": "48:22:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_address",
              "typeString": "address"
            },
            "typeName": {
              "id": 2,
              "name": "address",
              "nodeType": "ElementaryTypeName",
              "src": "48:7:0",
              "typeDescriptions": {
                "typeIdentifier": "t_address",
                "typeString": "address"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": true,
            "id": 6,
            "name": "ceiling",
            "nodeType": "VariableDeclaration",
            "scope": 92,
            "src": "76:41:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_uint256",
              "typeString": "uint256"
            },
            "typeName": {
              "id": 4,
              "name": "uint",
              "nodeType": "ElementaryTypeName",
              "src": "76:4:0",
              "typeDescriptions": {
                "typeIdentifier": "t_uint256",
                "typeString": "uint256"
              }
            },
            "value": {
              "argumentTypes": null,
              "hexValue": "302e3235",
              "id": 5,
              "isConstant": false,
              "isLValue": false,
              "isPure": true,
              "kind": "number",
              "lValueRequested": false,
              "nodeType": "Literal",
              "src": "107:10:0",
              "subdenomination": "ether",
              "typeDescriptions": {
                "typeIdentifier": "t_rational_250000000000000000_by_1",
                "typeString": "int_const 250000000000000000"
              },
              "value": "0.25"
            },
            "visibility": "public"
          },
          {
            "anonymous": false,
            "id": 12,
            "name": "Deposit",
            "nodeType": "EventDefinition",
            "parameters": {
              "id": 11,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 8,
                  "indexed": true,
                  "name": "_from",
                  "nodeType": "VariableDeclaration",
                  "scope": 12,
                  "src": "138:21:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 7,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "138:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 10,
                  "indexed": false,
                  "name": "_value",
                  "nodeType": "VariableDeclaration",
                  "scope": 12,
                  "src": "161:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 9,
                    "name": "uint",
                    "nodeType": "ElementaryTypeName",
                    "src": "161:4:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "137:36:0"
            },
            "src": "124:50:0"
          },
          {
            "body": {
              "id": 20,
              "nodeType": "Block",
              "src": "205:35:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 18,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 15,
                      "name": "pitboss",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 3,
                      "src": "213:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 16,
                        "name": "msg",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 104,
                        "src": "223:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_magic_message",
                          "typeString": "msg"
                        }
                      },
                      "id": 17,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "sender",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": null,
                      "src": "223:10:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "src": "213:20:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "id": 19,
                  "nodeType": "ExpressionStatement",
                  "src": "213:20:0"
                }
              ]
            },
            "id": 21,
            "implemented": true,
            "isConstructor": true,
            "isDeclaredConst": false,
            "modifiers": [],
            "name": "Dealer",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 13,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "195:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 14,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "205:0:0"
            },
            "scope": 92,
            "src": "180:60:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 31,
              "nodeType": "Block",
              "src": "273:45:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 25,
                          "name": "msg",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 104,
                          "src": "289:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_magic_message",
                            "typeString": "msg"
                          }
                        },
                        "id": 26,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "sender",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": null,
                        "src": "289:10:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 27,
                          "name": "msg",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 104,
                          "src": "301:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_magic_message",
                            "typeString": "msg"
                          }
                        },
                        "id": 28,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "value",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": null,
                        "src": "301:9:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      ],
                      "id": 24,
                      "name": "Deposit",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 12,
                      "src": "281:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_event_nonpayable$_t_address_$_t_uint256_$returns$__$",
                        "typeString": "function (address,uint256)"
                      }
                    },
                    "id": 29,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "281:30:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 30,
                  "nodeType": "ExpressionStatement",
                  "src": "281:30:0"
                }
              ]
            },
            "id": 32,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [],
            "name": "",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 22,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "255:2:0"
            },
            "payable": true,
            "returnParameters": {
              "id": 23,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "273:0:0"
            },
            "scope": 92,
            "src": "246:72:0",
            "stateMutability": "payable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 42,
              "nodeType": "Block",
              "src": "345:54:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        "id": 38,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "expression": {
                            "argumentTypes": null,
                            "id": 35,
                            "name": "msg",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 104,
                            "src": "361:3:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_magic_message",
                              "typeString": "msg"
                            }
                          },
                          "id": 36,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "sender",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "361:10:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "==",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 37,
                          "name": "pitboss",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 3,
                          "src": "375:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "src": "361:21:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      ],
                      "id": 34,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 107,
                      "src": "353:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$returns$__$",
                        "typeString": "function (bool) pure"
                      }
                    },
                    "id": 39,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "353:30:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 40,
                  "nodeType": "ExpressionStatement",
                  "src": "353:30:0"
                },
                {
                  "id": 41,
                  "nodeType": "PlaceholderStatement",
                  "src": "391:1:0"
                }
              ]
            },
            "id": 43,
            "name": "pitbossOnly",
            "nodeType": "ModifierDefinition",
            "parameters": {
              "id": 33,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "345:0:0"
            },
            "src": "324:75:0",
            "visibility": "internal"
          },
          {
            "body": {
              "id": 58,
              "nodeType": "Block",
              "src": "470:38:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 55,
                        "name": "amount",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 47,
                        "src": "494:6:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 52,
                        "name": "winner",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 45,
                        "src": "478:6:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      "id": 54,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "transfer",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": null,
                      "src": "478:15:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_transfer_nonpayable$_t_uint256_$returns$__$",
                        "typeString": "function (uint256)"
                      }
                    },
                    "id": 56,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "478:23:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 57,
                  "nodeType": "ExpressionStatement",
                  "src": "478:23:0"
                }
              ]
            },
            "id": 59,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": [],
                "id": 50,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 49,
                  "name": "pitbossOnly",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 43,
                  "src": "458:11:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "458:11:0"
              }
            ],
            "name": "cashout",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 48,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 45,
                  "name": "winner",
                  "nodeType": "VariableDeclaration",
                  "scope": 59,
                  "src": "422:14:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 44,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "422:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 47,
                  "name": "amount",
                  "nodeType": "VariableDeclaration",
                  "scope": 59,
                  "src": "438:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 46,
                    "name": "uint",
                    "nodeType": "ElementaryTypeName",
                    "src": "438:4:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "421:29:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 51,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "470:0:0"
            },
            "scope": 92,
            "src": "405:103:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 80,
              "nodeType": "Block",
              "src": "553:95:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "id": 68,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "expression": {
                            "argumentTypes": null,
                            "id": 65,
                            "name": "this",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 115,
                            "src": "570:4:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_contract$_Dealer_$92",
                              "typeString": "contract Dealer"
                            }
                          },
                          "id": 66,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "balance",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "570:12:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": ">",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 67,
                          "name": "ceiling",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 6,
                          "src": "585:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "src": "570:22:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      ],
                      "id": 64,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 107,
                      "src": "561:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$returns$__$",
                        "typeString": "function (bool) pure"
                      }
                    },
                    "id": 69,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "561:32:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 70,
                  "nodeType": "ExpressionStatement",
                  "src": "561:32:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "id": 77,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "expression": {
                            "argumentTypes": null,
                            "id": 74,
                            "name": "this",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 115,
                            "src": "618:4:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_contract$_Dealer_$92",
                              "typeString": "contract Dealer"
                            }
                          },
                          "id": 75,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "balance",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "618:12:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "-",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 76,
                          "name": "ceiling",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 6,
                          "src": "633:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "src": "618:22:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 71,
                        "name": "pitboss",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 3,
                        "src": "601:7:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      "id": 73,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "transfer",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": null,
                      "src": "601:16:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_transfer_nonpayable$_t_uint256_$returns$__$",
                        "typeString": "function (uint256)"
                      }
                    },
                    "id": 78,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "601:40:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 79,
                  "nodeType": "ExpressionStatement",
                  "src": "601:40:0"
                }
              ]
            },
            "id": 81,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": [],
                "id": 62,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 61,
                  "name": "pitbossOnly",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 43,
                  "src": "541:11:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "541:11:0"
              }
            ],
            "name": "overflow",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 60,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "531:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 63,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "553:0:0"
            },
            "scope": 92,
            "src": "514:134:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 90,
              "nodeType": "Block",
              "src": "689:36:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 87,
                        "name": "pitboss",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 3,
                        "src": "710:7:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      ],
                      "id": 86,
                      "name": "selfdestruct",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 110,
                      "src": "697:12:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_selfdestruct_nonpayable$_t_address_$returns$__$",
                        "typeString": "function (address)"
                      }
                    },
                    "id": 88,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "697:21:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 89,
                  "nodeType": "ExpressionStatement",
                  "src": "697:21:0"
                }
              ]
            },
            "id": 91,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": [],
                "id": 84,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 83,
                  "name": "pitbossOnly",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 43,
                  "src": "677:11:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "677:11:0"
              }
            ],
            "name": "kill",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 82,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "667:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 85,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "689:0:0"
            },
            "scope": 92,
            "src": "654:71:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          }
        ],
        "scope": 93,
        "src": "25:703:0"
      }
    ],
    "src": "0:729:0"
  },
  "legacyAST": {
    "absolutePath": "/home/bohendo/all/Documents/bjtj/contracts/Dealer.sol",
    "exportedSymbols": {
      "Dealer": [
        92
      ]
    },
    "id": 93,
    "nodeType": "SourceUnit",
    "nodes": [
      {
        "id": 1,
        "literals": [
          "solidity",
          "^",
          "0.4",
          ".0"
        ],
        "nodeType": "PragmaDirective",
        "src": "0:23:0"
      },
      {
        "baseContracts": [],
        "contractDependencies": [],
        "contractKind": "contract",
        "documentation": null,
        "fullyImplemented": true,
        "id": 92,
        "linearizedBaseContracts": [
          92
        ],
        "name": "Dealer",
        "nodeType": "ContractDefinition",
        "nodes": [
          {
            "constant": false,
            "id": 3,
            "name": "pitboss",
            "nodeType": "VariableDeclaration",
            "scope": 92,
            "src": "48:22:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_address",
              "typeString": "address"
            },
            "typeName": {
              "id": 2,
              "name": "address",
              "nodeType": "ElementaryTypeName",
              "src": "48:7:0",
              "typeDescriptions": {
                "typeIdentifier": "t_address",
                "typeString": "address"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": true,
            "id": 6,
            "name": "ceiling",
            "nodeType": "VariableDeclaration",
            "scope": 92,
            "src": "76:41:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_uint256",
              "typeString": "uint256"
            },
            "typeName": {
              "id": 4,
              "name": "uint",
              "nodeType": "ElementaryTypeName",
              "src": "76:4:0",
              "typeDescriptions": {
                "typeIdentifier": "t_uint256",
                "typeString": "uint256"
              }
            },
            "value": {
              "argumentTypes": null,
              "hexValue": "302e3235",
              "id": 5,
              "isConstant": false,
              "isLValue": false,
              "isPure": true,
              "kind": "number",
              "lValueRequested": false,
              "nodeType": "Literal",
              "src": "107:10:0",
              "subdenomination": "ether",
              "typeDescriptions": {
                "typeIdentifier": "t_rational_250000000000000000_by_1",
                "typeString": "int_const 250000000000000000"
              },
              "value": "0.25"
            },
            "visibility": "public"
          },
          {
            "anonymous": false,
            "id": 12,
            "name": "Deposit",
            "nodeType": "EventDefinition",
            "parameters": {
              "id": 11,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 8,
                  "indexed": true,
                  "name": "_from",
                  "nodeType": "VariableDeclaration",
                  "scope": 12,
                  "src": "138:21:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 7,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "138:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 10,
                  "indexed": false,
                  "name": "_value",
                  "nodeType": "VariableDeclaration",
                  "scope": 12,
                  "src": "161:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 9,
                    "name": "uint",
                    "nodeType": "ElementaryTypeName",
                    "src": "161:4:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "137:36:0"
            },
            "src": "124:50:0"
          },
          {
            "body": {
              "id": 20,
              "nodeType": "Block",
              "src": "205:35:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 18,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 15,
                      "name": "pitboss",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 3,
                      "src": "213:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 16,
                        "name": "msg",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 104,
                        "src": "223:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_magic_message",
                          "typeString": "msg"
                        }
                      },
                      "id": 17,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "sender",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": null,
                      "src": "223:10:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "src": "213:20:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "id": 19,
                  "nodeType": "ExpressionStatement",
                  "src": "213:20:0"
                }
              ]
            },
            "id": 21,
            "implemented": true,
            "isConstructor": true,
            "isDeclaredConst": false,
            "modifiers": [],
            "name": "Dealer",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 13,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "195:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 14,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "205:0:0"
            },
            "scope": 92,
            "src": "180:60:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 31,
              "nodeType": "Block",
              "src": "273:45:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 25,
                          "name": "msg",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 104,
                          "src": "289:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_magic_message",
                            "typeString": "msg"
                          }
                        },
                        "id": 26,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "sender",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": null,
                        "src": "289:10:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 27,
                          "name": "msg",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 104,
                          "src": "301:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_magic_message",
                            "typeString": "msg"
                          }
                        },
                        "id": 28,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "value",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": null,
                        "src": "301:9:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      ],
                      "id": 24,
                      "name": "Deposit",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 12,
                      "src": "281:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_event_nonpayable$_t_address_$_t_uint256_$returns$__$",
                        "typeString": "function (address,uint256)"
                      }
                    },
                    "id": 29,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "281:30:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 30,
                  "nodeType": "ExpressionStatement",
                  "src": "281:30:0"
                }
              ]
            },
            "id": 32,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [],
            "name": "",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 22,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "255:2:0"
            },
            "payable": true,
            "returnParameters": {
              "id": 23,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "273:0:0"
            },
            "scope": 92,
            "src": "246:72:0",
            "stateMutability": "payable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 42,
              "nodeType": "Block",
              "src": "345:54:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        },
                        "id": 38,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "expression": {
                            "argumentTypes": null,
                            "id": 35,
                            "name": "msg",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 104,
                            "src": "361:3:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_magic_message",
                              "typeString": "msg"
                            }
                          },
                          "id": 36,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "sender",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "361:10:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "==",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 37,
                          "name": "pitboss",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 3,
                          "src": "375:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "src": "361:21:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      ],
                      "id": 34,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 107,
                      "src": "353:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$returns$__$",
                        "typeString": "function (bool) pure"
                      }
                    },
                    "id": 39,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "353:30:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 40,
                  "nodeType": "ExpressionStatement",
                  "src": "353:30:0"
                },
                {
                  "id": 41,
                  "nodeType": "PlaceholderStatement",
                  "src": "391:1:0"
                }
              ]
            },
            "id": 43,
            "name": "pitbossOnly",
            "nodeType": "ModifierDefinition",
            "parameters": {
              "id": 33,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "345:0:0"
            },
            "src": "324:75:0",
            "visibility": "internal"
          },
          {
            "body": {
              "id": 58,
              "nodeType": "Block",
              "src": "470:38:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 55,
                        "name": "amount",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 47,
                        "src": "494:6:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 52,
                        "name": "winner",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 45,
                        "src": "478:6:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      "id": 54,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "transfer",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": null,
                      "src": "478:15:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_transfer_nonpayable$_t_uint256_$returns$__$",
                        "typeString": "function (uint256)"
                      }
                    },
                    "id": 56,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "478:23:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 57,
                  "nodeType": "ExpressionStatement",
                  "src": "478:23:0"
                }
              ]
            },
            "id": 59,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": [],
                "id": 50,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 49,
                  "name": "pitbossOnly",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 43,
                  "src": "458:11:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "458:11:0"
              }
            ],
            "name": "cashout",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 48,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 45,
                  "name": "winner",
                  "nodeType": "VariableDeclaration",
                  "scope": 59,
                  "src": "422:14:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  },
                  "typeName": {
                    "id": 44,
                    "name": "address",
                    "nodeType": "ElementaryTypeName",
                    "src": "422:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 47,
                  "name": "amount",
                  "nodeType": "VariableDeclaration",
                  "scope": 59,
                  "src": "438:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 46,
                    "name": "uint",
                    "nodeType": "ElementaryTypeName",
                    "src": "438:4:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "421:29:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 51,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "470:0:0"
            },
            "scope": 92,
            "src": "405:103:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 80,
              "nodeType": "Block",
              "src": "553:95:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "id": 68,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "expression": {
                            "argumentTypes": null,
                            "id": 65,
                            "name": "this",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 115,
                            "src": "570:4:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_contract$_Dealer_$92",
                              "typeString": "contract Dealer"
                            }
                          },
                          "id": 66,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "balance",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "570:12:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": ">",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 67,
                          "name": "ceiling",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 6,
                          "src": "585:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "src": "570:22:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_bool",
                          "typeString": "bool"
                        }
                      ],
                      "id": 64,
                      "name": "require",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 107,
                      "src": "561:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_require_pure$_t_bool_$returns$__$",
                        "typeString": "function (bool) pure"
                      }
                    },
                    "id": 69,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "561:32:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 70,
                  "nodeType": "ExpressionStatement",
                  "src": "561:32:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "commonType": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "id": 77,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "leftExpression": {
                          "argumentTypes": null,
                          "expression": {
                            "argumentTypes": null,
                            "id": 74,
                            "name": "this",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 115,
                            "src": "618:4:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_contract$_Dealer_$92",
                              "typeString": "contract Dealer"
                            }
                          },
                          "id": 75,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberName": "balance",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": null,
                          "src": "618:12:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "nodeType": "BinaryOperation",
                        "operator": "-",
                        "rightExpression": {
                          "argumentTypes": null,
                          "id": 76,
                          "name": "ceiling",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 6,
                          "src": "633:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "src": "618:22:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      ],
                      "expression": {
                        "argumentTypes": null,
                        "id": 71,
                        "name": "pitboss",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 3,
                        "src": "601:7:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      "id": 73,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberName": "transfer",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": null,
                      "src": "601:16:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_transfer_nonpayable$_t_uint256_$returns$__$",
                        "typeString": "function (uint256)"
                      }
                    },
                    "id": 78,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "601:40:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 79,
                  "nodeType": "ExpressionStatement",
                  "src": "601:40:0"
                }
              ]
            },
            "id": 81,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": [],
                "id": 62,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 61,
                  "name": "pitbossOnly",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 43,
                  "src": "541:11:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "541:11:0"
              }
            ],
            "name": "overflow",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 60,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "531:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 63,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "553:0:0"
            },
            "scope": 92,
            "src": "514:134:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 90,
              "nodeType": "Block",
              "src": "689:36:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "arguments": [
                      {
                        "argumentTypes": null,
                        "id": 87,
                        "name": "pitboss",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 3,
                        "src": "710:7:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      }
                    ],
                    "expression": {
                      "argumentTypes": [
                        {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      ],
                      "id": 86,
                      "name": "selfdestruct",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 110,
                      "src": "697:12:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_function_selfdestruct_nonpayable$_t_address_$returns$__$",
                        "typeString": "function (address)"
                      }
                    },
                    "id": 88,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "kind": "functionCall",
                    "lValueRequested": false,
                    "names": [],
                    "nodeType": "FunctionCall",
                    "src": "697:21:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$__$",
                      "typeString": "tuple()"
                    }
                  },
                  "id": 89,
                  "nodeType": "ExpressionStatement",
                  "src": "697:21:0"
                }
              ]
            },
            "id": 91,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": [],
                "id": 84,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 83,
                  "name": "pitbossOnly",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 43,
                  "src": "677:11:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "677:11:0"
              }
            ],
            "name": "kill",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 82,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "667:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 85,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "689:0:0"
            },
            "scope": 92,
            "src": "654:71:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          }
        ],
        "scope": 93,
        "src": "25:703:0"
      }
    ],
    "src": "0:729:0"
  },
  "compiler": {
    "name": "solc",
    "version": "0.4.19+commit.c4cbbb05.Emscripten.clang"
  },
  "networks": {
    "1": {
      "events": {},
      "links": {},
      "address": "0x13Ea3e8f20fdABb3996D7580DF50143b93E4ba27",
      "transactionHash": "0x82b39bf40c8b35bdcf329d830cea648212fbd1749b6e77dbc47b770058a507f0"
    },
    "5777": {
      "events": {},
      "links": {},
      "address": "0x345ca3e014aaf5dca488057592ee47305d9b3e10",
      "transactionHash": "0x032de192e79e1baa57d2d293b6c49875498e6134772d013c7d964bc9b571f71c"
    }
  },
  "schemaVersion": "2.0.0",
  "updatedAt": "2018-03-14T19:37:16.144Z"
}

// build/contracts/Dealer.json will be pasted above by Makefile
// it will be saved in a variable called dealerData
// this script is intended to be executed in a geth console

var dealer = web3.eth.contract(dealerData.abi)
console.log('dealer contract interface loaded & saved to variable: dealer')

var deploytx = {
  "data": dealerData.bytecode,
  "gas": 1000000,
}
console.log('dealer contract deployment transaction initialized & saved to variable: deploytx')

if (dealerData.networks[net.version]) {
  var myDealer = dealer.at(dealerData.networks[net.version].address)
  console.log('dealer has been deployed to network ', net.version, ' & this instance was saved to variable: myDealer')
}

