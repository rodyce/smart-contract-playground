const VaccinePassport = artifacts.require("VaccinePassport");

contract("VaccinePassport", (accounts) => {
  it("register issuer", async () => {
    // Test setup.
    const vaccinePassportInstance = await VaccinePassport.deployed();

    const owner = accounts[0];
    const holder = accounts[1];

    // Method under test.
    await vaccinePassportInstance.registerIssuer(holder, { from: owner });

    // Collect results.
    const isIssuer = await vaccinePassportInstance.isAuthorizedIssuer(holder);

    // Assertions.
    assert.strictEqual(isIssuer, true, "msg if failed");
  });

  // it("issue new passport", async () => {
  //   // Test setup.
  //   const vaccinePassportInstance = await VaccinePassport.deployed();

  //   // Method under test.
  //   const newPassportId = await vaccinePassportInstance.issueNewVaccinePassport(
  //     accounts[0],
  //     "RCE414",
  //     123,
  //     "photoUrl",
  //     1,
  //     10,
  //     {
  //       from: accounts[0],
  //     }
  //   );

  //   // Collect results.
  //   const initials = await vaccinePassportInstance.getInitials(newPassportId);

  //   // Assertions.
  //   assert.strictEqual("RCE414", initials);
  // });
});
