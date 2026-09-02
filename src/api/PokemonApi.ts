import { getRandomNumber } from '../utils/RandomNumber';

export type Pet = {
    name: string;
    sprites: {
        front_default: string;
    };
};

export async function getRandomPet(): Promise<Pet> {
    const randomId = getRandomNumber(1, 150);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

    if (!response.ok) {
        throw new Error(`Pokemon API error! Status: ${response.status}`);
    }

    const data: Pet = await response.json();
    return data;
}
