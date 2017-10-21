# PYP

# Deployment
  - set up all necessary ethereum environment: geth, truffle, we are using the last version of truffle(3.4.9) with support to solidity 4.15
  - git clone https://bitbucket.org/kkx/pyp.git
  - cd pyp
  - run testrpc(for test) or run geth to run a synced node
  - truffle migrate(need to set up your eth accounts there before running the migrate!)


# geth
for example for ubuntu, an instruction can be found here: https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu

# truffle
the repository is this: https://github.com/trufflesuite/truffle, just run: 'npm install -g truffle'

# Run unitests in local
    - cd pyp
    - run 'testrpc'
    - run '. scripts/start_testrpc.sh' to run all the unitests

# Manual tests in local
    - cd pyp
    - run 'testrpc'
    - run 'truffle console' in another window
    - run 'truffle migrate' to create contracts
    - load contracts as your variable in the console like ico = PYPIco.at('address of the contract in the contract creation output')
    - interact with the contracts

# Deployment for production
    - cd pyp
    - run a synced(synced in mainnet) geth node
    - run 'truffle console' in another window
    - be sure your default account(accounts[0] in geth) has enough eth to pay the gas
    - run 'truffle migrate' to create contracts



# Contract Management
The project are divided in 3 contracts: Token contracts, ICO contract, Vault contract.

## Token contract
Implemented using OpenZepplin project with some ajusts for this project. It is a ERC20 compatible token. 
    - total hard cap is set to 20000 eths with goal as 3200 eths
    - The token is pausable in transferability which can be turned on/off by the owner, token transferability is off by default once the contracts is created

ICO contract
    - created with all the arguments written in the migration script(goal, cap, starttime, endtime, addresses). 
    - can pause/unpause token transferability
    - can buy tokens once we are in the ico openning window
    - owner have to run manually finalize to close the ico once the endtime is reached or the hard cap reached, in this way, the contract will decide to transfer eths to the team or active refund in case the goal is not reached.
    - once the contract is created owner can send pre-ico tokens to their investors until the hard cap is reached or the ico window is closed.
    - the token purchase has different rate as shown in the white paper

Vault contract
    - in case of gaol not reached, investor can withdraw their investment 
    - otherwise, the collected funds is transfered to the team address
    

