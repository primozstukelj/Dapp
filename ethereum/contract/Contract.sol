//solium-disable linebreak-style
pragma solidity ^0.4.24;

contract ContractFactory {
    address[] public deployedContracts;
    uint public counter = 0;

    function createContracts(address _developer, address _voter1, address _voter2, uint _daysToExpire, string _description, string _aDescription) public payable{
        require(msg.value >0);
        Contract newC;
        newC = (new Contract).value(msg.value)(msg.sender,_developer,_voter1,_voter2,_daysToExpire, _description, _aDescription);
        
        deployedContracts.push(address(newC));
        counter++;
    }

    function getDeployedContracts() public view returns(address[]arr){
        return deployedContracts;
    }

    function getCounter() external view returns(uint) {
        return counter;
    }

    function getLastContractAddress() external view returns(address) {
        return deployedContracts[counter - 1];
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }   
}

contract Contract {

    enum ServiceState { InProcess, InReview, Approved, Decline }
    ServiceState public state;
    
    address public creator;//subscriber
    address public developer;
    address public voter1;
    address public voter2;
    bool public companyVoted = false;
    bool public vote1=false;
    bool public vote2=false;
    bool public voter1vote= false;
    bool public voter2vote= false;
    uint public approvalsCount;
    
    uint public expireDate;//deadline
    uint public timeLimit;
    
    string public description;
    string public actualDescription;
    
    constructor(address _creator,address _developer, address _voter1, address _voter2, uint _daysToExpire, string _description, string _aDescription) public payable {
        creator = _creator;
        developer = _developer;

        voter1= _voter1;
        voter2= _voter2;
        
        approvalsCount=0;
        
        state = ServiceState.InProcess;
        expireDate = now + _daysToExpire * 1 days;
        timeLimit = _daysToExpire;
        description = _description;
        actualDescription = _aDescription;
    }
    
    modifier approved(){
        require(state == ServiceState.Approved || (approvalsCount == 2 && vote1 == true && vote2 == true));
        _;
    }
    
    modifier serviceInReview{
        require(state == ServiceState.InReview);
        _;
    }
    
    modifier isOverDeadline{
        require(now >= expireDate || (state != ServiceState.Approved && approvalsCount < 2));
        _;
    }
    
    modifier isDecline{
        require(state == ServiceState.Decline);
        _;
    }
    
    function getBalance() public view returns (uint){
        return address(this).balance;
    } 
    
    function sendToReview(address _address) external {
        require(_address == developer);
        state = ServiceState.InReview;
    }
    
    function isProductOk(address _address, bool _ok) external serviceInReview {
        require(_address == creator);
        if(_ok){
            state = ServiceState.Approved;
        }else{
            state = ServiceState.Decline;
        }
        companyVoted = true;
    } 
    
    function getMoneyBack() external {
        require(approvalsCount==2 && (vote1== false || vote2==false));
        creator.transfer(address(this).balance);
    }
    
    function transferMoneyToDeveloper() external approved {
        developer.transfer(address(this).balance);
    }
    
    function vote(address _address, bool vote) external isDecline {
        require( _address != creator && _address != developer);
        approvalsCount++;
        if(_address == voter1 && voter1vote == false){
            vote1= vote; 
            voter1vote=true;
        }else if(_address == voter2 && voter2vote == false){
            vote2 = vote;
            voter2vote= true;
        }

        if (voter2vote == true && voter1vote == true && vote2 == true && vote1 == true) {
            state = ServiceState.Approved;
        }
    }

    function getSummary() external view returns(string, uint, uint, ServiceState, string, bool, bool, bool) {
        return (description, timeLimit, address(this).balance, state, actualDescription, companyVoted, voter1vote, voter2vote);
    }
}
