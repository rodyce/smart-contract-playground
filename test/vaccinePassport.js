const VaccinePassport = artifacts.require("VaccinePassport");

contract("VaccinePassport", (accounts) => {
  it("register issuer", async () => {
    // Test setup.
    const vaccinePassportInstance = await VaccinePassport.deployed();

    const owner = accounts[0];
    const issuer = accounts[1];

    // Method under test.
    await vaccinePassportInstance.registerIssuer(issuer, { from: owner });

    // Collect results.
    const isIssuer = await vaccinePassportInstance.isAuthorizedIssuer(issuer);

    // Assertions.
    assert.strictEqual(isIssuer, true, "msg if failed");
  });

  it("issue new passport", async () => {
    // Test setup.
    const vaccinePassportInstance = await VaccinePassport.deployed();

    const expectedInitials = "RCE414";
    const expectedVaccineLot = 10;

    const owner = accounts[0];
    const issuer = accounts[1];
    const holder = accounts[2];

    await vaccinePassportInstance.registerIssuer(issuer, { from: owner });

    // Method under test.
    const tx = await vaccinePassportInstance.issueNewVaccinePassport(
      holder,
      expectedInitials,
      123,
      "photoUrl",
      1,
      expectedVaccineLot,
      {
        from: issuer,
      }
    );

    // Collect results.
    const eventName = tx.logs[0].event;
    const newPassportId = tx.logs[0].args["tokenId"];
    // This is returned as a string.
    const initials = await vaccinePassportInstance.getInitials(newPassportId);

    // These are returned as a big number (BN, from bignumber.js).
    const doseCount = await vaccinePassportInstance.getDoseCount(newPassportId);
    const vaccineLot = await vaccinePassportInstance.getDoseLot(
      newPassportId,
      0 // <--- First dose, index starts at zero.
    );

    // Assertions.
    // Expected event name.
    assert.strictEqual(
      eventName,
      "Transfer",
      `Unexpected event name: ${eventName}`
    );

    // Expected initials stored.
    assert.strictEqual(initials, expectedInitials);

    // Expected dose count.
    // One dose after issuing the certificate.
    const expectedDoseCount = 1;
    assert.strictEqual(
      doseCount.toNumber(),
      expectedDoseCount,
      "unexpected dose count"
    );

    assert.strictEqual(
      vaccineLot.toNumber(),
      expectedVaccineLot,
      "unexpected vaccine lot"
    );
  });
});

// Sample transaction return when invoking "issueNewVaccinePassport":
/*
{
  "tx": "0x5227a387000118b182cc2029fb7ceeaebfaa76711e9917ef5d4bac3a5593b9a4",
  "receipt": {
    "transactionHash": "0x5227a387000118b182cc2029fb7ceeaebfaa76711e9917ef5d4bac3a5593b9a4",
    "transactionIndex": 0,
    "blockHash": "0x2ec8bd7396f35ad90eb2d57237de4c9737bec43f455ece4ce6feafab7ffda3b3",
    "blockNumber": 78,
    "from": "0x94c9e3c3144e96d1fd918c83d279ab662c046dc5",
    "to": "0x7dee7a08d60be15467145314e243d4e2421d372f",
    "gasUsed": 307055,
    "cumulativeGasUsed": 307055,
    "contractAddress": null,
    "logs": [
      {
        "logIndex": 0,
        "transactionIndex": 0,
        "transactionHash": "0x5227a387000118b182cc2029fb7ceeaebfaa76711e9917ef5d4bac3a5593b9a4",
        "blockHash": "0x2ec8bd7396f35ad90eb2d57237de4c9737bec43f455ece4ce6feafab7ffda3b3",
        "blockNumber": 78,
        "address": "0x7dee7A08d60Be15467145314e243d4E2421d372F",
        "type": "mined",
        "id": "log_30e40f51",
        "event": "Transfer",
        "args": {
          "0": "0x0000000000000000000000000000000000000000",
          "1": "0xb9C837EBb9BdF0a636F44F93F54A381475087056",
          "2": "1",
          "__length__": 3,
          "from": "0x0000000000000000000000000000000000000000",
          "to": "0xb9C837EBb9BdF0a636F44F93F54A381475087056",
          "tokenId": "1"
        }
      }
    ],
    "status": true,
    "logsBloom": "0x00000000000000000000000000000000000040000000000000000000000000000000000000000000000000000002000000000000000000000000000000040000000000000000000000000028000000000000000000040000000000000000000000000000020000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000060000000000000000000040000008000000000000000000000000000000000000000",
    "rawLogs": [
      {
        "logIndex": 0,
        "transactionIndex": 0,
        "transactionHash": "0x5227a387000118b182cc2029fb7ceeaebfaa76711e9917ef5d4bac3a5593b9a4",
        "blockHash": "0x2ec8bd7396f35ad90eb2d57237de4c9737bec43f455ece4ce6feafab7ffda3b3",
        "blockNumber": 78,
        "address": "0x7dee7A08d60Be15467145314e243d4E2421d372F",
        "data": "0x",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x000000000000000000000000b9c837ebb9bdf0a636f44f93f54a381475087056",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ],
        "type": "mined",
        "id": "log_30e40f51"
      }
    ]
  },
  "logs": [
    {
      "logIndex": 0,
      "transactionIndex": 0,
      "transactionHash": "0x5227a387000118b182cc2029fb7ceeaebfaa76711e9917ef5d4bac3a5593b9a4",
      "blockHash": "0x2ec8bd7396f35ad90eb2d57237de4c9737bec43f455ece4ce6feafab7ffda3b3",
      "blockNumber": 78,
      "address": "0x7dee7A08d60Be15467145314e243d4E2421d372F",
      "type": "mined",
      "id": "log_30e40f51",
      "event": "Transfer",
      "args": {
        "0": "0x0000000000000000000000000000000000000000",
        "1": "0xb9C837EBb9BdF0a636F44F93F54A381475087056",
        "2": "1",
        "__length__": 3,
        "from": "0x0000000000000000000000000000000000000000",
        "to": "0xb9C837EBb9BdF0a636F44F93F54A381475087056",
        "tokenId": "1"
      }
    }
  ]
}
*/
