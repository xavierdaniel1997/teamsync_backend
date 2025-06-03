export interface SocketStore{
    onlineStatus:  Map<string, string>
}

export const socketStore: SocketStore = {
    onlineStatus : new Map<string, string>()
}