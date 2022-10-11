import { Prisma } from "@prisma/client";

function distance(q: number[], p: number[]) {
  return Math.sqrt(Math.pow(q[0] - p[0], 2) + Math.pow(q[1] - p[1], 2));
}

export function closest(point: number[], points: number[][]) {
  var minDistance = 100000000000;
  var closestPoint;
  for (var a = 0; a < points.length; a++) {
    var distance = Math.sqrt(
      Math.pow(points[a][0] - point[0], 2) +
        Math.pow(points[a][1] - point[1], 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = points[a];
    }
  }
  return closestPoint;
}

export function closestStation(point: number[], stations: any[]) {
  var minDistance = 100000000000;
  var closestPoint;
  for (var a = 0; a < stations.length; a++) {
    var distance = Math.sqrt(
      Math.pow(stations[a].location[0] - point[0], 2) +
        Math.pow(stations[a].location[1] - point[1], 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = stations[a];
    }
  }
  return closestPoint;
}

/*
Credit: https://stackoverflow.com/a/29915728/15681093
Original: https://github.com/substack/point-in-polygon (MIT)
 */
export function insidePolygon(point: number[], vs: number[][]) {
  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}
export function insideStation(point: number[], stations: any[]) {
  for (const station of stations) {
    if (!station.area || station.area.length === 0) continue;
    if (insidePolygon(point, station.area)) {
      return station;
    }
  }
  return {};
}
