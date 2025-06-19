

export interface MeetingDTO {
    userId: string;
    meetingTitle: string,
    meetingTime: string,
    meetingDate: string,
    duration: string,
    description: string,
    members: { userId: string; email: string }[],
    meetingId: string
}