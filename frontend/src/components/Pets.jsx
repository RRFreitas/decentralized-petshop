import React, { useState, useEffect } from "react"

const zero = '0x0000000000000000000000000000000000000000'

const Pets = ({ pets, selectedAddress, adopt }) => {
    return (
        <React.Fragment>
            <div style={{display: 'flex', maxWidth: '80%', flexWrap: 'wrap', justifyContent: 'space-around'}}>
            {
                pets.map(pet => (<Pet 
                    pet={pet}
                    key={pet.id}
                    selectedAddress={selectedAddress}
                    adopt={adopt}
                />))
            }
            </div>
        </React.Fragment>
    )
}

const Pet = ({ pet, selectedAddress, adopt}) => {
    console.log(selectedAddress, pet.owner)
    let border = selectedAddress.toLowerCase() === pet.owner.toLowerCase() ? "1px solid red" : "none"
    console.log(border)
    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '30%', marginTop: 15, border: border}}>
            <div>
                <strong>Name: </strong>
                <span>{pet.name}</span>
            </div>
            <div>
                <strong>Age: </strong>
                <span>{pet.age}</span>
            </div>
            <div>
                <strong>Breed: </strong>
                <span>{pet.breed}</span>
            </div>
            <div>
                <strong>Owner: </strong>
                <span style={{fontSize: 9}}>{pet.owner}</span>
            </div>
            <button type="button" onClick={() => adopt(pet.id)} disabled={pet.owner !== zero && pet.owner !== selectedAddress}>Adopt</button>
        </div>
    )
}

export default Pets
