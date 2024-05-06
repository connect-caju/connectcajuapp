
// Embedded Coordinates schema
export const Coordinates = {
    name: "Coordinates",
    embedded: true,
    properties: {
        position: "int?",
        latitude: "double?",
        longitude: "double?",
    },
};
