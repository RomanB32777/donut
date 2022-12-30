export const getActiveRooms = (rooms: Map<string, Set<string>>) => {
  // Convert map into 2D list:
  // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
  const arr = Array.from(rooms);
  const filtered = arr.filter((room) => !room[1].has(room[0]));
  return filtered.map((i) => ({ room: i[0], sockets: Array.from(i[1]) }));
};
