export class Player {
    constructor(
        public readonly playerId: string,
        public level: number = 11,
        public clientId: string,
        public round: number = 0) {
    }
}
