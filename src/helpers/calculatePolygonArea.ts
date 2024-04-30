/* eslint-disable prettier/prettier */
const isEqual = (coord1: any, coord2: any) => {
  return coord1.lat === coord2.lat && coord1.lng === coord2.lng;
};

export function calculateArea(coordinates: any) {
  // Ensure the polygon is closed (first and last coordinates are the same)
  if (
    coordinates.length < 3 ||
    !isEqual(coordinates[0], coordinates[coordinates.length - 1])
  ) {

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Invalid polygon: Ensure the polygon is closed.");
    return null;
  }

  const earthRadius = 6371000; // Earth radius in meters

  // Function to calculate the Haversine distance between two points
  function haversine(lat1: any, lon1: any, lat2: any, lon2: any) {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  // Function to convert degrees to radians
  function toRadians(degrees: any) {
    return degrees * (Math.PI / 180);
  }

  let area = 0;

  // Iterate through each pair of consecutive coordinates
  for (let i = 0; i < coordinates.length - 1; i++) {
    const current = coordinates[i];
    const next = coordinates[i + 1];

    // Calculate the area contribution of each triangle formed by consecutive coordinates
    area +=
      (haversine(
        current.lat,
        current.lng,
        next.lat,
        next.lng,
      ) *
        haversine(
          current.lat,
          current.lng,
          next.lat,
          current.lng,
        )) /
      2;
  }

  return area;
}


// calculate the area from the latitude and longitude points
export const calculatePolygonArea = (points: any) => {

  const earthRadiusKm = 6371; // Radius of the earth in kilometers
  let totalDistance = 0;

  // calculate the area using the shoelece formula
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    totalDistance += distance;
  }

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = i === points.length - 1 ? points[0] : points[i + 1];
    area += p1.lng * p2.lat - p2.lng * p1.lat;
  }

  area = 0.5 * Math.abs(area) * totalDistance * 100; //100 times the area to convert it from square km to hectares
  return area;

};
