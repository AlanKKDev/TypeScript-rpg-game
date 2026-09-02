export type Rarity = 'common' | 'rare' | 'legendary';

export type HexColor = `#${string}`;

export type Item = {
    readonly price: number;
    readonly rarity: Rarity;
    readonly description?: string;
    readonly color?: HexColor;
};

export const itemsData: Record<string, Item> = {
    Apple: {
        price: 5,
        rarity: 'common',
        description: 'Sweet apple',
        color: '#ff0000',
    },
    'Iron Sword': {
        price: 70,
        rarity: 'rare',
        description: 'Some iron sword',
        color: '#c5b9b9e5',
    },
};
