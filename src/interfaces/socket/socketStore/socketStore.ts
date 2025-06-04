export interface SocketStore{
    onlineStatus:  Map<string, string>
    typingStatus: Map<string, {recipientId: string, timeoutId?: NodeJS.Timeout}>
}

export const socketStore: SocketStore = {
    onlineStatus : new Map<string, string>(),
    typingStatus: new Map<string, {recipientId: string, timeoutId?: NodeJS.Timeout}>()
}