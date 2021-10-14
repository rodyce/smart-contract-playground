// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract VaccinePassport is
    Ownable,
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    ReentrancyGuard
{
    event VaccinePassportIssued(
        address indexed issuer,
        address indexed holder,
        uint256 passportId
    );

    event VaccinePassportDoseRegistered(
        uint256 passportId,
        uint256 vendor,
        uint256 lot
    );

    string[] private vaccineVendors = [
        "Pfizer",
        "Janssen",
        "Moderna",
        "AstraZeneca",
        "Sputnik V"
    ];

    struct HolderInfo {
        string initials; // RCE414
        uint256 dateOfBirthTimestamp;
        string photoUrl;
    }

    struct DoseInfo {
        uint256 timeOfIssue;
        uint256 vendor;
        uint256 lot;
    }

    // Unique identifier for the Vaccination Passport
    uint256 private vaccinePassportId;

    // Map from vaccine passport ID -> Holder, non-PII info.
    mapping(uint256 => HolderInfo) holderInfoByVaccinePassportId;

    // Map from vaccine passport ID -> array of doses.
    mapping(uint256 => DoseInfo[]) holderDosesByVaccinePassportId;

    // Set of authorized issuers that can mint new vaccionation passport tokens
    mapping(address => bool) private authorizedIssuers;

    constructor() ERC721("COVID-19 Vaccine Passport", "COVP") {
        vaccinePassportId = 0;
    }

    function getInitials(uint256 tokenId) public view returns (string memory) {
        return holderInfoByVaccinePassportId[tokenId].initials;
    }

    function getDateOfBirthTimestamp(uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return holderInfoByVaccinePassportId[tokenId].dateOfBirthTimestamp;
    }

    function getPhotoUrl(uint256 tokenId) public view returns (string memory) {
        return holderInfoByVaccinePassportId[tokenId].photoUrl;
    }

    function getDoseCount(uint256 tokenId) public view returns (uint256) {
        return holderDosesByVaccinePassportId[tokenId].length;
    }

    function getDoseTimeOfIssue(uint256 tokenId, uint256 doseNumber)
        public
        view
        returns (uint256)
    {
        require(doseNumber < holderDosesByVaccinePassportId[tokenId].length);

        return holderDosesByVaccinePassportId[tokenId][doseNumber].timeOfIssue;
    }

    function getDoseVendor(uint256 tokenId, uint256 doseNumber)
        public
        view
        returns (uint256)
    {
        require(doseNumber < holderDosesByVaccinePassportId[tokenId].length);

        return holderDosesByVaccinePassportId[tokenId][doseNumber].vendor;
    }

    function getDoseVendorName(uint256 tokenId, uint256 doseNumber)
        public
        view
        returns (string memory)
    {
        require(doseNumber < holderDosesByVaccinePassportId[tokenId].length);

        return
            vaccineVendors[
                holderDosesByVaccinePassportId[tokenId][doseNumber].vendor
            ];
    }

    function getDoseLot(uint256 tokenId, uint256 doseIndex)
        public
        view
        returns (uint256)
    {
        require(doseIndex < holderDosesByVaccinePassportId[tokenId].length);

        return holderDosesByVaccinePassportId[tokenId][doseIndex].lot;
    }

    function isAuthorizedIssuer(address issuer) public view returns (bool) {
        return authorizedIssuers[issuer];
    }

    function registerIssuer(address newIssuer) public onlyOwner {
        authorizedIssuers[newIssuer] = true;
    }

    function issueNewVaccinePassport(
        address holder,
        string memory initials,
        uint256 dateOfBirthTimestamp,
        string memory photoUrl,
        uint256 vendor,
        uint256 lot
    ) public nonReentrant {
        require(isAuthorizedIssuer(msg.sender));

        vaccinePassportId += 1;

        HolderInfo memory holderInfo = HolderInfo({
            initials: initials,
            dateOfBirthTimestamp: dateOfBirthTimestamp,
            photoUrl: photoUrl
        });

        holderInfoByVaccinePassportId[vaccinePassportId] = holderInfo;
        holderDosesByVaccinePassportId[vaccinePassportId].push(
            DoseInfo({timeOfIssue: block.timestamp, vendor: vendor, lot: lot})
        );

        super._mint(holder, vaccinePassportId);

        emit VaccinePassportIssued(msg.sender, holder, vaccinePassportId);
        emit VaccinePassportDoseRegistered(vaccinePassportId, vendor, lot);
    }

    function registerDose(
        uint256 tokenId,
        uint256 vendor,
        uint256 lot
    ) public nonReentrant {
        require(isAuthorizedIssuer(msg.sender));

        holderDosesByVaccinePassportId[tokenId].push(
            DoseInfo({timeOfIssue: block.timestamp, vendor: vendor, lot: lot})
        );

        emit VaccinePassportDoseRegistered(vaccinePassportId, vendor, lot);
    }

    /**
     * override(ERC721, ERC721Enumerable, ERC721Pausable)
     * here you're overriding _beforeTokenTransfer method of
     * three Base classes namely ERC721, ERC721Enumerable, ERC721Pausable
     * */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * override(ERC721, ERC721Enumerable) -> here you're specifying only two base classes ERC721, ERC721Enumerable
     * */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
