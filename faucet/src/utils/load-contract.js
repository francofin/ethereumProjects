import contract from "truffle-contract";


export const loadContract = async (name, provider) => {
    const res = await fetch(`/contracts/${name}.json`)
    const Artifact = await res.json()

    // have to set the provider when creating the artifact as well

    const _contract = contract(Artifact)
    _contract.setProvider(provider)

    

    let deployedContract = null
    try{
        deployedContract = await _contract.deployed()
    } catch {
        console.error("Cannot load the contract, Please check your netwrok settings.")
    }




    return deployedContract
}