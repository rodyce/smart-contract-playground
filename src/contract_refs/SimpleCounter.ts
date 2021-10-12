export const SimpleCounterAddress =
  "0x30F7417d381a0aa11496A5eB38833F603eef300A";

export const SimpleCounterAbi = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
    ],
    name: "CounterUpdated",
    type: "event",
  },
  {
    constant: false,
    inputs: [],
    name: "incrementCounter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCounterValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export default SimpleCounterAbi;
